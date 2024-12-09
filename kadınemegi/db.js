const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('PostgreSQL veritabanına başarılı bir şekilde bağlanıldı.');
});

pool.on('error', (err, client) => {
  console.error('Veritabanı bağlantı hatası:', err);
  process.exit(-1);
});

module.exports = pool;
