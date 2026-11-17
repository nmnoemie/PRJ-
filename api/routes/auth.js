const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, poolPromise, requete } = require('../db');
const { authentifier } = require('../middleware/auth');

const router = express.Router();

// Inscription : le rôle est TOUJOURS CLIENT
router.post('/register', async (req, res) => {
  const { nom, prenom, email, password, telephone, adresse } = req.body;
  if (!nom || !prenom || !email || !adresse || !password || password.length < 8) {
    return res.status(422).json({
      message: 'Données invalides (nom, prénom, email, adresse, mot de passe de 8 caractères minimum)',
    });
  }

  const existe = await requete('SELECT id FROM utilisateur WHERE email = @email', { email });
  if (existe.length) return res.status(409).json({ message: 'Email déjà utilisé' });

  const hash = await bcrypt.hash(password, 10);
  const pool = await poolPromise;
  const tx = new sql.Transaction(pool);
  await tx.begin();
  try {
    const r = await new sql.Request(tx)
      .input('nom', nom).input('prenom', prenom).input('email', email)
      .input('hash', hash).input('telephone', telephone || null)
      .query(`INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, telephone, role)
              OUTPUT INSERTED.id
              VALUES (@nom, @prenom, @email, @hash, @telephone, 'CLIENT')`);
    const id = r.recordset[0].id;

    await new sql.Request(tx)
      .input('id', sql.Int, id).input('adresse', adresse)
      .query('INSERT INTO client (id, adresse_livraison) VALUES (@id, @adresse)');

    await tx.commit();
    res.status(201).json({ message: 'Compte créé' });
  } catch (e) {
    await tx.rollback();
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const rows = await requete('SELECT * FROM utilisateur WHERE email = @email', { email });
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.mot_de_passe))) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, role: user.role, nom: user.nom, prenom: user.prenom });
});

// Qui suis-je ?
router.get('/me', authentifier, async (req, res) => {
  const rows = await requete(
    'SELECT id, nom, prenom, email, telephone, role FROM utilisateur WHERE id = @id',
    { id: req.user.id }
  );
  res.json(rows[0]);
});

module.exports = router;