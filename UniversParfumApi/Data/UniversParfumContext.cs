using Microsoft.EntityFrameworkCore;
using UniversParfumApi.Models;

namespace UniversParfumApi.Data;

public class UniversParfumContext : DbContext
{
    public UniversParfumContext(
        DbContextOptions<UniversParfumContext> options)
        : base(options)
    {
    }

    public DbSet<Utilisateur> Utilisateurs { get; set; }
    public DbSet<Parfum> Parfums { get; set; }
    public DbSet<Commande> Commandes { get; set; }
    public DbSet<LigneCommande> LignesCommande { get; set; }
}