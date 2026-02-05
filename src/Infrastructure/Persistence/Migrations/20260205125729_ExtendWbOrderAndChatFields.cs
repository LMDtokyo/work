using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MessagingPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ExtendWbOrderAndChatFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "article",
                table: "wb_orders",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "finished_at",
                table: "wb_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "rid",
                table: "wb_orders",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "chats",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "wb_account_id",
                table: "chats",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "wb_chat_id",
                table: "chats",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_chats_wb_account_id_wb_chat_id",
                table: "chats",
                columns: new[] { "wb_account_id", "wb_chat_id" },
                unique: true,
                filter: "wb_account_id IS NOT NULL AND wb_chat_id IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_chats_wb_accounts_wb_account_id",
                table: "chats",
                column: "wb_account_id",
                principalTable: "wb_accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_chats_wb_accounts_wb_account_id",
                table: "chats");

            migrationBuilder.DropIndex(
                name: "IX_chats_wb_account_id_wb_chat_id",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "article",
                table: "wb_orders");

            migrationBuilder.DropColumn(
                name: "finished_at",
                table: "wb_orders");

            migrationBuilder.DropColumn(
                name: "rid",
                table: "wb_orders");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "wb_account_id",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "wb_chat_id",
                table: "chats");
        }
    }
}
