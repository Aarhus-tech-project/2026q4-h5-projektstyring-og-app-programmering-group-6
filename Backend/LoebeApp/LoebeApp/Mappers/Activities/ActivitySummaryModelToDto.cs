using LoebeApp.DTOs.Activities;
using LoebeApp.Models.Activities;

namespace LoebeApp.Mappers.Activities
{
    public static class ActivitySummaryModelToDto
    {
        public static ActivitySummaryResponse MapToSummary(ActivitySummary activity)
        {
            return new ActivitySummaryResponse
            {
                Id = activity.Id,
                StartedAt = activity.StartedAt,
                DurationSeconds = activity.DurationSeconds,
                DistanceMeters = activity.DistanceMeters,
                AveragePaceSeconds = activity.AveragePaceSeconds
            };
        }
    }
}