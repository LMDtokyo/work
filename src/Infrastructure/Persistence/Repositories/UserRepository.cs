using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence.Repositories;

internal sealed class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.Users.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<User?> GetByEmailAsync(Email email, CancellationToken ct = default)
        => await _context.Users.FirstOrDefaultAsync(x => x.Email == email, ct);

    public async Task<bool> ExistsAsync(Email email, CancellationToken ct = default)
        => await _context.Users.AnyAsync(x => x.Email == email, ct);

    public async Task AddAsync(User user, CancellationToken ct = default)
        => await _context.Users.AddAsync(user, ct);

    public void Update(User user) => _context.Users.Update(user);

    public void Delete(User user) => _context.Users.Remove(user);
}
