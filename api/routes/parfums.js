const express = require('express');
const { requete } = require('../db');
const { authentifier, autoriser } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next); // renvoie les erreurs au gestionnaire

// PUBLIC : liste (filtres ?marque= et ?prixMax=)
router.get('/', ah(async (req, res) => {
  const { marque, prixMax } = req.query;
  let texte = 'SELECT reference, nom, marque, contenance_ml, prix, stock_disponible FROM parfum WHERE 1=1';
  const params = {};
  if (marque)  { texte += ' AND marque = @marque';  params.marque = marque; }
  if (prixMax) { texte += ' AND prix <= @prixMax';  params.prixMax = parseFloat(prixMax); }
  texte += ' ORDER BY marque, nom';
  res.json(await requete(texte, params));
}));

// PUBLIC : détail
router.get('/:reference', ah(async (req, res) => {
  const rows = await requete(
    'SELECT reference, nom, marque, contenance_ml, prix, stock_disponible FROM parfum WHERE reference = @reference',
    { reference: req.params.reference }
  );
  if (!rows.length) return res.status(404).json({ message: 'Parfum introuvable' });
  res.json(rows[0]);
}));

// ADMIN : créer
router.post('/', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const { reference, nom, marque, contenance_ml, prix, stock_disponible = 0 } = req.body;
  if (!reference || !nom || !marque || !(contenance_ml > 0) || !(prix >= 0) || !(stock_disponible >= 0)) {
    return res.status(422).json({ message: 'Données invalides' });
  }
  const existe = await requete('SELECT reference FROM parfum WHERE reference = @reference', { reference });
  if (existe.length) return res.status(409).json({ message: 'Cette référence existe déjà' });

  await requete(
    `INSERT INTO parfum (reference, nom, marque, contenance_ml, prix, stock_disponible, administrateur_id)
     VALUES (@reference, @nom, @marque, @contenance_ml, @prix, @stock_disponible, @admin)`,
    { reference, nom, marque, contenance_ml, prix, stock_disponible, admin: req.user.id }
  );
  res.status(201).json({ message: 'Parfum créé', reference });
}));

// ADMIN : modifier (seulement les champs envoyés)
router.patch('/:reference', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  const autorises = ['nom', 'marque', 'contenance_ml', 'prix'];
  const champs = autorises.filter((c) => req.body[c] !== undefined);
  if (!champs.length) return res.status(422).json({ message: 'Aucun champ à modifier' });
  if (req.body.prix !== undefined && !(req.body.prix >= 0)) return res.status(422).json({ message: 'Prix invalide' });
  if (req.body.contenance_ml !== undefined && !(req.body.contenance_ml > 0)) return res.status(422).json({ message: 'Contenance invalide' });

  const params = { reference: req.params.reference };
  champs.forEach((c) => (params[c] = req.body[c]));
  const rows = await requete(
    `UPDATE parfum SET ${champs.map((c) => `${c} = @${c}`).join(', ')}
     OUTPUT INSERTED.reference WHERE reference = @reference`,
    params
  );
  if (!rows.length) return res.status(404).json({ message: 'Parfum introuvable' });
  res.json({ message: 'Parfum modifié' });
}));

// ADMIN ou PRÉPARATEUR : ajuster le stock
router.patch('/:reference/stock', authentifier, autoriser('ADMINISTRATEUR', 'PREPARATEUR'), ah(async (req, res) => {
  const { stock } = req.body;
  if (!Number.isInteger(stock) || stock < 0) return res.status(422).json({ message: 'Stock invalide' });
  const rows = await requete(
    'UPDATE parfum SET stock_disponible = @stock OUTPUT INSERTED.reference WHERE reference = @reference',
    { stock, reference: req.params.reference }
  );
  if (!rows.length) return res.status(404).json({ message: 'Parfum introuvable' });
  res.json({ message: 'Stock mis à jour', stock });
}));

// ADMIN : supprimer
router.delete('/:reference', authentifier, autoriser('ADMINISTRATEUR'), ah(async (req, res) => {
  try {
    const rows = await requete(
      'DELETE FROM parfum OUTPUT DELETED.reference WHERE reference = @reference',
      { reference: req.params.reference }
    );
    if (!rows.length) return res.status(404).json({ message: 'Parfum introuvable' });
    res.json({ message: 'Parfum supprimé' });
  } catch (e) {
    if (e.number === 547) { // clé étrangère : le parfum est dans des commandes
      return res.status(409).json({ message: 'Parfum présent dans des commandes : suppression impossible' });
    }
    throw e;
  }
}));

module.exports = router;