using LoebeApp.DTOs;

namespace LoebeApp.Managers
{
    public interface IAuthManager
    {
        /// <summary>
        /// Registers a user asynchronously.
        /// </summary>
        /// <param name="request">Registration information for the user.</param>
        /// <returns>A task that represents the asynchronous registration operation.</returns>
        Task RegisterUserAsync(RegisterRequest request);

        /// <summary>
        /// Authenticates a user using the specified login request.
        /// </summary>
        /// <param name="request">The login credentials and authentication data.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the login response.</returns>
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}
