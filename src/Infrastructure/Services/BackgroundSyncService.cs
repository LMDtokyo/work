using MediatR;
using MessagingPlatform.Application.Features.Chats.Commands;
using MessagingPlatform.Application.Features.Wildberries.Commands;
using MessagingPlatform.Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Infrastructure.Services;

internal sealed class BackgroundSyncService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<BackgroundSyncService> _logger;
    private static readonly TimeSpan SyncInterval = TimeSpan.FromMinutes(2);
    private const int BatchSize = 10; // Reduced to respect WB API rate limits
    private const int DelayBetweenAccountsMs = 300; // 300ms between accounts
    private const int DelayBetweenBatchesMs = 5000; // 5 seconds between batches

    public BackgroundSyncService(
        IServiceProvider serviceProvider,
        ILogger<BackgroundSyncService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BackgroundSyncService started. Sync interval: {Interval} minutes", SyncInterval.TotalMinutes);

        // Wait a bit before first sync to let app stabilize
        await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PerformSyncCycleAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during background sync cycle");
            }

            await Task.Delay(SyncInterval, stoppingToken);
        }

        _logger.LogInformation("BackgroundSyncService stopped");
    }

    private async Task PerformSyncCycleAsync(CancellationToken ct)
    {
        using var scope = _serviceProvider.CreateScope();
        var accountRepo = scope.ServiceProvider.GetRequiredService<IWbAccountRepository>();
        var sender = scope.ServiceProvider.GetRequiredService<ISender>();

        var activeAccounts = await accountRepo.GetActiveAccountsAsync(ct);

        if (activeAccounts.Count == 0)
        {
            _logger.LogDebug("No active accounts to sync");
            return;
        }

        _logger.LogInformation("Starting sync cycle for {Count} active accounts", activeAccounts.Count);

        // Process in batches to avoid DB/API overload
        var batches = activeAccounts
            .Select((account, index) => new { account, index })
            .GroupBy(x => x.index / BatchSize)
            .Select(g => g.Select(x => x.account).ToList())
            .ToList();

        var totalSynced = 0;
        var totalFailed = 0;

        foreach (var batch in batches)
        {
            // CRITICAL: Sequential processing to respect WB API rate limits
            // Parallel execution causes 429 Too Many Requests
            foreach (var account in batch)
            {
                var success = await SyncAccountAsync(account.Id, account.UserId, sender, ct);
                if (success)
                    totalSynced++;
                else
                    totalFailed++;

                // Delay between individual accounts (300ms - WB recommends ~200ms)
                if (account != batch.Last())
                    await Task.Delay(DelayBetweenAccountsMs, ct);
            }

            // Longer delay between batches to allow rate limit buckets to refill
            if (batch != batches.Last())
                await Task.Delay(DelayBetweenBatchesMs, ct);
        }

        _logger.LogInformation(
            "Sync cycle completed. Success: {Success}, Failed: {Failed}",
            totalSynced,
            totalFailed);
    }

    private async Task<bool> SyncAccountAsync(Guid accountId, Guid userId, ISender sender, CancellationToken ct)
    {
        try
        {
            var ordersCmd = new SyncOrdersCommand(accountId, userId);
            var ordersResult = await sender.Send(ordersCmd, ct);

            var chatsCmd = new SyncWbChatsCommand(accountId, userId);
            await sender.Send(chatsCmd, ct);

            var eventsCmd = new SyncWbChatEventsCommand(accountId, userId);
            var eventsResult = await sender.Send(eventsCmd, ct);

            _logger.LogDebug("Events sync for {AccountId}: {Count} new messages", accountId, eventsResult.Value);

            return ordersResult.IsSuccess;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to sync account {AccountId}", accountId);
            return false;
        }
    }
}
