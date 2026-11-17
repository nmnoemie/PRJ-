/**
 * api.js - Mode API RÉELLE
 */
(function () {
  "use strict";

  const USE_MOCK = false; // Mode API réelle
  const API_BASE = "http://localhost:3000/api";
  const TOKEN_KEY = "up_token";
  const USER_KEY = "up_user";

  // --- GESTION DU TOKEN ---
  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t) { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); }
  function getStoredUser() { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; }
  function setStoredUser(u) { u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY); }

  // --- APPEL FETCH GÉNÉRIQUE ---
  async function fetchAPI(endpoint, options = {}) {
    const headers = { "Content-Type": "application/json", ...options.headers };
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "Erreur serveur");
      error.code = response.status;
      throw error;
    }
    return data;
  }

  // --- FONCTIONS DE L'API ---
  const api = {
    // Auth
    async login(email, password) {
      const data = await fetchAPI("/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setToken(data.token);
      setStoredUser(data.user || { email, role: data.role, nom: data.nom, prenom: data.prenom });
      return data;
    },
    async register(userData) {
      const data = await fetchAPI("/register", { method: "POST", body: JSON.stringify(userData) });
      return data;
    },
    async me() {
      if (!getToken()) return null;
      return await fetchAPI("/me");
    },
    logout() { setToken(null); setStoredUser(null); },

    // Parfums
    async getParfums(filtres = {}) {
      const query = new URLSearchParams(filtres).toString();
      return await fetchAPI(`/parfums${query ? "?" + query : ""}`);
    },
    async getParfum(ref) { return await fetchAPI(`/parfums/${ref}`); },
    
    // Admin Parfums
    async createParfum(parfum) { return await fetchAPI("/parfums", { method: "POST", body: JSON.stringify(parfum) }); },
    async updateParfum(ref, data) { return await fetchAPI(`/parfums/${ref}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deleteParfum(ref) { return await fetchAPI(`/parfums/${ref}`, { method: "DELETE" }); },
    
    // Admin Utilisateurs (LA NOUVELLE LIGNE EST ICI)
    async getUtilisateurs() { return await fetchAPI("/admin/utilisateurs"); },

    // Panier
    async getPanier() { return await fetchAPI("/panier"); },
    async addToPanier(reference, quantite) { return await fetchAPI("/panier/lignes", { method: "POST", body: JSON.stringify({ reference, quantite }) }); },
    async updatePanierLigne(id, quantite) { return await fetchAPI(`/panier/lignes/${id}`, { method: "PATCH", body: JSON.stringify({ quantite }) }); },
    async deletePanierLigne(id) { return await fetchAPI(`/panier/lignes/${id}`, { method: "DELETE" }); },

    // Commandes
    async getCommandes() { return await fetchAPI("/commandes"); },
    async getCommande(id) { return await fetchAPI(`/commandes/${id}`); },
    async payerCommande(id, montant) { return await fetchAPI(`/commandes/${id}/paiement`, { method: "POST", body: JSON.stringify({ montant }) }); },
    
    // Preparation (à implémenter côté backend)
    async getPreparation() { return await fetchAPI("/preparation"); },
    async prendreEnCharge(id) { return await fetchAPI(`/preparation/${id}/prendre`, { method: "POST" }); },
    async marquerPrete(id) { return await fetchAPI(`/preparation/${id}/prete`, { method: "POST" }); },

    // Livraison (à implémenter côté backend)
    async getLivraisons() { return await fetchAPI("/livraison/colis"); },
    async recupererColis(id) { return await fetchAPI(`/livraison/${id}/recuperer`, { method: "POST" }); },
    async confirmerLivraison(id) { return await fetchAPI(`/livraison/${id}/livree`, { method: "POST" }); },
    async signalerEchec(id, motif) { return await fetchAPI(`/livraison/${id}/echec`, { method: "POST", body: JSON.stringify({ motif }) }); },

    // Helpers
    getUser() { return getStoredUser(); },
    isLoggedIn() { return !!getToken(); },
  };

  window.api = api;
})();