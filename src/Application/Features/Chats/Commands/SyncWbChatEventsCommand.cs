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

        var isFirstSync = string.IsNullOrEmpty(wbAcc.LastEventCursor);

        if (isFirstSync)
        {
            _logger.LogInformation("First sync for account {AccountId}, loading full history", req.WbAccountId);
            return await LoadFullHistoryAndSync(wbAcc, req.UserId, ct);
        }

        // use cursor to get only new events
        var eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, wbAcc.LastEventCursor, 100, ct);

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

        // create missing chats from events
        var missingChatIds = chatIdSet.Where(cid => !existingChats.ContainsKey(cid)).ToList();
        if (missingChatIds.Any())
        {
            _logger.LogInformation("Creating {Count} new chats from events", missingChatIds.Count);
            var newChats = new List<Chat>();
            foreach (var wbChatId in missingChatIds)
            {
                var firstEvent = eventsResult.Events.First(e => e.ChatId == wbChatId);
                var chat = Chat.CreateFromWb(req.UserId, req.WbAccountId, wbChatId,
                    firstEvent.IsFromCustomer ? "Клиент" : "Продавец", null);
                chat.UpdateLastMessage(firstEvent.Text, firstEvent.CreatedAt);
                newChats.Add(chat);
                existingChats[wbChatId] = chat;
            }
            await _chatRepo.AddRangeAsync(newChats, ct);
            await _uow.SaveChangesAsync(ct);
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

    private async Task<Result<int>> LoadFullHistoryAndSync(WbAccount wbAcc, Guid userId, CancellationToken ct)
    {
        int totalLoaded = 0;
        string? cursor = null;
        int iterations = 0;
        const int MAX_ITER = 50;

        while (iterations < MAX_ITER)
        {
            var eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, cursor, 100, ct);

            if (eventsResult.Events.Count == 0) break;

            var chatIdSet = eventsResult.Events.Select(e => e.ChatId).Distinct().ToList();
            var existingChats = await _chatRepo.GetByWbChatIdsAsync(wbAcc.Id, chatIdSet, ct);

            var missingChatIds = chatIdSet.Where(cid => !existingChats.ContainsKey(cid)).ToList();
            if (missingChatIds.Any())
            {
                var newChats = new List<Chat>();
                foreach (var wbChatId in missingChatIds)
                {
                    var firstEvent = eventsResult.Events.First(e => e.ChatId == wbChatId);
                    var chat = Chat.CreateFromWb(userId, wbAcc.Id, wbChatId,
                        firstEvent.IsFromCustomer ? "Клиент" : "Продавец", null);
                    newChats.Add(chat);
                    existingChats[wbChatId] = chat;
                }
                await _chatRepo.AddRangeAsync(newChats, ct);
                await _uow.SaveChangesAsync(ct);
            }

            var msgIds = eventsResult.Events.Select(e => e.MessageId).ToList();
            var existingMsgIds = await _msgRepo.GetExistingMessageIdsAsync(msgIds, ct);

            var newMessages = eventsResult.Events
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

            _logger.LogDebug("Full history batch {Iter}, loaded {Count} messages", iterations, newMessages.Count);
        }

        if (!string.IsNullOrEmpty(cursor))
        {
            wbAcc.UpdateEventCursor(cursor);
            _wbAccRepo.Update(wbAcc);
            await _uow.SaveChangesAsync(ct);
        }

        _logger.LogInformation("Full history sync completed for account {AccountId}, loaded {Total} messages in {Iterations} batches",
            wbAcc.Id, totalLoaded, iterations);

        return Result.Success(totalLoaded);
    }
}
