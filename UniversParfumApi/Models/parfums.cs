using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversParfumApi.Models;

[Table("parfum")]
public class Parfum
{
    [Key]
    [Column("reference")]
    public string Reference { get; set; } = string.Empty;

    [Required]
    [Column("nom")]
    public string Nom { get; set; } = string.Empty;

    [Required]
    [Column("marque")]
    public string Marque { get; set; } = string.Empty;

    [Column("contenance_ml")]
    public int ContenanceMl { get; set; }

    [Column("prix")]
    public decimal Prix { get; set; }

    [Column("stock_disponible")]
    public int StockDisponible { get; set; }

    [Column("administrateur_id")]
    public int? AdministrateurId { get; set; }
}