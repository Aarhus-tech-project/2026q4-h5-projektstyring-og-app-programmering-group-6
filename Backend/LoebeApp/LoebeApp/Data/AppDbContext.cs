using Microsoft.EntityFrameworkCore;
using LoebeApp.Models.Users;
using LoebeApp.Models.Activities;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using LoebeApp.Models.Statistics;

namespace LoebeApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<PersonalRecord> PersonalRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        { 
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();

            modelBuilder.Entity<Activity>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(activity => activity.UserId);

            modelBuilder.Entity<Activity>()
                .Property(activity => activity.GpsPoints)
                .HasConversion(
                    points => JsonSerializer.Serialize(points, (JsonSerializerOptions?)null),
                    json => JsonSerializer.Deserialize<List<GpsPoint>>(
                        json, (JsonSerializerOptions?)null) ?? new List<GpsPoint>())
                .HasColumnType("jsonb");

            modelBuilder.Entity<PersonalRecord>()
                .HasKey(record => new { record.UserId, record.DistanceMeters });

            modelBuilder.Entity<PersonalRecord>()
                .HasOne<Activity>()
                .WithMany()
                .HasForeignKey(record => record.ActivityId);
        }
    }
}