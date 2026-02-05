using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Exceptions;
using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.Entities;

public sealed class WbOrder : Entity<Guid>
{
    private static readonly WbOrderStatus[] FinalStatuses = { WbOrderStatus.Delivered, WbOrderStatus.Cancelled };

    public Guid WbAccountId { get; private set; }
    public long WbOrderId { get; private set; }
    public WbOrderStatus Status { get; private set; }
    public string? Article { get; private set; }
    public long? Rid { get; private set; }
    public string? CustomerPhone { get; private set; }
    public decimal TotalPrice { get; private set; }
    public string Currency { get; private set; } = "RUB";
    public string? ProductName { get; private set; }
    public int Quantity { get; private set; }
    public DateTime WbCreatedAt { get; private set; }
    public DateTime? FinishedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private bool IsInFinalState => FinalStatuses.Contains(Status);

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
        DateTime wbCreatedAt,
        string? article = null,
        long? rid = null) : base(id)
    {
        WbAccountId = wbAccountId;
        WbOrderId = wbOrderId;
        Status = status;
        Article = article;
        Rid = rid;
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
        DateTime wbCreatedAt,
        string? article = null,
        long? rid = null)
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
            wbCreatedAt,
            article?.Trim(),
            rid);
    }

    public void UpdateStatus(WbOrderStatus newStatus)
    {
        if (IsInFinalState)
            throw new DomainException($"Невозможно изменить статус заказа {WbOrderId}. Заказ находится в финальном статусе {Status}");

        if (Status != newStatus)
        {
            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void SetCustomerPhone(string? phone)
    {
        if (IsInFinalState)
            throw new DomainException($"Невозможно изменить данные заказа {WbOrderId}. Заказ находится в финальном статусе {Status}");

        CustomerPhone = phone?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(WbOrderStatus status, decimal totalPrice, string? productName, int quantity, string? article = null, long? rid = null)
    {
        if (IsInFinalState)
            throw new DomainException($"Невозможно обновить заказ {WbOrderId}. Заказ находится в финальном статусе {Status}");

        Status = status;
        TotalPrice = totalPrice;
        ProductName = productName?.Trim();
        Quantity = quantity > 0 ? quantity : 1;
        Article = article?.Trim();
        Rid = rid;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsDelivered(DateTime finishedAt)
    {
        if (Status == WbOrderStatus.Delivered)
            return; // Already delivered, idempotent

        Status = WbOrderStatus.Delivered;
        FinishedAt = finishedAt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsCancelled()
    {
        if (Status == WbOrderStatus.Cancelled)
            return; // Already cancelled, idempotent

        Status = WbOrderStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }
}
