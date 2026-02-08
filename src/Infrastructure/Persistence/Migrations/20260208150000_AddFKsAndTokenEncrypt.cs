using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MessagingPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFKsAndTokenEncrypt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // FK: messages -> chats
            migrationBuilder.AddForeignKey(
                name: "fk_messages_chats_chat_id",
                table: "messages",
                column: "chat_id",
                principalTable: "chats",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            // FK: refresh_tokens -> users
            migrationBuilder.AddForeignKey(
                name: "fk_refresh_tokens_users_user_id",
                table: "refresh_tokens",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            // widen api_token for encrypted values
            migrationBuilder.AlterColumn<string>(
                name: "api_token",
                table: "wb_accounts",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(512)",
                oldMaxLength: 512);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_messages_chats_chat_id",
                table: "messages");

            migrationBuilder.DropForeignKey(
                name: "fk_refresh_tokens_users_user_id",
                table: "refresh_tokens");

            migrationBuilder.AlterColumn<string>(
                name: "api_token",
                table: "wb_accounts",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1024)",
                oldMaxLength: 1024);
        }
    }
}
