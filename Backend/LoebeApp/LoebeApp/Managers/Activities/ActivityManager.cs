using LoebeApp.Calculations.Activities;
using LoebeApp.DTOs.Activities;
using LoebeApp.DTOs.Statistics;
using LoebeApp.Exceptions;
using LoebeApp.Mappers.Activities;
using LoebeApp.Mappers.Statistics;
using LoebeApp.Repositories.Activities;
using System.ComponentModel.DataAnnotations;

namespace LoebeApp.Managers.Activities
{
    public class ActivityManager 
        ( IActivityRepository activityRepository)
        : IActivityManager
    {
        /// <inheritdoc/>
        /// <inheritdoc/>
        public async Task AddActivityAsync(CreateActivityRequest request, int userId)
        {
            ValidateActivityRequest(request);

            double? averagePaceSeconds = null;

            if (request.DistanceMeters > 0 && request.DurationSeconds > 0)
            {
                averagePaceSeconds = request.DurationSeconds / (request.DistanceMeters / 1000);
            }

            var activity = ActivityDtoToModel.Map(request, userId, averagePaceSeconds);
            var recordCandidates = PersonalRecordCalculator.CalculateCandidates(activity);

            await activityRepository.AddActivityAsync(activity, recordCandidates);
        }

        private static void ValidateActivityRequest(CreateActivityRequest request)
        {
            if (request.Id == Guid.Empty)
            {
                throw new ValidationException("Aktiviteten mangler et gyldigt id.");
            }

            var previousElapsedMilliseconds = -1;

            foreach (var point in request.GpsPoints)
            {
                if (point.ElapsedMilliseconds < previousElapsedMilliseconds)
                {
                    throw new ValidationException(
                        "GPS-punkterne skal være i tidsrækkefølge.");
                }

                previousElapsedMilliseconds = point.ElapsedMilliseconds;
            }

        }

        public async Task<List<ActivitySummaryResponse>> GetActivitiesByUserIdAsync(int userId)
        {
            var activities = await activityRepository.GetActivitiesByUserIdAsync(userId);

            var activitySummary = 
                activities.Select(activity => ActivitySummaryModelToDto.MapToSummary(activity)).ToList();

            return activitySummary;
        }

        /// <inheritdoc/>
        public async Task<ActivityDetailsResponse> GetActivityByIdAsync(Guid activityId, int userId)
        {
            var activity = await activityRepository.GetActivityByIdAsync(activityId, userId);

            if (activity is null)
            {
                throw new ActivityNotFoundException();
            }

            var activityDetails = ActivityModelToDto.MapToDetails(activity);

            return activityDetails;
        }

        /// <inheritdoc/>
        public async Task<ActivityStatisticsResponse> GetStatisticsAsync(int userId)
        {
            var statistics = await activityRepository.GetStatisticsAsync(userId);
            var personalRecords = new List<PersonalRecordResponse>();

            foreach (var record in statistics.PersonalRecords)
            {
                var durationSeconds = record.DurationMilliseconds / 1000.0;
                var distanceKilometers = record.DistanceMeters / 1000.0;
                var paceSecondsPerKilometer = durationSeconds / distanceKilometers;

                personalRecords.Add(
                    ActivityStatisticsModelToDto.MapPersonalRecord(record, paceSecondsPerKilometer));
            }

            return ActivityStatisticsModelToDto.Map(statistics, personalRecords);
        }
    }
}
