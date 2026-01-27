using System.Security.Claims;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.API.Utilities;
using MessagingPlatform.Application.Features.Chats.DTOs;
using MessagingPlatform.Application.Features.Chats.Queries;

namespace MessagingPlatform.API.Endpoints;

public static class ChatEndpoints
{
    public sealed record ChatResponseDto(
        Guid Id,
        string Name,
        string? Avatar,
        string? LastMessage,
        string? LastMessageTime,
        int UnreadCount);

    public static async Task<IResult> GetChats(
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<IReadOnlyList<ChatResponseDto>>.Failure("Unauthorized"));

        var query = new GetUserChatsQuery(userId);
        var result = await sender.Send(query);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<IReadOnlyList<ChatResponseDto>>.Failure(result.Error!));

        var dtos = result.Value!.Select(MapToResponse).ToList();
        return Results.Ok(ApiResponse<IReadOnlyList<ChatResponseDto>>.Success(dtos));
    }

    private static ChatResponseDto MapToResponse(ChatDto chat)
    {
        string? timeStr = null;
        if (chat.LastMessageAt.HasValue)
        {
            var diff = DateTime.UtcNow - chat.LastMessageAt.Value;
            timeStr = diff.TotalMinutes < 1 ? "сейчас" :
                      diff.TotalMinutes < 60 ? $"{(int)diff.TotalMinutes} мин." :
                      diff.TotalHours < 24 ? $"{(int)diff.TotalHours} ч." :
                      chat.LastMessageAt.Value.ToString("dd.MM");
        }

        return new ChatResponseDto(
            chat.Id,
            chat.ContactName,
            chat.ContactAvatar,
            chat.LastMessage,
            timeStr,
            chat.UnreadCount);
    }
}
