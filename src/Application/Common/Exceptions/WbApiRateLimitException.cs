namespace MessagingPlatform.Application.Common.Exceptions;

public sealed class WbApiRateLimitException : Exception
{
    public int RetryAfterSeconds { get; }

    public WbApiRateLimitException(int retryAfterSeconds = 60)
        : base($"Wildberries API rate limit exceeded. Retry after {retryAfterSeconds} seconds.")
    {
        RetryAfterSeconds = retryAfterSeconds;
    }

    public WbApiRateLimitException(string message, int retryAfterSeconds = 60) : base(message)
    {
        RetryAfterSeconds = retryAfterSeconds;
    }

    public WbApiRateLimitException(string message, Exception innerException, int retryAfterSeconds = 60)
        : base(message, innerException)
    {
        RetryAfterSeconds = retryAfterSeconds;
    }
}
