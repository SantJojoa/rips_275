import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SystemUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SystemUser.hasMany(models.Control, { foreignKey: 'id_system_user' });
      SystemUser.belongsTo(models.Prestador, { foreignKey: 'id_prestador', as: 'prestador' });
    }
  }
  SystemUser.init({
    username: DataTypes.STRING,
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    cedula: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('SUPERADMIN', 'ADMIN', 'USER'),
    id_prestador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'prestadores', key: 'id' },
    },
  }, {
    sequelize,
    modelName: 'SystemUser',
    tableName: 'system_users',
    timestamps: true,
    paranoid: true,
    underscored: true, // <-- esto hace que Sequelize use created_at / updated_at
  });
  return SystemUser;
};