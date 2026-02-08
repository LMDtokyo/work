using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Application.Features.Chats.Commands;

public sealed record SyncWbChatEventsCommand(Guid WbAccountId, Guid UserId) : IRequest<Result<int>>;

internal sealed class SyncWbChatEventsCommandHandler : IRequestHandler<SyncWbChatEventsCommand, Result<int>>
{
    private readonly IWbAccountRepository _wbAccRepo;
    private readonly IChatRepository _chatRepo;
    private readonly IMessageRepository _msgRepo;
    private readonly IWildberriesApiClient _wbApi;
    private readonly IUnitOfWork _uow;
    private readonly IChatNotifier _notifier;
    private readonly ILogger<SyncWbChatEventsCommandHandler> _logger;

    public SyncWbChatEventsCommandHandler(
        IWbAccountRepository wbAccRepo,
        IChatRepository chatRepo,
        IMessageRepository msgRepo,
        IWildberriesApiClient wbApi,
        IUnitOfWork uow,
        IChatNotifier notifier,
        ILogger<SyncWbChatEventsCommandHandler> logger)
    {
        _wbAccRepo = wbAccRepo;
        _chatRepo = chatRepo;
        _msgRepo = msgRepo;
        _wbApi = wbApi;
        _uow = uow;
        _notifier = notifier;
        _logger = logger;
    }

    public async Task<Result<int>> Handle(SyncWbChatEventsCommand req, CancellationToken ct)
    {
        var wbAcc = await _wbAccRepo.GetByIdWithUserAsync(req.WbAccountId, req.UserId, ct);
        if (wbAcc is null)
            return Result.Failure<int>("WB аккаунт не найден");

        // no cursor = new account, skip to latest position
        if (string.IsNullOrEmpty(wbAcc.LastEventCursor) || wbAcc.LastEventCursor == "initial")
        {
            _logger.LogInformation("New account {AccountId}, fast-forwarding to latest cursor", req.WbAccountId);
            return await FastForwardToLatest(wbAcc, ct);
        }

        WbEventsResult eventsResult;
        int retryCount = 0;
        while (true)
        {
            try
            {
                eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, wbAcc.LastEventCursor, 100, ct);
                break;
            }
            catch (Common.Exceptions.WbApiRateLimitException ex)
            {
                retryCount++;
                if (retryCount > 3)
                {
                    _logger.LogWarning("Rate limit exceeded 3 times for account {AccountId}, skipping", req.WbAccountId);
                    return Result.Success(0);
                }
                _logger.LogWarning("Rate limit hit, waiting {Seconds}s (attempt {Attempt}/3)", ex.RetryAfterSeconds, retryCount);
                await Task.Delay(TimeSpan.FromSeconds(ex.RetryAfterSeconds + 2), ct);
            }
            catch (Common.Exceptions.WbApiAuthenticationException)
            {
                wbAcc.MarkTokenExpired();
                _wbAccRepo.Update(wbAcc);
                await _uow.SaveChangesAsync(ct);
                return Result.Failure<int>("WB token expired");
            }
        }

        _logger.LogDebug("Got {Count} events from WB API for account {AccountId}, cursor: {Cursor}",
            eventsResult.Events.Count, req.WbAccountId, wbAcc.LastEventCursor ?? "null");

        if (eventsResult.Events.Count == 0)
        {
            if (!string.IsNullOrEmpty(eventsResult.NextCursor))
            {
                wbAcc.UpdateEventCursor(eventsResult.NextCursor);
                _wbAccRepo.Update(wbAcc);
                await _uow.SaveChangesAsync(ct);
            }
            return Result.Success(0);
        }

        var chatIdSet = eventsResult.Events.Select(e => e.ChatId).Distinct().ToList();
        var existingChats = await _chatRepo.GetByWbChatIdsAsync(req.WbAccountId, chatIdSet, ct);

        _logger.LogDebug("Found {Count} existing chats for {EventCount} events", existingChats.Count, eventsResult.Events.Count);

        // load WB chats data for names/avatars
        var wbChatsData = await _wbApi.GetChatsAsync(wbAcc.ApiToken, ct);
        var wbChatLookup = wbChatsData.ToDictionary(c => c.ChatId, c => c);

        // create missing chats from events
        var missingChatIds = chatIdSet.Where(cid => !existingChats.ContainsKey(cid)).ToList();
        if (missingChatIds.Any())
        {
            _logger.LogInformation("Creating {Count} new chats from events", missingChatIds.Count);

            var newChats = new List<Chat>();
            foreach (var wbChatId in missingChatIds)
            {
                var firstEvent = eventsResult.Events.First(e => e.ChatId == wbChatId);

                var chatName = "Покупатель";
                string? avatar = null;
                if(wbChatLookup.TryGetValue(wbChatId, out var wbChatInfo) && !string.IsNullOrWhiteSpace(wbChatInfo.CustomerName)) {
                    chatName = wbChatInfo.CustomerName;
                    avatar = wbChatInfo.CustomerAvatar;
                }

                var chat = Chat.CreateFromWb(req.UserId, req.WbAccountId, wbChatId, chatName, avatar);
                chat.UpdateLastMessage(firstEvent.Text, firstEvent.CreatedAt);
                newChats.Add(chat);
                existingChats[wbChatId] = chat;
            }
            await _chatRepo.AddRangeAsync(newChats, ct);
            await _uow.SaveChangesAsync(ct);
        }

