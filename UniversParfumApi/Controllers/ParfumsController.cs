using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversParfumApi.Data;
using UniversParfumApi.DTOs;
using UniversParfumApi.Models;

namespace UniversParfumApi.Controllers;

[ApiController]
[Route("api/parfums")]
[Authorize(Roles = "ADMINISTRATEUR")]
public class ParfumsController : ControllerBase
{
    private readonly UniversParfumContext _context;

    public ParfumsController(UniversParfumContext context)
    {
        _context = context;
    }

    // GET api/parfums
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var parfums = await _context.Parfums.ToListAsync();
        return Ok(parfums);
    }

    // GET api/parfums/{reference}
    [HttpGet("{reference}")]
    public async Task<IActionResult> GetOne(string reference)
    {
        var parfum = await _context.Parfums.FindAsync(reference);

        if (parfum == null)
            return NotFound(new { message = "Parfum introuvable." });

        return Ok(parfum);
    }

    // POST api/parfums
    [HttpPost]
    public async Task<IActionResult> Create(ParfumDto dto)
    {
        bool existe = await _context.Parfums
            .AnyAsync(p => p.Reference == dto.Reference);

        if (existe)
            return Conflict(new { message = "Cette référence existe déjà." });

        var parfum = new Parfum
        {
            Reference = dto.Reference,
            Nom = dto.Nom,
            Marque = dto.Marque,
            ContenanceMl = dto.ContenanceMl,
            Prix = dto.Prix,
            StockDisponible = dto.StockDisponible,
            AdministrateurId = AdministrateurConnecte()
        };

        _context.Parfums.Add(parfum);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne),
            new { reference = parfum.Reference }, parfum);
    }

    // PUT api/parfums/{reference}
    [HttpPut("{reference}")]
    public async Task<IActionResult> Update(string reference, ParfumDto dto)
    {
        var parfum = await _context.Parfums.FindAsync(reference);

        if (parfum == null)
            return NotFound(new { message = "Parfum introuvable." });

        parfum.Nom = dto.Nom;
        parfum.Marque = dto.Marque;
        parfum.ContenanceMl = dto.ContenanceMl;
        parfum.Prix = dto.Prix;
        parfum.StockDisponible = dto.StockDisponible;

        await _context.SaveChangesAsync();

        return Ok(parfum);
    }

    // DELETE api/parfums/{reference}
    [HttpDelete("{reference}")]
    public async Task<IActionResult> Delete(string reference)
    {
        var parfum = await _context.Parfums.FindAsync(reference);

        if (parfum == null)
            return NotFound(new { message = "Parfum introuvable." });

        _context.Parfums.Remove(parfum);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Récupère l'id de l'admin connecté, présent dans le token JWT.
    private int? AdministrateurConnecte()
    {
        var valeur = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(valeur, out int id) ? id : null;
    }
}