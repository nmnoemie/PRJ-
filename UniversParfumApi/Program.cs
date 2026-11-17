
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UniversParfumApi.Data;
using UniversParfumApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// 1. CONFIGURATION JWT
// ========================================

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Clé JWT manquante dans la configuration."
    );

if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException(
        "La clé JWT doit contenir au moins 32 octets."
    );
}

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Issuer JWT manquant.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Audience JWT manquante.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        ),

        ClockSkew = TimeSpan.Zero
    };
});

// ========================================
// 2. AUTORISATION
// ========================================

builder.Services.AddAuthorization();

// ========================================
// 3. CONTROLLERS ET OPENAPI
// ========================================

builder.Services.AddControllers();

builder.Services.AddOpenApi();

// ========================================
// 4. CONNEXION SQL SERVER
// ========================================

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Chaîne de connexion SQL Server manquante."
    );

builder.Services.AddDbContext<UniversParfumContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// ========================================
// 5. CONSTRUCTION DE L'APPLICATION
// ========================================

var app = builder.Build();

// ========================================
// 6. CONFIGURATION OPENAPI
// ========================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ========================================
// 7. CRÉATION DU PREMIER ADMINISTRATEUR
// ========================================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var db = services.GetRequiredService<UniversParfumContext>();

        if (await db.Database.CanConnectAsync())
        {
            Console.WriteLine("Connexion SQL Server réussie.");

            bool existeUtilisateur =
                await db.Utilisateurs.AnyAsync();

            if (!existeUtilisateur)
            {
                var nom = builder.Configuration["Admin:Nom"]
                    ?? Environment.GetEnvironmentVariable("ADMIN_NOM");

                var prenom = builder.Configuration["Admin:Prenom"]
                    ?? Environment.GetEnvironmentVariable("ADMIN_PRENOM");

                var email = builder.Configuration["Admin:Email"]
                    ?? Environment.GetEnvironmentVariable("ADMIN_EMAIL");

                var password = builder.Configuration["Admin:Password"]
                    ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

                if (string.IsNullOrWhiteSpace(nom) ||
                    string.IsNullOrWhiteSpace(prenom) ||
                    string.IsNullOrWhiteSpace(email) ||
                    string.IsNullOrWhiteSpace(password))
                {
                    Console.WriteLine(
                        "Informations du premier administrateur manquantes."
                    );
                }
                else
                {
                    var admin = new Utilisateur
                    {
                        Nom = nom,
                        Prenom = prenom,
                        Email = email,
                        Role = "ADMINISTRATEUR"
                    };

                    var hasher = new PasswordHasher<Utilisateur>();

                    admin.MotDePasse = hasher.HashPassword(
                        admin,
                        password
                    );

                    db.Utilisateurs.Add(admin);

                    await db.SaveChangesAsync();

                    Console.WriteLine(
                        "Premier administrateur créé avec succès."
                    );
                }
            }
            else
            {
                Console.WriteLine(
                    "Des utilisateurs existent déjà. Aucun compte créé."
                );
            }
        }
        else
        {
            Console.WriteLine(
                "Impossible de se connecter à SQL Server."
            );
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(
            $"Erreur lors de l'initialisation SQL : {ex.Message}"
        );

        throw;
    }
}

// ========================================
// 8. MIDDLEWARE HTTP
// ========================================

app.UseHttpsRedirection();

// Sert wwwroot (login.html, CSS, JS) avant l'authentification
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();

app.UseAuthorization();

// ========================================
// 9. ROUTES DES CONTROLLERS
// ========================================

app.MapControllers();

// ========================================
// 10. DÉMARRAGE
// ========================================

app.Run();
