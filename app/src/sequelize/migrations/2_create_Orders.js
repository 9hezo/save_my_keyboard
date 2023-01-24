'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ownerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      workerId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      kinds: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      details: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT,
      },
      imageUrl: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      pickup: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
