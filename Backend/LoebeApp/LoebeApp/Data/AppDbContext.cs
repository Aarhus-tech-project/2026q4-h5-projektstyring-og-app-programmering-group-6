using Microsoft.EntityFrameworkCore;
using LoebeApp.Models.Users;
using LoebeApp.Models.Activities;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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
        }
    }
}