using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Chats.DTOs;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Chats.Queries;

public sealed record GetUserChatsQuery(Guid UserId) : IRequest<Result<IReadOnlyList<ChatDto>>>;

internal sealed class GetUserChatsQueryHandler : IRequestHandler<GetUserChatsQuery, Result<IReadOnlyList<ChatDto>>>
{
    private readonly IChatRepository _chatRepository;

    public GetUserChatsQueryHandler(IChatRepository chatRepository)
    {
        _chatRepository = chatRepository;
    }

    public async Task<Result<IReadOnlyList<ChatDto>>> Handle(GetUserChatsQuery request, CancellationToken ct)
    {
        var chats = await _chatRepository.GetByUserIdAsync(request.UserId, ct);

        var dtos = chats
            .Select(c => new ChatDto(
                c.Id,
                c.ContactName,
                c.ContactAvatar,
                c.LastMessageText,
                c.LastMessageAt,
                c.UnreadCount))
            .ToList();

        return dtos;
    }
}
