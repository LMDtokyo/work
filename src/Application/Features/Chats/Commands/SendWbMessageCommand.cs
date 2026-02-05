using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
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
            .NotEmpty().WithMessage("Текст сообщения не может быть пустым")
            .MaximumLength(4000).WithMessage("Сообщение не может превышать 4000 символов");
    }
}

internal sealed class SendWbMessageCommandHandler : IRequestHandler<SendWbMessageCommand, Result<bool>>
{
    private readonly IChatRepository _chatRepository;
    private readonly IWbAccountRepository _accountRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWildberriesApiClient _wbApiClient;

    public SendWbMessageCommandHandler(
        IChatRepository chatRepository,
        IWbAccountRepository accountRepository,
        IUnitOfWork unitOfWork,
        IWildberriesApiClient wbApiClient)
    {
        _chatRepository = chatRepository;
        _accountRepository = accountRepository;
        _unitOfWork = unitOfWork;
        _wbApiClient = wbApiClient;
    }

    public async Task<Result<bool>> Handle(SendWbMessageCommand request, CancellationToken ct)
    {
        // Get chat and verify it belongs to user
        var chat = await _chatRepository.GetByIdWithUserAsync(request.ChatId, request.UserId, ct);
        if (chat is null)
            return Result.Failure<bool>("Чат не найден или у вас нет доступа к нему");

        // INVARIANT: Chat must be linked to WB account
        if (!chat.WbAccountId.HasValue || !chat.WbChatId.HasValue)
            return Result.Failure<bool>("Этот чат не связан с аккаунтом Wildberries");

        // Get WB account and verify ownership
        var account = await _accountRepository.GetByIdWithUserAsync(chat.WbAccountId.Value, request.UserId, ct);
        if (account is null)
            return Result.Failure<bool>("Аккаунт Wildberries не найден или у вас нет доступа к нему");

        // Send message via WB API
        bool success;
        try
        {
            success = await _wbApiClient.SendMessageAsync(
                account.ApiToken.Value,
                chat.WbChatId.Value,
                request.Text,
                ct);
        }
        catch (Exception)
        {
            return Result.Failure<bool>("Не удалось отправить сообщение через Wildberries API");
        }

        if (!success)
            return Result.Failure<bool>("Wildberries API вернул ошибку при отправке сообщения");

        // Update last message in chat
        chat.UpdateLastMessage(request.Text, DateTime.UtcNow);
        _chatRepository.Update(chat);
        await _unitOfWork.SaveChangesAsync(ct);

        return true;
    }
}
