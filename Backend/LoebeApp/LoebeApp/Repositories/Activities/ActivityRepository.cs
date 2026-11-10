using LoebeApp.Data;
using LoebeApp.Models.Activities;
using Microsoft.EntityFrameworkCore;

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

        /// <inheritdoc/>
        public async Task <List<ActivitySummary>> GetActivitiesByUserIdAsync(int userId)
        {
            return await context.Activities
                .AsNoTracking()
                .Where(activity => activity.UserId == userId)
                .OrderByDescending(activity => activity.StartedAt)
                .Select(activity => new ActivitySummary
                {
                    Id = activity.Id,
                    StartedAt = activity.StartedAt,
                    DurationSeconds = activity.DurationSeconds,
                    DistanceMeters = activity.DistanceMeters,
                    AveragePaceSeconds = activity.AveragePaceSeconds
                })
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<Activity?> GetActivityByIdAsync(Guid activityId, int userId)
        {
            return await context.Activities
                .AsNoTracking()
                .SingleOrDefaultAsync(activity =>
                    activity.Id == activityId &&
                    activity.UserId == userId);
        }
    }
}
