using MessagingPlatform.Domain.Entities;

namespace MessagingPlatform.Domain.Repositories;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
    Task<IEnumerable<RefreshToken>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(RefreshToken refreshToken, CancellationToken ct = default);
    void Update(RefreshToken refreshToken);
    Task RevokeAllByUserIdAsync(Guid userId, string? ipAddress = null, CancellationToken ct = default);
}
