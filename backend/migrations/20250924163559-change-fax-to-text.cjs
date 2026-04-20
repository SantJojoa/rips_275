'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('prestadores', 'telefono', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('prestadores', 'fax', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('prestadores', 'nit', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('prestadores', 'telefono', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.changeColumn('prestadores', 'fax', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.changeColumn('prestadores', 'nit', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  }
};
