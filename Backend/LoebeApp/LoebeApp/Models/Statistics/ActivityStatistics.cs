namespace LoebeApp.Models.Statistics
{
    public class ActivityStatistics
    {
        public double TotalDistanceMeters { get; set; }

        public long TotalDurationSeconds { get; set; }

        public List<PersonalRecord> PersonalRecords { get; set; } = [];
    }
}