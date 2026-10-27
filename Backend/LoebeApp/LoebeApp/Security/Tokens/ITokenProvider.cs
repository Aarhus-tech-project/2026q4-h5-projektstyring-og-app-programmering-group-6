using LoebeApp.DTOs;
using LoebeApp.Models;

namespace LoebeApp.Security
{
    public interface ITokenProvider
    {
        LoginResponse CreateToken(User user);
    }
}