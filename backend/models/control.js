'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Control extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Control.belongsTo(models.SystemUser, { foreignKey: 'id_system_user' });
      Control.belongsTo(models.Prestador, { foreignKey: 'id_prestador' });
    }
  }
  Control.init({
    id_system_user: DataTypes.INTEGER,
    id_prestador: DataTypes.INTEGER,
    numero_radicado: DataTypes.STRING,
    periodo_fac: DataTypes.INTEGER,
    año: DataTypes.INTEGER,
    route: DataTypes.TEXT,
    status: DataTypes.ENUM('ACT', 'INACT', 'ERROR'),
  }, {
    sequelize,
    modelName: 'Control',
    tableName: 'control',
    timestamps: true,
    paranoid: false,
    underscored: false,
    hooks: {
      beforeCreate: (control, options) => {
        // Inicializa vacío; se definirá luego con id real
        control.numero_radicado = null;
      },
      afterCreate: async (control, options) => {
        const year = control.createdAt ? new Date(control.createdAt).getFullYear() : new Date().getFullYear();
        const numero = `${year}-${control.id}`;
        await control.update({ numero_radicado: numero }, { transaction: options.transaction });
      }
    }
  });
  return Control;
};