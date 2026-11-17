using System.ComponentModel.DataAnnotations;

namespace UniversParfumApi.DTOs;

public class UtilisateurDto
{
    [Required]
    public string Nom { get; set; } = string.Empty;

    [Required]
    public string Prenom { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    // Obligatoire à la création, facultatif à la modification (vide = mot de passe inchangé)
    public string? MotDePasse { get; set; }
}