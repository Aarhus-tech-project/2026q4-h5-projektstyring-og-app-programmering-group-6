using LoebeApp.Managers;
using LoebeApp.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LoebeApp.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(
        IAuthManager authManager)
        : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync(RegisterRequest request)
        {
            await authManager.RegisterUserAsync(request);

            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            var respons = await authManager.LoginAsync(request);

            return Ok(respons);
        }

    }
}
