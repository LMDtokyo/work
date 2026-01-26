namespace MessagingPlatform.Application.Features.Auth.DTOs;

public sealed record AuthResponse(
    Guid UserId,
    string Email,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt);
