using LoebeApp.Models.Activities;

namespace LoebeApp.Repositories.Activities
{
    public interface IActivityRepository
    {
        /// <summary>
        /// Adds an activity and its GPS points asynchronously.
        /// </summary>
        /// <param name="activity">The activity to save.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task AddActivityAsync(Activity activity);

        /// <summary>
        /// Gets the specified user's activities, ordered newest first.
        /// </summary>
        /// <param name="userId">The owner's user ID.</param>
        /// <returns>The user's activities, or an empty list if none exist.</returns>
        Task<List<ActivitySummary>> GetActivitiesByUserIdAsync(int userId);

        /// <summary>
        /// Gets an activity belonging to the specified user.
        /// </summary>
        /// <param name="activityId">The activity's ID.</param>
        /// <param name="userId">The owner's user ID.</param>
        /// <returns>The activity, or null if no matching activity exists.</returns>
        Task<Activity?> GetActivityByIdAsync(Guid activityId, int userId);
    }
}
