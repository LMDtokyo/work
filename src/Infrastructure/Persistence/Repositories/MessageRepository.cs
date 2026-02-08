using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence.Repositories;

internal sealed class MessageRepository : IMessageRepository
{
    private readonly ApplicationDbContext _ctx;

    public MessageRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<IReadOnlyList<Message>> GetByChatIdAsync(Guid chatId, int limit = 100, CancellationToken ct = default)
    {
        var msgs = await _ctx.Messages
            .Where(x => x.ChatId == chatId)
            .OrderByDescending(x => x.CreatedAt)
            .Take(limit)
            .ToListAsync(ct);
        msgs.Reverse();
        return msgs;
    }

    public async Task<Message?> GetByWbMessageIdAsync(string wbMessageId, CancellationToken ct = default)
        => await _ctx.Messages.FirstOrDefaultAsync(x => x.WbMessageId == wbMessageId, ct);

    public async Task<bool> ExistsAsync(string wbMessageId, CancellationToken ct = default)
        => await _ctx.Messages.AnyAsync(x => x.WbMessageId == wbMessageId, ct);

    public async Task<HashSet<string>> GetExistingMessageIdsAsync(IEnumerable<string> wbMessageIds, CancellationToken ct = default)
    {
        var idList = wbMessageIds.ToList();
        var existing = await _ctx.Messages
            .Where(x => idList.Contains(x.WbMessageId))
            .Select(x => x.WbMessageId)
            .ToListAsync(ct);
        return existing.ToHashSet();
    }

    public async Task AddAsync(Message message, CancellationToken ct = default)
        => await _ctx.Messages.AddAsync(message, ct);

    public async Task AddRangeAsync(IEnumerable<Message> messages, CancellationToken ct = default)
        => await _ctx.Messages.AddRangeAsync(messages, ct);
}
