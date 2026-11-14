import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ring = sequelize.define(
  'Ring',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('visit', 'package'),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(280),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('sent', 'acknowledged'),
      allowNull: false,
      defaultValue: 'sent',
    },
  },
  {
    tableName: 'Rings',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  },
);

export default Ring;
