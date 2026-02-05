using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Chats.Commands;

public sealed record MarkChatAsReadCommand(Guid ChatId, Guid UserId) : IRequest<Result<bool>>;

internal sealed class MarkChatAsReadCommandHandler : IRequestHandler<MarkChatAsReadCommand, Result<bool>>
{
    private readonly IChatRepository _chatRepo;
    private readonly IUnitOfWork _uow;

    public MarkChatAsReadCommandHandler(IChatRepository chatRepo, IUnitOfWork uow)
    {
        _chatRepo = chatRepo;
        _uow = uow;
    }

    public async Task<Result<bool>> Handle(MarkChatAsReadCommand req, CancellationToken ct)
    {
        var chat = await _chatRepo.GetByIdWithUserAsync(req.ChatId, req.UserId, ct);
        if (chat is null)
            return Result.Failure<bool>("Чат не найден");

        chat.MarkAsRead();
        _chatRepo.Update(chat);
        await _uow.SaveChangesAsync(ct);

        return true;
    }
}
