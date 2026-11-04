using LoebeApp.Data;
using LoebeApp.Models;

namespace LoebeApp.Repositories.Activities
{
    public class ActivityRepository 
        (AppDbContext context)
        : IActivityRepository
    {

        /// <inheritdoc/>
        public async Task AddActivityAsync(Activity activity)
        {
            context.Activities.Add(activity);
            await context.SaveChangesAsync();
        }
    }
}
