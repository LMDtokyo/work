using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.Entities;

public sealed class WbOrder : Entity<Guid>
{
    public Guid WbAccountId { get; private set; }
    public long WbOrderId { get; private set; }
    public WbOrderStatus Status { get; private set; }
    public string? CustomerPhone { get; private set; }
    public decimal TotalPrice { get; private set; }
    public string Currency { get; private set; } = "RUB";
    public string? ProductName { get; private set; }
    public int Quantity { get; private set; }
    public DateTime WbCreatedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private WbOrder() { }

    private WbOrder(
        Guid id,
        Guid wbAccountId,
        long wbOrderId,
        WbOrderStatus status,
        decimal totalPrice,
        string currency,
        string? productName,
        int quantity,
        DateTime wbCreatedAt) : base(id)
    {
        WbAccountId = wbAccountId;
        WbOrderId = wbOrderId;
        Status = status;
        TotalPrice = totalPrice;
        Currency = currency;
        ProductName = productName;
        Quantity = quantity;
        WbCreatedAt = wbCreatedAt;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static WbOrder Create(
        Guid wbAccountId,
        long wbOrderId,
        WbOrderStatus status,
        decimal totalPrice,
        string currency,
        string? productName,
        int quantity,
        DateTime wbCreatedAt)
    {
        return new WbOrder(
            Guid.NewGuid(),
            wbAccountId,
            wbOrderId,
            status,
            totalPrice,
            string.IsNullOrWhiteSpace(currency) ? "RUB" : currency.Trim().ToUpperInvariant(),
            productName?.Trim(),
            quantity > 0 ? quantity : 1,
            wbCreatedAt);
    }

    public void UpdateStatus(WbOrderStatus newStatus)
    {
        if (Status != newStatus)
        {
            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void SetCustomerPhone(string? phone)
    {
        CustomerPhone = phone?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(WbOrderStatus status, decimal totalPrice, string? productName, int quantity)
    {
        Status = status;
        TotalPrice = totalPrice;
        ProductName = productName?.Trim();
        Quantity = quantity > 0 ? quantity : 1;
        UpdatedAt = DateTime.UtcNow;
    }
}
