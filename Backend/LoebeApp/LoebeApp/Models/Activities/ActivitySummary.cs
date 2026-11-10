namespace LoebeApp.Models.Activities
{
    public class ActivitySummary
    {
        public Guid Id { get; set; }

        public DateTimeOffset StartedAt { get; set; }

        public int DurationSeconds { get; set; }

        public double DistanceMeters { get; set; }

        public double? AveragePaceSeconds { get; set; }
    }
}