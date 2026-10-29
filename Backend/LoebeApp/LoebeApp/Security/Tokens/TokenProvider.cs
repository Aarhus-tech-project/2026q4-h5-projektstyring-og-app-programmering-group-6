using LoebeApp.Configuration;
using LoebeApp.DTOs;
using LoebeApp.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LoebeApp.Security
{
    public class TokenProvider(
        IOptions<JwtOptions> jwtOptions) : ITokenProvider
    {
        public LoginResponse CreateToken(User user)
        {
            var options = jwtOptions.Value;

            var expiresAtUtc = DateTime.UtcNow.AddMinutes(
                options.ExpirationMinutes);

            var claims = new[]
            {
                new Claim(
                    JwtRegisteredClaimNames.Sub,
                    user.Id.ToString(System.Globalization.CultureInfo.InvariantCulture))
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(options.Key));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: options.Issuer,
                audience: options.Audience,
                claims: claims,
                expires: expiresAtUtc,
                signingCredentials: credentials);

            return new LoginResponse
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAtUtc = expiresAtUtc
            };

        }
    }
}