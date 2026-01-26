using System.Security.Claims;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.Application.Features.Auth.Commands;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.API.Endpoints;

public static class AuthEndpoints
{
    public sealed record RegisterRequest(string Email, string Password, string? FirstName, string? LastName);
    public sealed record LoginRequest(string Email, string Password);
    public sealed record RefreshTokenRequest(string RefreshToken);
    public sealed record AuthResponseDto(Guid UserId, string Email, string AccessToken, string RefreshToken, DateTime ExpiresAt);
    public sealed record UserResponseDto(Guid Id, string Email, string? FirstName, string? LastName, string Role);

    public static async Task<IResult> Register(RegisterRequest request, ISender sender)
    {
        var command = new RegisterCommand(request.Email, request.Password, request.FirstName, request.LastName);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value!.UserId,
            result.Value.Email,
            result.Value.AccessToken,
            result.Value.RefreshToken,
            result.Value.ExpiresAt)));
    }

    public static async Task<IResult> Login(LoginRequest request, ISender sender)
    {
        var command = new LoginCommand(request.Email, request.Password);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value!.UserId,
            result.Value.Email,
            result.Value.AccessToken,
            result.Value.RefreshToken,
            result.Value.ExpiresAt)));
    }

    public static async Task<IResult> RefreshToken(RefreshTokenRequest request, ISender sender)
    {
        var command = new RefreshTokenCommand(request.RefreshToken);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AuthResponseDto>.Failure(result.Error!));

        return Results.Ok(ApiResponse<AuthResponseDto>.Success(new AuthResponseDto(
            result.Value!.UserId,
            result.Value.Email,
            result.Value.AccessToken,
            result.Value.RefreshToken,
            result.Value.ExpiresAt)));
    }

    public static async Task<IResult> GetCurrentUser(ClaimsPrincipal user, IUserRepository userRepository)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Results.Ok(ApiResponse<UserResponseDto>.Failure("Unauthorized"));

        var dbUser = await userRepository.GetByIdAsync(userId);

        if (dbUser is null)
            return Results.Ok(ApiResponse<UserResponseDto>.Failure("User not found"));

        return Results.Ok(ApiResponse<UserResponseDto>.Success(new UserResponseDto(
            dbUser.Id,
            dbUser.Email.Value,
            dbUser.FirstName,
            dbUser.LastName,
            dbUser.Role.ToString())));
    }
}
