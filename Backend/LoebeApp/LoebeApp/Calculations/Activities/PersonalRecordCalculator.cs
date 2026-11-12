using LoebeApp.Models.Activities;
using LoebeApp.Models.Statistics;

namespace LoebeApp.Calculations.Activities
{
    public static class PersonalRecordCalculator
    {
        private static readonly int[] RecordDistancesMeters = [1_000, 3_000, 5_000, 10_000];

        public static List<PersonalRecord> CalculateCandidates(Activity activity)
        {
            var points = activity.GpsPoints;
            var distances = BuildCumulativeDistances(points);
            var candidates = new List<PersonalRecord>();

            foreach (var distanceMeters in RecordDistancesMeters)
            {
                var duration = FindFastestDurationMilliseconds(points, distances, distanceMeters);
                if (duration is null)
                {
                    continue;
                }

                candidates.Add(new PersonalRecord
                {
                    UserId = activity.UserId,
                    ActivityId = activity.Id,
                    DistanceMeters = distanceMeters,
                    DurationMilliseconds = duration.Value
                });
            }

            return candidates;
        }

        private static int? FindFastestDurationMilliseconds(
            IReadOnlyList<GpsPoint> points,
            double[] distances,
            int distanceMeters)
        {
            if (distances.Length < 2 || distances[^1] < distanceMeters)
            {
                return null;
            }

            var fastestMilliseconds = double.PositiveInfinity;
            var endIndex = 1;

            // Start ved et målt punkt, og estimér tiden ved målet.
            for (var startIndex = 0; startIndex < points.Count - 1; startIndex++)
            {
                var targetMeters = distances[startIndex] + distanceMeters;
                if (targetMeters > distances[^1])
                {
                    break;
                }

                while (distances[endIndex] < targetMeters)
                {
                    endIndex++;
                }

                var endTime = EstimateElapsedMilliseconds(points, distances, endIndex, targetMeters);
                var duration = endTime - points[startIndex].ElapsedMilliseconds;
                fastestMilliseconds = Math.Min(fastestMilliseconds, duration);
            }

            // Slut ved et målt punkt, og estimér tiden ved starten.
            var leftIndex = 0;
            for (var finishIndex = 1; finishIndex < points.Count; finishIndex++)
            {
                var targetMeters = distances[finishIndex] - distanceMeters;
                if (targetMeters < 0)
                {
                    continue;
                }

                while (distances[leftIndex + 1] <= targetMeters)
                {
                    leftIndex++;
                }

                var startTime = distances[leftIndex] == targetMeters
                    ? points[leftIndex].ElapsedMilliseconds
                    : EstimateElapsedMilliseconds(points, distances, leftIndex + 1, targetMeters);

                var duration = points[finishIndex].ElapsedMilliseconds - startTime;
                fastestMilliseconds = Math.Min(fastestMilliseconds, duration);
            }

            return fastestMilliseconds > 0
                ? Math.Max(1, (int)Math.Round(fastestMilliseconds))
                : null;
        }

        private static double[] BuildCumulativeDistances(IReadOnlyList<GpsPoint> points)
        {
            var distances = new double[points.Count];

            for (var i = 1; i < points.Count; i++)
            {
                var segmentMeters = GpsDistance.BetweenMeters(points[i - 1], points[i]);
                distances[i] = distances[i - 1] + segmentMeters;
            }

            return distances;
        }

        private static double EstimateElapsedMilliseconds(
            IReadOnlyList<GpsPoint> points,
            double[] distances,
            int rightIndex,
            double targetMeters)
        {
            var leftIndex = rightIndex - 1;
            var leftMeters = distances[leftIndex];
            var rightMeters = distances[rightIndex];
            var fraction = (targetMeters - leftMeters) / (rightMeters - leftMeters);

            var leftTime = points[leftIndex].ElapsedMilliseconds;
            var rightTime = points[rightIndex].ElapsedMilliseconds;

            return leftTime + fraction * (rightTime - leftTime);
        }
    }
}