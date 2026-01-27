using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.Entities;

public sealed class Chat : AggregateRoot<Guid>
{
    public Guid UserId { get; private set; }
    public string ContactName { get; private set; } = string.Empty;
    public string? ContactAvatar { get; private set; }
    public string? LastMessageText { get; private set; }
    public DateTime? LastMessageAt { get; private set; }
    public int UnreadCount { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Chat() { }

    private Chat(Guid id, Guid userId, string contactName, string? avatar = null) : base(id)
    {
        UserId = userId;
        ContactName = contactName;
        ContactAvatar = avatar;
        UnreadCount = 0;
        CreatedAt = DateTime.UtcNow;
    }

    public static Chat Create(Guid userId, string contactName, string? avatar = null)
    {
        return new Chat(Guid.NewGuid(), userId, contactName.Trim(), avatar);
    }

    public void UpdateLastMessage(string text, DateTime timestamp)
    {
        LastMessageText = text.Length > 100 ? text[..100] + "..." : text;
        LastMessageAt = timestamp;
    }

    public void IncrementUnread() => UnreadCount++;

    public void MarkAsRead() => UnreadCount = 0;

    public void UpdateContact(string name, string? avatar = null)
    {
        if (!string.IsNullOrWhiteSpace(name))
            ContactName = name.Trim();
        ContactAvatar = avatar;
    }
}
