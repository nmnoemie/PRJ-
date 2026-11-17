const express = require('express');
const { requete } = require('../db');
const { authentifier, autoriser } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ==========================================
// 1. GESTION DES UTILISATEURS
// ==========================================
router.get('/utilisateurs', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const users = await requete('SELECT id, nom, prenom, email, role, telephone FROM utilisateur ORDER BY role, nom');
  res.json(users);
}));

router.post('/utilisateurs', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const { nom, prenom, email, password, role, telephone } = req.body;
  if (!['PREPARATEUR', 'LIVREUR'].includes(role)) {
    return res.status(422).json({ message: 'Rôle invalide.' });
  }
  const hash = password || 'Test1234!'; // Mot de passe par défaut pour la démo
  try {
    const result = await requete(`
      INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, telephone)
      OUTPUT INSERTED.id
      VALUES (@nom, @prenom, @email, @hash, @role, @telephone)
    `, { nom, prenom, email, hash, role, telephone });
    res.status(201).json({ message: 'Utilisateur créé', id: result[0].id });
  } catch (err) {
    if (err.number === 2627) return res.status(409).json({ message: 'Cet email existe déjà.' });
    throw err;
  }
}));

// ==========================================
// 2. GESTION DES PROMOTIONS
// ==========================================
router.get('/promotions', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const promos = await requete('SELECT * FROM promotion ORDER BY date_fin DESC');
  res.json(promos);
}));

router.post('/promotions', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const { code, pourcentage, date_debut, date_fin } = req.body;
  await requete(`
    INSERT INTO promotion (code, pourcentage, date_debut, date_fin)
    VALUES (@code, @pourcentage, @date_debut, @date_fin)
  `, { code, pourcentage, date_debut, date_fin });
  res.status(201).json({ message: 'Promotion créée' });
}));

// ==========================================
// 3. ZONES DE LIVRAISON
// ==========================================
router.get('/zones', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const zones = await requete('SELECT * FROM zone_livraison ORDER BY nom');
  res.json(zones);
}));

router.post('/zones', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const { nom, frais } = req.body;
  await requete(`
    INSERT INTO zone_livraison (nom, frais, actif)
    VALUES (@nom, @frais, 1)
  `, { nom, frais });
  res.status(201).json({ message: 'Zone créée' });
}));

// ==========================================
// 4. ARBITRAGE DES LITIGES
// ==========================================
router.post('/commandes/:id/arbitrer', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const { id } = req.params;
  const { commentaire } = req.body;
  
  // Annuler la commande
  await requete("UPDATE commande SET statut = 'ANNULEE' WHERE id = @id", { id });
  
  // Historique
  await requete(`
    INSERT INTO historique_statut (commande_id, ancien_statut, nouveau_statut, date_heure, auteur_id)
    VALUES (@id, 'EN_LIVRAISON', 'ANNULEE', SYSDATETIME(), @adminId)
  `, { id, adminId: req.user.id });

  // Incident
  await requete(`
    INSERT INTO incident (commande_id, type, motif, date_heure)
    VALUES (@id, 'LITIGE', @commentaire, SYSDATETIME())
  `, { id, commentaire: commentaire || 'Litige arbitré par l\'administrateur' });

  res.json({ message: 'Litige arbitré, commande annulée' });
}));

module.exports = router;