using MessagingPlatform.Domain.Enums;

namespace MessagingPlatform.Application.Features.Wildberries.DTOs;

public sealed record WbAccountDto(
    Guid Id,
    string ShopName,
    WbAccountStatus Status,
    DateTime? LastSyncAt,
    DateTime CreatedAt,
    string? ErrorMessage);
