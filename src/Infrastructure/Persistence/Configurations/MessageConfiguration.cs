using MessagingPlatform.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MessagingPlatform.Infrastructure.Persistence.Configurations;

internal sealed class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.ChatId).HasColumnName("chat_id").IsRequired();
        builder.Property(x => x.WbMessageId).HasColumnName("wb_message_id").HasMaxLength(100).IsRequired();
        builder.Property(x => x.Text).HasColumnName("text").IsRequired();
        builder.Property(x => x.IsFromCustomer).HasColumnName("is_from_customer").IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(x => x.SyncedAt).HasColumnName("synced_at").IsRequired();

        builder.HasOne<Chat>()
            .WithMany()
            .HasForeignKey(x => x.ChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ChatId).HasDatabaseName("ix_messages_chat_id");
        builder.HasIndex(x => x.WbMessageId).IsUnique().HasDatabaseName("ix_messages_wb_message_id");
        builder.HasIndex(x => new { x.ChatId, x.CreatedAt }).HasDatabaseName("ix_messages_chat_created");
    }
}
