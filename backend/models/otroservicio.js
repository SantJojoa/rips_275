'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OtroServicios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OtroServicios.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }
  OtroServicio.init({
    id_user: DataTypes.INTEGER,
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'OtroServicio',
    tableName: 'otro_servicios',
    timestamps: true,
    paranoid: true,
    underscore: false,
  });
  return OtroServicios;
};