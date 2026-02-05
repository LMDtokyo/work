using MessagingPlatform.Domain.Enums;

namespace MessagingPlatform.Application.Common.Interfaces;

public interface IWildberriesApiClient
{
    Task<bool> ValidateTokenAsync(string token, CancellationToken ct = default);
    Task<IReadOnlyList<WbOrderData>> GetOrdersAsync(string token, DateTime? from = null, CancellationToken ct = default);
    Task<IReadOnlyList<WbOrderData>> GetArchivedOrdersAsync(string token, DateTime? from = null, DateTime? to = null, CancellationToken ct = default);
    DateTime? GetTokenExpirationDate(string token);

    // Chat methods
    Task<IReadOnlyList<WbChatData>> GetChatsAsync(string token, CancellationToken ct = default);
    Task<IReadOnlyList<WbMessageData>> GetMessagesAsync(string token, long chatId, CancellationToken ct = default);
    Task<bool> SendMessageAsync(string token, long chatId, string text, CancellationToken ct = default);
}

public sealed record WbOrderData(
    long OrderId,
    WbOrderStatus Status,
    string? Article,
    long? Rid,
    decimal TotalPrice,
    string Currency,
    string? ProductName,
    int Quantity,
    DateTime CreatedAt,
    DateTime? FinishedAt = null);

public sealed record WbChatData(
    long ChatId,
    string CustomerName,
    string? CustomerAvatar,
    string? LastMessage,
    DateTime? LastMessageAt,
    int UnreadCount);

public sealed record WbMessageData(
    long MessageId,
    long ChatId,
    string Text,
    bool IsFromCustomer,
    DateTime CreatedAt);
