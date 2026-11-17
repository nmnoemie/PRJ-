const express = require('express');
const { requete } = require('../db');
const { authentifier, autoriser } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Lister les commandes PAYEE ou EN_PREPARATION
router.get('/', authentifier, autoriser('PREPARATEUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const commandes = await requete(`
    SELECT c.id, c.statut, c.date_creation, c.montant_total, u.nom, u.prenom
    FROM commande c
    JOIN client cl ON c.client_id = cl.id
    JOIN utilisateur u ON cl.id = u.id
    WHERE c.statut IN ('PAYEE', 'EN_PREPARATION')
    ORDER BY c.date_creation ASC
  `);
  
  // Pour chaque commande, on récupère les lignes
  for (let c of commandes) {
    c.lignes = await requete(`
      SELECT lc.id, lc.parfum_ref AS reference, p.nom, lc.quantite, lc.indisponible
      FROM ligne_commande lc
      JOIN parfum p ON lc.parfum_ref = p.reference
      WHERE lc.commande_id = @id
    `, { id: c.id });
  }
  
  res.json(commandes);
}));

// Prendre en charge (PAYEE -> EN_PREPARATION)
router.post('/:id/prendre', authentifier, autoriser('PREPARATEUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const id = req.params.id;
  const preparateurId = req.user.id;
  
  await requete(`
    UPDATE commande SET statut = 'EN_PREPARATION', preparateur_id = @prepa 
    WHERE id = @id AND statut = 'PAYEE'
  `, { id, prepa: preparateurId });
  
  await requete(`
    INSERT INTO historique_statut (commande_id, ancien_statut, nouveau_statut, date_heure, auteur_id)
    VALUES (@id, 'PAYEE', 'EN_PREPARATION', SYSDATETIME(), @prepa)
  `, { id, prepa: preparateurId });
  
  res.json({ message: 'Commande prise en charge' });
}));

// Marquer prête (EN_PREPARATION -> PRETE)
router.post('/:id/prete', authentifier, autoriser('PREPARATEUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const id = req.params.id;
  const preparateurId = req.user.id;
  
  await requete(`
    UPDATE commande SET statut = 'PRETE' 
    WHERE id = @id AND statut = 'EN_PREPARATION'
  `, { id });
  
  await requete(`
    INSERT INTO historique_statut (commande_id, ancien_statut, nouveau_statut, date_heure, auteur_id)
    VALUES (@id, 'EN_PREPARATION', 'PRETE', SYSDATETIME(), @prepa)
  `, { id, prepa: preparateurId });
  
  res.json({ message: 'Commande prête pour livraison' });
}));

// Signaler une rupture sur une ligne
router.post('/:id/lignes/:ligneId/rupture', authentifier, autoriser('PREPARATEUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const { id, ligneId } = req.params;
  const { motif } = req.body;
  
  await requete('UPDATE ligne_commande SET indisponible = 1 WHERE id = @ligneId', { ligneId });
  
  await requete(`
    INSERT INTO incident (commande_id, type, motif, date_heure)
    VALUES (@id, 'RUPTURE', @motif, SYSDATETIME())
  `, { id, motif: motif || 'Rupture de stock signalée' });
  
  res.json({ message: 'Rupture signalée' });
}));

module.exports = router;