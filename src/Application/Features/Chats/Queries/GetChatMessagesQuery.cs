using MediatR;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Application.Common.Models;

namespace MessagingPlatform.Application.Features.Chats.Queries;

public sealed record GetChatMessagesQuery(Guid ChatId, Guid UserId) : IRequest<Result<IReadOnlyList<MessageData>>>;

public sealed record MessageData(
    string Id,
    string Text,
    DateTime SentAt,
    bool IsFromCustomer);

internal sealed class GetChatMessagesQueryHandler : IRequestHandler<GetChatMessagesQuery, Result<IReadOnlyList<MessageData>>>
{
    private readonly IChatRepository _chatRepo;
    private readonly IMessageRepository _msgRepo;

    public GetChatMessagesQueryHandler(IChatRepository chatRepo, IMessageRepository msgRepo)
    {
        _chatRepo = chatRepo;
        _msgRepo = msgRepo;
    }

    public async Task<Result<IReadOnlyList<MessageData>>> Handle(GetChatMessagesQuery req, CancellationToken ct)
    {
        var chat = await _chatRepo.GetByIdAsync(req.ChatId, ct);
        if (chat is null)
            return Result.Failure<IReadOnlyList<MessageData>>("Чат не найден");

        if (chat.UserId != req.UserId)
            return Result.Failure<IReadOnlyList<MessageData>>("Нет доступа");

        var messages = await _msgRepo.GetByChatIdAsync(req.ChatId, 100, ct);

        var result = messages
            .Select(m => new MessageData(m.Id.ToString(), m.Text, m.CreatedAt, m.IsFromCustomer))
            .ToList();

        return Result.Success<IReadOnlyList<MessageData>>(result);
    }
}
