import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Municipio extends Model {
    static associate(models) {
      // define association here
    }
  }
  Municipio.init({
    id_municipio: DataTypes.STRING,
    nom_municipio: DataTypes.STRING,
    codigo_dane: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Municipio',
    tableName: 'municipios',
    timestamps: true,
    paranoid: false,
    underscored: true,
  });
  return Municipio;
};
