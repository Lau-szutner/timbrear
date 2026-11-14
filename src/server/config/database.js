import 'server-only';
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const globalForDb = globalThis;

const sequelize =
  globalForDb.sequelize ??
  new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sequelize = sequelize;
}

export default sequelize;
