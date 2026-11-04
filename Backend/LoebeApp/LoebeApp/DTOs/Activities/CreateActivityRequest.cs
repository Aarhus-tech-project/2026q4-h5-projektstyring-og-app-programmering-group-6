using System.ComponentModel.DataAnnotations;

namespace LoebeApp.DTOs.Activities
{
    public class CreateActivityRequest
    {
        public required Guid Id { get; set; }

        public required DateTimeOffset StartedAt { get; set; }

        [Range(0, int.MaxValue)]
        public required int DurationSeconds { get; set; }

        [Range(0, double.MaxValue)]
        public required double DistanceMeters { get; set; }

        [Required]
        public required List<GpsPointRequest> GpsPoints { get; set; }
    }
}