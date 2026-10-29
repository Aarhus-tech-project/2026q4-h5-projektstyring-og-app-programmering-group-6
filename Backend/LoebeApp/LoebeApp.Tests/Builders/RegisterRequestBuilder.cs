using LoebeApp.DTOs;

namespace LoebeApp.Tests.Builders
{
    public class RegisterRequestBuilder
    {
        private string? _email = $"test-{Guid.NewGuid():N}@example.com";
        private string? _password = "TestPassword123!";

        public RegisterRequestBuilder WithEmail(string? email)
        {
            _email = email;
            return this;
        }

        public RegisterRequestBuilder WithPassword(string? password)
        {
            _password = password;
            return this;
        }

        public RegisterRequest Build()
        {
            return new RegisterRequest
            {
                Email = _email!,
                Password = _password!
            };
        }
    }
}