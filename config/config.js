require("dotenv").config("../.env");

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  PORT: process.env.PORT,
  JWT_KEY: process.env.JWT_KEY,
};
