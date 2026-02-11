using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Services;
using MessagingPlatform.Application.Features.Chats.Commands;
using MessagingPlatform.Application.Features.Wildberries.Commands;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Infrastructure.Services;

internal sealed class InitialSyncService : IInitialSyncService
{
    private readonly ISender _sender;
    private readonly IChatNotifier _notifier;
    readonly ILogger<InitialSyncService> _logger;

    public InitialSyncService(ISender sender, IChatNotifier notifier, ILogger<InitialSyncService> logger)
    {
        _sender = sender;
        _notifier = notifier;
        _logger = logger;
    }

    public async Task<bool> PerformInitialSyncAsync(Guid wbAccountId, Guid userId, CancellationToken ct = default)
    {
        try
        {
            _logger.LogInformation("Initial sync started: account {Acc}, user {Usr}", wbAccountId, userId);

            // 1. заказы
            var ordersCmd = new SyncOrdersCommand(wbAccountId, userId);
            var ordersRes = await _sender.Send(ordersCmd, ct);
            int orderCount = ordersRes.IsSuccess ? ordersRes.Value : 0;

            if (ordersRes.IsFailure)
                _logger.LogWarning("Initial orders sync fail: {Err}", ordersRes.Error);

            await Task.Delay(500, ct); // rate limit

            // 2. чаты
            var chatsCmd = new SyncWbChatsCommand(wbAccountId, userId);
            var chatsRes = await _sender.Send(chatsCmd, ct);
            int chatCount = chatsRes.IsSuccess ? chatsRes.Value : 0;

            if (chatsRes.IsFailure)
                _logger.LogWarning("Initial chats sync fail: {Err}", chatsRes.Error);

            await Task.Delay(400, ct);

            // 3. инициализация курсора событий (cursor = now)
            var eventsCmd = new SyncWbChatEventsCommand(wbAccountId, userId);
            await _sender.Send(eventsCmd, ct);

            _logger.LogInformation("Initial sync done: {Orders} orders, {Chats} chats", orderCount, chatCount);

            // уведомить фронт
            try { await _notifier.NotifySyncDone(userId, orderCount, chatCount); }
            catch { /* не блокируем */ }

            return ordersRes.IsSuccess;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Initial sync error: account {Acc}", wbAccountId);
            return false;
        }
    }
}