        // update existing chats with placeholder names
        foreach(var (wbChatId, chat) in existingChats)
        {
            if(chat.ContactName is "Клиент" or "Продавец" or "Неизвестный" or "Покупатель")
            {
                if(wbChatLookup.TryGetValue(wbChatId, out var wbInfo))
                {
                    chat.UpdateContact(wbInfo.CustomerName, wbInfo.CustomerAvatar);
                    _chatRepo.Update(chat);
                }
            }
        }

        var msgIds = eventsResult.Events.Select(e => e.MessageId).ToList();
        var ourChatIds = existingChats.Values.Select(c => c.Id).ToList();
        var existingMsgIds = await _msgRepo.GetExistingMessageIdsAsync(ourChatIds, msgIds, ct);

        _logger.LogDebug("Found {Count} existing message IDs out of {Total}", existingMsgIds.Count, msgIds.Count);

        var newMessages = eventsResult.Events
            .Where(e => !existingMsgIds.Contains(e.MessageId))
            .Select(e => Message.Create(existingChats[e.ChatId].Id, e.MessageId, e.Text, e.IsFromCustomer, e.CreatedAt))
            .ToList();

        _logger.LogInformation("Syncing {Count} new messages for account {AccountId}", newMessages.Count, req.WbAccountId);

        if (newMessages.Any())
        {
            await _msgRepo.AddRangeAsync(newMessages, ct);

            // update chat last message info
            var chatUpdates = newMessages
                .GroupBy(m => m.ChatId)
                .Select(g => new { ChatId = g.Key, LatestMsg = g.OrderByDescending(x => x.CreatedAt).First() });

            foreach (var upd in chatUpdates)
            {
                var chatWbId = existingChats.FirstOrDefault(kv => kv.Value.Id == upd.ChatId).Key;
                if (chatWbId != null && existingChats.TryGetValue(chatWbId, out var chat))
                {
                    chat.UpdateLastMessage(upd.LatestMsg.Text, upd.LatestMsg.CreatedAt);
                    _chatRepo.Update(chat);
                }
            }

            await _uow.SaveChangesAsync(ct);
            _logger.LogInformation("Saved {Count} messages to DB", newMessages.Count);

            // push realtime notifications
            foreach (var msg in newMessages)
            {
                var chatWbId = existingChats.FirstOrDefault(kv => kv.Value.Id == msg.ChatId).Key;
                if (chatWbId != null && existingChats.TryGetValue(chatWbId, out var ch))
                    await _notifier.NotifyNewMessage(req.UserId, ch.Id, msg.WbMessageId, msg.Text, msg.IsFromCustomer, msg.CreatedAt);
            }
        }

        // update cursor for next sync
        if (!string.IsNullOrEmpty(eventsResult.NextCursor))
        {
            wbAcc.UpdateEventCursor(eventsResult.NextCursor);
            _wbAccRepo.Update(wbAcc);
            await _uow.SaveChangesAsync(ct);
        }

        return Result.Success(newMessages.Count);
    }

    /// <summary>
    /// For new accounts - skip all old events, just grab the latest cursor
    /// so we start receiving only new messages from this moment
    /// </summary>
    private async Task<Result<int>> FastForwardToLatest(WbAccount wbAcc, CancellationToken ct)
    {
        string? cursor = null;
        int batches = 0;

        // paginate through events quickly, just saving cursors
        while (batches < 200)
        {
            WbEventsResult result;
            try
            {
                result = await _wbApi.GetEventsAsync(wbAcc.ApiToken, cursor, 100, ct);
            }
            catch (Common.Exceptions.WbApiRateLimitException)
            {
                // save where we are and continue next cycle
                break;
            }

            if (result.Events.Count == 0 || string.IsNullOrEmpty(result.NextCursor))
            {
                cursor = result.NextCursor ?? cursor;
                break;
            }

            cursor = result.NextCursor;
            batches++;
        }

        if (!string.IsNullOrEmpty(cursor))
        {
            wbAcc.UpdateEventCursor(cursor);
            _wbAccRepo.Update(wbAcc);
            await _uow.SaveChangesAsync(ct);
            _logger.LogInformation("Fast-forwarded {Batches} batches for account {AccountId}", batches, wbAcc.Id);
        }

        return Result.Success(0);
    }
}
