using MessagingPlatform.Domain.Enums;

namespace MessagingPlatform.Application.Features.Wildberries.DTOs;

public sealed record WbOrderDto(
    Guid Id,
    long WbOrderId,
    WbOrderStatus Status,
    string? CustomerPhone,
    decimal TotalPrice,
    string Currency,
    string? ProductName,
    int Quantity,
    DateTime WbCreatedAt);
