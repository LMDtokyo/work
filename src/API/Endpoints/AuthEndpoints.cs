using System.Security.Claims;
using System.Text.Json.Serialization;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.API.Services;
using MessagingPlatform.API.Utilities;
using MessagingPlatform.Application.Features.Auth.Commands;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.API.Endpoints;

public static class AuthEndpoints
{
    public sealed class RegisterRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }
    }

    public sealed class LoginRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("rememberMe")]
        public bool RememberMe { get; set; }
    }

    public sealed record AuthResponseDto(Guid UserId, string Email);
    public sealed record UserResponseDto(Guid Id, string Email, string? FirstName, string? LastName, string Role, string Theme);

    public static async Task<IResult> Register(
        RegisterRequest request,
        HttpContext httpContext,
        ISender sender,
        ICookieAuthService cookieService)
    {
        var command = new RegisterCommand(request.Email, request.Password, request.FirstName, request.LastName);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        cookieService.SetTokens(httpContext, result.Value!.AccessToken, result.Value.RefreshToken, result.Value.ExpiresAt);

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value.UserId,
            result.Value.Email)));
    }

    public static async Task<IResult> Login(
        LoginRequest request,
        HttpContext httpContext,
        ISender sender,
        ICookieAuthService cookieService)
    {
        var command = new LoginCommand(request.Email, request.Password, request.RememberMe);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        cookieService.SetTokens(httpContext, result.Value!.AccessToken, result.Value.RefreshToken, result.Value.ExpiresAt);

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value.UserId,
            result.Value.Email)));
    }

    public static async Task<IResult> RefreshToken(
        HttpContext httpContext,
        ISender sender,
        ICookieAuthService cookieService)
    {
        var refreshToken = cookieService.GetRefreshToken(httpContext);

        if (string.IsNullOrEmpty(refreshToken))
            return Results.Json(ApiResponse<AuthResponseDto>.Failure("No refresh token provided"), statusCode: 401);

        var command = new RefreshTokenCommand(refreshToken);
        var result = await sender.Send(command);

        if (result.IsFailure)
        {
            cookieService.ClearTokens(httpContext);
            return Results.Json(ApiResponse<AuthResponseDto>.Failure(result.Error!), statusCode: 401);
        }

        cookieService.SetTokens(httpContext, result.Value!.AccessToken, result.Value.RefreshToken, result.Value.ExpiresAt);

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value.UserId,
            result.Value.Email)));
    }

    public static async Task<IResult> GetCurrentUser(ClaimsPrincipal user, IUserRepository userRepository)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<UserResponseDto>.Failure("Unauthorized"), statusCode: 401);

        var dbUser = await userRepository.GetByIdAsync(userId);

        if (dbUser is null)
            return Results.NotFound(ApiResponse<UserResponseDto>.Failure("User not found"));

        return Results.Ok(ApiResponse<UserResponseDto>.Success(new UserResponseDto(
            dbUser.Id,
            dbUser.Email.Value,
            dbUser.FirstName,
            dbUser.LastName,
            dbUser.Role.ToString(),
            dbUser.Theme.ToString().ToLowerInvariant())));
    }

    public static async Task<IResult> Logout(
        HttpContext httpContext,
        ISender sender,
        ICookieAuthService cookieService)
    {
        var refreshToken = cookieService.GetRefreshToken(httpContext);

        if (!string.IsNullOrEmpty(refreshToken))
        {
            var command = new LogoutCommand(refreshToken);
            await sender.Send(command);
        }

        cookieService.ClearTokens(httpContext);

        return Results.Ok(ApiResponse<bool>.Success(true));
    }
}
