namespace LoebeApp.Models.Activities
{
    public class Activity
    {
        public Guid Id { get; set; }

        public int UserId { get; set; }

        public DateTimeOffset StartedAt { get; set; }

        public int DurationSeconds { get; set; }

        public double DistanceMeters { get; set; }

        public double? AveragePaceSeconds { get; set; }

        public List<GpsPoint> GpsPoints { get; set; } = [];
    }
}