/**
 * ui.js - Éléments d'interface communs (menu, notifications, formatage)
 */
(function () {
  "use strict";

  // Formatage des prix en euros
  window.formatPrix = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
  
  // Formatage des dates
  window.formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR") : "-";

  // Afficher une notification (toast)
  window.notifier = function (message, type = "info") {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = "toast show " + type;
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  // Injecter le menu de navigation dans le header
  window.injecterMenu = function (pageActive) {
    const header = document.querySelector("header");
    if (!header) return;

    const user = window.api ? window.api.getUser() : null;
    
    let liens = "";

    // 1. Liens publics (Visiteur non connecté ou Client)
    if (!user || user.role === "CLIENT") {
      liens += `<a href="index.html" ${pageActive === 'index' ? 'class="active"' : ''}>Accueil</a>`;
      liens += `<a href="catalogue.html" ${pageActive === 'catalogue' ? 'class="active"' : ''}>Catalogue</a>`;
    }

    // 2. Liens spécifiques selon le rôle
    if (user) {
      if (user.role === "CLIENT") {
        liens += `<a href="panier.html" ${pageActive === 'panier' ? 'class="active"' : ''}>Panier</a>`;
        liens += `<a href="mes-commandes.html" ${pageActive === 'mes-commandes' ? 'class="active"' : ''}>Mes commandes</a>`;
      } else if (user.role === "PREPARATEUR") {
        liens += `<a href="preparation.html" ${pageActive === 'preparation' ? 'class="active"' : ''}>Espace Préparation</a>`;
      } else if (user.role === "LIVREUR") {
        liens += `<a href="livraison.html" ${pageActive === 'livraison' ? 'class="active"' : ''}>Espace Livraison</a>`;
      } else if (user.role === "ADMIN" || user.role === "ADMINISTRATEUR") {
        liens += `<a href="admin.html" ${pageActive === 'admin' ? 'class="active"' : ''}>Espace Admin</a>`;
      }
    }

    // 3. Menu de droite
    let navDroite = "";
    if (user) {
      navDroite = `<span class="user-info">${user.prenom} ${user.nom} (${user.role})</span>
                   <button class="btn btn-secondary btn-sm" onclick="window.api.logout(); window.location.href='index.html';">Déconnexion</button>`;
    } else {
      navDroite = `<a href="login.html" class="btn btn-primary btn-sm">Connexion</a>`;
    }

    // 4. Lien du logo (Adapté selon le rôle)
    // Un préparateur ne doit pas retourner sur l'accueil public en cliquant sur le logo
    let lienLogo = "index.html";
    if (user) {
      if (user.role === "PREPARATEUR") lienLogo = "preparation.html";
      else if (user.role === "LIVREUR") lienLogo = "livraison.html";
      else if (user.role === "ADMIN" || user.role === "ADMINISTRATEUR") lienLogo = "admin.html";
    }

    // Injection dans le header
    header.innerHTML = `
      <div class="container nav-container">
        <a href="${lienLogo}" class="logo">Univers Parfum</a>
        <nav class="main-nav">
          ${liens}
        </nav>
        <div class="nav-user" style="display: flex; align-items: center; gap: 10px;">
          ${navDroite}
        </div>
      </div>
    `;
  };
})();