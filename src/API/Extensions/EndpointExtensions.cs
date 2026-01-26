using MessagingPlatform.API.Endpoints;

namespace MessagingPlatform.API.Extensions;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/Auth")
            .WithTags("Authentication");

        group.MapPost("/register", AuthEndpoints.Register)
            .WithName("Register")
            .WithSummary("Register a new user")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/login", AuthEndpoints.Login)
            .WithName("Login")
            .WithSummary("Login with credentials")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapPost("/refresh", AuthEndpoints.RefreshToken)
            .WithName("RefreshToken")
            .WithSummary("Refresh access token")
            .Produces<AuthEndpoints.AuthResponseDto>(StatusCodes.Status200OK)
            .Produces<object>(StatusCodes.Status400BadRequest);

        group.MapGet("/me", AuthEndpoints.GetCurrentUser)
            .WithName("GetCurrentUser")
            .WithSummary("Get current user info")
            .RequireAuthorization()
            .Produces<AuthEndpoints.UserResponseDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        return app;
    }
}
