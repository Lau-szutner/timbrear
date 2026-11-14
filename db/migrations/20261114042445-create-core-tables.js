'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const id = {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    };
    const timestamps = {
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    };

    await queryInterface.createTable('Users', {
      id,
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      ...timestamps,
    });

    await queryInterface.createTable('Doorbells', {
      id,
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      token: { type: Sequelize.STRING(32), allowNull: false, unique: true },
      label: { type: Sequelize.STRING(100), allowNull: false },
      channel: { type: Sequelize.STRING(20), allowNull: true },
      channel_target: { type: Sequelize.STRING(255), allowNull: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps,
    });

    await queryInterface.createTable('Rings', {
      id,
      doorbell_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Doorbells', key: 'id' },
        onDelete: 'CASCADE',
      },
      type: { type: Sequelize.ENUM('visit', 'package'), allowNull: false },
      message: { type: Sequelize.STRING(280), allowNull: true },
      status: {
        type: Sequelize.ENUM('sent', 'acknowledged'),
        allowNull: false,
        defaultValue: 'sent',
      },
      ...timestamps,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Rings');
    await queryInterface.dropTable('Doorbells');
    await queryInterface.dropTable('Users');
  },
};
