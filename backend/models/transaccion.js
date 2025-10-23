import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Transaccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaccion.belongsTo(models.Control, { foreignKey: 'id_control' });
      Transaccion.belongsToMany(models.Users, {
        through: {
          model: models.UserTransaction,
          timestamps: false
        },
        foreignKey: 'id_transaction',
        otherKey: 'id_user'
      });
    }
  }
  Transaccion.init({
    num_nit: DataTypes.INTEGER,
    num_factura: DataTypes.STRING,
    valor_factura: DataTypes.FLOAT,
    tipo_nota: DataTypes.STRING,
    num_nota: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaccion',
    tableName: 'transaccion',
    timestamps: true,
    paranoid: false,
    underscored: false,
  });
  return Transaccion;
};