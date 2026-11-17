
using System.ComponentModel.DataAnnotations;

namespace UniversParfumApi.DTOs;

public class CreateAdminDto
{
    [Required]
    [MaxLength(100)]
    public string Nom { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Prenom { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(12)]
    public string MotDePasse { get; set; } = string.Empty;
}
