using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Wildberries.DTOs;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Wildberries.Queries;

public sealed record GetWbOrdersQuery(
    Guid AccountId,
    Guid UserId,
    int Skip = 0,
    int Take = 50) : IRequest<Result<PaginatedResult<WbOrderDto>>>;

public sealed class GetWbOrdersQueryValidator : AbstractValidator<GetWbOrdersQuery>
{
    public GetWbOrdersQueryValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty().WithMessage("Идентификатор аккаунта обязателен");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя обязателен");

        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0).WithMessage("Смещение не может быть отрицательным");

        RuleFor(x => x.Take)
            .InclusiveBetween(1, 100).WithMessage("Количество записей должно быть от 1 до 100");
    }
}

internal sealed class GetWbOrdersQueryHandler : IRequestHandler<GetWbOrdersQuery, Result<PaginatedResult<WbOrderDto>>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IWbOrderRepository _orderRepository;

    public GetWbOrdersQueryHandler(
        IWbAccountRepository accountRepository,
        IWbOrderRepository orderRepository)
    {
        _accountRepository = accountRepository;
        _orderRepository = orderRepository;
    }

    public async Task<Result<PaginatedResult<WbOrderDto>>> Handle(GetWbOrdersQuery request, CancellationToken ct)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.AccountId, request.UserId, ct);
        if (account is null)
            return Result.Failure<PaginatedResult<WbOrderDto>>("Аккаунт не найден или у вас нет прав на просмотр заказов");

        var orders = await _orderRepository.GetByAccountIdAsync(request.AccountId, request.Skip, request.Take, ct);
        var totalCount = await _orderRepository.CountByAccountIdAsync(request.AccountId, ct);

        var dtos = orders
            .Select(o => new WbOrderDto(
                o.Id,
                o.WbOrderId,
                o.Status,
                o.CustomerPhone,
                o.TotalPrice,
                o.Currency,
                o.ProductName,
                o.Quantity,
                o.WbCreatedAt))
            .ToList();

        var result = PaginatedResult<WbOrderDto>.Create(dtos, totalCount, request.Skip, request.Take);
        return result;
    }
}
