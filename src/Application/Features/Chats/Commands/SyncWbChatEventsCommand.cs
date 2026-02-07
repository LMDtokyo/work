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

        var eventsResult = await _wbApi.GetEventsAsync(wbAcc.ApiToken, null, 50, ct);

        _logger.LogDebug("Got {Count} events from WB API for account {AccountId}", eventsResult.Events.Count, req.WbAccountId);

        if (eventsResult.Events.Count == 0)
            return Result.Success(0);

        var chatIdSet = eventsResult.Events.Select(e => e.ChatId).Distinct().ToList();
        var existingChats = await _chatRepo.GetByWbChatIdsAsync(req.WbAccountId, chatIdSet, ct);

        _logger.LogDebug("Found {Count} existing chats for {EventCount} events", existingChats.Count, eventsResult.Events.Count);

        var msgIds = eventsResult.Events.Select(e => e.MessageId).ToList();
        var existingMsgIds = await _msgRepo.GetExistingMessageIdsAsync(msgIds, ct);

        _logger.LogDebug("Found {Count} existing message IDs out of {Total}", existingMsgIds.Count, msgIds.Count);

        var newMessages = eventsResult.Events
            .Where(e => existingChats.ContainsKey(e.ChatId) && !existingMsgIds.Contains(e.MessageId))
            .Select(e => Message.Create(existingChats[e.ChatId].Id, e.MessageId, e.Text, e.IsFromCustomer, e.CreatedAt))
            .ToList();

        _logger.LogInformation("Syncing {Count} new messages for account {AccountId}", newMessages.Count, req.WbAccountId);

        if (newMessages.Any())
        {
            await _msgRepo.AddRangeAsync(newMessages, ct);
            await _uow.SaveChangesAsync(ct);
            _logger.LogInformation("Saved {Count} messages to DB", newMessages.Count);
        }

        return Result.Success(newMessages.Count);
    }
}
