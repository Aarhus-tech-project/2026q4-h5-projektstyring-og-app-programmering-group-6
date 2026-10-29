using LoebeApp.Data;
using LoebeApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LoebeApp.Repositories
{
    public class UserRepository 
        (AppDbContext context) 
        : IUserRepository 
    {
        /// <inheritdoc/>
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await context.Users
                .SingleOrDefaultAsync(user => user.Email == email);
        }

        /// <inheritdoc/>
        public async Task AddUserAsync(User user)
        {
            context.Users.Add(user);
            await context.SaveChangesAsync();
        }
    }
}
