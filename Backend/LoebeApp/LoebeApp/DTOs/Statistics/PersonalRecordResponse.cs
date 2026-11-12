namespace LoebeApp.DTOs.Statistics
{
    public class PersonalRecordResponse
    {
        public required int DistanceMeters { get; set; }

        public required int DurationMilliseconds { get; set; }

        public required double PaceSecondsPerKilometer { get; set; }

        public required Guid ActivityId { get; set; }
    }
}