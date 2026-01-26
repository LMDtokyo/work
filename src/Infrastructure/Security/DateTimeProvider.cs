using MessagingPlatform.Application.Common.Interfaces;

namespace MessagingPlatform.Infrastructure.Security;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
