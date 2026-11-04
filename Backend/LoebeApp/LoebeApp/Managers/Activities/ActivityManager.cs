using LoebeApp.DTOs.Activities;
using LoebeApp.Models;
using LoebeApp.Repositories.Activities;
using LoebeApp.Mappers.Activities;
using System.ComponentModel.DataAnnotations;

namespace LoebeApp.Managers.Activities
{
    public class ActivityManager 
        ( IActivityRepository activityRepository)
        : IActivityManager
    {
        /// <inheritdoc/>
        public async Task AddActivityAsync(CreateActivityRequest request, int userId)
        {
            ValidateActivityRequest(request);

            double? averagePaceSeconds = null;

            if (request.DistanceMeters > 0 && request.DurationSeconds > 0)
            {
                averagePaceSeconds = request.DurationSeconds / (request.DistanceMeters / 1000);
            }

            var activity = ActivityDtoToModel.Map(
                request, userId, averagePaceSeconds);

            await activityRepository.AddActivityAsync(activity);
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
    }
}
