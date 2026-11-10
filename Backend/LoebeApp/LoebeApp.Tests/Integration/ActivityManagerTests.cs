using LoebeApp.DTOs.Activities;
using LoebeApp.Exceptions;
using LoebeApp.Managers.Activities;
using LoebeApp.Models.Users;
using LoebeApp.Repositories.Activities;
using LoebeApp.Tests.Builders;
using LoebeApp.Tests.Setup;

namespace LoebeApp.Tests.Integration
{
    public class ActivityManagerTests(PostgresFixture fixture)
        : IClassFixture<PostgresFixture>
    {
        [Fact]
        public async Task AddActivityAsync_ValidRequest_CanReadSavedRouteAndPace()
        {
            // Arrange
            await using var context = fixture.CreateContext();
            var user = new User
            {
                Email = $"activity-{Guid.NewGuid():N}@example.com",
                PasswordHash = "unused-in-this-test"
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var request = new CreateActivityRequestBuilder().Build();

            // Act
            var manager = new ActivityManager(new ActivityRepository(context));
            await manager.AddActivityAsync(request, user.Id);

            // Assert
            await using var verificationContext = fixture.CreateContext();
            var reader = new ActivityManager(new ActivityRepository(verificationContext));
            var savedActivity = await reader.GetActivityByIdAsync(request.Id, user.Id);

            Assert.Equal(request.Id, savedActivity.Id);
            Assert.Equal(400d, savedActivity.AveragePaceSeconds.GetValueOrDefault(), 6);
            Assert.Equal(
                new[] { 0, 2000 },
                savedActivity.GpsPoints.Select(point => point.ElapsedMilliseconds));
            Assert.Equal(56.154398, savedActivity.GpsPoints[1].Latitude);
        }

        [Fact]
        public async Task GetActivityByIdAsync_ActivityBelongsToAnotherUser_ThrowsNotFound()
        {
            // Arrange
            await using var context = fixture.CreateContext();

            var owner = new User
            {
                Email = $"owner-{Guid.NewGuid():N}@example.com",
                PasswordHash = "unused-in-this-test"
            };

            var otherUser = new User
            {
                Email = $"other-{Guid.NewGuid():N}@example.com",
                PasswordHash = "unused-in-this-test"
            };

            context.Users.AddRange(owner, otherUser);
            await context.SaveChangesAsync();

            var request = new CreateActivityRequestBuilder().Build();
            var manager = new ActivityManager(new ActivityRepository(context));
            await manager.AddActivityAsync(request, owner.Id);

            // Act + Assert
            await Assert.ThrowsAsync<ActivityNotFoundException>(
                () => manager.GetActivityByIdAsync(request.Id, otherUser.Id));
        }

        [Fact]
        public async Task GetActivitiesByUserIdAsync_ReturnsOnlyOwnActivities()
        {
            // Arrange
            await using var context = fixture.CreateContext();

            var owner = new User
            {
                Email = $"owner-{Guid.NewGuid():N}@example.com",
                PasswordHash = "unused-in-this-test"
            };

            var otherUser = new User
            {
                Email = $"other-{Guid.NewGuid():N}@example.com",
                PasswordHash = "unused-in-this-test"
            };

            context.Users.AddRange(owner, otherUser);
            await context.SaveChangesAsync();

            var builder = new CreateActivityRequestBuilder();
            var ownActivity = builder.Build();
            var otherActivity = builder.Build();

            var manager = new ActivityManager(new ActivityRepository(context));
            await manager.AddActivityAsync(ownActivity, owner.Id);
            await manager.AddActivityAsync(otherActivity, otherUser.Id);

            // Act
            var history = await manager.GetActivitiesByUserIdAsync(owner.Id);

            // Assert
            var activity = Assert.Single(history);
            Assert.Contains(history, activity => activity.Id == ownActivity.Id);
            Assert.DoesNotContain(history, activity => activity.Id == otherActivity.Id);
        }
    }
}