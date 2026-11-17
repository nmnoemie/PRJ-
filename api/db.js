require('dotenv').config();
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: { encrypt: false, trustServerCertificate: true },
};

if (process.env.DB_INSTANCE) config.options.instanceName = process.env.DB_INSTANCE;
else config.port = parseInt(process.env.DB_PORT || '1433');

const poolPromise = new sql.ConnectionPool(config).connect();

// Exemple : requete('SELECT * FROM utilisateur WHERE email = @email', { email })
async function requete(texte, params = {}) {
  const pool = await poolPromise;
  const request = pool.request();
  for (const [nom, valeur] of Object.entries(params)) request.input(nom, valeur);
  const result = await request.query(texte);
  return result.recordset;
}

module.exports = { sql, poolPromise, requete };