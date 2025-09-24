'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.changeColumn('system_users', 'role', {
      type: Sequelize.ENUM('USER', 'ADMIN'),
      allowNull: false,
      defaultValue: 'USER'
    }, { transaction: t });
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.changeColumn('system_users', 'role', {
      type: Sequelize.ENUM('USER', 'ADMIN'),
      allowNull: true,
      defaultValue: null
    }, { transaction: t });
  });
}
