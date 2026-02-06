using MediatR;
using MessagingPlatform.Application.Common.Exceptions;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Application.Features.Chats.Commands;

public sealed record SyncWbChatsCommand(Guid WbAccountId, Guid UserId) : IRequest<Result<int>>;

internal sealed class SyncWbChatsCommandHandler : IRequestHandler<SyncWbChatsCommand, Result<int>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IChatRepository _chatRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWildberriesApiClient _wbApiClient;
    private readonly ILogger<SyncWbChatsCommandHandler> _logger;

    public SyncWbChatsCommandHandler(
        IWbAccountRepository accountRepository,
        IChatRepository chatRepository,
        IUnitOfWork unitOfWork,
        IWildberriesApiClient wbApiClient,
        ILogger<SyncWbChatsCommandHandler> logger)
    {
        _accountRepository = accountRepository;
        _chatRepository = chatRepository;
        _unitOfWork = unitOfWork;
        _wbApiClient = wbApiClient;
        _logger = logger;
    }

    public async Task<Result<int>> Handle(SyncWbChatsCommand request, CancellationToken ct)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.WbAccountId, request.UserId, ct);
        if (account is null)
            return Result.Failure<int>("Аккаунт не найден или у вас нет прав на синхронизацию");

        IReadOnlyList<WbChatData> apiChats;
        try
        {
            apiChats = await _wbApiClient.GetChatsAsync(account.ApiToken.Value, ct);
        }
        catch (WbApiAuthenticationException ex)
        {
            // CRITICAL: Mark token as expired
            account.MarkTokenExpired();
            _accountRepository.Update(account);
            await _unitOfWork.SaveChangesAsync(ct);

            _logger.LogWarning(
                ex,
                "WB Account {AccountId} marked as TokenExpired during chats sync",
                request.WbAccountId);

            return Result.Failure<int>("API токен истёк или недействителен. Пожалуйста, обновите токен в настройках.");
        }
        catch (WbApiRateLimitException ex)
        {
            _logger.LogWarning(
                ex,
                "Rate limit hit during chats sync for account {AccountId}. Retry after {Seconds}s",
                request.WbAccountId,
                ex.RetryAfterSeconds);

            // Don't mark as error - temporary condition
            return Result.Failure<int>($"Превышен лимит запросов WB API. Повторите через {ex.RetryAfterSeconds} секунд.");
        }
        catch (Exception ex)
        {
            account.MarkError($"Ошибка при получении чатов: {ex.Message}");
            _accountRepository.Update(account);
            await _unitOfWork.SaveChangesAsync(ct);

            _logger.LogError(
                ex,
                "Unexpected error during chats sync for account {AccountId}",
                request.WbAccountId);

            return Result.Failure<int>("Не удалось получить чаты из Wildberries API");
        }

        if (apiChats.Count == 0)
        {
            return 0;
        }

        var apiChatIds = apiChats.Select(c => c.ChatId).ToList();

        // Single DB query to fetch all existing chats - batch loading to avoid N+1
        var existingChatsDict = await _chatRepository.GetByWbChatIdsAsync(request.WbAccountId, apiChatIds, ct);

        var newChats = new List<Chat>();

        foreach (var chatData in apiChats)
        {
            // Skip chats with empty names
            if (string.IsNullOrWhiteSpace(chatData.CustomerName))
                continue;

            if (existingChatsDict.TryGetValue(chatData.ChatId, out var existingChat))
            {
                // Update existing chat
                existingChat.SyncFromWb(
                    chatData.CustomerName,
                    chatData.CustomerAvatar,
                    chatData.LastMessage,
                    chatData.LastMessageAt,
                    chatData.UnreadCount);
                _chatRepository.Update(existingChat);
            }
            else
            {
                // Create new chat
                var newChat = Chat.CreateFromWb(
                    request.UserId,
                    request.WbAccountId,
                    chatData.ChatId,
                    chatData.CustomerName,
                    chatData.CustomerAvatar);

                if (!string.IsNullOrWhiteSpace(chatData.LastMessage) && chatData.LastMessageAt.HasValue)
                {
                    newChat.UpdateLastMessage(chatData.LastMessage, chatData.LastMessageAt.Value);
                }

                if (chatData.UnreadCount > 0)
                {
                    for (int i = 0; i < chatData.UnreadCount; i++)
                    {
                        newChat.IncrementUnread();
                    }
                }

                newChats.Add(newChat);
            }
        }

        if (newChats.Count > 0)
            await _chatRepository.AddRangeAsync(newChats, ct);

        await _unitOfWork.SaveChangesAsync(ct);

        return newChats.Count;
    }
}
