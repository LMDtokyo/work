using MessagingPlatform.Domain.Exceptions;
using MessagingPlatform.Domain.Primitives;

namespace MessagingPlatform.Domain.ValueObjects;

public sealed class WbApiToken : ValueObject
{
    private const int MinLength = 32;
    private const int MaxLength = 1024;

    public string Value { get; }

    private WbApiToken(string value) => Value = value;

    public static WbApiToken Create(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            throw new DomainException("API токен не может быть пустым");

        token = token.Trim();

        if (token.Length < MinLength)
            throw new DomainException($"API токен должен содержать минимум {MinLength} символов");

        if (token.Length > MaxLength)
            throw new DomainException($"API токен не может превышать {MaxLength} символов");

        return new WbApiToken(token);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value[..8] + "***";

    public static implicit operator string(WbApiToken token) => token.Value;
}
