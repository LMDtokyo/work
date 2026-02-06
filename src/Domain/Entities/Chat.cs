using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.Entities;

public sealed class Chat : AggregateRoot<Guid>
{
    public Guid UserId { get; private set; }
    public Guid? WbAccountId { get; private set; }
    public string? WbChatId { get; private set; }
    public string ContactName { get; private set; } = string.Empty;
    public string? ContactAvatar { get; private set; }
    public string? LastMessageText { get; private set; }
    public DateTime? LastMessageAt { get; private set; }
    public int UnreadCount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Chat() { }

    private Chat(Guid id, Guid userId, string contactName, string? avatar = null, Guid? wbAccountId = null, string? wbChatId = null) : base(id)
    {
        UserId = userId;
        WbAccountId = wbAccountId;
        WbChatId = wbChatId;
        ContactName = contactName;
        ContactAvatar = avatar;
        UnreadCount = 0;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static Chat Create(Guid userId, string contactName, string? avatar = null)
    {
        return new Chat(Guid.NewGuid(), userId, contactName.Trim(), avatar);
    }

    public static Chat CreateFromWb(Guid userId, Guid wbAccountId, string wbChatId, string contactName, string? avatar = null)
    {
        if (string.IsNullOrWhiteSpace(contactName))
            throw new ArgumentException("Contact name is required", nameof(contactName));

        return new Chat(Guid.NewGuid(), userId, contactName.Trim(), avatar, wbAccountId, wbChatId);
    }

    public void UpdateLastMessage(string text, DateTime timestamp)
    {
        LastMessageText = text.Length > 100 ? text[..100] + "..." : text;
        LastMessageAt = timestamp;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncrementUnread()
    {
        UnreadCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsRead()
    {
        UnreadCount = 0;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateContact(string name, string? avatar = null)
    {
        if (!string.IsNullOrWhiteSpace(name))
            ContactName = name.Trim();
        ContactAvatar = avatar;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SyncFromWb(string contactName, string? avatar, string? lastMessage, DateTime? lastMessageAt, int unreadCount)
    {
        ContactName = contactName.Trim();
        ContactAvatar = avatar;
        LastMessageText = lastMessage;
        LastMessageAt = lastMessageAt;
        UnreadCount = unreadCount;
        UpdatedAt = DateTime.UtcNow;
    }
}
