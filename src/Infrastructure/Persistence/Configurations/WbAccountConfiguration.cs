using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MessagingPlatform.Infrastructure.Persistence.Configurations;

internal sealed class WbAccountConfiguration : IEntityTypeConfiguration<WbAccount>
{
    public void Configure(EntityTypeBuilder<WbAccount> builder)
    {
        builder.ToTable("wb_accounts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.HasIndex(x => x.UserId);

        builder.Property(x => x.ApiToken)
            .HasColumnName("api_token")
            .HasMaxLength(512)
            .IsRequired()
            .HasConversion(
                token => token.Value,
                value => WbApiToken.Create(value));

        builder.Property(x => x.ShopName)
            .HasColumnName("shop_name")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.LastSyncAt)
            .HasColumnName("last_sync_at");

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(x => x.ErrorMessage)
            .HasColumnName("error_message")
            .HasMaxLength(1024);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
