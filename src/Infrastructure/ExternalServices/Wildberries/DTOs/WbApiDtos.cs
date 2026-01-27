using System.Text.Json.Serialization;

namespace MessagingPlatform.Infrastructure.ExternalServices.Wildberries.DTOs;

public sealed record WbOrderDto
{
    [JsonPropertyName("id")]
    public long Id { get; init; }

    [JsonPropertyName("rid")]
    public long Rid { get; init; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }

    [JsonPropertyName("warehouseId")]
    public int WarehouseId { get; init; }

    [JsonPropertyName("supplyId")]
    public string? SupplyId { get; init; }

    [JsonPropertyName("orderUid")]
    public string? OrderUid { get; init; }

    [JsonPropertyName("article")]
    public string? Article { get; init; }

    [JsonPropertyName("colorCode")]
    public string? ColorCode { get; init; }

    [JsonPropertyName("currencyCode")]
    public int CurrencyCode { get; init; }

    [JsonPropertyName("totalPrice")]
    public decimal TotalPrice { get; init; }

    [JsonPropertyName("discountPercent")]
    public int DiscountPercent { get; init; }

    [JsonPropertyName("convertedPrice")]
    public decimal ConvertedPrice { get; init; }

    [JsonPropertyName("chrtId")]
    public long ChrtId { get; init; }

    [JsonPropertyName("skus")]
    public List<string> Skus { get; init; } = new();

    [JsonPropertyName("nmId")]
    public long NmId { get; init; }

    [JsonPropertyName("barcode")]
    public string? Barcode { get; init; }

    [JsonPropertyName("subject")]
    public string? Subject { get; init; }

    [JsonPropertyName("category")]
    public string? Category { get; init; }

    [JsonPropertyName("brand")]
    public string? Brand { get; init; }

    [JsonPropertyName("isCancel")]
    public bool IsCancel { get; init; }

    [JsonPropertyName("cancelDt")]
    public DateTime? CancelDt { get; init; }
}

public sealed record WbOrdersResponse
{
    [JsonPropertyName("next")]
    public long Next { get; init; }

    [JsonPropertyName("orders")]
    public List<WbOrderDto> Orders { get; init; } = new();
}

public sealed record WbErrorResponse
{
    [JsonPropertyName("code")]
    public string? Code { get; init; }

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("data")]
    public object? Data { get; init; }
}
