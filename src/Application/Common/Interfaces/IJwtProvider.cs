using MessagingPlatform.Domain.Entities;

namespace MessagingPlatform.Application.Common.Interfaces;

public interface IJwtProvider
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Guid? ValidateRefreshToken(string token);
}
