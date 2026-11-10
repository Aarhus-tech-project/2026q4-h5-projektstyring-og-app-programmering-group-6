using LoebeApp.DTOs.Activities;
using LoebeApp.Models;
using LoebeApp.Models.Activities;

namespace LoebeApp.Mappers.Activities
{
    public static class ActivityDtoToModel
    {
        public static Activity Map(
            CreateActivityRequest request,
            int userId,
            double? averagePaceSeconds)
        {
            return new Activity
            {
                Id = request.Id,
                UserId = userId,
                StartedAt = request.StartedAt.ToUniversalTime(),
                DurationSeconds = request.DurationSeconds,
                DistanceMeters = request.DistanceMeters,
                AveragePaceSeconds = averagePaceSeconds,
                GpsPoints = request.GpsPoints.Select(point => new GpsPoint
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