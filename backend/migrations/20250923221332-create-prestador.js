'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prestador', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre_departamento: {
        type: Sequelize.STRING
      },
      cod_habilitacion: {
        type: Sequelize.STRING
      },
      nombre_prestador: {
        type: Sequelize.STRING
      },
      nit: {
        type: Sequelize.INTEGER
      },
      razon_social: {
        type: Sequelize.STRING
      },
      ese: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      fax: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      nivel: {
        type: Sequelize.INTEGER
      },
      carcter: {
        type: Sequelize.STRING
      },
      habilitado: {
        type: Sequelize.STRING
      },
      naju_nombre: {
        type: Sequelize.STRING
      },
      rep_legal: {
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
    await queryInterface.dropTable('prestador');
  }
};