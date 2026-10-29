using LoebeApp.Models;

namespace LoebeApp.Repositories
{
    public interface IUserRepository
    {
        /// <summary>
        /// Asynchronously gets a user by the specified email address.
        /// </summary>
        /// <param name="email">Email address used to find the user.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the matching user if found;
        /// otherwise, <see langword="null"/>.</returns>
        Task<User?> GetUserByEmailAsync(string email);

        /// <summary>
        /// Adds a user asynchronously.
        /// </summary>
        /// <param name="user">The user to add.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        Task AddUserAsync(User user);

 
    }
}
