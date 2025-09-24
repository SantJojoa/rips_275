'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OtroServicio extends Model {
    static associate(models) {
      OtroServicio.belongsTo(models.Users, { foreignKey: 'id_user' });
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
    underscored: true, // <--- corregido
  });

  return OtroServicio;
};
