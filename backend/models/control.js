import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Control extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Control.belongsTo(models.SystemUser, { foreignKey: 'id_system_user' });
      Control.belongsTo(models.Prestador, { foreignKey: 'id_prestador' });
    }
  }
  Control.init({
    id_system_user: DataTypes.INTEGER,
    id_prestador: DataTypes.INTEGER,
    numero_radicado: DataTypes.STRING,
    periodo_fac: DataTypes.INTEGER,
    año: DataTypes.INTEGER,
    route: DataTypes.TEXT,
    status: DataTypes.ENUM('ACT', 'INACT', 'ERROR'),
  }, {
    sequelize,
    modelName: 'Control',
    tableName: 'control',
    timestamps: true,
    paranoid: false,
    underscored: false,
    hooks: {
      beforeCreate: (control, options) => {
        // Inicializa vacío; se definirá luego con id real
        control.numero_radicado = null;
      },
      afterCreate: async (control, options) => {
        console.log('[HOOK] Ejecutando afterCreate para control ID:', control.id);
        const year = control.createdAt ? new Date(control.createdAt).getFullYear() : new Date().getFullYear();
        const numero = `${year}-${control.id}`;
        console.log('[HOOK] Generando numero_radicado:', numero);
        await control.update({ numero_radicado: numero }, { transaction: options.transaction });
        console.log('[HOOK] numero_radicado actualizado correctamente');
      }
    }
  });
  return Control;
};