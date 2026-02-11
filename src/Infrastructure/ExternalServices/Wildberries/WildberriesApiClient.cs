using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using MessagingPlatform.Application.Common.Exceptions;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Infrastructure.ExternalServices.Wildberries.DTOs;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Infrastructure.ExternalServices.Wildberries;

internal sealed class WildberriesApiClient : IWildberriesApiClient
{
    private const string MarketplaceApiBaseUrl = "https://marketplace-api.wildberries.ru";
    private const string StatsApiBaseUrl = "https://statistics-api.wildberries.ru";
    private const string ChatApiBaseUrl = "https://buyer-chat-api.wildberries.ru";

    private readonly HttpClient _httpClient;
    private readonly ILogger<WildberriesApiClient> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public WildberriesApiClient(HttpClient httpClient, ILogger<WildberriesApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<bool> ValidateTokenAsync(string token, CancellationToken ct = default)
    {
        const string endpoint = "/api/v3/warehouses";
        try
        {
            var request = CreateRequest(HttpMethod.Get, $"{MarketplaceApiBaseUrl}{endpoint}", token);
            var response = await _httpClient.SendAsync(request, ct);

            var isValid = response.StatusCode switch
            {
                HttpStatusCode.OK => true,
                HttpStatusCode.Unauthorized => false,
                HttpStatusCode.Forbidden => false,
                _ => true
            };

            if (!isValid)
            {
                _logger.LogWarning(
                    "Token validation failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
            }

            return isValid;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex,
                "HTTP request error during token validation. Endpoint: {Endpoint}",
                endpoint);
            return false;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex,
                "Request cancelled during token validation. Endpoint: {Endpoint}",
                endpoint);
            return false;
        }
    }

    public async Task<IReadOnlyList<WbOrderData>> GetOrdersAsync(
        string token,
        DateTime? from = null,
        CancellationToken ct = default)
    {
        var result = new List<WbOrderData>();
        var dateFrom = from ?? DateTime.UtcNow.AddDays(-30);

        try
        {
            // statistics API - все заказы, не только FBS
            while (true)
            {
                var url = $"{StatsApiBaseUrl}/api/v1/supplier/orders?dateFrom={dateFrom:yyyy-MM-ddTHH:mm:ss}";
                var request = CreateRequest(HttpMethod.Get, url, token);
                var response = await _httpClient.SendAsync(request, ct);

                if (response.StatusCode == HttpStatusCode.Unauthorized ||
                    response.StatusCode == HttpStatusCode.Forbidden)
                {
                    _logger.LogWarning("Stats API auth fail: {Code}", (int)response.StatusCode);
                    throw new WbApiAuthenticationException("Invalid or expired API token");
                }

                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                {
                    var wait = (int)(response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 60);
                    _logger.LogWarning("Stats orders rate limit, retry {Sec}s", wait);
                    throw new WbApiRateLimitException($"Rate limit exceeded. Retry after {wait}s", wait);
                }

                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync(ct);
                    _logger.LogError("Stats orders failed ({Code}): {Body}", (int)response.StatusCode, body);
                    break;
                }

                var content = await response.Content.ReadAsStringAsync(ct);
                var orders = JsonSerializer.Deserialize<List<WbStatsOrderDto>>(content, _jsonOptions);

                if (orders == null || orders.Count == 0)
                    break;

                var unique = orders
                    .Where(x => !string.IsNullOrEmpty(x.Srid))
                    .GroupBy(x => x.Srid)
                    .Select(g => g.OrderByDescending(x => x.LastChangeDate).First())
                    .ToList();

                foreach (var o in unique)
                    result.Add(MapStatsOrder(o));

                // пагинация: если пришло ~80к строк, запрос ещё
                if (orders.Count < 50000)
                    break;

                dateFrom = orders[^1].LastChangeDate;
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error fetching stats orders. Got: {Count}", result.Count);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Cancelled fetching stats orders. Got: {Count}", result.Count);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON error parsing stats orders. Got: {Count}", result.Count);
        }

