using LoebeApp.Data;
using LoebeApp.Models.Activities;
using LoebeApp.Models.Statistics;
using Microsoft.EntityFrameworkCore;

namespace LoebeApp.Repositories.Activities
{
    public class ActivityRepository 
        (AppDbContext context)
        : IActivityRepository
    {

        /// <inheritdoc/>
        /// <inheritdoc/>
        public async Task AddActivityAsync(
            Activity activity,
            IReadOnlyList<PersonalRecord> recordCandidates)
        {
            await using var transaction = await context.Database.BeginTransactionAsync();

            context.Activities.Add(activity);
            await context.SaveChangesAsync();

            foreach (var candidate in recordCandidates)
            {
                await SaveRecordIfFasterAsync(candidate);
            }

            await transaction.CommitAsync();
        }

        private async Task SaveRecordIfFasterAsync(PersonalRecord candidate)
        {
            await context.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO "PersonalRecords" AS existing
                    ("UserId", "DistanceMeters", "DurationMilliseconds", "ActivityId")
                VALUES
                    ({candidate.UserId}, {candidate.DistanceMeters},
                     {candidate.DurationMilliseconds}, {candidate.ActivityId})
                ON CONFLICT ("UserId", "DistanceMeters") DO UPDATE
                SET "DurationMilliseconds" = EXCLUDED."DurationMilliseconds",
                    "ActivityId" = EXCLUDED."ActivityId"
                WHERE EXCLUDED."DurationMilliseconds" < existing."DurationMilliseconds"
                """);
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

        /// <inheritdoc/>
        public async Task<ActivityStatistics> GetStatisticsAsync(int userId)
        {
            var statistics = await context.Activities
                .Where(activity => activity.UserId == userId)
                .GroupBy(activity => activity.UserId)
                .Select(group => new ActivityStatistics
                {
                    TotalDistanceMeters = group.Sum(activity => activity.DistanceMeters),
                    TotalDurationSeconds = group.Sum(activity => (long)activity.DurationSeconds)
                })
                .SingleOrDefaultAsync() ?? new ActivityStatistics();

            statistics.PersonalRecords = await context.PersonalRecords
                .AsNoTracking()
                .Where(record => record.UserId == userId)
                .OrderBy(record => record.DistanceMeters)
                .ToListAsync();

            return statistics;
        }
    }
}
