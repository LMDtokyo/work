using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Chats.Commands;

public sealed record SendWbMessageCommand(
    Guid ChatId,
    Guid UserId,
    string Text) : IRequest<Result<bool>>;

public sealed class SendWbMessageCommandValidator : AbstractValidator<SendWbMessageCommand>
{
    public SendWbMessageCommandValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Текст не может быть пустым")
            .MaximumLength(1000).WithMessage("Макс 1000 символов");
    }
}

internal sealed class SendWbMessageCommandHandler : IRequestHandler<SendWbMessageCommand, Result<bool>>
{
    readonly IChatRepository _chats;
    readonly IMessageRepository _messages;
    readonly IWbAccountRepository _accounts;
    readonly IUnitOfWork _uow;
    readonly IWildberriesApiClient _wb;
    readonly IChatNotifier _notifier;

    public SendWbMessageCommandHandler(
        IChatRepository chats,
        IMessageRepository messages,
        IWbAccountRepository accounts,
        IUnitOfWork uow,
        IWildberriesApiClient wb,
        IChatNotifier notifier)
    {
        _chats = chats;
        _messages = messages;
        _accounts = accounts;
        _uow = uow;
        _wb = wb;
        _notifier = notifier;
    }

    public async Task<Result<bool>> Handle(SendWbMessageCommand req, CancellationToken ct)
    {
        var chat = await _chats.GetByIdWithUserAsync(req.ChatId, req.UserId, ct);
        if (chat is null)
            return Result.Failure<bool>("Чат не найден");

        if (!chat.WbAccountId.HasValue || string.IsNullOrEmpty(chat.WbChatId))
            return Result.Failure<bool>("Чат не привязан к WB");

        var acc = await _accounts.GetByIdWithUserAsync(chat.WbAccountId.Value, req.UserId, ct);
        if (acc is null)
            return Result.Failure<bool>("WB аккаунт не найден");

        // fetch replySign from WB
        var wbChats = await _wb.GetChatsAsync(acc.ApiToken, ct);
        var target = wbChats.FirstOrDefault(c => c.ChatId == chat.WbChatId);
        if (target == null || string.IsNullOrEmpty(target.ReplySign))
            return Result.Failure<bool>("Не удалось получить replySign");

        bool ok;
        try
        {
            ok = await _wb.SendMessageAsync(acc.ApiToken, target.ReplySign, req.Text, ct);
        }
        catch (Exception)
        {
            return Result.Failure<bool>("Ошибка WB API");
        }

        if (!ok)
            return Result.Failure<bool>("WB не принял сообщение");

        // save sent message to DB
        var now = DateTime.UtcNow;
        var msgId = "sent_" + Guid.NewGuid().ToString("N")[..12];
        var msg = Message.Create(chat.Id, msgId, req.Text, false, now);
        await _messages.AddAsync(msg, ct);

        chat.UpdateLastMessage(req.Text, now);
        _chats.Update(chat);
        await _uow.SaveChangesAsync(ct);

        await _notifier.NotifyNewMessage(req.UserId, chat.Id, msgId, req.Text, false, now);
        return true;
    }
}
