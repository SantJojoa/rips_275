'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hospitalizaciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hospitalizaciones.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }
  Hospitalizaciones.init({
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Hospitalizaciones',
    tableName: 'hospitalizaciones',
    timestamps: true,
    paranoid: true,
    underscore: true,
  });
  return Hospitalizaciones;
};