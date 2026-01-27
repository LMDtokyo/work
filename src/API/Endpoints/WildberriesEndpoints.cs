using System.Security.Claims;
using System.Text.Json.Serialization;
using MediatR;
using MessagingPlatform.API.Models;
using MessagingPlatform.API.Utilities;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Wildberries.Commands;
using MessagingPlatform.Application.Features.Wildberries.DTOs;
using MessagingPlatform.Application.Features.Wildberries.Queries;

namespace MessagingPlatform.API.Endpoints;

public static class WildberriesEndpoints
{
    public sealed class AddAccountRequest
    {
        [JsonPropertyName("apiToken")]
        public string ApiToken { get; set; } = string.Empty;

        [JsonPropertyName("shopName")]
        public string ShopName { get; set; } = string.Empty;
    }

    public sealed class UpdateTokenRequest
    {
        [JsonPropertyName("apiToken")]
        public string ApiToken { get; set; } = string.Empty;
    }

    public sealed class GetOrdersRequest
    {
        [JsonPropertyName("skip")]
        public int Skip { get; set; }

        [JsonPropertyName("take")]
        public int Take { get; set; } = 50;
    }

    public sealed record AccountResponseDto(
        Guid Id,
        string ShopName,
        string Status,
        DateTime? LastSyncAt,
        DateTime CreatedAt,
        string? ErrorMessage);

    public sealed record OrderResponseDto(
        Guid Id,
        long WbOrderId,
        string Status,
        string? CustomerPhone,
        decimal TotalPrice,
        string Currency,
        string? ProductName,
        int Quantity,
        DateTime WbCreatedAt);

    public sealed record PaginatedOrdersDto(
        IReadOnlyList<OrderResponseDto> Items,
        int TotalCount,
        int Page,
        int PageSize,
        int TotalPages,
        bool HasPreviousPage,
        bool HasNextPage);

    public sealed record SyncResultDto(int NewOrdersCount);

    public static async Task<IResult> AddAccount(
        AddAccountRequest request,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<AccountResponseDto>.Failure("Unauthorized"));

        var command = new AddWbAccountCommand(userId, request.ApiToken, request.ShopName);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AccountResponseDto>.Failure(result.Error!));

        var dto = MapToAccountResponse(result.Value!);
        return Results.Ok(ApiResponse<AccountResponseDto>.Success(dto));
    }

    public static async Task<IResult> GetAccounts(
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<IReadOnlyList<AccountResponseDto>>.Failure("Unauthorized"));

        var query = new GetUserWbAccountsQuery(userId);
        var result = await sender.Send(query);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<IReadOnlyList<AccountResponseDto>>.Failure(result.Error!));

        var dtos = result.Value!.Select(MapToAccountResponse).ToList();
        return Results.Ok(ApiResponse<IReadOnlyList<AccountResponseDto>>.Success(dtos));
    }

    public static async Task<IResult> RemoveAccount(
        Guid id,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse.Failure("Unauthorized"));

        var command = new RemoveWbAccountCommand(userId, id);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse.Failure(result.Error!));

        return Results.Ok(ApiResponse.Success());
    }

    public static async Task<IResult> UpdateToken(
        Guid id,
        UpdateTokenRequest request,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<AccountResponseDto>.Failure("Unauthorized"));

        var command = new UpdateWbAccountTokenCommand(userId, id, request.ApiToken);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<AccountResponseDto>.Failure(result.Error!));

        var dto = MapToAccountResponse(result.Value!);
        return Results.Ok(ApiResponse<AccountResponseDto>.Success(dto));
    }

    public static async Task<IResult> SyncOrders(
        Guid id,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<SyncResultDto>.Failure("Unauthorized"));

        var command = new SyncOrdersCommand(id, userId);
        var result = await sender.Send(command);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<SyncResultDto>.Failure(result.Error!));

        return Results.Ok(ApiResponse<SyncResultDto>.Success(new SyncResultDto(result.Value)));
    }

    public static async Task<IResult> GetOrders(
        Guid id,
        int skip,
        int take,
        ClaimsPrincipal user,
        ISender sender)
    {
        if (!ClaimsExtractor.TryGetUserId(user, out var userId))
            return Results.Ok(ApiResponse<PaginatedOrdersDto>.Failure("Unauthorized"));

        var query = new GetWbOrdersQuery(id, userId, skip, take > 0 ? take : 50);
        var result = await sender.Send(query);

        if (result.IsFailure)
            return Results.Ok(ApiResponse<PaginatedOrdersDto>.Failure(result.Error!));

        var dto = MapToPaginatedOrders(result.Value!);
        return Results.Ok(ApiResponse<PaginatedOrdersDto>.Success(dto));
    }

    private static AccountResponseDto MapToAccountResponse(WbAccountDto account) =>
        new(
            account.Id,
            account.ShopName,
            account.Status.ToString().ToLowerInvariant(),
            account.LastSyncAt,
            account.CreatedAt,
            account.ErrorMessage);

    private static OrderResponseDto MapToOrderResponse(WbOrderDto order) =>
        new(
            order.Id,
            order.WbOrderId,
            order.Status.ToString().ToLowerInvariant(),
            order.CustomerPhone,
            order.TotalPrice,
            order.Currency,
            order.ProductName,
            order.Quantity,
            order.WbCreatedAt);

    private static PaginatedOrdersDto MapToPaginatedOrders(PaginatedResult<WbOrderDto> result) =>
        new(
            result.Items.Select(MapToOrderResponse).ToList(),
            result.TotalCount,
            result.Page,
            result.PageSize,
            result.TotalPages,
            result.HasPreviousPage,
            result.HasNextPage);
}
