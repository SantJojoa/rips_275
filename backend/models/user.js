import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsToMany(models.Transaccion, {
        through: {
          model: models.UserTransaction,
          timestamps: false
        },
        foreignKey: 'id_user',
        otherKey: 'id_transaction'
      });
      Users.hasMany(models.Consultas, { foreignKey: 'id_user' });
      Users.hasMany(models.Procedimiento, { foreignKey: 'id_user' });
      Users.hasMany(models.Hospitalizaciones, { foreignKey: 'id_user' });
      Users.hasMany(models.RecienNacido, { foreignKey: 'id_user' });
      Users.hasMany(models.Urgencias, { foreignKey: 'id_user' });
      Users.hasMany(models.Medicamento, { foreignKey: 'id_user' });
      Users.hasMany(models.OtroServicio, { foreignKey: 'id_user' });
    }
  }

  Users.init({
    tipo_doc: DataTypes.STRING,
    num_doc: DataTypes.STRING,
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
    paranoid: false,
    underscored: false,
  });

  return Users;
};
