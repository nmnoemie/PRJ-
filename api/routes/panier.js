const express = require('express');
const { requete } = require('../db');
const { authentifier, autoriser } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Récupérer le panier actif du client
router.get('/', authentifier, autoriser('CLIENT'), ah(async (req, res) => {
  const clientId = req.user.id;
  
  let commandes = await requete(
    "SELECT id, montant_total FROM commande WHERE client_id = @clientId AND statut = 'EN_ATTENTE_PAIEMENT'",
    { clientId }
  );
  
  if (!commandes.length) {
    return res.json({ id: null, lignes: [], total: 0 });
  }
  
  const commandeId = commandes[0].id;
  const lignes = await requete(
    `SELECT lc.id, lc.parfum_ref AS reference, p.nom, p.marque, lc.prix_unitaire, lc.quantite, p.stock_disponible, lc.indisponible
     FROM ligne_commande lc 
     JOIN parfum p ON p.reference = lc.parfum_ref 
     WHERE lc.commande_id = @commandeId`,
    { commandeId }
  );
  
  const total = lignes.reduce((acc, l) => acc + (l.prix_unitaire * l.quantite), 0);
  res.json({ id: commandeId, lignes, total });
}));

// Ajouter une ligne au panier
router.post('/lignes', authentifier, autoriser('CLIENT'), ah(async (req, res) => {
  const { reference, quantite } = req.body;
  const clientId = req.user.id;
  
  // Vérifier le stock et récupérer le prix
  const parfums = await requete('SELECT prix, stock_disponible FROM parfum WHERE reference = @reference', { reference });
  if (!parfums.length) return res.status(404).json({ message: 'Parfum introuvable' });
  if (parfums[0].stock_disponible < quantite) return res.status(409).json({ message: 'Stock insuffisant' });

  // Trouver ou créer le panier
  let commandes = await requete(
    "SELECT id FROM commande WHERE client_id = @clientId AND statut = 'EN_ATTENTE_PAIEMENT'",
    { clientId }
  );
  
  let commandeId;
  if (!commandes.length) {
    const result = await requete(
      `INSERT INTO commande (client_id, statut, date_creation, montant_total) 
       OUTPUT INSERTED.id 
       VALUES (@clientId, 'EN_ATTENTE_PAIEMENT', SYSDATETIME(), 0)`,
      { clientId }
    );
    commandeId = result[0].id;
  } else {
    commandeId = commandes[0].id;
  }

  // Vérifier si la ligne existe déjà
  const lignes = await requete(
    'SELECT id, quantite FROM ligne_commande WHERE commande_id = @commandeId AND parfum_ref = @reference',
    { commandeId, reference }
  );

  if (lignes.length) {
    await requete(
      'UPDATE ligne_commande SET quantite = quantite + @quantite WHERE id = @id',
      { quantite, id: lignes[0].id }
    );
  } else {
    await requete(
      'INSERT INTO ligne_commande (commande_id, parfum_ref, quantite, prix_unitaire) VALUES (@commandeId, @reference, @quantite, @prix)',
      { commandeId, reference, quantite, prix: parfums[0].prix }
    );
  }

  res.status(201).json({ message: 'Ligne ajoutée' });
}));

// Modifier la quantité d'une ligne
router.patch('/lignes/:id', authentifier, autoriser('CLIENT'), ah(async (req, res) => {
  const { quantite } = req.body;
  const ligneId = req.params.id;
  
  if (quantite <= 0) {
    await requete('DELETE FROM ligne_commande WHERE id = @ligneId', { ligneId });
    return res.json({ message: 'Ligne supprimée' });
  }

  const lignes = await requete(
    `SELECT lc.parfum_ref AS reference, p.stock_disponible 
     FROM ligne_commande lc 
     JOIN commande c ON c.id = lc.commande_id 
     JOIN parfum p ON p.reference = lc.parfum_ref
     WHERE lc.id = @ligneId AND c.client_id = @clientId`,
    { ligneId, clientId: req.user.id }
  );
  
  if (!lignes.length) return res.status(404).json({ message: 'Ligne introuvable' });
  if (lignes[0].stock_disponible < quantite) return res.status(409).json({ message: 'Stock insuffisant' });

  await requete('UPDATE ligne_commande SET quantite = @quantite WHERE id = @ligneId', { quantite, ligneId });
  res.json({ message: 'Quantité mise à jour' });
}));

// Supprimer une ligne
router.delete('/lignes/:id', authentifier, autoriser('CLIENT'), ah(async (req, res) => {
  await requete('DELETE FROM ligne_commande WHERE id = @id', { id: req.params.id });
  res.json({ message: 'Ligne supprimée' });
}));

module.exports = router;