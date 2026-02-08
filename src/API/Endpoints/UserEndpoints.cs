using System.Security.Claims;
using System.Text.Json.Serialization;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.API.Utilities;
using MessagingPlatform.Application.Features.UserSettings.Commands;

namespace MessagingPlatform.API.Endpoints;

public static class UserEndpoints
{
    public sealed class UpdateThemeRequest
    {
        [JsonPropertyName("theme")]
        public string Theme { get; set; } = string.Empty;
    }

    public sealed class ChangePasswordRequest
    {
        [JsonPropertyName("oldPassword")]
        public string OldPassword { get; set; } = string.Empty;

        [JsonPropertyName("newPassword")]
        public string NewPassword { get; set; } = string.Empty;
    }

    public sealed record ThemeResponseDto(string Theme);

    public static async Task<IResult> UpdateTheme(
        UpdateThemeRequest request,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<ThemeResponseDto>.Failure("Unauthorized"), statusCode: 401);

        var command = new UpdateThemeCommand(userId, request.Theme);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<ThemeResponseDto>.Failure(result.Error!));

        return Results.Ok(ApiResponse<ThemeResponseDto>.Success(
            new ThemeResponseDto(result.Value.ToString().ToLowerInvariant())));
    }

    public static async Task<IResult> ChangePassword(
        ChangePasswordRequest request,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Json(ApiResponse<bool>.Failure("Unauthorized"), statusCode: 401);

        var command = new ChangePasswordCommand(userId, request.OldPassword, request.NewPassword);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.BadRequest(ApiResponse<bool>.Failure(result.Error!));

        return Results.Ok(ApiResponse<bool>.Success(true));
    }
}
