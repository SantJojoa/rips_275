import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class UserTransaction extends Model {
        static associate(models) {
            // associations can be defined here if needed
        }
    }

    UserTransaction.init({
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        id_transaction: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'transaccion',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'UserTransaction',
        tableName: 'user_transactions',
        timestamps: false, // This is important since we don't have timestamp columns
        underscored: true // This will make Sequelize use snake_case for column names
    });

    return UserTransaction;
};