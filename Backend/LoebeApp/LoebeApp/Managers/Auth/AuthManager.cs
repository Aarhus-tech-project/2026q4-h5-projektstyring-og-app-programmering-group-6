using LoebeApp.Models;
using LoebeApp.Repositories;
using LoebeApp.DTOs;
using LoebeApp.Exceptions;
using LoebeApp.Security;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LoebeApp.Managers
{
    public class AuthManager(
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher,
        ITokenProvider tokenProvider)
        : IAuthManager
    {
        /// <inheritdoc/>
        public async Task RegisterUserAsync(RegisterRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var password = request.Password;

            if (password.Length < 10 ||
                !password.Any(char.IsUpper) ||
                !password.Any(char.IsLower) ||
                !password.Any(char.IsDigit) ||
                !password.Any(c => !char.IsLetterOrDigit(c) && !char.IsWhiteSpace(c)))
            {
                throw new ValidationException(
                    "Password skal indeholde mindst 10 tegn, et stort bogstav, et lille bogstav, et tal og et specialtegn");
            }

            var existingUser = await userRepository.GetUserByEmailAsync(email);

            if (existingUser is not null)
            {
                throw new EmailAlreadyInUseException();
            }

            var user = new User
            {
                Email = email,
                PasswordHash = string.Empty
            };

            user.PasswordHash = passwordHasher.HashPassword(user, password);

            await userRepository.AddUserAsync(user);
        }

        /// <inheritdoc/>
        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();

            var user = await userRepository.GetUserByEmailAsync(email);

            if (user is null)
            {
                throw new InvalidCredentialsException();
            }

            var verificationResult = passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                throw new InvalidCredentialsException();
            }

            LoginResponse response = tokenProvider.CreateToken(user);

            return response;

        }
    }
}
