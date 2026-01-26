using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Domain.Primitives;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Domain.Entities;

public sealed class User : AggregateRoot<Guid>
{
    public Email Email { get; private set; } = null!;
    public PasswordHash PasswordHash { get; private set; } = null!;
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }

    private User() { }

    private User(Guid id, Email email, PasswordHash passwordHash, UserRole role) : base(id)
    {
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
    }

    public static User Create(Email email, PasswordHash passwordHash, UserRole role = UserRole.User)
    {
        var user = new User(Guid.NewGuid(), email, passwordHash, role);
        return user;
    }

    public void UpdateProfile(string? firstName, string? lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public void UpdatePassword(PasswordHash newPasswordHash)
    {
        PasswordHash = newPasswordHash;
    }

    public void RecordLogin()
    {
        LastLoginAt = DateTime.UtcNow;
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;

    public void ChangeRole(UserRole newRole) => Role = newRole;
}
