using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.Entities;

public sealed class RefreshToken : Entity<Guid>
{
    public string Token { get; private set; } = null!;
    public Guid UserId { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string? CreatedByIp { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? RevokedByIp { get; private set; }
    public string? ReplacedByToken { get; private set; }

    private RefreshToken() { }

    private RefreshToken(Guid id, string token, Guid userId, DateTime expiresAt, string? createdByIp) : base(id)
    {
        Token = token;
        UserId = userId;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
        CreatedByIp = createdByIp;
    }

    public static RefreshToken Create(Guid userId, string token, int expirationDays, string? ipAddress = null)
    {
        return new RefreshToken(
            Guid.NewGuid(),
            token,
            userId,
            DateTime.UtcNow.AddDays(expirationDays),
            ipAddress);
    }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt.HasValue;
    public bool IsActive => !IsRevoked && !IsExpired;

    public void Revoke(string? ipAddress = null, string? replacedByToken = null)
    {
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = ipAddress;
        ReplacedByToken = replacedByToken;
    }
}
