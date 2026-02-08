using MessagingPlatform.API.Endpoints;

namespace MessagingPlatform.API.Extensions;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/Auth")
            .WithTags("Authentication");

        group.MapGet("/", () => Results.Ok(new
        {
            service = "MessagingPlatform API",
            version = "1.0.0",
            endpoints = new[]
            {
                "POST /api/Auth/register",
                "POST /api/Auth/login",
                "POST /api/Auth/logout",
                "POST /api/Auth/refresh",
                "GET /api/Auth/me"
            }
        })).WithName("ApiInfo").WithSummary("API information");

        group.MapPost("/register", AuthEndpoints.Register)
            .WithName("Register")
            .WithSummary("Register a new user")
            .RequireRateLimiting("auth")
            .Accepts<AuthEndpoints.RegisterRequest>("application/json")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/login", AuthEndpoints.Login)
            .WithName("Login")
            .WithSummary("Login with credentials")
            .RequireRateLimiting("auth")
            .Accepts<AuthEndpoints.LoginRequest>("application/json")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/refresh", AuthEndpoints.RefreshToken)
            .WithName("RefreshToken")
            .WithSummary("Refresh access token")
            .RequireRateLimiting("auth")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/logout", AuthEndpoints.Logout)
            .WithName("Logout")
            .WithSummary("Logout and revoke refresh token")
            .RequireRateLimiting("auth")
            .Produces<bool>(StatusCodes.Status200OK);

        group.MapGet("/me", AuthEndpoints.GetCurrentUser)
            .WithName("GetCurrentUser")
            .WithSummary("Get current user info")
            .RequireAuthorization()
            .RequireRateLimiting("api")
            .Produces<AuthEndpoints.UserResponseDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        return app;
    }

    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/User")
            .WithTags("User")
            .RequireAuthorization();

        group.MapPut("/theme", UserEndpoints.UpdateTheme)
            .WithName("UpdateTheme")
            .WithSummary("Update user theme preference")
            .RequireRateLimiting("api")
            .Accepts<UserEndpoints.UpdateThemeRequest>("application/json")
            .Produces<UserEndpoints.ThemeResponseDto>(StatusCodes.Status200OK);

        group.MapPut("/password", UserEndpoints.ChangePassword)
            .WithName("ChangePassword")
            .WithSummary("Change user password")
            .RequireRateLimiting("api")
            .Accepts<UserEndpoints.ChangePasswordRequest>("application/json")
            .Produces<bool>(StatusCodes.Status200OK);

        return app;
    }

    public static IEndpointRouteBuilder MapWildberriesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/Wildberries")
            .WithTags("Wildberries")
            .RequireAuthorization();

        group.MapPost("/accounts", WildberriesEndpoints.AddAccount)
            .WithName("AddWbAccount")
            .WithSummary("Add a Wildberries seller account")
            .RequireRateLimiting("api")
            .Accepts<WildberriesEndpoints.AddAccountRequest>("application/json")
            .Produces<WildberriesEndpoints.AccountResponseDto>(StatusCodes.Status200OK);

        group.MapGet("/accounts", WildberriesEndpoints.GetAccounts)
            .WithName("GetWbAccounts")
            .WithSummary("Get all Wildberries accounts for current user")
            .RequireRateLimiting("api")
            .Produces<IReadOnlyList<WildberriesEndpoints.AccountResponseDto>>(StatusCodes.Status200OK);

        group.MapDelete("/accounts/{id:guid}", WildberriesEndpoints.RemoveAccount)
            .WithName("RemoveWbAccount")
            .WithSummary("Remove a Wildberries account")
            .RequireRateLimiting("api")
            .Produces(StatusCodes.Status200OK);

        group.MapPut("/accounts/{id:guid}/token", WildberriesEndpoints.UpdateToken)
            .WithName("UpdateWbAccountToken")
            .WithSummary("Update API token for a Wildberries account")
            .RequireRateLimiting("api")
            .Accepts<WildberriesEndpoints.UpdateTokenRequest>("application/json")
            .Produces<WildberriesEndpoints.AccountResponseDto>(StatusCodes.Status200OK);

        group.MapPost("/accounts/{id:guid}/sync", WildberriesEndpoints.SyncOrders)
            .WithName("SyncWbOrders")
            .WithSummary("Sync orders from Wildberries API")
            .RequireRateLimiting("api")
            .Produces<WildberriesEndpoints.SyncResultDto>(StatusCodes.Status200OK);

        group.MapGet("/accounts/{id:guid}/orders", WildberriesEndpoints.GetOrders)
            .WithName("GetWbOrders")
            .WithSummary("Get orders for a Wildberries account")
            .RequireRateLimiting("api")
            .Produces<WildberriesEndpoints.PaginatedOrdersDto>(StatusCodes.Status200OK);

        group.MapGet("/orders", WildberriesEndpoints.GetAllOrders)
            .WithName("GetAllOrders")
            .WithSummary("Get orders across all user accounts")
            .RequireRateLimiting("api")
            .Produces<WildberriesEndpoints.PaginatedOrdersDto>(StatusCodes.Status200OK);

        group.MapPost("/accounts/{id:guid}/sync-chats", WildberriesEndpoints.SyncChats)
            .WithName("SyncWbChats")
            .WithSummary("Sync chats from Wildberries API")
            .RequireRateLimiting("api")
            .Produces<int>(StatusCodes.Status200OK);

        group.MapPost("/accounts/{id:guid}/sync-chat-events", WildberriesEndpoints.SyncChatEvents)
            .WithName("SyncWbChatEvents")
            .WithSummary("Sync chat messages/events from Wildberries API")
            .RequireRateLimiting("api")
            .Produces<int>(StatusCodes.Status200OK);

        return app;
    }

    public static IEndpointRouteBuilder MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/chats")
            .WithTags("Chats")
            .RequireAuthorization();

        group.MapGet("/", ChatEndpoints.GetChats)
            .WithName("GetChats")
            .WithSummary("Get user's chats")
            .RequireRateLimiting("api")
            .Produces<IReadOnlyList<ChatEndpoints.ChatResponseDto>>(StatusCodes.Status200OK);

        group.MapPost("/{id:guid}/messages", ChatEndpoints.SendMessage)
            .WithName("SendChatMessage")
            .WithSummary("Send message to a chat")
            .RequireRateLimiting("api")
            .Accepts<ChatEndpoints.SendMessageRequest>("application/json")
            .Produces<bool>(StatusCodes.Status200OK);

        group.MapPut("/{id:guid}/read", ChatEndpoints.MarkAsRead)
            .WithName("MarkChatAsRead")
            .WithSummary("Mark chat as read")
            .RequireRateLimiting("api")
            .Produces<bool>(StatusCodes.Status200OK);

        group.MapGet("/{id:guid}/messages", ChatEndpoints.GetMessages)
            .WithName("GetChatMessages")
            .WithSummary("Get chat messages")
            .RequireRateLimiting("api")
            .Produces<IReadOnlyList<ChatEndpoints.MessageResponseDto>>(StatusCodes.Status200OK);

        group.MapPost("/update-last-messages", ChatEndpoints.UpdateLastMessages)
            .WithName("UpdateLastMessages")
            .WithSummary("Update last message metadata for all chats")
            .RequireRateLimiting("api")
            .Produces<int>(StatusCodes.Status200OK);

        return app;
    }
}
