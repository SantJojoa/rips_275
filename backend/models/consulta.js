import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Consultas extends Model {
    static associate(models) {
      Consultas.belongsTo(models.Users, { foreignKey: 'id_user' });
    }
  }

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
