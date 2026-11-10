using LoebeApp.DTOs.Auth;
using LoebeApp.Models.Users;

namespace LoebeApp.Security.Tokens
{
    public interface ITokenProvider
    {
        LoginResponse CreateToken(User user);
    }
}