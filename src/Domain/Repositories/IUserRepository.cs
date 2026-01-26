using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(Email email, CancellationToken ct = default);
    Task<bool> ExistsAsync(Email email, CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
    void Update(User user);
    void Delete(User user);
}
