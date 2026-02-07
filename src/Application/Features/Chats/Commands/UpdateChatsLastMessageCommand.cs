using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Application.Features.Chats.Commands;

public sealed record UpdateChatsLastMessageCommand(Guid UserId) : IRequest<Result<int>>;

internal sealed class UpdateChatsLastMessageCommandHandler : IRequestHandler<UpdateChatsLastMessageCommand, Result<int>>
{
    private readonly IChatRepository _chatRepo;
    private readonly IMessageRepository _msgRepo;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<UpdateChatsLastMessageCommandHandler> _log;

    public UpdateChatsLastMessageCommandHandler(
        IChatRepository chatRepo,
        IMessageRepository msgRepo,
        IUnitOfWork uow,
        ILogger<UpdateChatsLastMessageCommandHandler> log)
    {
        _chatRepo = chatRepo;
        _msgRepo = msgRepo;
        _uow = uow;
        _log = log;
    }

    public async Task<Result<int>> Handle(UpdateChatsLastMessageCommand req, CancellationToken ct)
    {
        var chats = await _chatRepo.GetByUserIdAsync(req.UserId, ct);

        int updated = 0;
        foreach (var chat in chats)
        {
            var msgs = await _msgRepo.GetByChatIdAsync(chat.Id, 1, ct);
            if (msgs.Count > 0)
            {
                var lastMsg = msgs[0];
                chat.UpdateLastMessage(lastMsg.Text, lastMsg.CreatedAt);
                _chatRepo.Update(chat);
                updated++;
            }
        }

        if (updated > 0)
        {
            await _uow.SaveChangesAsync(ct);
            _log.LogInformation("Updated last_message for {Count} chats", updated);
        }

        return Result.Success(updated);
    }
}
