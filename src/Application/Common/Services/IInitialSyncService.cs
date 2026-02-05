namespace MessagingPlatform.Application.Common.Services;

/// <summary>
/// Service for performing initial synchronization of WB account data
/// </summary>
public interface IInitialSyncService
{
    /// <summary>
    /// Performs initial sync of orders and chats for a newly added WB account
    /// </summary>
    /// <param name="wbAccountId">WB Account ID</param>
    /// <param name="userId">User ID for ownership verification</param>
    /// <param name="ct">Cancellation token</param>
    /// <returns>True if sync was successful</returns>
    Task<bool> PerformInitialSyncAsync(Guid wbAccountId, Guid userId, CancellationToken ct = default);
}
