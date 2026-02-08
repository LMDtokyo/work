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
    readonly ILogger<SyncWbChatEventsCommandHandler> _logger;

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

        // new account - cursor = now, no old messages
        if (string.IsNullOrEmpty(wbAcc.LastEventCursor) || wbAcc.LastEventCursor == "initial")
        {
            var nowCursor = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
            wbAcc.UpdateEventCursor(nowCursor);
            _wbAccRepo.Update(wbAcc);
            await _uow.SaveChangesAsync(ct);
            _logger.LogInformation("Account {Id} cursor set to now ({Cursor})", req.WbAccountId, nowCursor);
            return Result.Success(0);
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
                    _logger.LogWarning("Rate limit x3 for {AccountId}, skip", req.WbAccountId);
                    return Result.Success(0);
                }
                _logger.LogWarning("Rate limit, wait {Sec}s ({Attempt}/3)", ex.RetryAfterSeconds, retryCount);
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

        // filter: only events after account activation
        var minDate = wbAcc.CreatedAt;
        var events = eventsResult.Events.Where(e => e.CreatedAt >= minDate).ToList();

        _logger.LogDebug("Events: {Total} total, {Fresh} after {MinDate}",
            eventsResult.Events.Count, events.Count, minDate);

        // advance cursor even if all events are old
        if (events.Count == 0)
        {
            if (!string.IsNullOrEmpty(eventsResult.NextCursor))
            {
                wbAcc.UpdateEventCursor(eventsResult.NextCursor);
                _wbAccRepo.Update(wbAcc);
                await _uow.SaveChangesAsync(ct);
            }
            return Result.Success(0);
        }

        var chatIds = events.Select(e => e.ChatId).Distinct().ToList();
        var existingChats = await _chatRepo.GetByWbChatIdsAsync(req.WbAccountId, chatIds, ct);

        // chat names from WB
        var wbChats = await _wbApi.GetChatsAsync(wbAcc.ApiToken, ct);
        var lookup = wbChats.ToDictionary(c => c.ChatId, c => c);

        // create missing chats
        var newChats = new List<Chat>();
        foreach (var cid in chatIds.Where(id => !existingChats.ContainsKey(id)))
        {
            var evt = events.First(e => e.ChatId == cid);
            string name = "Покупатель";
            string? ava = null;
            if (lookup.TryGetValue(cid, out var ci) && !string.IsNullOrWhiteSpace(ci.CustomerName))
            {
                name = ci.CustomerName;
                ava = ci.CustomerAvatar;
            }
            var chat = Chat.CreateFromWb(req.UserId, req.WbAccountId, cid, name, ava);
            chat.UpdateLastMessage(evt.Text, evt.CreatedAt);
            newChats.Add(chat);
            existingChats[cid] = chat;
        }

        // fix placeholder names
        foreach (var (wbChatId, chat) in existingChats)
        {
            if (chat.ContactName is "Клиент" or "Продавец" or "Неизвестный" or "Покупатель")
                if (lookup.TryGetValue(wbChatId, out var wbInfo))
                {
                    chat.UpdateContact(wbInfo.CustomerName, wbInfo.CustomerAvatar);
                    _chatRepo.Update(chat);
                }
        }

        var msgIds = events.Select(e => e.MessageId).ToList();
        var ourChatIds = existingChats.Values.Select(c => c.Id).ToList();
        var existing = await _msgRepo.GetExistingMessageIdsAsync(ourChatIds, msgIds, ct);

        var newMsgs = events
            .Where(e => !existing.Contains(e.MessageId))
            .Select(e => Message.Create(existingChats[e.ChatId].Id, e.MessageId, e.Text, e.IsFromCustomer, e.CreatedAt))
            .ToList();

        _logger.LogInformation("Sync: {Msgs} msgs, {Chats} chats for {Acc}",
            newMsgs.Count, newChats.Count, req.WbAccountId);

        // save chats first (FK)
        if (newChats.Any())
        {
            await _chatRepo.AddRangeAsync(newChats, ct);
            await _uow.SaveChangesAsync(ct);
        }

        if (newMsgs.Any())
        {
            await _msgRepo.AddRangeAsync(newMsgs, ct);

            // update last message per chat
            foreach (var g in newMsgs.GroupBy(m => m.ChatId))
            {
                var latest = g.OrderByDescending(x => x.CreatedAt).First();
                var wbId = existingChats.FirstOrDefault(kv => kv.Value.Id == g.Key).Key;
                if (wbId != null && existingChats.TryGetValue(wbId, out var ch))
                {
                    ch.UpdateLastMessage(latest.Text, latest.CreatedAt);
                    _chatRepo.Update(ch);
                }
            }
        }

        if (!string.IsNullOrEmpty(eventsResult.NextCursor))
        {
            wbAcc.UpdateEventCursor(eventsResult.NextCursor);
            _wbAccRepo.Update(wbAcc);
        }

        await _uow.SaveChangesAsync(ct);

        // notify
        foreach (var msg in newMsgs)
        {
            var wbId = existingChats.FirstOrDefault(kv => kv.Value.Id == msg.ChatId).Key;
            if (wbId != null && existingChats.TryGetValue(wbId, out var c))
                await _notifier.NotifyNewMessage(req.UserId, c.Id, msg.WbMessageId, msg.Text, msg.IsFromCustomer, msg.CreatedAt);
        }

        return Result.Success(newMsgs.Count);
    }
}
