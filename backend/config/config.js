import { config } from 'dotenv';

config();

console.log(process.env.DB_PORT);
console.log(process.env.DB_USERNAME);
console.log('Server running on port', process.env.PORT);

export default {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT || 5432,
};