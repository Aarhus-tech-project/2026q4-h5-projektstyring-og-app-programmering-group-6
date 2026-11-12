namespace LoebeApp.DTOs.Statistics
{
    public class ActivityStatisticsResponse
    {
        public required double TotalDistanceMeters { get; set; }

        public required long TotalDurationSeconds { get; set; }

        public required List<PersonalRecordResponse> PersonalRecords { get; set; }
    }
}