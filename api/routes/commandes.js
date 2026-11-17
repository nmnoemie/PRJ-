const express = require('express');
const { requete, sql } = require('../db');
const { authentifier, autoriser } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Lister les commandes du client
router.get('/', authentifier, ah(async (req, res) => {
  let query = 'SELECT * FROM commande';
  const params = {};
  
  if (req.user.role === 'CLIENT') {
    query += ' WHERE client_id = @clientId';
    params.clientId = req.user.id;
  }
  // (Ajouter les filtres pour PREPARATEUR et LIVREUR ici si besoin)
  
  query += ' ORDER BY date_creation DESC';
  const commandes = await requete(query, params);
  res.json(commandes);
}));

// Payer une commande
router.post('/:id/paiement', authentifier, autoriser('CLIENT'), ah(async (req, res) => {
  const commandeId = req.params.id;
  const clientId = req.user.id;

  // 1. Vérifier que la commande est bien au client et en attente de paiement
  const commandes = await requete(
    "SELECT id FROM commande WHERE id = @commandeId AND client_id = @clientId AND statut = 'EN_ATTENTE_PAIEMENT'",
    { commandeId, clientId }
  );
  if (!commandes.length) return res.status(409).json({ message: 'Commande introuvable ou déjà payée' });

  // 2. Récupérer les lignes pour vérifier les stocks
  const lignes = await requete(
    `SELECT lc.reference, lc.quantite, p.stock_disponible, p.prix 
     FROM ligne_commande lc 
     JOIN parfum p ON p.reference = lc.reference 
     WHERE lc.commande_id = @commandeId`,
    { commandeId }
  );

  // 3. Vérifier les stocks
  for (const ligne of lignes) {
    if (ligne.stock_disponible < ligne.quantite) {
      return res.status(409).json({ message: `Stock insuffisant pour le parfum ${ligne.reference}` });
    }
  }

  // 4. Transaction SQL (idéalement, utiliser une transaction)
  // Ici, on fait les requêtes à la suite pour simplifier
  for (const ligne of lignes) {
    // Décrémenter le stock
    await requete(
      'UPDATE parfum SET stock_disponible = stock_disponible - @quantite WHERE reference = @reference',
      { quantite: ligne.quantite, reference: ligne.reference }
    );
  }

  // 5. Mettre à jour la commande et ajouter l'historique
  await requete(
    "UPDATE commande SET statut = 'PAYEE' WHERE id = @commandeId",
    { commandeId }
  );
  
  await requete(
    `INSERT INTO historique_commande (commande_id, ancien_statut, nouveau_statut, date_changement, auteur_id)
     VALUES (@commandeId, 'EN_ATTENTE_PAIEMENT', 'PAYEE', GETDATE(), @clientId)`,
    { commandeId, clientId }
  );

  // 6. Enregistrer le paiement
  await requete(
    `INSERT INTO paiement (commande_id, montant, date_paiement, mode)
     VALUES (@commandeId, @montant, GETDATE(), 'CARTE_SIMULEE')`,
    { commandeId, montant: req.body.montant || 0 }
  );

  res.json({ message: 'Paiement effectué avec succès' });
}));

module.exports = router;