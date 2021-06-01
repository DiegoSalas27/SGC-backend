const knex = require("knex");
const Config = require("./config");

const connection = {
  client: "mssql",
  connection: {
    host: Config.dbHost,
    user: Config.dbUsername,
    password: Config.dbPassword,
    database: Config.dbName,
    port: 1433 || Config.dbPort,
  },
};

const db = knex(connection);

module.exports = db;
