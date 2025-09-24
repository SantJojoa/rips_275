'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Urgencias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 
      Urgencias.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }
  Urgencias.init({
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Urgencias',
    tableName: 'urgencias',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });
  return Urgencias;
};