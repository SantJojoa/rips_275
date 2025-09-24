'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RecienNacido extends Model {
    static associate(models) {
      // Usa exactamente el nombre exportado en index.js
      RecienNacido.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }

  RecienNacido.init({
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'RecienNacido',
    tableName: 'recien_nacidos',
    timestamps: true,
    paranoid: true,
    underscored: true, // <-- corregido
  });

  return RecienNacido;
};
