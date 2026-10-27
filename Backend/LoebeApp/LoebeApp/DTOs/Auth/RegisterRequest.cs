using System.ComponentModel.DataAnnotations;

namespace LoebeApp.DTOs

{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(10)]
        public required string Password { get; set; }
    }
}
