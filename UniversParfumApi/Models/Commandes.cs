using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversParfumApi.Models;

[Table("commande")]
public class Commande
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("date_creation")]
    public DateTime DateCreation { get; set; }

    [Column("statut")]
    public string Statut { get; set; } = string.Empty;

    [Column("montant_total")]
    public decimal MontantTotal { get; set; }

    [Column("nb_tentatives_livraison")]
    public byte NbTentativesLivraison { get; set; }

    [Column("client_id")]
    public int ClientId { get; set; }

    [Column("preparateur_id")]
    public int? PreparateurId { get; set; }

    [Column("livreur_id")]
    public int? LivreurId { get; set; }

    public List<LigneCommande> Lignes { get; set; } = new();
}