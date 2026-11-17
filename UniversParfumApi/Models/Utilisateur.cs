
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversParfumApi.Models;

[Table("utilisateur")]
public class Utilisateur
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nom")]
    public string Nom { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("prenom")]
    public string Prenom { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("mot_de_passe")]
    public string MotDePasse { get; set; } = string.Empty;

    [MaxLength(20)]
    [Column("telephone")]
    public string? Telephone { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("role")]
    public string Role { get; set; } = string.Empty;
}
