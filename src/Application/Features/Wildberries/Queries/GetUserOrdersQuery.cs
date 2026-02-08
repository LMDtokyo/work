using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Wildberries.DTOs;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Wildberries.Queries;

public sealed record GetUserOrdersQuery(
    Guid UserId,
    int Skip = 0,
    int Take = 50) : IRequest<Result<PaginatedResult<WbOrderDto>>>;

internal sealed class GetUserOrdersHandler
    : IRequestHandler<GetUserOrdersQuery, Result<PaginatedResult<WbOrderDto>>>
{
    readonly IWbAccountRepository _accounts;
    readonly IWbOrderRepository _orders;

    public GetUserOrdersHandler(IWbAccountRepository accounts, IWbOrderRepository orders)
    {
        _accounts = accounts;
        _orders = orders;
    }

    public async Task<Result<PaginatedResult<WbOrderDto>>> Handle(GetUserOrdersQuery req, CancellationToken ct)
    {
        var accs = await _accounts.GetByUserIdAsync(req.UserId, ct);
        if (accs.Count == 0)
            return Result.Failure<PaginatedResult<WbOrderDto>>("Нет подключенных аккаунтов");

        var accIds = accs.Select(a => a.Id).ToList();

        var orders = await _orders.GetByAccountIdsAsync(accIds, req.Skip, req.Take, ct);
        var total = await _orders.CountByAccountIdsAsync(accIds, ct);

        var dtos = orders.Select(o => new WbOrderDto(
            o.Id, o.WbOrderId, o.Status, o.Article, o.Rid,
            o.CustomerPhone, o.TotalPrice, o.Currency,
            o.ProductName, o.Quantity, o.WbCreatedAt, o.FinishedAt
        )).ToList();

        return PaginatedResult<WbOrderDto>.Create(dtos, total, req.Skip, req.Take);
    }
}
