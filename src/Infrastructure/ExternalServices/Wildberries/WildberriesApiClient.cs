using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Domain.Enums;
using MessagingPlatform.Infrastructure.ExternalServices.Wildberries.DTOs;
using Microsoft.Extensions.Logging;

namespace MessagingPlatform.Infrastructure.ExternalServices.Wildberries;

internal sealed class WildberriesApiClient : IWildberriesApiClient
{
    private const string MarketplaceApiBaseUrl = "https://marketplace-api.wildberries.ru";

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
        try
        {
            var request = CreateRequest(HttpMethod.Get, $"{MarketplaceApiBaseUrl}/api/v3/warehouses", token);
            var response = await _httpClient.SendAsync(request, ct);

            return response.StatusCode switch
            {
                HttpStatusCode.OK => true,
                HttpStatusCode.Unauthorized => false,
                HttpStatusCode.Forbidden => false,
                _ => true
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error validating Wildberries token");
            return false;
        }
        catch (TaskCanceledException)
        {
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

                if (!response.IsSuccessStatusCode)
                {
                    LogApiError(response.StatusCode);
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
            _logger.LogError(ex, "Error fetching orders from Wildberries");
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("Wildberries API request was cancelled");
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Error deserializing Wildberries response");
        }

        return result;
    }

    private static WbOrderData MapToWbOrderData(WbOrderDto order)
    {
        var status = order.IsCancel ? WbOrderStatus.Cancelled : WbOrderStatus.New;
        var productName = !string.IsNullOrWhiteSpace(order.Subject)
            ? order.Subject
            : order.Article;

        return new WbOrderData(
            order.Id,
            status,
            order.ConvertedPrice / 100m,
            MapCurrencyCode(order.CurrencyCode),
            productName,
            1,
            order.CreatedAt);
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

    private static HttpRequestMessage CreateRequest(HttpMethod method, string url, string apiToken)
    {
        var request = new HttpRequestMessage(method, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return request;
    }
}
