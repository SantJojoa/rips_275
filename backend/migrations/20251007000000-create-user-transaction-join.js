'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create the join table
        await queryInterface.createTable('user_transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            id_transaction: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'transaccion',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add index for better query performance
        await queryInterface.addIndex('user_transactions', ['id_user', 'id_transaction']);

        // Remove the old foreign key from transaccion table
        await queryInterface.removeColumn('transaccion', 'id_user');
    },

    async down(queryInterface, Sequelize) {
        // Add back the old foreign key
        await queryInterface.addColumn('transaccion', 'id_user', {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Drop the join table
        await queryInterface.dropTable('user_transactions');
    }
};