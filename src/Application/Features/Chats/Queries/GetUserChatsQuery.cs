using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Chats.DTOs;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Chats.Queries;

public sealed record GetUserChatsQuery(Guid UserId) : IRequest<Result<IReadOnlyList<ChatDto>>>;

internal sealed class GetUserChatsQueryHandler : IRequestHandler<GetUserChatsQuery, Result<IReadOnlyList<ChatDto>>>
{
    private readonly IChatRepository _chatRepo;

    public GetUserChatsQueryHandler(IChatRepository chatRepo)
    {
        _chatRepo = chatRepo;
    }

    public async Task<Result<IReadOnlyList<ChatDto>>> Handle(GetUserChatsQuery request, CancellationToken ct)
    {
        var chats = await _chatRepo.GetByUserIdAsync(request.UserId, ct);

        var dtos = chats.Select(c => new ChatDto(
            c.Id,
            c.ContactName,
            c.ContactAvatar,
            c.LastMessageText,
            c.LastMessageAt,
            c.UnreadCount)).ToList();

        return dtos;
    }
}
