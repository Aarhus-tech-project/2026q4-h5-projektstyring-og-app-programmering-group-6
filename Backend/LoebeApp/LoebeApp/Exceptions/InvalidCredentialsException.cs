namespace LoebeApp.Exceptions
{
    public class InvalidCredentialsException : Exception
    {
        public InvalidCredentialsException()
            : base("E-mail eller password er forkert.")
        {
        }
    }
}