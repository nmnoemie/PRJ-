using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversParfumApi.Data;
using UniversParfumApi.DTOs;

namespace UniversParfumApi.Controllers;

[ApiController]
[Route("api/commandes")]
[Authorize(Roles = "ADMINISTRATEUR")]
public class CommandesController : ControllerBase
{
    private readonly UniversParfumContext _context;

    public CommandesController(UniversParfumContext context)
    {
        _context = context;
    }

    // GET api/commandes
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var commandes = await _context.Commandes
            .Include(c => c.Lignes)
            .OrderByDescending(c => c.DateCreation)
            .ToListAsync();

        return Ok(commandes);
    }

    // GET api/commandes/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOne(int id)
    {
        var commande = await _context.Commandes
            .Include(c => c.Lignes)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (commande == null)
            return NotFound(new { message = "Commande introuvable." });

        return Ok(commande);
    }
       

           // GET api/commandes/personnel
    [HttpGet("personnel")]
    public async Task<IActionResult> GetPersonnel()
    {
        var personnel = await _context.Utilisateurs
            .Where(u => u.Role == "PREPARATEUR" || u.Role == "LIVREUR")
            .Select(u => new { u.Id, u.Nom, u.Prenom, u.Role })
            .ToListAsync();

        return Ok(personnel);
    }




    // PUT api/commandes/5/statut
    [HttpPut("{id:int}/statut")]
    public async Task<IActionResult> ChangerStatut(int id, StatutCommandeDto dto)
    {
        var commande = await _context.Commandes
            .Include(c => c.Lignes)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (commande == null)
            return NotFound(new { message = "Commande introuvable." });

        // Vérifie que le préparateur existe bien et a le bon rôle
        if (dto.PreparateurId.HasValue)
        {
            var idPreparateur = dto.PreparateurId.Value;
            bool preparateurValide = await _context.Utilisateurs
                .AnyAsync(u => u.Id == idPreparateur && u.Role == "PREPARATEUR");

            if (!preparateurValide)
                return BadRequest(new { message = "Préparateur introuvable." });
        }

        // Vérifie que le livreur existe bien et a le bon rôle
        if (dto.LivreurId.HasValue)
        {
            var idLivreur = dto.LivreurId.Value;
            bool livreurValide = await _context.Utilisateurs
                .AnyAsync(u => u.Id == idLivreur && u.Role == "LIVREUR");

            if (!livreurValide)
                return BadRequest(new { message = "Livreur introuvable." });
        }

        commande.Statut = dto.Statut;
        commande.PreparateurId = dto.PreparateurId;
        commande.LivreurId = dto.LivreurId;

        await _context.SaveChangesAsync();

        return Ok(commande);
    }
}