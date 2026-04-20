'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_doc: {
        type: Sequelize.STRING
      },
      num_doc: {
        type: Sequelize.INTEGER
      },
      tipo_usuario: {
        type: Sequelize.STRING
      },
      fecha_nacimiento: {
        type: Sequelize.DATE
      },
      cod_sexo: {
        type: Sequelize.STRING
      },
      cod_pais_residencia: {
        type: Sequelize.STRING
      },
      cod_municipio_residencia: {
        type: Sequelize.STRING
      },
      incapacidad: {
        type: Sequelize.STRING
      },
      consecutivo: {
        type: Sequelize.STRING
      },
      cod_pais_origen: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('users');
  }
};