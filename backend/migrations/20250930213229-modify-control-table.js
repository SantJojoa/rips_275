'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('control', 'fecha_registro');

    await queryInterface.addColumn('control', 'numero_radicado', {

      type: Sequelize.STRING,
      allowNull: true
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('control', 'numero_radicado');
    await queryInterface.addColumn('control', 'fecha_registro', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
