using System.ComponentModel.DataAnnotations;

namespace UniversParfumApi.DTOs;

public class StatutCommandeDto
{
    [Required]
    public string Statut { get; set; } = string.Empty;

    public int? PreparateurId { get; set; }

    public int? LivreurId { get; set; }
}