
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using UniversParfumApi.Data;
using UniversParfumApi.DTOs;
using UniversParfumApi.Models;

namespace UniversParfumApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UniversParfumContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<Utilisateur> _hasher = new();

    public AuthController(
        UniversParfumContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Utilisateurs
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return Unauthorized(new {
                message = "Email ou mot de passe incorrect."
            });

        var result = _hasher.VerifyHashedPassword(
            user, user.MotDePasse, dto.MotDePasse);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new {
                message = "Email ou mot de passe incorrect."
            });

        var jwt = _configuration.GetSection("Jwt");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwt["Key"]!));

        var credentials = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.GivenName, user.Prenom),
            new Claim(ClaimTypes.Surname, user.Nom)
        };

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                double.Parse(jwt["ExpirationMinutes"]!)),
            signingCredentials: credentials);

        return Ok(new
        {
            message = "Connexion réussie.",
            token = new JwtSecurityTokenHandler().WriteToken(token),
            role = user.Role,
            nom = user.Nom,
            prenom = user.Prenom
        });
    }

    [HttpGet("admin-test")]
    [Microsoft.AspNetCore.Authorization.Authorize(
        Roles = "ADMINISTRATEUR")]
    public IActionResult AdminTest()
    {
        return Ok(new {
            message = "Bienvenue dans votre espace administrateur."
        });
    }
}
