using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;
using MessagingPlatform.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace MessagingPlatform.Infrastructure.Persistence;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly ITokenEncryptionService? _enc;

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<WbAccount> WbAccounts => Set<WbAccount>();
    public DbSet<WbOrder> WbOrders => Set<WbOrder>();
    public DbSet<Chat> Chats => Set<Chat>();
    public DbSet<Message> Messages => Set<Message>();

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ITokenEncryptionService enc)
        : base(options)
    {
        _enc = enc;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // override api_token conversion to encrypt at rest
        if (_enc is not null)
        {
            modelBuilder.Entity<WbAccount>().Property(x => x.ApiToken)
                .HasMaxLength(1024)
                .HasConversion(
                    token => _enc.Encrypt(token.Value),
                    dbVal => WbApiToken.Create(_enc.Decrypt(dbVal)));
        }

        base.OnModelCreating(modelBuilder);
    }
}
