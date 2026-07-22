'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('control', 'numero_cuenta_cobro', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Único solo entre facturas activas: al desactivar una factura, su número
    // de cuenta de cobro queda libre para ser reutilizado.
    await queryInterface.addIndex('control', {
      fields: ['numero_cuenta_cobro'],
      unique: true,
      where: { status: 'ACT' },
      name: 'control_numero_cuenta_cobro_act_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('control', 'control_numero_cuenta_cobro_act_unique');
    await queryInterface.removeColumn('control', 'numero_cuenta_cobro');
  }
};
