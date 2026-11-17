using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversParfumApi.Models;

[Table("ligne_commande")]
public class LigneCommande
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("commande_id")]
    public int CommandeId { get; set; }

    [Column("parfum_ref")]
    public string ParfumRef { get; set; } = string.Empty;

    [Column("quantite")]
    public int Quantite { get; set; }

    [Column("prix_unitaire")]
    public decimal PrixUnitaire { get; set; }

    [Column("indisponible")]
    public bool Indisponible { get; set; }
}