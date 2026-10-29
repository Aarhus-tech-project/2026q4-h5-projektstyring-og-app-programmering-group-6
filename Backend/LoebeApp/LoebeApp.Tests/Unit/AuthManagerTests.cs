using LoebeApp.Managers;
using LoebeApp.Models;
using LoebeApp.Repositories;
using LoebeApp.Security;
using LoebeApp.Tests.Builders;
using LoebeApp.Exceptions;
using Microsoft.AspNetCore.Identity;
using NSubstitute;
using System.ComponentModel.DataAnnotations;

namespace LoebeApp.Tests.Unit
{
    public class AuthManagerTests
    {
        [Theory]
        [InlineData("Aa1!")]               // For kort
        [InlineData("testpassword123!")]   // Mangler stort bogstav
        [InlineData("TESTPASSWORD123!")]   // Mangler lille bogstav
        [InlineData("TestPassword!!!")]    // Mangler tal
        [InlineData("TestPassword123")]    // Mangler specialtegn
        public async Task RegisterUserAsync_InvalidPassword_ThrowsValidationException(
            string password)
        {
            // Arrange
            var repository = Substitute.For<IUserRepository>();

            var manager = new AuthManager(
                repository,
                new PasswordHasher<User>(),
                Substitute.For<ITokenProvider>());

            var request = new RegisterRequestBuilder()
                .WithPassword(password)
                .Build();

            // Act + Assert
            await Assert.ThrowsAsync<ValidationException>(
                () => manager.RegisterUserAsync(request));
        }

        [Fact]
        public async Task LoginAsync_WrongPassword_ThrowsInvalidCredentialsException()
        {
            // Arrange
            var repository = Substitute.For<IUserRepository>();
            var passwordHasher = new PasswordHasher<User>();

            var user = new User
            {
                Id = 1,
                Email = "test@example.com",
                PasswordHash = string.Empty
            };

            user.PasswordHash = passwordHasher.HashPassword(
                user,
                "TestPassword123!");

            repository.GetUserByEmailAsync(user.Email)
                .Returns(Task.FromResult<User?>(user));

            var manager = new AuthManager(
                repository,
                passwordHasher,
                Substitute.For<ITokenProvider>());

            var request = new DTOs.LoginRequest
            {
                Email = user.Email,
                Password = "WrongPassword123!"
            };

            // Act + Assert
            await Assert.ThrowsAsync<InvalidCredentialsException>(
                () => manager.LoginAsync(request));
        }

        [Fact]
        public async Task LoginAsync_UnknownEmail_ThrowsInvalidCredentialsException()
        {
            // Arrange
            var repository = Substitute.For<IUserRepository>();

            var request = new DTOs.LoginRequest
            {
                Email = "unknown@example.com",
                Password = "TestPassword123!"
            };

            repository.GetUserByEmailAsync(request.Email)
                .Returns(Task.FromResult<User?>(null));

            var manager = new AuthManager(
                repository,
                new PasswordHasher<User>(),
                Substitute.For<ITokenProvider>());

            // Act + Assert
            await Assert.ThrowsAsync<InvalidCredentialsException>(
                () => manager.LoginAsync(request));
        }
    }
}