namespace MessagingPlatform.Application.Common.Interfaces;

public interface IChatNotifier
{
    Task NotifyNewMessage(Guid userId, Guid chatId, string messageId, string text, bool isFromCustomer, DateTime sentAt);
    Task NotifyChatUpdated(Guid userId, Guid chatId);
}
