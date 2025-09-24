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
      Control.belongsTo(models.SystemUser, { foreignKey: 'id_system_users' });
      Control.belongsTo(models.Prestador, { foreignKey: 'id_prestador' });
    }
  }
  Control.init({
    fecha_registro: DataTypes.DATE,
    periodo_fac: DataTypes.INTEGER,
    año: DataTypes.INTEGER,
    route: DataTypes.TEXT,
    status: DataTypes.ENUM,
  }, {
    sequelize,
    modelName: 'Control',
    tableName: 'control',
    timestamps: false,
    paranoid: false,
    underscore: false,
  });
  return Control;
};