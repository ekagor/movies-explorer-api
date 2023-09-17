require('dotenv').config();

const { SECRET_KEY = 'diplom-test' } = process.env;
const { PORT = 3000 } = process.env;
const { DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { NODE_ENV = 'production' } = process.env;
module.exports = {
  SECRET_KEY,
  PORT,
  DB_URL,
  NODE_ENV,
};