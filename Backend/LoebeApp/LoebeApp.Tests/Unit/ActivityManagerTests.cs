using LoebeApp.Managers.Activities;
using LoebeApp.Repositories.Activities;
using LoebeApp.Tests.Builders;
using NSubstitute;
using System.ComponentModel.DataAnnotations;

namespace LoebeApp.Tests.Unit
{
    public class ActivityManagerTests
    {
        [Fact]
        public async Task AddActivityAsync_GpsPointsOutOfOrder_ThrowsValidationException()
        {
            // Arrange
            var repository = Substitute.For<IActivityRepository>();
            var manager = new ActivityManager(repository);

            var request = new CreateActivityRequestBuilder().Build();
            request.GpsPoints.Reverse();

            // Act + Assert
            await Assert.ThrowsAsync<ValidationException>(
                () => manager.AddActivityAsync(request, userId: 1));
        }
    }
}