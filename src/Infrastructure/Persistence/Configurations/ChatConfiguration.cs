using MessagingPlatform.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MessagingPlatform.Infrastructure.Persistence.Configurations;

internal sealed class ChatConfiguration : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.ToTable("chats");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(x => x.WbAccountId)
            .HasColumnName("wb_account_id");

        builder.Property(x => x.WbChatId)
            .HasColumnName("wb_chat_id");

        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => new { x.WbAccountId, x.WbChatId })
            .IsUnique()
            .HasFilter("wb_account_id IS NOT NULL AND wb_chat_id IS NOT NULL");

        builder.Property(x => x.ContactName)
            .HasColumnName("contact_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.ContactAvatar)
            .HasColumnName("contact_avatar")
            .HasMaxLength(500);

        builder.Property(x => x.LastMessageText)
            .HasColumnName("last_message_text")
            .HasMaxLength(500);

        builder.Property(x => x.LastMessageAt)
            .HasColumnName("last_message_at");

        builder.Property(x => x.UnreadCount)
            .HasColumnName("unread_count")
            .HasDefaultValue(0);

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<WbAccount>()
            .WithMany()
            .HasForeignKey(x => x.WbAccountId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
