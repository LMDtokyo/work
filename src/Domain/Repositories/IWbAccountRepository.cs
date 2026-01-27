using MessagingPlatform.Domain.Entities;

namespace MessagingPlatform.Domain.Repositories;

public interface IWbAccountRepository
{
    Task<WbAccount?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<WbAccount?> GetByIdWithUserAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<WbAccount>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<WbAccount>> GetActiveAccountsAsync(CancellationToken ct = default);
    Task<bool> ExistsForUserAsync(Guid userId, string shopName, CancellationToken ct = default);
    Task AddAsync(WbAccount account, CancellationToken ct = default);
    void Update(WbAccount account);
    void Delete(WbAccount account);
}
