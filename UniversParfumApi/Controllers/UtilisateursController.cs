using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversParfumApi.Data;
using UniversParfumApi.DTOs;
using UniversParfumApi.Models;

namespace UniversParfumApi.Controllers;

[ApiController]
[Route("api/utilisateurs")]
[Authorize(Roles = "ADMINISTRATEUR")]
public class UtilisateursController : ControllerBase
{
    private static readonly string[] RolesAutorises =
        { "ADMINISTRATEUR", "PREPARATEUR", "LIVREUR" };

    private readonly UniversParfumContext _context;
    private readonly PasswordHasher<Utilisateur> _hasher = new();

    public UtilisateursController(UniversParfumContext context)
    {
        _context = context;
    }

    // GET api/utilisateurs
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var utilisateurs = await _context.Utilisateurs
            .OrderBy(u => u.Nom)
            .ToListAsync();

        return Ok(utilisateurs.Select(Projection));
    }

    // GET api/utilisateurs/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOne(int id)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);

        if (utilisateur == null)
            return NotFound(new { message = "Utilisateur introuvable." });

        return Ok(Projection(utilisateur));
    }

    // POST api/utilisateurs
    [HttpPost]
    public async Task<IActionResult> Create(UtilisateurDto dto)
    {
        if (!RolesAutorises.Contains(dto.Role))
            return BadRequest(new { message = "Rôle non autorisé." });

        if (string.IsNullOrWhiteSpace(dto.MotDePasse))
            return BadRequest(new { message = "Le mot de passe est obligatoire." });

        if (await EmailDejaUtilise(dto.Email))
            return Conflict(new { message = "Cet email est déjà utilisé." });

        var utilisateur = new Utilisateur
        {
            Nom = dto.Nom,
            Prenom = dto.Prenom,
            Email = dto.Email,
            Role = dto.Role
        };

        utilisateur.MotDePasse = _hasher.HashPassword(utilisateur, dto.MotDePasse);

        _context.Utilisateurs.Add(utilisateur);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne),
            new { id = utilisateur.Id }, Projection(utilisateur));
    }

    // PUT api/utilisateurs/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UtilisateurDto dto)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);

        if (utilisateur == null)
            return NotFound(new { message = "Utilisateur introuvable." });

        if (!RolesAutorises.Contains(dto.Role))
            return BadRequest(new { message = "Rôle non autorisé." });

        if (id == AdministrateurConnecte() && dto.Role != "ADMINISTRATEUR")
            return BadRequest(new { message = "Vous ne pouvez pas retirer votre propre rôle d'administrateur." });

        if (await _context.Utilisateurs.AnyAsync(u => u.Email == dto.Email && u.Id != id))
            return Conflict(new { message = "Cet email est déjà utilisé." });

        utilisateur.Nom = dto.Nom;
        utilisateur.Prenom = dto.Prenom;
        utilisateur.Email = dto.Email;
        utilisateur.Role = dto.Role;

        if (!string.IsNullOrWhiteSpace(dto.MotDePasse))
            utilisateur.MotDePasse = _hasher.HashPassword(utilisateur, dto.MotDePasse);

        await _context.SaveChangesAsync();

        return Ok(Projection(utilisateur));
    }

    // DELETE api/utilisateurs/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id == AdministrateurConnecte())
            return BadRequest(new { message = "Vous ne pouvez pas supprimer votre propre compte." });

        var utilisateur = await _context.Utilisateurs.FindAsync(id);

        if (utilisateur == null)
            return NotFound(new { message = "Utilisateur introuvable." });

        _context.Utilisateurs.Remove(utilisateur);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // Une clé étrangère l'empêche : cet utilisateur a des commandes, parfums ou historiques liés.
            return Conflict(new
            {
                message = "Suppression impossible : cet utilisateur est lié à d'autres données."
            });
        }

        return NoContent();
    }

    private async Task<bool> EmailDejaUtilise(string email)
    {
        return await _context.Utilisateurs.AnyAsync(u => u.Email == email);
    }

    // Ne renvoie jamais le mot de passe haché.
    private static object Projection(Utilisateur u) => new
    {
        u.Id,
        u.Nom,
        u.Prenom,
        u.Email,
        u.Role
    };

    private int? AdministrateurConnecte()
    {
        var valeur = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(valeur, out int id) ? id : null;
    }
}