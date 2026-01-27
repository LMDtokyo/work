using MessagingPlatform.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MessagingPlatform.Infrastructure.Persistence.Configurations;

internal sealed class WbOrderConfiguration : IEntityTypeConfiguration<WbOrder>
{
    public void Configure(EntityTypeBuilder<WbOrder> builder)
    {
        builder.ToTable("wb_orders");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.WbAccountId)
            .HasColumnName("wb_account_id")
            .IsRequired();

        builder.HasIndex(x => x.WbAccountId);

        builder.Property(x => x.WbOrderId)
            .HasColumnName("wb_order_id")
            .IsRequired();

        builder.HasIndex(x => new { x.WbAccountId, x.WbOrderId })
            .IsUnique();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.CustomerPhone)
            .HasColumnName("customer_phone")
            .HasMaxLength(50);

        builder.Property(x => x.TotalPrice)
            .HasColumnName("total_price")
            .HasPrecision(18, 2);

        builder.Property(x => x.Currency)
            .HasColumnName("currency")
            .HasMaxLength(10)
            .HasDefaultValue("RUB");

        builder.Property(x => x.ProductName)
            .HasColumnName("product_name")
            .HasMaxLength(512);

        builder.Property(x => x.Quantity)
            .HasColumnName("quantity")
            .HasDefaultValue(1);

        builder.Property(x => x.WbCreatedAt)
            .HasColumnName("wb_created_at");

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasOne<WbAccount>()
            .WithMany()
            .HasForeignKey(x => x.WbAccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
