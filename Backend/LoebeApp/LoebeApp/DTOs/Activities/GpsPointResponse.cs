namespace LoebeApp.DTOs.Activities
{
    public class GpsPointResponse
    {
        public required double Latitude { get; set; }

        public required double Longitude { get; set; }

        public required int ElapsedMilliseconds { get; set; }

        public required double AccuracyMeters { get; set; }
    }
}