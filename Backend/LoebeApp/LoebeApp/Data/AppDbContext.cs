using Microsoft.EntityFrameworkCore;
using LoebeApp.Models;

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
                .ComplexCollection(activity => activity.GpsPoints)
                .ToJson("GpsPoints")
                .HasColumnType("jsonb");
        }
    }
}
