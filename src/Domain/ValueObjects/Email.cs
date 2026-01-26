using System.Text.RegularExpressions;
using MessagingPlatform.Domain.Exceptions;
using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.ValueObjects;

public sealed partial class Email : ValueObject
{
    private const int MaxLength = 256;

    public string Value { get; }

    private Email(string value) => Value = value;

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email cannot be empty");

        if (email.Length > MaxLength)
            throw new DomainException($"Email cannot exceed {MaxLength} characters");

        if (!EmailRegex().IsMatch(email))
            throw new DomainException("Email format is invalid");

        return new Email(email.ToLowerInvariant());
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();
}
