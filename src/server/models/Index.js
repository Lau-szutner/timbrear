import sequelize from '../config/database.js';
import User from './User.js';
import Doorbell from './Doorbell.js';
import Ring from './Ring.js';

User.hasMany(Doorbell, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Doorbell.belongsTo(User, { foreignKey: 'user_id' });

Doorbell.hasMany(Ring, { foreignKey: 'doorbell_id', onDelete: 'CASCADE' });
Ring.belongsTo(Doorbell, { foreignKey: 'doorbell_id' });

export { sequelize, User, Doorbell, Ring };
