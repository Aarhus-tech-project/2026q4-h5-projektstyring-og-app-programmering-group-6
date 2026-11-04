using LoebeApp.DTOs.Activities;

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
    }
}
