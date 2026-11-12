namespace LoebeApp.Models.Statistics
{
    public class PersonalRecord
    {
        public int UserId { get; set; }
        public int DistanceMeters { get; set; }
        public int DurationMilliseconds { get; set; }
        public Guid ActivityId { get; set; }
    }
}