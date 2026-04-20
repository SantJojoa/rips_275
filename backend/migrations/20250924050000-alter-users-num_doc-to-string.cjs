'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Cambiar tipo de columna num_doc a STRING (VARCHAR)
        await queryInterface.changeColumn('users', 'num_doc', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Revertir a INTEGER si fuera necesario
        await queryInterface.changeColumn('users', 'num_doc', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    }
};


