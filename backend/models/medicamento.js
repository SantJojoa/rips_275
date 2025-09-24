'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medicamento.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }
  Medicamento.init({
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Medicamento',
    tableName: 'medicamentos',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });
  return Medicamento;
};