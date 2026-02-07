using MessagingPlatform.Domain.Entities;

namespace MessagingPlatform.Domain.Repositories;

public interface IMessageRepository
{
    Task<IReadOnlyList<Message>> GetByChatIdAsync(Guid chatId, int limit = 100, CancellationToken ct = default);
    Task<Message?> GetByWbMessageIdAsync(string wbMessageId, CancellationToken ct = default);
    Task<bool> ExistsAsync(string wbMessageId, CancellationToken ct = default);
    Task<HashSet<string>> GetExistingMessageIdsAsync(IEnumerable<string> wbMessageIds, CancellationToken ct = default);
    Task AddAsync(Message message, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<Message> messages, CancellationToken ct = default);
}