        return result;
    }

    public async Task<IReadOnlyList<WbOrderData>> GetArchivedOrdersAsync(
        string token,
        DateTime? from = null,
        DateTime? to = null,
        CancellationToken ct = default)
    {
        const string endpoint = "/api/v3/statistics/orders";
        var result = new List<WbOrderData>();
        var dateFrom = from ?? DateTime.UtcNow.AddDays(-90);
        var dateTo = to ?? DateTime.UtcNow;

        try
        {
            var url = $"{MarketplaceApiBaseUrl}{endpoint}?dateFrom={dateFrom:O}&dateTo={dateTo:O}";
            var request = CreateRequest(HttpMethod.Get, url, token);
            var response = await _httpClient.SendAsync(request, ct);

            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning(
                    "WB API authentication failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            if (response.StatusCode == HttpStatusCode.TooManyRequests)
            {
                var retryAfter = (int)(response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 60);
                _logger.LogWarning(
                    "WB API rate limit exceeded for {Endpoint}. Retry after {Seconds} seconds",
                    endpoint,
                    retryAfter);
                throw new WbApiRateLimitException($"Rate limit exceeded. Retry after {retryAfter}s", retryAfter);
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Failed to fetch archived orders from Wildberries. Endpoint: {Endpoint}, StatusCode: {StatusCode}, DateFrom: {DateFrom}, DateTo: {DateTo}",
                    endpoint,
                    (int)response.StatusCode,
                    dateFrom,
                    dateTo);
                return result;
            }

            var content = await response.Content.ReadAsStringAsync(ct);
            var ordersResponse = JsonSerializer.Deserialize<WbOrdersResponse>(content, _jsonOptions);

            if (ordersResponse?.Orders != null)
            {
                foreach (var order in ordersResponse.Orders)
                {
                    result.Add(MapToWbOrderData(order));
                }
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP request error while fetching archived orders. DateFrom: {DateFrom}, OrdersFetched: {Count}", dateFrom, result.Count);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Request cancelled while fetching archived orders. DateFrom: {DateFrom}, OrdersFetched: {Count}", dateFrom, result.Count);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON deserialization error while parsing archived orders. DateFrom: {DateFrom}, OrdersFetched: {Count}", dateFrom, result.Count);
        }

        return result;
    }

    private static WbOrderData MapToWbOrderData(WbOrderDto order)
    {
        var status = order.IsCancel ? WbOrderStatus.Cancelled : WbOrderStatus.New;
        var productName = !string.IsNullOrWhiteSpace(order.Subject)
            ? order.Subject
            : order.Article;

        decimal price = order.ConvertedPrice / 100m; // копейки → рубли

        return new WbOrderData(
            order.Id,
            status,
            order.Article,
            order.Rid,
            price,
            MapCurrencyCode(order.CurrencyCode),
            productName,
            1,
            order.CreatedAt,
            order.CancelDt); // CancelDt can serve as FinishedAt for cancelled orders
    }

    static WbOrderData MapStatsOrder(WbStatsOrderDto o)
    {
        var st = o.IsCancel ? WbOrderStatus.Cancelled
            : o.IsRealization ? WbOrderStatus.Delivered
            : WbOrderStatus.New;

        var name = o.Subject ?? o.SupplierArticle ?? "—";
        var cur = string.IsNullOrEmpty(o.CurrencyCode) ? "RUB" : o.CurrencyCode;
        var dt = DateTime.SpecifyKind(o.Date, DateTimeKind.Utc);

        // 0001-01-01 = дефолт, не реальная дата отмены
        DateTime? cancelDt = null;
        if (o.CancelDate.HasValue && o.CancelDate.Value.Year > 2000)
            cancelDt = DateTime.SpecifyKind(o.CancelDate.Value, DateTimeKind.Utc);

        long orderId = 0;
        if (!string.IsNullOrEmpty(o.Srid))
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(o.Srid);
            orderId = Math.Abs(BitConverter.ToInt64(
                System.Security.Cryptography.SHA256.HashData(bytes), 0));
        }

        return new WbOrderData(
            orderId, st, o.SupplierArticle, null,
            o.PriceWithDisc > 0 ? o.PriceWithDisc : o.TotalPrice,
            cur, name, 1, dt, cancelDt);
    }

    private static string MapCurrencyCode(int currencyCode)
    {
        return currencyCode switch
        {
            643 => "RUB",
            840 => "USD",
            978 => "EUR",
            398 => "KZT",
            933 => "BYN",
            _ => "RUB"
        };
    }

    private void LogApiError(HttpStatusCode statusCode)
    {
        var message = statusCode switch
        {
            HttpStatusCode.Unauthorized => "Invalid API token",
            HttpStatusCode.Forbidden => "Access forbidden",
            HttpStatusCode.TooManyRequests => "Rate limit exceeded",
            HttpStatusCode.InternalServerError => "Wildberries server error",
            HttpStatusCode.BadGateway => "Wildberries bad gateway",
            HttpStatusCode.ServiceUnavailable => "Wildberries service unavailable",
            _ => $"API error: {statusCode}"
        };
        _logger.LogWarning("Wildberries API: {Message} ({StatusCode})", message, (int)statusCode);
    }

    public DateTime? GetTokenExpirationDate(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        try
        {
            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(token))
            {
                _logger.LogWarning("Invalid JWT token format");
                return null;
            }

            var jwtToken = handler.ReadJwtToken(token);

            return jwtToken.ValidTo != DateTime.MinValue ? jwtToken.ValidTo : null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse JWT token expiration");
            return null;
        }
    }

    public async Task<IReadOnlyList<WbChatData>> GetChatsAsync(string token, CancellationToken ct = default)
    {
        const string endpoint = "/api/v1/seller/chats";
        var result = new List<WbChatData>();

        try
        {
            var url = $"{ChatApiBaseUrl}{endpoint}";
            var request = CreateRequest(HttpMethod.Get, url, token);
            var response = await _httpClient.SendAsync(request, ct);

            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning(
                    "WB API authentication failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            if (response.StatusCode == HttpStatusCode.TooManyRequests)
            {
                var retryAfter = (int)(response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 60);
                _logger.LogWarning(
                    "WB API rate limit exceeded for {Endpoint}. Retry after {Seconds} seconds",
                    endpoint,
                    retryAfter);
                throw new WbApiRateLimitException($"Rate limit exceeded. Retry after {retryAfter}s", retryAfter);
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Failed to fetch chats from Wildberries. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                return result;
            }

            var content = await response.Content.ReadAsStringAsync(ct);
            _logger.LogInformation("Received chats response: {Content}", content.Length > 2000 ? content.Substring(0, 2000) : content);

            var chatsResponse = JsonSerializer.Deserialize<WbChatsResponse>(content, _jsonOptions);
            _logger.LogInformation("Deserialized {Count} chats from WB API", chatsResponse?.Chats?.Count ?? 0);

            if (chatsResponse?.Chats != null)
            {
                foreach (var chat in chatsResponse.Chats)
                {
                    var lastMessageText = chat.LastMessage?.Text;
                    var lastMessageAt = chat.LastMessage != null
                        ? DateTimeOffset.FromUnixTimeMilliseconds(chat.LastMessage.Timestamp).UtcDateTime
                        : (DateTime?)null;

                    result.Add(new WbChatData(
                        chat.ChatId,
                        chat.CustomerName,
                        chat.CustomerAvatar,
                        lastMessageText,
                        lastMessageAt,
                        chat.UnreadCount,
                        chat.ReplySign));
                }
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP request error while fetching chats. ChatsFetched: {Count}", result.Count);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Request cancelled while fetching chats. ChatsFetched: {Count}", result.Count);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON deserialization error while parsing chats. ChatsFetched: {Count}", result.Count);
        }

        return result;
    }

    public async Task<WbEventsResult> GetEventsAsync(string token, string? nextCursor = null, int limit = 100, CancellationToken ct = default)
    {
        const string endpoint = "/api/v1/seller/events";
        var emptyResult = new WbEventsResult(Array.Empty<WbEventData>(), null, 0);

        try
        {
            var url = $"{ChatApiBaseUrl}{endpoint}?limit={limit}";
            if (!string.IsNullOrEmpty(nextCursor))
                url += $"&next={nextCursor}";

            var request = CreateRequest(HttpMethod.Get, url, token);
            var response = await _httpClient.SendAsync(request, ct);

            if (response.StatusCode == HttpStatusCode.Unauthorized || response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("WB API auth failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}", endpoint, (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            if (response.StatusCode == HttpStatusCode.TooManyRequests)
            {
                var retryAfter = (int)(response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 60);
                _logger.LogWarning("WB API rate limit exceeded. Retry after {Seconds}s", retryAfter);
                throw new WbApiRateLimitException($"Rate limit exceeded. Retry after {retryAfter}s", retryAfter);
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to fetch events. StatusCode: {StatusCode}", (int)response.StatusCode);
                return emptyResult;
            }

            var content = await response.Content.ReadAsStringAsync(ct);
            var eventsResponse = JsonSerializer.Deserialize<WbEventsResponse>(content, _jsonOptions);

            if (eventsResponse?.Result?.Events == null)
                return emptyResult;

            var events = eventsResponse.Result.Events
                .Where(e => e.EventType == "message" && e.Message?.Text != null)
                .Select(e => new WbEventData(
                    e.ChatId,
                    e.EventId,
                    e.Message!.Text!,
                    e.Sender == "client",
                    DateTimeOffset.FromUnixTimeMilliseconds(e.AddTimestamp).UtcDateTime))
                .ToList();

            var next = eventsResponse.Result.Next?.ToString();
            return new WbEventsResult(events, next, eventsResponse.Result.TotalEvents);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error while fetching events");
            return emptyResult;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Request cancelled while fetching events");
            return emptyResult;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON error while parsing events");
            return emptyResult;
        }
    }

    public async Task<bool> SendMessageAsync(string token, string replySign, string text, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(text))
            return false;

        try
        {
            var url = $"{ChatApiBaseUrl}/api/v1/seller/message";

            using var form = new MultipartFormDataContent();
            form.Add(new StringContent(replySign), "replySign");
            form.Add(new StringContent(text), "message");

            var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = form };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.SendAsync(request, ct);

            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("WB send auth fail: {Code}", (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            if (response.StatusCode == HttpStatusCode.TooManyRequests)
            {
                var wait = (int)(response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 10);
                throw new WbApiRateLimitException($"Rate limit. Retry after {wait}s", wait);
            }

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("WB send failed ({Code}): {Body}", (int)response.StatusCode, body);
                return false;
            }

            var content = await response.Content.ReadAsStringAsync(ct);
            var resp = JsonSerializer.Deserialize<WbSendMsgResponse>(content, _jsonOptions);

            if (resp?.Errors != null && resp.Errors.Count > 0)
            {
                _logger.LogWarning("WB send errors: {Errors}", string.Join("; ", resp.Errors));
                return false;
            }

            return resp?.Result != null;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error sending msg");
            return false;
        }
        catch (TaskCanceledException)
        {
            return false;
        }
    }

    private static HttpRequestMessage CreateRequest(HttpMethod method, string url, string apiToken)
    {
        var request = new HttpRequestMessage(method, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return request;
    }
}
