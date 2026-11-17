const express = require('express');
const { requete } = require('../db');
const { authentifier, autoriser } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Lister les colis avec les infos du client ET du préparateur
router.get('/colis', authentifier, autoriser('LIVREUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const livreurId = req.user.id;
  
  const commandes = await requete(`
    SELECT c.id, c.statut, c.date_creation, c.montant_total, c.nb_tentatives_livraison,
           u_client.nom AS client_nom, u_client.prenom AS client_prenom, u_client.telephone AS client_tel, 
           cl.adresse_livraison,
           u_prepa.nom AS preparateur_nom, u_prepa.prenom AS preparateur_prenom
    FROM commande c
    JOIN client cl ON c.client_id = cl.id
    JOIN utilisateur u_client ON cl.id = u_client.id
    LEFT JOIN utilisateur u_prepa ON c.preparateur_id = u_prepa.id
    WHERE c.statut = 'PRETE' 
       OR (c.statut = 'EN_LIVRAISON' AND c.livreur_id = @livreurId)
    ORDER BY c.date_creation ASC
  `, { livreurId });
  
  res.json(commandes);
}));

// Récupérer le colis (PRETE -> EN_LIVRAISON)
router.post('/:id/recuperer', authentifier, autoriser('LIVREUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const id = req.params.id;
  const livreurId = req.user.id;
  
  await requete(`
    UPDATE commande SET statut = 'EN_LIVRAISON', livreur_id = @livreurId 
    WHERE id = @id AND statut = 'PRETE'
  `, { id, livreurId });
  
  await requete(`
    INSERT INTO historique_statut (commande_id, ancien_statut, nouveau_statut, date_heure, auteur_id)
    VALUES (@id, 'PRETE', 'EN_LIVRAISON', SYSDATETIME(), @livreurId)
  `, { id, livreurId });
  
  res.json({ message: 'Colis récupéré' });
}));

// Confirmer la remise (EN_LIVRAISON -> LIVREE)
router.post('/:id/livree', authentifier, autoriser('LIVREUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const id = req.params.id;
  const livreurId = req.user.id;
  
  await requete(`
    UPDATE commande SET statut = 'LIVREE' 
    WHERE id = @id AND statut = 'EN_LIVRAISON'
  `, { id });
  
  await requete(`
    INSERT INTO historique_statut (commande_id, ancien_statut, nouveau_statut, date_heure, auteur_id)
    VALUES (@id, 'EN_LIVRAISON', 'LIVREE', SYSDATETIME(), @livreurId)
  `, { id, livreurId });
  
  res.json({ message: 'Colis livré avec succès' });
}));

// Signaler un échec
router.post('/:id/echec', authentifier, autoriser('LIVREUR', 'ADMINISTRATEUR'), ah(async (req, res) => {
  const id = req.params.id;
  const livreurId = req.user.id;
  const { motif } = req.body;
  
  // Récupérer le nombre de tentatives actuelles
  const cmds = await requete('SELECT nb_tentatives_livraison FROM commande WHERE id = @id', { id });
  if (!cmds.length) return res.status(404).json({ message: 'Commande introuvable' });
  
  const tentative = cmds[0].nb_tentatives_livraison + 1;
  
  if (tentative > 3) {
    return res.status(409).json({ message: 'Nombre maximum de tentatives atteint' });
  }

  // Enregistrer la tentative
  await requete(`
    INSERT INTO tentative_livraison (commande_id, livreur_id, numero, reussie, motif_echec)
    VALUES (@id, @livreurId, @tentative, 0, @motif)
  `, { id, livreurId, tentative, motif });

  // Mettre à jour le compteur de la commande
  await requete('UPDATE commande SET nb_tentatives_livraison = @tentative WHERE id = @id', { id, tentative });

  // Si c'est la 3ème, on annule
  if (tentative === 3) {
    await requete("UPDATE commande SET statut = 'ANNULEE' WHERE id = @id", { id });
    await requete(`
      INSERT INTO historique_statut (commande_id, ancien_statut, nouveau_statut, date_heure, auteur_id)
      VALUES (@id, 'EN_LIVRAISON', 'ANNULEE', SYSDATETIME(), @livreurId)
    `, { id, livreurId });
  }

  res.json({ message: `Échec enregistré (tentative ${tentative}/3)` });
}));

module.exports = router;