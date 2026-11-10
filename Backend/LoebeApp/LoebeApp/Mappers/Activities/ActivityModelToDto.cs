using LoebeApp.DTOs.Activities;
using LoebeApp.Models.Activities;

namespace LoebeApp.Mappers.Activities
{
    public static class ActivityModelToDto
    {
        public static ActivityDetailsResponse MapToDetails(Activity activity)
        {
            return new ActivityDetailsResponse
            {
                Id = activity.Id,
                StartedAt = activity.StartedAt,
                DurationSeconds = activity.DurationSeconds,
                DistanceMeters = activity.DistanceMeters,
                AveragePaceSeconds = activity.AveragePaceSeconds,
                GpsPoints = activity.GpsPoints.Select(point =>
                    new GpsPointResponse
                    {
                        Latitude = point.Latitude,
                        Longitude = point.Longitude,
                        ElapsedMilliseconds = point.ElapsedMilliseconds,
                        AccuracyMeters = point.AccuracyMeters
                    }).ToList()
            };
        }
    }
}