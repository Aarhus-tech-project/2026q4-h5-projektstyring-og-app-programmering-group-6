using System.ComponentModel.DataAnnotations;

namespace LoebeApp.DTOs.Activities
{
    public class GpsPointRequest
    {
        [Range(-90, 90)]
        public required double Latitude { get; set; }

        [Range(-180, 180)]
        public required double Longitude { get; set; }

        [Range(0, int.MaxValue)]
        public required int ElapsedMilliseconds { get; set; }

        [Range(0, double.MaxValue)]
        public required double AccuracyMeters { get; set; }
    }
}