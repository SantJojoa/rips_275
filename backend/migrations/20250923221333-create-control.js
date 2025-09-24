'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('control', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_system_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'system_users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      id_prestador: {
        type: Sequelize.INTEGER,
        references: {
          model: 'prestador',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      fecha_registro: {
        type: Sequelize.DATE
      },
      periodo_fac: {
        type: Sequelize.INTEGER
      },
      año: {
        type: Sequelize.INTEGER
      },
      route: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('ACT', 'INACT', 'ERROR')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Controls');
  }
};