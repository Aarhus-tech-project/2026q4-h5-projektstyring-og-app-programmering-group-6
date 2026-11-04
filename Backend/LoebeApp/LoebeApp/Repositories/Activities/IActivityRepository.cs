using LoebeApp.Models;

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
    }
}
