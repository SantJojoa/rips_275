import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Prestador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prestador.hasMany(models.Control, { foreignKey: 'id_prestador' });
    }
  }
  Prestador.init({
    nombre_departamento: DataTypes.STRING,
    cod_habilitacion: DataTypes.STRING,
    nombre_prestador: DataTypes.STRING,
    nit: DataTypes.INTEGER,
    razon_social: DataTypes.STRING,
    ese: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    fax: DataTypes.INTEGER,
    email: DataTypes.STRING,
    nivel: DataTypes.INTEGER,
    carcter: DataTypes.STRING,
    habilitado: DataTypes.STRING,
    naju_nombre: DataTypes.STRING,
    rep_legal: DataTypes.STRING,
    muni_nombre: DataTypes.STRING,
    naju_codigo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Prestador',
    tableName: 'prestadores',
    timestamps: false,
    paranoid: false,
    underscored: false,
  });
  return Prestador;
};