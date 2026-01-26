using MessagingPlatform.Domain.Exceptions;
using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.ValueObjects;

public sealed class PasswordHash : ValueObject
{
    public string Value { get; }

    private PasswordHash(string value) => Value = value;

    public static PasswordHash Create(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
            throw new DomainException("Password hash cannot be empty");

        return new PasswordHash(hash);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public static implicit operator string(PasswordHash hash) => hash.Value;
}
