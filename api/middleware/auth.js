const jwt = require('jsonwebtoken');

function authentifier(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Non connecté' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

// L'administrateur passe partout
function autoriser(...roles) {
  return (req, res, next) => {
    if (req.user.role === 'ADMINISTRATEUR' || roles.includes(req.user.role)) return next();
    res.status(403).json({ message: 'Accès refusé' });
  };
}

module.exports = { authentifier, autoriser };