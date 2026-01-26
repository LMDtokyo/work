using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MessagingPlatform.Infrastructure.Persistence.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.Email)
            .HasColumnName("email")
            .HasMaxLength(256)
            .IsRequired()
            .HasConversion(
                email => email.Value,
                value => Email.Create(value));

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.Property(x => x.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(512)
            .IsRequired()
            .HasConversion(
                hash => hash.Value,
                value => PasswordHash.Create(value));

        builder.Property(x => x.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100);

        builder.Property(x => x.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100);

        builder.Property(x => x.Role)
            .HasColumnName("role")
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(x => x.LastLoginAt)
            .HasColumnName("last_login_at");
    }
}
