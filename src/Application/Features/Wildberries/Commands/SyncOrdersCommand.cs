using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Wildberries.Commands;

public sealed record SyncOrdersCommand(Guid AccountId, Guid UserId) : IRequest<Result<int>>;

internal sealed class SyncOrdersCommandHandler : IRequestHandler<SyncOrdersCommand, Result<int>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IWbOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWildberriesApiClient _wbApiClient;

    public SyncOrdersCommandHandler(
        IWbAccountRepository accountRepository,
        IWbOrderRepository orderRepository,
        IUnitOfWork unitOfWork,
        IWildberriesApiClient wbApiClient)
    {
        _accountRepository = accountRepository;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _wbApiClient = wbApiClient;
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
        catch (Exception)
        {
            account.MarkError("Ошибка при получении заказов из Wildberries API");
            _accountRepository.Update(account);
            await _unitOfWork.SaveChangesAsync(ct);
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
        var existingOrderIds = await _orderRepository.GetExistingWbOrderIdsAsync(request.AccountId, apiOrderIds, ct);
        var existingOrderIdsSet = existingOrderIds.ToHashSet();

        var newOrders = new List<WbOrder>();
        var ordersToUpdate = new List<(WbOrderData Data, long OrderId)>();

        foreach (var orderData in apiOrders)
        {
            if (existingOrderIdsSet.Contains(orderData.OrderId))
            {
                ordersToUpdate.Add((orderData, orderData.OrderId));
            }
            else
            {
                var newOrder = WbOrder.Create(
                    request.AccountId,
                    orderData.OrderId,
                    orderData.Status,
                    orderData.TotalPrice,
                    orderData.Currency,
                    orderData.ProductName,
                    orderData.Quantity,
                    orderData.CreatedAt);
                newOrders.Add(newOrder);
            }
        }

        foreach (var (data, orderId) in ordersToUpdate)
        {
            var existingOrder = await _orderRepository.GetByWbOrderIdAsync(request.AccountId, orderId, ct);
            if (existingOrder is not null)
            {
                existingOrder.Update(data.Status, data.TotalPrice, data.ProductName, data.Quantity);
                _orderRepository.Update(existingOrder);
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
