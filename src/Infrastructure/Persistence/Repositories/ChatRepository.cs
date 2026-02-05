using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence.Repositories;

internal sealed class ChatRepository : IChatRepository
{
    private readonly ApplicationDbContext _context;

    public ChatRepository(ApplicationDbContext context) => _context = context;

    public async Task<Chat?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.Chats.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<Chat?> GetByIdWithUserAsync(Guid id, Guid userId, CancellationToken ct = default)
        => await _context.Chats.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

    public async Task<IReadOnlyList<Chat>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _context.Chats
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.LastMessageAt ?? x.CreatedAt)
            .ToListAsync(ct);

    public async Task<Chat?> GetByWbChatIdAsync(Guid wbAccountId, long wbChatId, CancellationToken ct = default)
        => await _context.Chats.FirstOrDefaultAsync(
            x => x.WbAccountId == wbAccountId && x.WbChatId == wbChatId, ct);

    public async Task<Dictionary<long, Chat>> GetByWbChatIdsAsync(
        Guid wbAccountId,
        IEnumerable<long> wbChatIds,
        CancellationToken ct = default)
    {
        var chatIdList = wbChatIds.ToList();
        var chats = await _context.Chats
            .Where(x => x.WbAccountId == wbAccountId && x.WbChatId != null && chatIdList.Contains(x.WbChatId.Value))
            .ToListAsync(ct);

        return chats.ToDictionary(x => x.WbChatId!.Value);
    }

    public async Task AddAsync(Chat chat, CancellationToken ct = default)
        => await _context.Chats.AddAsync(chat, ct);

    public async Task AddRangeAsync(IEnumerable<Chat> chats, CancellationToken ct = default)
        => await _context.Chats.AddRangeAsync(chats, ct);

    public void Update(Chat chat) => _context.Chats.Update(chat);

    public void Delete(Chat chat) => _context.Chats.Remove(chat);
}
