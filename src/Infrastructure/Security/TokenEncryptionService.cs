using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace MessagingPlatform.Infrastructure.Security;

public interface ITokenEncryptionService
{
    string Encrypt(string plainText);
    string Decrypt(string cipherText);
}

internal sealed class TokenEncryptionService : ITokenEncryptionService
{
    private readonly byte[] _key;

    public TokenEncryptionService(IConfiguration config)
    {
        var secret = config["TokenEncryption:Key"]
            ?? config["Jwt:Secret"]
            ?? throw new InvalidOperationException("No encryption key configured");

        using var sha = SHA256.Create();
        _key = sha.ComputeHash(Encoding.UTF8.GetBytes(secret));
    }

    public string Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText)) return plainText;

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var enc = aes.CreateEncryptor();
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var encrypted = enc.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        var result = new byte[aes.IV.Length + encrypted.Length];
        Buffer.BlockCopy(aes.IV, 0, result, 0, aes.IV.Length);
        Buffer.BlockCopy(encrypted, 0, result, aes.IV.Length, encrypted.Length);

        return Convert.ToBase64String(result);
    }

    public string Decrypt(string cipherText)
    {
        if (string.IsNullOrEmpty(cipherText)) return cipherText;

        // already plaintext (migration compat)
        try
        {
            var fullBytes = Convert.FromBase64String(cipherText);
            if (fullBytes.Length < 17) return cipherText;

            using var aes = Aes.Create();
            aes.Key = _key;

            var iv = new byte[16];
            Buffer.BlockCopy(fullBytes, 0, iv, 0, 16);
            aes.IV = iv;

            using var dec = aes.CreateDecryptor();
            var decrypted = dec.TransformFinalBlock(fullBytes, 16, fullBytes.Length - 16);
            return Encoding.UTF8.GetString(decrypted);
        }
        catch
        {
            // not encrypted yet, return as-is
            return cipherText;
        }
    }
}
