namespace LoebeApp.Exceptions
{
    public class EmailAlreadyInUseException : Exception
    {
        public EmailAlreadyInUseException() 
            : base("E-mail er allerede i brug.")
        {
        }
    }
}
