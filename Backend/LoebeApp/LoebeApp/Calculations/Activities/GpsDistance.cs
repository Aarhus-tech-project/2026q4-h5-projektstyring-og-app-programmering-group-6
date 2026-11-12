using LoebeApp.Models.Activities;

namespace LoebeApp.Calculations.Activities
{
    public static class GpsDistance
    {
        public static double BetweenMeters(GpsPoint from, GpsPoint to)
        {
            const double earthRadiusMeters = 6_371_008.8;
            const double radiansPerDegree = Math.PI / 180;

            var fromLatitude = from.Latitude * radiansPerDegree;
            var toLatitude = to.Latitude * radiansPerDegree;
            var latitudeDifference = toLatitude - fromLatitude;
            var longitudeDifference = (to.Longitude - from.Longitude) * radiansPerDegree;

            var halfLatitudeSine = Math.Sin(latitudeDifference / 2);
            var halfLongitudeSine = Math.Sin(longitudeDifference / 2);

            var haversine = halfLatitudeSine * halfLatitudeSine
                + Math.Cos(fromLatitude) * Math.Cos(toLatitude)
                * halfLongitudeSine * halfLongitudeSine;

            return 2 * earthRadiusMeters * Math.Asin(Math.Sqrt(Math.Clamp(haversine, 0, 1)));
        }
    }
}