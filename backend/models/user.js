'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Transacciones, { foreignKey: 'id_user' });
      Users.hasMany(models.Consultas, { foreignKey: 'id_user' });
      Users.hasMany(models.Procedimiento, { foreignKey: 'id_user' });
      Users.hasMany(models.Hospitalizaciones, { foreignKey: 'id_user' });
      Users.hasMany(models.RecienNacidos, { foreignKey: 'id_user' });
      Users.hasMany(models.Urgencias, { foreignKey: 'id_user' });
      Users.hasMany(models.Medicamento, { foreignKey: 'id_user' });
      Users.hasMany(models.OtroServicio, { foreignKey: 'id_user' });


    }
  }
  Users.init({
    tipo_doc: DataTypes.STRING,
    num_doc: DataTypes.INTEGER,
    tipo_usuario: DataTypes.STRING,
    fecha_nacimiento: DataTypes.DATE,
    cod_sexo: DataTypes.STRING,
    cod_pais_residencia: DataTypes.STRING,
    cod_municipio_residencia: DataTypes.STRING,
    incapacidad: DataTypes.STRING,
    consecutivo: DataTypes.STRING,
    cod_pais_origen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscore: false,
  });
  return Users;
};