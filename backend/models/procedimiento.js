import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Procedimiento extends Model {
    static associate(models) {
      // Usa exactamente el nombre que exportaste en models/index.js
      Procedimiento.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }

  Procedimiento.init({
    tipo_doc_user: DataTypes.STRING,
    num_doc_user: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Procedimiento',
    tableName: 'procedimientos',
    timestamps: true,
    paranoid: false,
    underscored: false, // <--- corregido
  });

  return Procedimiento;
};
