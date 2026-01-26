using System.Text.Json;
using FluentValidation;
using MessagingPlatform.Domain.Exceptions;

namespace MessagingPlatform.API.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, response) = exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                new ErrorResponse(
                    "Validation failed",
                    validationEx.Errors.Select(e => e.ErrorMessage).ToArray())),

            DomainException domainEx => (
                StatusCodes.Status400BadRequest,
                new ErrorResponse(domainEx.Message)),

            UnauthorizedAccessException => (
                StatusCodes.Status401Unauthorized,
                new ErrorResponse("Unauthorized")),

            _ => HandleUnknownException(exception)
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }

    private (int, ErrorResponse) HandleUnknownException(Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception occurred");

        return (
            StatusCodes.Status500InternalServerError,
            new ErrorResponse("Internal server error"));
    }
}

public sealed record ErrorResponse(string Message, string[]? Errors = null);
