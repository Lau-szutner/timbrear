process.loadEnvFile('.env.local');

module.exports = {
  development: { url: process.env.DATABASE_URL, dialect: 'mysql' },
};
