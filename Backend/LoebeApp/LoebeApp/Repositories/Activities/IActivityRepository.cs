using LoebeApp.Models.Activities;
using LoebeApp.Models.Statistics;

namespace LoebeApp.Repositories.Activities
{
    public interface IActivityRepository
    {
        /// <summary>
        /// Saves an activity and updates personal records when the candidates are faster.
        /// </summary>
        /// <param name="activity">The activity to save.</param>
        /// <param name="recordCandidates">The activity's best times for the record distances.</param>
        Task AddActivityAsync(Activity activity, IReadOnlyList<PersonalRecord> recordCandidates);

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

        /// <summary>
        /// Asynchronously retrieves activity statistics for the specified user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose activity statistics are retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the user's activity statistics.</returns>
        Task<ActivityStatistics> GetStatisticsAsync(int userId);
    }
}
