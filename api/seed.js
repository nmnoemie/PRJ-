const bcrypt = require('bcrypt');
const { requete } = require('./db');

(async () => {
  try {
    const hash = await bcrypt.hash('Test1234!', 10);
    const comptes = [
      ['Admin', 'Test', 'admin@parfum.test', 'ADMINISTRATEUR'],
      ['Prepa', 'Test', 'prepa@parfum.test', 'PREPARATEUR'],
      ['Livreur', 'Test', 'livreur@parfum.test', 'LIVREUR'],
      ['Client', 'Test', 'client@parfum.test', 'CLIENT'],
    ];

    for (const [nom, prenom, email, role] of comptes) {
      const existe = await requete('SELECT id FROM utilisateur WHERE email = @email', { email });
      if (existe.length) continue;

      const r = await requete(
        `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role)
         OUTPUT INSERTED.id
         VALUES (@nom, @prenom, @email, @hash, @role)`,
        { nom, prenom, email, hash, role }
      );
      if (role === 'CLIENT') {
        await requete('INSERT INTO client (id, adresse_livraison) VALUES (@id, @adresse)', {
          id: r[0].id,
          adresse: '1 rue de Test, 75001 Paris',
        });
      }
    }
    console.log('Comptes créés (mot de passe : Test1234!)');
  } catch (e) {
    console.error('Erreur :', e.message);
  }
  process.exit();
})();