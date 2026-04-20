'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('system_users', 'nombres', {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'username'
        });

        await queryInterface.addColumn('system_users', 'apellidos', {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'nombres'
        });

        await queryInterface.addColumn('system_users', 'cedula', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
            after: 'apellidos'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('system_users', 'nombres');
        await queryInterface.removeColumn('system_users', 'apellidos');
        await queryInterface.removeColumn('system_users', 'cedula');
    }
};
