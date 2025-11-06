import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from 'sequelize';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable], dbConfig)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const db = {};

// 👇 Este cambio es CLAVE (usa `pathToFileURL`)
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js');

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);
  const module = await import(pathToFileURL(modelPath).href);
  const model = module.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;
}


// Asociaciones
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) db[modelName].associate(db);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;


export default db;
