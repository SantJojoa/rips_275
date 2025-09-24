'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SystemUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SystemUser.hasMany(models.Control, { foreignKey: 'id_system_users' });
    }
  }
  SytemUser.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'SystemUser',
    tableName: 'system_users',
    timestamps: true,
    paranoid: true,
    underscore: true,
  });
  return SystemUser;
};