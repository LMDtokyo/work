using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MessagingPlatform.API.Services;

internal sealed class ChatNotifier : IChatNotifier
{
    private readonly IHubContext<ChatHub> _hub;

    public ChatNotifier(IHubContext<ChatHub> hub) => _hub = hub;

    public async Task NotifyNewMessage(Guid userId, Guid chatId, string msgId, string text, bool isFromCustomer, DateTime sentAt)
    {
        await _hub.Clients.Group($"user_{userId}").SendAsync("NewMessage", new
        {
            chatId = chatId.ToString(),
            messageId = msgId,
            text,
            isFromCustomer,
            sentAt = sentAt.ToString("o")
        });
    }

    public Task NotifyChatUpdated(Guid userId, Guid chatId)
        => _hub.Clients.Group($"user_{userId}").SendAsync("ChatUpdated", new { chatId = chatId.ToString() });

    public Task NotifyNewOrder(Guid userId, Guid orderId, string? productName, decimal price, string status)
        => _hub.Clients.Group($"user_{userId}").SendAsync("NewOrder", new
        {
            orderId = orderId.ToString(),
            productName,
            price,
            status
        });

    public Task NotifySyncDone(Guid userId, int orderCount, int chatCount)
        => _hub.Clients.Group($"user_{userId}").SendAsync("SyncDone", new { orderCount, chatCount });
}
