namespace MessagingPlatform.Application.Features.Chats.DTOs;

public sealed record ChatDto(
    Guid Id,
    string ContactName,
    string? ContactAvatar,
    string? LastMessage,
    DateTime? LastMessageAt,
    int UnreadCount,
    string Platform);
