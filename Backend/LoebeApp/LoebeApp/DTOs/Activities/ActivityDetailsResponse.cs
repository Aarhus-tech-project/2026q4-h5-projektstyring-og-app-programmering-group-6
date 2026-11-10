namespace LoebeApp.DTOs.Activities
{
    public class ActivityDetailsResponse
    {
        public required Guid Id { get; set; }

        public required DateTimeOffset StartedAt { get; set; }

        public required int DurationSeconds { get; set; }

        public required double DistanceMeters { get; set; }

        public required double? AveragePaceSeconds { get; set; }

        public required List<GpsPointResponse> GpsPoints { get; set; }
    }
}