using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence.Repositories;

internal sealed class WbAccountRepository : IWbAccountRepository
{
    private readonly ApplicationDbContext _context;

    public WbAccountRepository(ApplicationDbContext context) => _context = context;

    public async Task<WbAccount?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.WbAccounts.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<WbAccount?> GetByIdWithUserAsync(Guid id, Guid userId, CancellationToken ct = default)
        => await _context.WbAccounts.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

    public async Task<IReadOnlyList<WbAccount>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _context.WbAccounts
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<WbAccount>> GetActiveAccountsAsync(CancellationToken ct = default)
        => await _context.WbAccounts
            .Where(x => x.Status == WbAccountStatus.Active)
            .ToListAsync(ct);

    public async Task<bool> ExistsForUserAsync(Guid userId, string shopName, CancellationToken ct = default)
        => await _context.WbAccounts.AnyAsync(
            x => x.UserId == userId && x.ShopName.ToLower() == shopName.ToLower(), ct);

    public async Task AddAsync(WbAccount account, CancellationToken ct = default)
        => await _context.WbAccounts.AddAsync(account, ct);

    public void Update(WbAccount account) => _context.WbAccounts.Update(account);

    public void Delete(WbAccount account) => _context.WbAccounts.Remove(account);
}
