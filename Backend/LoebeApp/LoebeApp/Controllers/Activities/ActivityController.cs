using LoebeApp.DTOs.Activities;
using LoebeApp.Managers.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LoebeApp.Controllers.Activities
{
    [ApiController]
    [Authorize]
    [Route("api/activities")]
    public class ActivitiesController(
        IActivityManager activityManager)
        : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddActivityAsync(CreateActivityRequest request)
        {
            var userIdClaim = User.FindFirstValue(
                JwtRegisteredClaimNames.Sub);

            if (!int.TryParse(userIdClaim, out var userId) || userId <= 0)
            {
                return Unauthorized();
            }

            await activityManager.AddActivityAsync(request, userId);

            return StatusCode(StatusCodes.Status201Created);
        }
    }
}