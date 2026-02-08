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

// Chat DTOs
public sealed record WbLastMessageDto
{
    [JsonPropertyName("text")]
    public string? Text { get; init; }

    [JsonPropertyName("addTimestamp")]
    public long Timestamp { get; init; }
}

public sealed record WbChatDto
{
    [JsonPropertyName("chatID")]
    public string ChatId { get; init; } = string.Empty;

    [JsonPropertyName("replySign")]
    public string? ReplySign { get; init; }

    [JsonPropertyName("clientName")]
    public string CustomerName { get; init; } = string.Empty;

    [JsonPropertyName("clientAvatar")]
    public string? CustomerAvatar { get; init; }

    [JsonPropertyName("lastMessage")]
    public WbLastMessageDto? LastMessage { get; init; }

    [JsonPropertyName("unreadCount")]
    public int UnreadCount { get; init; }
}

public sealed record WbChatsResponse
{
    [JsonPropertyName("result")]
    public List<WbChatDto> Chats { get; init; } = new();
}

public sealed record WbMessageDto
{
    [JsonPropertyName("messageId")]
    public long MessageId { get; init; }

    [JsonPropertyName("chatId")]
    public long ChatId { get; init; }

    [JsonPropertyName("text")]
    public string Text { get; init; } = string.Empty;

    [JsonPropertyName("isFromCustomer")]
    public bool IsFromCustomer { get; init; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }
}

public sealed record WbMessagesResponse
{
    [JsonPropertyName("messages")]
    public List<WbMessageDto> Messages { get; init; } = new();
}

public sealed record WbSendMsgResultDto
{
    [JsonPropertyName("addTime")]
    public long AddTime { get; init; }

    [JsonPropertyName("chatID")]
    public string? ChatId { get; init; }
}

public sealed record WbSendMsgResponse
{
    [JsonPropertyName("result")]
    public WbSendMsgResultDto? Result { get; init; }

    [JsonPropertyName("errors")]
    public List<string>? Errors { get; init; }
}

// Events API
public sealed record WbEventMessageDto
{
    [JsonPropertyName("text")]
    public string? Text { get; init; }
}

public sealed record WbEventDto
{
    [JsonPropertyName("chatID")]
    public string ChatId { get; init; } = string.Empty;

    [JsonPropertyName("eventID")]
    public string EventId { get; init; } = string.Empty;

    [JsonPropertyName("eventType")]
    public string EventType { get; init; } = string.Empty;

    [JsonPropertyName("message")]
    public WbEventMessageDto? Message { get; init; }

    [JsonPropertyName("addTimestamp")]
    public long AddTimestamp { get; init; }

    [JsonPropertyName("sender")]
    public string Sender { get; init; } = string.Empty;
}

public sealed record WbEventsResultDto
{
    [JsonPropertyName("next")]
    public long? Next { get; init; }

    [JsonPropertyName("totalEvents")]
    public int TotalEvents { get; init; }

    [JsonPropertyName("events")]
    public List<WbEventDto> Events { get; init; } = new();
}

public sealed record WbEventsResponse
{
    [JsonPropertyName("result")]
    public WbEventsResultDto? Result { get; init; }
}
