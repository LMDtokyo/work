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
    Task<WbEventsResult> GetEventsAsync(string token, string? nextCursor = null, int limit = 100, CancellationToken ct = default);
    Task<bool> SendMessageAsync(string token, string chatId, string text, CancellationToken ct = default);
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
    string ChatId,
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

public sealed record WbEventData(
    string ChatId,
    string MessageId,
    string Text,
    bool IsFromCustomer,
    DateTime CreatedAt);

public sealed record WbEventsResult(
    IReadOnlyList<WbEventData> Events,
    string? NextCursor,
    int TotalEvents);
