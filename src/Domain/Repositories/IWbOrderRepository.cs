using MessagingPlatform.Domain.Entities;

namespace MessagingPlatform.Domain.Repositories;

public interface IWbOrderRepository
{
    Task<WbOrder?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<WbOrder?> GetByWbOrderIdAsync(Guid accountId, long wbOrderId, CancellationToken ct = default);
    Task<IReadOnlyList<WbOrder>> GetByAccountIdAsync(Guid accountId, int skip = 0, int take = 50, CancellationToken ct = default);
    Task<int> CountByAccountIdAsync(Guid accountId, CancellationToken ct = default);
    Task<IReadOnlyList<long>> GetExistingWbOrderIdsAsync(Guid accountId, IEnumerable<long> wbOrderIds, CancellationToken ct = default);
    Task<Dictionary<long, WbOrder>> GetByWbOrderIdsAsync(Guid accountId, IEnumerable<long> wbOrderIds, CancellationToken ct = default);
    Task<IReadOnlyList<WbOrder>> GetByAccountIdsAsync(IEnumerable<Guid> accountIds, int skip, int take, CancellationToken ct = default);
    Task<int> CountByAccountIdsAsync(IEnumerable<Guid> accountIds, CancellationToken ct = default);
    Task AddAsync(WbOrder order, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<WbOrder> orders, CancellationToken ct = default);
    void Update(WbOrder order);
}
