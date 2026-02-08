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
    private readonly ILogger<SyncWbChatEventsCommandHandler> _logger;

    public SyncWbChatEventsCommandHandler(
        IWbAccountRepository wbAccRepo,
        IChatRepository chatRepo,
        IMessageRepository msgRepo,
        IWildberriesApiClient wbApi,
        IUnitOfWork uow,
        ILogger<SyncWbChatEventsCommandHandler> logger)
    {
        _wbAccRepo = wbAccRepo;
        _chatRepo = chatRepo;
        _msgRepo = msgRepo;
        _wbApi = wbApi;
        _uow = uow;
        _logger = logger;
    }

    public async Task<Result<int>> Handle(SyncWbChatEventsCommand req, CancellationToken ct)
    {
        var wbAcc = await _wbAccRepo.GetByIdWithUserAsync(req.WbAccountId, req.UserId, ct);
        if (wbAcc is null)
            return Result.Failure<int>("WB аккаунт не найден");

        // if cursor is null or 'initial' - load only new events from 2026-02-08 onwards
        var needsFullSync = string.IsNullOrEmpty(wbAcc.LastEventCursor) || wbAcc.LastEventCursor == "initial";

        if (needsFullSync)
        {
            _logger.LogInformation("Loading events from 2026-02-08 onwards for account {AccountId}", req.WbAccountId);
            return await LoadHistoryFromDate(wbAcc, req.UserId, new DateTime(2026, 2, 8, 0, 0, 0, DateTimeKind.Utc), ct);
        }

        WbEventsResult eventsResult;

        try
        {
            eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, wbAcc.LastEventCursor, 100, ct);
        }
        catch (Common.Exceptions.WbApiRateLimitException ex)
        {
            _logger.LogWarning("Rate limit during regular sync, will retry in next cycle after {Seconds}s", ex.RetryAfterSeconds);
            return Result.Success(0);
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

                string chatName = "Неизвестный";
                string? avatar = null;
                if(wbChatLookup.TryGetValue(wbChatId, out var wbChatInfo)) {
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
            if(chat.ContactName is "Клиент" or "Продавец" or "Неизвестный")
            {
                if(wbChatLookup.TryGetValue(wbChatId, out var wbInfo))
                {
                    chat.UpdateContact(wbInfo.CustomerName, wbInfo.CustomerAvatar);
                    _chatRepo.Update(chat);
                }
            }
        }

        var msgIds = eventsResult.Events.Select(e => e.MessageId).ToList();
        var existingMsgIds = await _msgRepo.GetExistingMessageIdsAsync(msgIds, ct);

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

    private async Task<Result<int>> LoadHistoryFromDate(WbAccount wbAcc, Guid userId, DateTime fromDate, CancellationToken ct)
    {
        int totalLoaded = 0;
        string? cursor = null;
        int iterations = 0;
        const int MAX_ITER = 100;

        while (iterations < MAX_ITER)
        {
            WbEventsResult eventsResult;

            try
            {
                eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, cursor, 100, ct);
            }
            catch (Common.Exceptions.WbApiRateLimitException ex)
            {
                _logger.LogWarning("Rate limit hit, waiting {Seconds}s before retry", ex.RetryAfterSeconds);
                await Task.Delay(TimeSpan.FromSeconds(ex.RetryAfterSeconds), ct);
                continue; // retry same iteration
            }

            if (eventsResult.Events.Count == 0) break;

            // filter events >= fromDate (only new from 08.02 onwards)
            var filteredEvents = eventsResult.Events.Where(e => e.CreatedAt >= fromDate).ToList();

            if (filteredEvents.Count == 0)
            {
                _logger.LogDebug("No events >= {FromDate} in this batch, continue to next", fromDate);
                cursor = eventsResult.NextCursor;
                iterations++;
                if (string.IsNullOrEmpty(cursor)) break;
                continue;
            }

            var chatIdSet = filteredEvents.Select(e => e.ChatId).Distinct().ToList();
            var existingChats = await _chatRepo.GetByWbChatIdsAsync(wbAcc.Id, chatIdSet, ct);

            // get real names from WB chats endpoint
            var wbChatsData = await _wbApi.GetChatsAsync(wbAcc.ApiToken, ct);
            var wbChatLookup = wbChatsData.ToDictionary(c => c.ChatId, c => c);

            var missingChatIds = chatIdSet.Where(cid => !existingChats.ContainsKey(cid)).ToList();
            if (missingChatIds.Any())
            {
                var newChats = new List<Chat>();
                foreach (var wbChatId in missingChatIds)
                {
                    var firstEvent = filteredEvents.First(e => e.ChatId == wbChatId);

                    var chatName = "Неизвестный";
                    string? avatar = null;
                    if(wbChatLookup.TryGetValue(wbChatId, out var wbInfo)) {
                        chatName = wbInfo.CustomerName;
                        avatar = wbInfo.CustomerAvatar;
                    }

                    var chat = Chat.CreateFromWb(userId, wbAcc.Id, wbChatId, chatName, avatar);
                    newChats.Add(chat);
                    existingChats[wbChatId] = chat;
                }
                await _chatRepo.AddRangeAsync(newChats, ct);
                await _uow.SaveChangesAsync(ct);
            }

            // fix old chats with placeholder names
            foreach(var (wbChatId, chat) in existingChats)
            {
                if(chat.ContactName is "Клиент" or "Продавец" or "Неизвестный")
                {
                    if(wbChatLookup.TryGetValue(wbChatId, out var wbInfo))
                    {
                        chat.UpdateContact(wbInfo.CustomerName, wbInfo.CustomerAvatar);
                        _chatRepo.Update(chat);
                    }
                }
            }

            var msgIds = filteredEvents.Select(e => e.MessageId).ToList();
            var existingMsgIds = await _msgRepo.GetExistingMessageIdsAsync(msgIds, ct);

            var newMessages = filteredEvents
                .Where(e => !existingMsgIds.Contains(e.MessageId))
                .Select(e => Message.Create(existingChats[e.ChatId].Id, e.MessageId, e.Text, e.IsFromCustomer, e.CreatedAt))
                .ToList();

            if (newMessages.Any())
            {
                await _msgRepo.AddRangeAsync(newMessages, ct);

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
                totalLoaded += newMessages.Count;
            }

            cursor = eventsResult.NextCursor;
            iterations++;

            if (string.IsNullOrEmpty(cursor)) break;

            _logger.LogDebug("History batch {Iter}, loaded {Count} messages", iterations, newMessages.Count);
        }

        if (!string.IsNullOrEmpty(cursor))
        {
            wbAcc.UpdateEventCursor(cursor);
            _wbAccRepo.Update(wbAcc);
            await _uow.SaveChangesAsync(ct);
        }

        _logger.LogInformation("History sync completed for account {AccountId}, loaded {Total} messages in {Iterations} batches",
            wbAcc.Id, totalLoaded, iterations);

        return Result.Success(totalLoaded);
    }
}
