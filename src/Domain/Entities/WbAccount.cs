using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Primitives;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Domain.Entities;

public sealed class WbAccount : AggregateRoot<Guid>
{
    public Guid UserId { get; private set; }
    public WbApiToken ApiToken { get; private set; } = null!;
    public string ShopName { get; private set; } = string.Empty;
    public WbAccountStatus Status { get; private set; }
    public DateTime? LastSyncAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string? ErrorMessage { get; private set; }

    private WbAccount() { }

    private WbAccount(Guid id, Guid userId, WbApiToken apiToken, string shopName) : base(id)
    {
        UserId = userId;
        ApiToken = apiToken;
        ShopName = shopName;
        Status = WbAccountStatus.Active;
        CreatedAt = DateTime.UtcNow;
    }

    public static WbAccount Create(Guid userId, WbApiToken apiToken, string shopName)
    {
        if (string.IsNullOrWhiteSpace(shopName))
            throw new ArgumentException("Название магазина обязательно", nameof(shopName));

        return new WbAccount(Guid.NewGuid(), userId, apiToken, shopName.Trim());
    }

    public void UpdateToken(WbApiToken newToken)
    {
        ApiToken = newToken;
        Status = WbAccountStatus.Active;
        ErrorMessage = null;
    }

    public void Activate()
    {
        Status = WbAccountStatus.Active;
        ErrorMessage = null;
    }

    public void Deactivate()
    {
        Status = WbAccountStatus.Inactive;
    }

    public void MarkTokenExpired()
    {
        Status = WbAccountStatus.TokenExpired;
        ErrorMessage = "API токен истёк или недействителен";
    }

    public void MarkError(string errorMessage)
    {
        Status = WbAccountStatus.Error;
        ErrorMessage = errorMessage;
    }

    public void MarkSynced()
    {
        LastSyncAt = DateTime.UtcNow;
        Status = WbAccountStatus.Active;
        ErrorMessage = null;
    }

    public void UpdateShopName(string shopName)
    {
        if (!string.IsNullOrWhiteSpace(shopName))
            ShopName = shopName.Trim();
    }
}
