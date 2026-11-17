using System.ComponentModel.DataAnnotations;

namespace UniversParfumApi.DTOs;

public class ParfumDto
{
    [Required]
    public string Reference { get; set; } = string.Empty;

    [Required]
    public string Nom { get; set; } = string.Empty;

    [Required]
    public string Marque { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int ContenanceMl { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Prix { get; set; }

    [Range(0, int.MaxValue)]
    public int StockDisponible { get; set; }
}