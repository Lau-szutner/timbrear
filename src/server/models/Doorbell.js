import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Doorbell = sequelize.define(
  'Doorbell',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    channel: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    channel_target: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'Doorbells',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  },
);

export default Doorbell;
