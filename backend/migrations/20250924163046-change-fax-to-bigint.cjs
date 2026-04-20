'use strict';

export async function up(queryInterface, Sequelize) {
  // Cambiar telefono a BIGINT
  await queryInterface.sequelize.query(`
    ALTER TABLE prestadores
    ALTER COLUMN telefono TYPE BIGINT
    USING regexp_replace(telefono::text, '[^0-9]', '', 'g')::BIGINT;
  `);

  // Cambiar fax a BIGINT
  await queryInterface.sequelize.query(`
    ALTER TABLE prestadores
    ALTER COLUMN fax TYPE BIGINT
    USING regexp_replace(fax::text, '[^0-9]', '', 'g')::BIGINT;
  `);

  // Cambiar nit a BIGINT
  await queryInterface.sequelize.query(`
    ALTER TABLE prestadores
    ALTER COLUMN nit TYPE BIGINT
    USING regexp_replace(nit::text, '[^0-9]', '', 'g')::BIGINT;
  `);

  // Asegurar createdAt y updatedAt
  await queryInterface.changeColumn('prestadores', 'createdAt', {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('NOW()'),
  });

  await queryInterface.changeColumn('prestadores', 'updatedAt', {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('NOW()'),
  });
}

export async function down(queryInterface, Sequelize) {
  // Revertir cambios: volver a INTEGER
  await queryInterface.changeColumn('prestadores', 'telefono', {
    type: Sequelize.INTEGER,
  });

  await queryInterface.changeColumn('prestadores', 'fax', {
    type: Sequelize.INTEGER,
  });

  await queryInterface.changeColumn('prestadores', 'nit', {
    type: Sequelize.INTEGER,
  });
}
