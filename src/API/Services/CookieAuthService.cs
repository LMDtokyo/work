using MessagingPlatform.API.Constants;
using MessagingPlatform.Infrastructure.Security;
using Microsoft.Extensions.Options;

namespace MessagingPlatform.API.Services;

public sealed class CookieAuthService : ICookieAuthService
{
    private readonly JwtSettings _jwtSettings;
    private const string AuthPath = "/api/Auth";

    public CookieAuthService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public void SetTokens(HttpContext context, string accessToken, string refreshToken, DateTime refreshExpiry)
    {
        var isSecure = IsSecureConnection(context);
        var sameSite = isSecure ? SameSiteMode.Strict : SameSiteMode.Lax;

        context.Response.Cookies.Append(CookieNames.AccessToken, accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isSecure,
            SameSite = sameSite,
            Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            Path = "/"
        });

        context.Response.Cookies.Append(CookieNames.RefreshToken, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = isSecure,
            SameSite = sameSite,
            Expires = refreshExpiry,
            Path = AuthPath
        });
    }

    public void ClearTokens(HttpContext context)
    {
        context.Response.Cookies.Delete(CookieNames.AccessToken, new CookieOptions { Path = "/" });
        context.Response.Cookies.Delete(CookieNames.RefreshToken, new CookieOptions { Path = AuthPath });
    }

    public string? GetRefreshToken(HttpContext context)
    {
        return context.Request.Cookies[CookieNames.RefreshToken];
    }

    private static bool IsSecureConnection(HttpContext context)
    {
        if (context.Request.IsHttps)
            return true;

        var forwardedProto = context.Request.Headers["X-Forwarded-Proto"].FirstOrDefault();
        return string.Equals(forwardedProto, "https", StringComparison.OrdinalIgnoreCase);
    }
}
