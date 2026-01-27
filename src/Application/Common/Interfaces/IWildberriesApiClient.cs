using MessagingPlatform.Domain.Enums;

namespace MessagingPlatform.Application.Common.Interfaces;

public interface IWildberriesApiClient
{
    Task<bool> ValidateTokenAsync(string token, CancellationToken ct = default);
    Task<IReadOnlyList<WbOrderData>> GetOrdersAsync(string token, DateTime? from = null, CancellationToken ct = default);
}

public sealed record WbOrderData(
    long OrderId,
    WbOrderStatus Status,
    decimal TotalPrice,
    string Currency,
    string? ProductName,
    int Quantity,
    DateTime CreatedAt);
