namespace MessagingPlatform.Application.Common.Exceptions;

public sealed class WbApiAuthenticationException : Exception
{
    public WbApiAuthenticationException()
        : base("Wildberries API authentication failed. Token is invalid or expired.")
    { }

    public WbApiAuthenticationException(string message) : base(message) { }

    public WbApiAuthenticationException(string message, Exception innerException)
        : base(message, innerException)
    { }
}
