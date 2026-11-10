namespace LoebeApp.Exceptions
{
    public class ActivityNotFoundException : Exception
    {
        public ActivityNotFoundException()
            : base("Aktiviteten blev ikke fundet.")
        {
        }
    }
}