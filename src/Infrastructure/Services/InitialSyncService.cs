using MediatR;
using MessagingPlatform.Application.Common.Services;
using MessagingPlatform.Application.Features.Chats.Commands;
using MessagingPlatform.Application.Features.Wildberries.Commands;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Infrastructure.Services;

internal sealed class InitialSyncService : IInitialSyncService
{
    private readonly ISender _sender;
    private readonly ILogger<InitialSyncService> _logger;

    public InitialSyncService(ISender sender, ILogger<InitialSyncService> logger)
    {
        _sender = sender;
        _logger = logger;
    }

    public async Task<bool> PerformInitialSyncAsync(Guid wbAccountId, Guid userId, CancellationToken ct = default)
    {
        try
        {
            _logger.LogInformation(
                "Starting initial sync for WB account {WbAccountId}, User {UserId}",
                wbAccountId,
                userId);

            // Sync orders first (more important for users)
            var ordersCommand = new SyncOrdersCommand(wbAccountId, userId);
            var ordersResult = await _sender.Send(ordersCommand, ct);

            if (ordersResult.IsFailure)
            {
                _logger.LogWarning(
                    "Failed to sync orders during initial sync. WbAccountId: {WbAccountId}, Error: {Error}",
                    wbAccountId,
                    ordersResult.Error);
            }
            else
            {
                _logger.LogInformation(
                    "Initial orders sync completed. WbAccountId: {WbAccountId}, NewOrders: {Count}",
                    wbAccountId,
                    ordersResult.Value);
            }

            // Sync chats (optional, don't fail if this fails)
            var chatsCommand = new SyncWbChatsCommand(wbAccountId, userId);
            var chatsResult = await _sender.Send(chatsCommand, ct);

            if (chatsResult.IsFailure)
            {
                _logger.LogWarning(
                    "Failed to sync chats during initial sync. WbAccountId: {WbAccountId}, Error: {Error}",
                    wbAccountId,
                    chatsResult.Error);
            }
            else
            {
                _logger.LogInformation(
                    "Initial chats sync completed. WbAccountId: {WbAccountId}, NewChats: {Count}",
                    wbAccountId,
                    chatsResult.Value);
            }

            // Consider success if at least orders synced successfully
            return ordersResult.IsSuccess;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Unexpected error during initial sync. WbAccountId: {WbAccountId}, UserId: {UserId}",
                wbAccountId,
                userId);
            return false;
        }
    }
}
