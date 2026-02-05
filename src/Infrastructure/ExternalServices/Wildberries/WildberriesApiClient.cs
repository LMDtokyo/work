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
    private const string ChatApiBaseUrl = "https://openapi.wildberries.ru";

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
        long next = 0;

        try
        {
            while (true)
            {
                var url = $"{MarketplaceApiBaseUrl}/api/v3/orders?limit=1000&next={next}&dateFrom={dateFrom:O}";
                var request = CreateRequest(HttpMethod.Get, url, token);
                var response = await _httpClient.SendAsync(request, ct);

                // CRITICAL: Handle authentication failures explicitly
                if (response.StatusCode == HttpStatusCode.Unauthorized ||
                    response.StatusCode == HttpStatusCode.Forbidden)
                {
                    _logger.LogWarning(
                        "WB API authentication failed. Endpoint: /api/v3/orders, StatusCode: {StatusCode}",
                        (int)response.StatusCode);
                    throw new WbApiAuthenticationException("Invalid or expired API token");
                }

                // Handle rate limiting
                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                {
                    var retryAfter = (int)(response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 60);
                    _logger.LogWarning(
                        "WB API rate limit exceeded for /api/v3/orders. Retry after {Seconds} seconds",
                        retryAfter);
                    throw new WbApiRateLimitException($"Rate limit exceeded. Retry after {retryAfter}s", retryAfter);
                }

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError(
                        "Failed to fetch orders from Wildberries. Endpoint: {Endpoint}, StatusCode: {StatusCode}, Next: {Next}, DateFrom: {DateFrom}",
                        url,
                        (int)response.StatusCode,
                        next,
                        dateFrom);
                    break;
                }

                var content = await response.Content.ReadAsStringAsync(ct);
                var ordersResponse = JsonSerializer.Deserialize<WbOrdersResponse>(content, _jsonOptions);

                if (ordersResponse?.Orders == null || ordersResponse.Orders.Count == 0)
                    break;

                foreach (var order in ordersResponse.Orders)
                {
                    result.Add(MapToWbOrderData(order));
                }

                if (ordersResponse.Next == 0)
                    break;

                next = ordersResponse.Next;
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex,
                "HTTP request error while fetching orders. DateFrom: {DateFrom}, OrdersFetched: {Count}",
                dateFrom,
                result.Count);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex,
                "Request cancelled while fetching orders. DateFrom: {DateFrom}, OrdersFetched: {Count}",
                dateFrom,
                result.Count);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex,
                "JSON deserialization error while parsing orders. DateFrom: {DateFrom}, OrdersFetched: {Count}",
                dateFrom,
                result.Count);
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

            // Handle authentication failures
            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning(
                    "WB API authentication failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            // Handle rate limiting
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

        // CRITICAL: Price conversion - WB API returns price in kopecks (cents)
        // Example: 12345 kopecks = 123.45 RUB
        decimal price = order.ConvertedPrice / 100m;

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

            // ValidTo is already in UTC
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

            // Handle authentication failures
            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning(
                    "WB API authentication failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            // Handle rate limiting
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
            var chatsResponse = JsonSerializer.Deserialize<WbChatsResponse>(content, _jsonOptions);

            if (chatsResponse?.Chats != null)
            {
                foreach (var chat in chatsResponse.Chats)
                {
                    result.Add(new WbChatData(
                        chat.ChatId,
                        chat.CustomerName,
                        chat.CustomerAvatar,
                        chat.LastMessage,
                        chat.LastMessageAt,
                        chat.UnreadCount));
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

    public async Task<IReadOnlyList<WbMessageData>> GetMessagesAsync(string token, long chatId, CancellationToken ct = default)
    {
        var endpoint = $"/api/v1/chats/{chatId}/messages";
        var result = new List<WbMessageData>();

        try
        {
            var url = $"{ChatApiBaseUrl}{endpoint}";
            var request = CreateRequest(HttpMethod.Get, url, token);
            var response = await _httpClient.SendAsync(request, ct);

            // Handle authentication failures
            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning(
                    "WB API authentication failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            // Handle rate limiting
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
                    "Failed to fetch messages from Wildberries. Endpoint: {Endpoint}, ChatId: {ChatId}, StatusCode: {StatusCode}",
                    endpoint,
                    chatId,
                    (int)response.StatusCode);
                return result;
            }

            var content = await response.Content.ReadAsStringAsync(ct);
            var messagesResponse = JsonSerializer.Deserialize<WbMessagesResponse>(content, _jsonOptions);

            if (messagesResponse?.Messages != null)
            {
                foreach (var msg in messagesResponse.Messages)
                {
                    result.Add(new WbMessageData(
                        msg.MessageId,
                        msg.ChatId,
                        msg.Text,
                        msg.IsFromCustomer,
                        msg.CreatedAt));
                }
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP request error while fetching messages. ChatId: {ChatId}, MessagesFetched: {Count}", chatId, result.Count);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Request cancelled while fetching messages. ChatId: {ChatId}, MessagesFetched: {Count}", chatId, result.Count);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON deserialization error while parsing messages. ChatId: {ChatId}, MessagesFetched: {Count}", chatId, result.Count);
        }

        return result;
    }

    public async Task<bool> SendMessageAsync(string token, long chatId, string text, CancellationToken ct = default)
    {
        const string endpoint = "/api/v1/chats/send";

        if (string.IsNullOrWhiteSpace(text))
        {
            _logger.LogWarning("Attempted to send empty message. ChatId: {ChatId}", chatId);
            return false;
        }

        try
        {
            var url = $"{ChatApiBaseUrl}{endpoint}";
            var payload = new WbSendMessageRequest { ChatId = chatId, Text = text };
            var jsonContent = JsonSerializer.Serialize(payload, _jsonOptions);
            var httpContent = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = httpContent
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.SendAsync(request, ct);

            // Handle authentication failures
            if (response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.Forbidden)
            {
                _logger.LogWarning(
                    "WB API authentication failed. Endpoint: {Endpoint}, StatusCode: {StatusCode}",
                    endpoint,
                    (int)response.StatusCode);
                throw new WbApiAuthenticationException("Invalid or expired API token");
            }

            // Handle rate limiting
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
                    "Failed to send message to Wildberries. Endpoint: {Endpoint}, ChatId: {ChatId}, StatusCode: {StatusCode}",
                    endpoint,
                    chatId,
                    (int)response.StatusCode);
                return false;
            }

            var content = await response.Content.ReadAsStringAsync(ct);
            var sendResponse = JsonSerializer.Deserialize<WbSendMessageResponse>(content, _jsonOptions);

            return sendResponse?.Success ?? false;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP request error while sending message. ChatId: {ChatId}", chatId);
            return false;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Request cancelled while sending message. ChatId: {ChatId}", chatId);
            return false;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON error while sending message. ChatId: {ChatId}", chatId);
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
