namespace MessagingPlatform.Application.Features.Auth.DTOs;

public sealed record UserDto(
    Guid Id,
    string Email,
    string? FirstName,
    string? LastName,
    string Role,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? LastLoginAt);
