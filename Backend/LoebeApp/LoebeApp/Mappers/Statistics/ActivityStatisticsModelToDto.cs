using LoebeApp.DTOs.Statistics;
using LoebeApp.Models.Statistics;

namespace LoebeApp.Mappers.Statistics
{
    public static class ActivityStatisticsModelToDto
    {
        public static ActivityStatisticsResponse Map(
            ActivityStatistics statistics,
            List<PersonalRecordResponse> personalRecords)
        {
            return new ActivityStatisticsResponse
            {
                TotalDistanceMeters = statistics.TotalDistanceMeters,
                TotalDurationSeconds = statistics.TotalDurationSeconds,
                PersonalRecords = personalRecords
            };
        }

        public static PersonalRecordResponse MapPersonalRecord(
            PersonalRecord record,
            double paceSecondsPerKilometer)
        {
            return new PersonalRecordResponse
            {
                DistanceMeters = record.DistanceMeters,
                DurationMilliseconds = record.DurationMilliseconds,
                PaceSecondsPerKilometer = paceSecondsPerKilometer,
                ActivityId = record.ActivityId
            };
        }
    }
}