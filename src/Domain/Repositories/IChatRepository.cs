using MessagingPlatform.Domain.Entities;

namespace MessagingPlatform.Domain.Repositories;

public interface IChatRepository
{
    Task<Chat?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Chat>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<Chat?> GetByIdWithUserAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<Chat?> GetByWbChatIdAsync(Guid wbAccountId, long wbChatId, CancellationToken ct = default);
    Task<Dictionary<long, Chat>> GetByWbChatIdsAsync(Guid wbAccountId, IEnumerable<long> wbChatIds, CancellationToken ct = default);
    Task AddAsync(Chat chat, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<Chat> chats, CancellationToken ct = default);
    void Update(Chat chat);
    void Delete(Chat chat);
}
