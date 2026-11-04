namespace LoebeApp.DTOs.Auth
{
    public class LoginResponse
    {
        public required string AccessToken { get; set; }

        public  required DateTime ExpiresAtUtc { get; set; }
    }
}
