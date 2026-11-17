app.use('/api/parfums', require('./routes/parfums'));

// tout en bas, avant app.listen
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/auth'));
app.use('/api/espace', require('./routes/demo'));

// Gestionnaire d'erreurs (après les routes)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

app.listen(process.env.PORT, () => console.log(`API sur http://localhost:${process.env.PORT}`));