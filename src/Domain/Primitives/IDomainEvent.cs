using MediatR;

namespace MessagingPlatform.Domain.Primitives;

public interface IDomainEvent : INotification
{
    Guid EventId { get; }
    DateTime OccurredOn { get; }
}
