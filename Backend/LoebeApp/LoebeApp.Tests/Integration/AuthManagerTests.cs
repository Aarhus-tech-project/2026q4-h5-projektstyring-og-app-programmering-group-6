using LoebeApp.Configuration;
using LoebeApp.DTOs;
using LoebeApp.Exceptions;
using LoebeApp.Managers;
using LoebeApp.Models;
using LoebeApp.Repositories;
using LoebeApp.Security;
using LoebeApp.Tests.Builders;
using LoebeApp.Tests.Setup;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NSubstitute;

namespace LoebeApp.Tests.Integration
{
    public class AuthManagerTests(PostgresFixture fixture)
        : IClassFixture<PostgresFixture>
    {
        [Fact]
        public async Task RegisterUserAsync_ValidRequest_SavesUserWithHashedPassword()
        {
            // Arrange
            await using var context = fixture.CreateContext();

            var passwordHasher = new PasswordHasher<User>();
            var tokenProvider = Substitute.For<ITokenProvider>();

            var manager = new AuthManager(
                new UserRepository(context),
                passwordHasher,
                tokenProvider);

            var request = new RegisterRequestBuilder().Build();

            // Act
            await manager.RegisterUserAsync(request);

            // Assert
            await using var verificationContext = fixture.CreateContext();

            var savedUser = await verificationContext.Users
                .SingleAsync(user => user.Email == request.Email);

            Assert.True(savedUser.Id > 0);
            Assert.NotEqual(request.Password, savedUser.PasswordHash);

            var verification = passwordHasher.VerifyHashedPassword(
                savedUser,
                savedUser.PasswordHash,
                request.Password);

            Assert.NotEqual(PasswordVerificationResult.Failed, verification);
        }

        [Fact]
        public async Task RegisterUserAsync_ExistingEmail_ThrowsEmailAlreadyInUseException()
        {
            // Arrange
            await using var context = fixture.CreateContext();

            var manager = new AuthManager(
                new UserRepository(context),
                new PasswordHasher<User>(),
                Substitute.For<ITokenProvider>());

            var request = new RegisterRequestBuilder().Build();


            await manager.RegisterUserAsync(request);

            // Act + Assert
            await Assert.ThrowsAsync<EmailAlreadyInUseException>(
                () => manager.RegisterUserAsync(request));

            await using var verificationContext = fixture.CreateContext();

            var userCount = await verificationContext.Users
                .CountAsync(user => user.Email == request.Email);

            Assert.Equal(1, userCount);
        }

        [Fact]
        public async Task LoginAsync_CorrectCredentials_ReturnsToken()
        {
            // Arrange
            await using var context = fixture.CreateContext();

            var jwtOptions = Options.Create(new JwtOptions
            {
                Issuer = "LoebeApp.Tests",
                Audience = "LoebeApp.Tests",
                Key = new string('x', 64),
                ExpirationMinutes = 60
            });

            var manager = new AuthManager(
                new UserRepository(context),
                new PasswordHasher<User>(),
                new TokenProvider(jwtOptions));

            var registration = new RegisterRequestBuilder().Build();

            await manager.RegisterUserAsync(registration);

            var request = new LoginRequest
            {
                Email = registration.Email,
                Password = registration.Password
            };

            // Act
            LoginResponse response = await manager.LoginAsync(request);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(response.AccessToken));
            Assert.True(response.ExpiresAtUtc > DateTime.UtcNow);
        }
    }
}