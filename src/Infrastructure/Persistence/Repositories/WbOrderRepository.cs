using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence.Repositories;

internal sealed class WbOrderRepository : IWbOrderRepository
{
    private readonly ApplicationDbContext _context;

    public WbOrderRepository(ApplicationDbContext context) => _context = context;

    public async Task<WbOrder?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.WbOrders.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<WbOrder?> GetByWbOrderIdAsync(Guid accountId, long wbOrderId, CancellationToken ct = default)
        => await _context.WbOrders.FirstOrDefaultAsync(
            x => x.WbAccountId == accountId && x.WbOrderId == wbOrderId, ct);

    public async Task<IReadOnlyList<WbOrder>> GetByAccountIdAsync(
        Guid accountId,
        int skip = 0,
        int take = 50,
        CancellationToken ct = default)
        => await _context.WbOrders
            .Where(x => x.WbAccountId == accountId)
            .OrderByDescending(x => x.WbCreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(ct);

    public async Task<int> CountByAccountIdAsync(Guid accountId, CancellationToken ct = default)
        => await _context.WbOrders.CountAsync(x => x.WbAccountId == accountId, ct);

    public async Task<IReadOnlyList<long>> GetExistingWbOrderIdsAsync(
        Guid accountId,
        IEnumerable<long> wbOrderIds,
        CancellationToken ct = default)
    {
        var orderIdList = wbOrderIds.ToList();
        return await _context.WbOrders
            .Where(x => x.WbAccountId == accountId && orderIdList.Contains(x.WbOrderId))
            .Select(x => x.WbOrderId)
            .ToListAsync(ct);
    }

    public async Task<Dictionary<long, WbOrder>> GetByWbOrderIdsAsync(
        Guid accountId,
        IEnumerable<long> wbOrderIds,
        CancellationToken ct = default)
    {
        var orderIdList = wbOrderIds.ToList();
        var orders = await _context.WbOrders
            .Where(x => x.WbAccountId == accountId && orderIdList.Contains(x.WbOrderId))
            .ToListAsync(ct);

        return orders.ToDictionary(x => x.WbOrderId);
    }

    public async Task AddAsync(WbOrder order, CancellationToken ct = default)
        => await _context.WbOrders.AddAsync(order, ct);

    public async Task AddRangeAsync(IEnumerable<WbOrder> orders, CancellationToken ct = default)
        => await _context.WbOrders.AddRangeAsync(orders, ct);

    public void Update(WbOrder order) => _context.WbOrders.Update(order);
}
