using LoebeApp.DTOs.Activities;
using LoebeApp.DTOs.Statistics;

namespace LoebeApp.Managers.Activities
{
    public interface IActivityManager
    {
        /// <summary>
        /// Adds an activity to the underlying store asynchronously.
        /// </summary>
        /// <param name="activity">The activity to add.</param>
        /// <returns>A task that represents the asynchronous add operation.</returns>
        Task AddActivityAsync(CreateActivityRequest request, int userId);

        /// <summary>
        /// Gets activity summaries for the specified user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of activity summaries for
        /// the specified user.</returns>
        Task<List<ActivitySummaryResponse>> GetActivitiesByUserIdAsync(int userId);

        /// <summary>
        /// Gets the details of an activity belonging to the specified user.
        /// </summary>
        /// <param name="activityId">The activity's ID.</param>
        /// <param name="userId">The owner's user ID.</param>
        /// <returns>The activity details.</returns>
        /// <exception cref="LoebeApp.Exceptions.ActivityNotFoundException">
        /// No matching activity belongs to the user.
        /// </exception>
        Task<ActivityDetailsResponse> GetActivityByIdAsync(Guid activityId, int userId);

        /// <summary>
        /// Asynchronously retrieves activity statistics for the specified user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the user's activity statistics.</returns>
        Task<ActivityStatisticsResponse> GetStatisticsAsync(int userId);
    }
}
