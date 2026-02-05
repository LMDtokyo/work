using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace MessagingPlatform.API.Infrastructure;

/// <summary>
/// Custom console formatter that sanitizes sensitive data (API tokens, Authorization headers) from logs.
/// Prevents token leakage in production logs.
/// </summary>
internal sealed partial class SecureConsoleFormatter : ConsoleFormatter
{
    private readonly IDisposable? _optionsReloadToken;
    private SimpleConsoleFormatterOptions _options;

    public SecureConsoleFormatter(IOptionsMonitor<SimpleConsoleFormatterOptions> options)
        : base("secure")
    {
        _optionsReloadToken = options.OnChange(ReloadLoggerOptions);
        _options = options.CurrentValue;
    }

    private void ReloadLoggerOptions(SimpleConsoleFormatterOptions options) => _options = options;

    public override void Write<TState>(
        in LogEntry<TState> logEntry,
        IExternalScopeProvider? scopeProvider,
        TextWriter textWriter)
    {
        var message = logEntry.Formatter?.Invoke(logEntry.State, logEntry.Exception);
        if (message is null)
            return;

        // Sanitize sensitive data
        message = SanitizeAuthorizationHeaders(message);
        message = SanitizeBearerTokens(message);
        message = SanitizeApiKeys(message);

        var logLevel = logEntry.LogLevel;
        var category = logEntry.Category;
        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

        textWriter.Write($"[{timestamp}] [{logLevel}] {category}: {message}");

        if (logEntry.Exception != null)
        {
            var sanitizedException = SanitizeException(logEntry.Exception);
            textWriter.Write($"{Environment.NewLine}{sanitizedException}");
        }

        textWriter.WriteLine();
    }

    private static string SanitizeAuthorizationHeaders(string message)
    {
        // Remove Authorization: Bearer <token>
        return AuthorizationHeaderRegex().Replace(message, "Authorization: Bearer [REDACTED]");
    }

    private static string SanitizeBearerTokens(string message)
    {
        // Remove standalone bearer tokens (JWT format: xxx.yyy.zzz)
        return BearerTokenRegex().Replace(message, "[REDACTED_TOKEN]");
    }

    private static string SanitizeApiKeys(string message)
    {
        // Remove API keys and tokens from query strings or JSON
        message = ApiKeyQueryStringRegex().Replace(message, "apiKey=[REDACTED]");
        message = TokenQueryStringRegex().Replace(message, "token=[REDACTED]");
        message = ApiTokenJsonRegex().Replace(message, "\"apiToken\":\"[REDACTED]\"");
        return message;
    }

    private static string SanitizeException(Exception exception)
    {
        var exceptionString = exception.ToString();
        exceptionString = SanitizeAuthorizationHeaders(exceptionString);
        exceptionString = SanitizeBearerTokens(exceptionString);
        exceptionString = SanitizeApiKeys(exceptionString);
        return exceptionString;
    }

    // Compiled regex patterns for performance
    [GeneratedRegex(@"Authorization:\s*Bearer\s+[\w\-\.]+", RegexOptions.IgnoreCase)]
    private static partial Regex AuthorizationHeaderRegex();

    [GeneratedRegex(@"\beyJ[\w\-]+\.eyJ[\w\-]+\.[\w\-]+", RegexOptions.None)]
    private static partial Regex BearerTokenRegex();

    [GeneratedRegex(@"apiKey=[^&\s]+", RegexOptions.IgnoreCase)]
    private static partial Regex ApiKeyQueryStringRegex();

    [GeneratedRegex(@"token=[^&\s]+", RegexOptions.IgnoreCase)]
    private static partial Regex TokenQueryStringRegex();

    [GeneratedRegex(@"""apiToken""\s*:\s*""[^""]+""", RegexOptions.IgnoreCase)]
    private static partial Regex ApiTokenJsonRegex();

    public void Dispose() => _optionsReloadToken?.Dispose();
}
