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
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            await activityManager.AddActivityAsync(request, userId);

            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<ActivitySummaryResponse>),StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<ActivitySummaryResponse>>> GetActivitiesAsync()
        {

            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var activitySummary = await activityManager.GetActivitiesByUserIdAsync(userId);

            return Ok(activitySummary);

        }

        [HttpGet("{activityId:guid}")]
        [ProducesResponseType(typeof(ActivityDetailsResponse),StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails),StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ActivityDetailsResponse>> GetActivityByIdAsync(Guid activityId)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var activityDetails = await activityManager.GetActivityByIdAsync(activityId, userId);

            return Ok(activityDetails);
        }

        private bool TryGetUserId(out int userId)
        {
            var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return int.TryParse(userIdClaim, out userId) && userId > 0;

        }

    }
}