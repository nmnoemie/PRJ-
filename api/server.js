require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES EXISTANTES ---
app.use('/api', require('./routes/auth')); // login, register, me
app.use('/api/espace', require('./routes/demo')); // (Optionnel, pour vos tests)
app.use('/api/parfums', require('./routes/parfums'));
app.use('/api/panier', require('./routes/panier'));

// --- NOUVELLES ROUTES À CRÉER ---
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/preparation', require('./routes/preparation'));
app.use('/api/livraison', require('./routes/livraison'));
app.use('/api/admin', require('./routes/admin'));

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err);
  // On renvoie le code d'erreur (409, 401, etc.) s'il existe, sinon 500
  const status = err.code || 500;
  const message = err.message || 'Erreur serveur';
  
  // On ne renvoie le détail technique que si on n'est pas en production
  const response = { message };
  if (process.env.NODE_ENV !== 'production') {
    response.detail = err.detail || err.message;
  }
  res.status(status).json(response);
});

app.listen(process.env.PORT, () => console.log(`API sur http://localhost:${process.env.PORT}`));