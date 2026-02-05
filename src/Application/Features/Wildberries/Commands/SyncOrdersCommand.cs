using MediatR;
using MessagingPlatform.Application.Common.Exceptions;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Application.Features.Wildberries.Commands;

public sealed record SyncOrdersCommand(Guid AccountId, Guid UserId) : IRequest<Result<int>>;

internal sealed class SyncOrdersCommandHandler : IRequestHandler<SyncOrdersCommand, Result<int>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IWbOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWildberriesApiClient _wbApiClient;
    private readonly ILogger<SyncOrdersCommandHandler> _logger;

    public SyncOrdersCommandHandler(
        IWbAccountRepository accountRepository,
        IWbOrderRepository orderRepository,
        IUnitOfWork unitOfWork,
        IWildberriesApiClient wbApiClient,
        ILogger<SyncOrdersCommandHandler> logger)
    {
        _accountRepository = accountRepository;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _wbApiClient = wbApiClient;
        _logger = logger;
    }

    public async Task<Result<int>> Handle(SyncOrdersCommand request, CancellationToken ct)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.AccountId, request.UserId, ct);
        if (account is null)
            return Result.Failure<int>("Аккаунт не найден или у вас нет прав на синхронизацию");

        IReadOnlyList<WbOrderData> apiOrders;
        try
        {
            apiOrders = await _wbApiClient.GetOrdersAsync(account.ApiToken.Value, account.LastSyncAt, ct);
        }
        catch (WbApiAuthenticationException ex)
        {
            // CRITICAL: Mark token as expired
            account.MarkTokenExpired();
            _accountRepository.Update(account);
            await _unitOfWork.SaveChangesAsync(ct);

            _logger.LogWarning(
                ex,
                "WB Account {AccountId} marked as TokenExpired due to authentication failure",
                request.AccountId);

            return Result.Failure<int>("API токен истёк или недействителен. Пожалуйста, обновите токен в настройках.");
        }
        catch (WbApiRateLimitException ex)
        {
            _logger.LogWarning(
                ex,
                "Rate limit hit for account {AccountId}. Retry after {Seconds}s",
                request.AccountId,
                ex.RetryAfterSeconds);

            // Don't mark as error - temporary condition
            return Result.Failure<int>($"Превышен лимит запросов WB API. Повторите через {ex.RetryAfterSeconds} секунд.");
        }
        catch (Exception ex)
        {
            account.MarkError($"Ошибка при получении заказов: {ex.Message}");
            _accountRepository.Update(account);
            await _unitOfWork.SaveChangesAsync(ct);

            _logger.LogError(
                ex,
                "Unexpected error during orders sync for account {AccountId}",
                request.AccountId);

            return Result.Failure<int>("Не удалось получить заказы из Wildberries API");
        }

        if (apiOrders.Count == 0)
        {
            account.MarkSynced();
            _accountRepository.Update(account);
            await _unitOfWork.SaveChangesAsync(ct);
            return 0;
        }

        var apiOrderIds = apiOrders.Select(o => o.OrderId).ToList();

        // Single DB query to fetch all existing orders that need updates
        var existingOrdersDict = await _orderRepository.GetByWbOrderIdsAsync(request.AccountId, apiOrderIds, ct);

        var newOrders = new List<WbOrder>();

        foreach (var orderData in apiOrders)
        {
            if (existingOrdersDict.TryGetValue(orderData.OrderId, out var existingOrder))
            {
                // Update existing order with new fields
                // Handle Delivered status with FinishedAt
                if (orderData.Status == WbOrderStatus.Delivered && orderData.FinishedAt.HasValue)
                {
                    existingOrder.MarkAsDelivered(orderData.FinishedAt.Value);
                }
                else if (orderData.Status == WbOrderStatus.Cancelled)
                {
                    existingOrder.MarkAsCancelled();
                }
                else
                {
                    existingOrder.Update(
                        orderData.Status,
                        orderData.TotalPrice,
                        orderData.ProductName,
                        orderData.Quantity,
                        orderData.Article,
                        orderData.Rid);
                }

                _orderRepository.Update(existingOrder);
            }
            else
            {
                // Create new order with all fields
                var newOrder = WbOrder.Create(
                    request.AccountId,
                    orderData.OrderId,
                    orderData.Status,
                    orderData.TotalPrice,
                    orderData.Currency,
                    orderData.ProductName,
                    orderData.Quantity,
                    orderData.CreatedAt,
                    orderData.Article,
                    orderData.Rid);

                // Set FinishedAt if order is already delivered
                if (orderData.Status == WbOrderStatus.Delivered && orderData.FinishedAt.HasValue)
                {
                    newOrder.MarkAsDelivered(orderData.FinishedAt.Value);
                }

                newOrders.Add(newOrder);
            }
        }

        if (newOrders.Count > 0)
            await _orderRepository.AddRangeAsync(newOrders, ct);

        account.MarkSynced();
        _accountRepository.Update(account);
        await _unitOfWork.SaveChangesAsync(ct);

        return newOrders.Count;
    }
}
