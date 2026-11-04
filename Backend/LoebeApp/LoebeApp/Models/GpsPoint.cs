namespace LoebeApp.Models
{
    public class GpsPoint
    {
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int ElapsedMilliseconds { get; set; }

        public double AccuracyMeters { get; set; }
    }
}