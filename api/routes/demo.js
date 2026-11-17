const express = require('express');
const { authentifier, autoriser } = require('../middleware/auth');
const router = express.Router();

router.use(authentifier);

router.get('/admin',       autoriser('ADMINISTRATEUR'), (req, res) => res.json({ message: 'Espace administrateur' }));
router.get('/preparation', autoriser('PREPARATEUR'),    (req, res) => res.json({ message: 'Espace préparateur' }));
router.get('/livraison',   autoriser('LIVREUR'),        (req, res) => res.json({ message: 'Espace livreur' }));
router.get('/client',      autoriser('CLIENT'),         (req, res) => res.json({ message: 'Espace client' }));

module.exports = router;