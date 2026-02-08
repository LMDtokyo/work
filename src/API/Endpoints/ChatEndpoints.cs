using System.Security.Claims;
using System.Text.Json.Serialization;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.API.Utilities;
using MessagingPlatform.Application.Features.Chats.Commands;
using MessagingPlatform.Application.Features.Chats.DTOs;
using MessagingPlatform.Application.Features.Chats.Queries;

namespace MessagingPlatform.API.Endpoints;

public static class ChatEndpoints
{
    public sealed class SendMessageRequest
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }

    public sealed record ChatResponseDto(
        Guid Id,
        string Name,
        string? Avatar,
        string? LastMessage,
        string? LastMessageTime,
        int UnreadCount);

    public sealed record MessageResponseDto(
        string Id,
        string Text,
        string SentAt,
        bool IsFromCustomer);

    public static async Task<IResult> GetChats(
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<IReadOnlyList<ChatResponseDto>>.Failure("Unauthorized"), statusCode: 401);

        var query = new GetUserChatsQuery(userId);
        var result = await sender.Send(query);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<IReadOnlyList<ChatResponseDto>>.Failure(result.Error!));

        var dtos = result.Value!.Select(MapToResponse).ToList();
        return Results.Ok(ApiResponse<IReadOnlyList<ChatResponseDto>>.Success(dtos));
    }

    public static async Task<IResult> UpdateLastMessages(
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<int>.Failure("Unauthorized"), statusCode: 401);

        var cmd = new UpdateChatsLastMessageCommand(userId);
        var res = await sender.Send(cmd);
        if (res.IsFailure)
            return Results.BadRequest(ApiResponse<int>.Failure(res.Error!));

        return Results.Ok(ApiResponse<int>.Success(res.Value));
    }

    public static async Task<IResult> SendMessage(
        Guid id,
        SendMessageRequest request,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<bool>.Failure("Unauthorized"), statusCode: 401);

        var command = new SendWbMessageCommand(id, userId, request.Text);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<bool>.Failure(result.Error!));

        return Results.Ok(ApiResponse<bool>.Success(true));
    }

    public static async Task<IResult> MarkAsRead(
        Guid id,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<bool>.Failure("Unauthorized"), statusCode: 401);

        var cmd = new MarkChatAsReadCommand(id, userId);
        var res = await sender.Send(cmd);
        if (res.IsFailure)
            return Results.BadRequest(ApiResponse<bool>.Failure(res.Error!));

        return Results.Ok(ApiResponse<bool>.Success(true));
    }

    public static async Task<IResult> GetMessages(
        Guid id,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<IReadOnlyList<MessageResponseDto>>.Failure("Unauthorized"), statusCode: 401);

        var query = new GetChatMessagesQuery(id, userId);
        var result = await sender.Send(query);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<IReadOnlyList<MessageResponseDto>>.Failure(result.Error!));

        var msgs = result.Value!.Select(m => new MessageResponseDto(
            m.Id,
            m.Text,
            m.SentAt.ToString("o"),
            m.IsFromCustomer)).ToList();

        return Results.Ok(ApiResponse<IReadOnlyList<MessageResponseDto>>.Success(msgs));
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
