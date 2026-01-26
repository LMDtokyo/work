using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence.Repositories;

internal sealed class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ApplicationDbContext _context;

    public RefreshTokenRepository(ApplicationDbContext context) => _context = context;

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default)
        => await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == token, ct);

    public async Task<IEnumerable<RefreshToken>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _context.RefreshTokens.Where(x => x.UserId == userId).ToListAsync(ct);

    public async Task AddAsync(RefreshToken refreshToken, CancellationToken ct = default)
        => await _context.RefreshTokens.AddAsync(refreshToken, ct);

    public void Update(RefreshToken refreshToken) => _context.RefreshTokens.Update(refreshToken);

    public async Task RevokeAllByUserIdAsync(Guid userId, string? ipAddress = null, CancellationToken ct = default)
    {
        var tokens = await _context.RefreshTokens
            .Where(x => x.UserId == userId && x.RevokedAt == null)
            .ToListAsync(ct);

        foreach (var token in tokens)
            token.Revoke(ipAddress);
    }
}
