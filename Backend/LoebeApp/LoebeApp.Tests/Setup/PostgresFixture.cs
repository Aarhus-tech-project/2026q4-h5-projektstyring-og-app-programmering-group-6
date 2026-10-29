using Testcontainers.PostgreSql;
using LoebeApp.Data;
using Microsoft.EntityFrameworkCore;

namespace LoebeApp.Tests.Setup
{
    public class PostgresFixture : IAsyncLifetime
    {
        private readonly PostgreSqlContainer _postgres =
            new PostgreSqlBuilder("postgres:18")
                .WithDatabase("loebeapp_tests")
                .Build();

        public string ConnectionString => _postgres.GetConnectionString();

        public async Task InitializeAsync()
        {
            await _postgres.StartAsync();

            await using var context = CreateContext();

            await context.Database.MigrateAsync();
        }

        public async Task DisposeAsync()
        {
            await _postgres.DisposeAsync();
        }

        public AppDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(ConnectionString)
                .Options;

            return new AppDbContext(options);
        }
    }
}