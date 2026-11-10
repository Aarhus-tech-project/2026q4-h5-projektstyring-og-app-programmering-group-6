using LoebeApp.DTOs.Activities;

namespace LoebeApp.Tests.Builders
{
    public class CreateActivityRequestBuilder
    {
        public CreateActivityRequest Build()
        {
            return new CreateActivityRequest
            {
                Id = Guid.NewGuid(),
                StartedAt = DateTimeOffset.UtcNow,
                DurationSeconds = 2,
                DistanceMeters = 5,
                GpsPoints =
                [
                    new GpsPointRequest
                    {
                        Latitude = 56.154435,
                        Longitude = 10.191753,
                        ElapsedMilliseconds = 0,
                        AccuracyMeters = 5
                    },
                    new GpsPointRequest
                    {
                        Latitude = 56.154398,
                        Longitude = 10.191707,
                        ElapsedMilliseconds = 2000,
                        AccuracyMeters = 5
                    }
                ]
            };
        }
    }
}