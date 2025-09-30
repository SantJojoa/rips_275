'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consultas extends Model {
    static associate(models) {
      // define asociación con Users
      Consultas.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }

  // Usa el mismo nombre de la clase
  Consultas.init({
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Consultas',
    tableName: 'consultas',
    timestamps: true,
    underscored: false,
  });

  return Consultas;
};
