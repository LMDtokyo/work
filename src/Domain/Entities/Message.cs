using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.Entities;

public sealed class Message : Entity<Guid>
{
    public Guid ChatId { get; private set; }
    public string WbMessageId { get; private set; } = string.Empty;
    public string Text { get; private set; } = string.Empty;
    public bool IsFromCustomer { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime SyncedAt { get; private set; }

    private Message() { }

    private Message(Guid id, Guid chatId, string wbMessageId, string text, bool isFromCustomer, DateTime createdAt)
        : base(id)
    {
        ChatId = chatId;
        WbMessageId = wbMessageId;
        Text = text;
        IsFromCustomer = isFromCustomer;
        CreatedAt = createdAt;
        SyncedAt = DateTime.UtcNow;
    }

    public static Message Create(Guid chatId, string wbMessageId, string text, bool isFromCustomer, DateTime createdAt)
    {
        if (string.IsNullOrWhiteSpace(wbMessageId))
            throw new ArgumentException("WB message ID is required", nameof(wbMessageId));

        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Message text is required", nameof(text));

        return new Message(Guid.NewGuid(), chatId, wbMessageId, text, isFromCustomer, createdAt);
    }
}
