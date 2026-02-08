using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Application.Features.Chats.Commands;

public sealed record LoadFullChatHistoryCommand(Guid WbAccountId, Guid UserId) : IRequest<Result<int>>;

internal sealed class LoadFullChatHistoryCommandHandler : IRequestHandler<LoadFullChatHistoryCommand, Result<int>>
{
    private readonly IWbAccountRepository _wbAccRepo;
    private readonly IChatRepository _chatRepo;
    private readonly IMessageRepository _msgRepo;
    private readonly IWildberriesApiClient _wbApi;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<LoadFullChatHistoryCommandHandler> _log;

    public LoadFullChatHistoryCommandHandler(
        IWbAccountRepository wbAccRepo,
        IChatRepository chatRepo,
        IMessageRepository msgRepo,
        IWildberriesApiClient wbApi,
        IUnitOfWork uow,
        ILogger<LoadFullChatHistoryCommandHandler> log)
    {
        _wbAccRepo = wbAccRepo;
        _chatRepo = chatRepo;
        _msgRepo = msgRepo;
        _wbApi = wbApi;
        _uow = uow;
        _log = log;
    }

    public async Task<Result<int>> Handle(LoadFullChatHistoryCommand req, CancellationToken ct)
    {
        var wbAcc = await _wbAccRepo.GetByIdWithUserAsync(req.WbAccountId, req.UserId, ct);
        if (wbAcc is null)
            return Result.Failure<int>("WB account not found");

        int totalLoaded = 0;
        string? cursor = null;
        int iterations = 0;
        const int MAX_ITERATIONS = 50; // safety limit

        _log.LogInformation("Starting full history load for account {AccountId}", req.WbAccountId);

        while (iterations < MAX_ITERATIONS)
        {
            var eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, cursor, 100, ct);

            if (eventsResult.Events.Count == 0)
                break;

            var chatIdSet = eventsResult.Events.Select(e => e.ChatId).Distinct().ToList();
            var existingChats = await _chatRepo.GetByWbChatIdsAsync(req.WbAccountId, chatIdSet, ct);

            // create missing chats
            var missingChatIds = chatIdSet.Where(cid => !existingChats.ContainsKey(cid)).ToList();
            if (missingChatIds.Any())
            {
                var newChats = new List<Chat>();
                foreach (var wbChatId in missingChatIds)
                {
                    var firstEvent = eventsResult.Events.First(e => e.ChatId == wbChatId);
                    var chat = Chat.CreateFromWb(req.UserId, req.WbAccountId, wbChatId,
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

                // update chats last message
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

            if (string.IsNullOrEmpty(cursor))
                break;

            _log.LogDebug("Loaded batch {Iter}, got {Count} new messages, cursor: {Cursor}",
                iterations, newMessages.Count, cursor);
        }

        // save final cursor
        if (!string.IsNullOrEmpty(cursor))
        {
            wbAcc.UpdateEventCursor(cursor);
            _wbAccRepo.Update(wbAcc);
            await _uow.SaveChangesAsync(ct);
        }

        _log.LogInformation("Finished full history load for account {AccountId}, loaded {Total} messages in {Iterations} iterations",
            req.WbAccountId, totalLoaded, iterations);

        return Result.Success(totalLoaded);
    }
}
