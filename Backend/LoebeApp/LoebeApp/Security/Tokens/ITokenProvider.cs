using LoebeApp.DTOs.Auth;
using LoebeApp.Models;

namespace LoebeApp.Security.Tokens
{
    public interface ITokenProvider
    {
        LoginResponse CreateToken(User user);
    }
}