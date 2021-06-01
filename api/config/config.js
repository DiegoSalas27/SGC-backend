const config = require("../../config/config");

class Config {
  static get dbHost() {
    const host = this.get("DB_HOST");
    return host ? host : "localhost";
  }

  static get dbUsername() {
    const username = this.get("DB_USERNAME");
    return username ? username : "sa";
  }

  static get dbPassword() {
    const password = this.get("DB_PASSWORD");
    return password ? password : "root";
  }

  static get dbPort() {
    const port = this.get("DB_PORT");
    return port ? Number(port) : 3306;
  }

  static get dbName() {
    const name = this.get("DB_NAME");
    return name ? name : "SGC";
  }

  static get dbServer() {
    const name = this.get("DB_SERVER");
    return name ? name : "DESKTOP-0J4CAOC";
  }

  static get port() {
    const port = this.get("PORT");
    return port ? Number(port) : 8080;
  }

  static get jwtSecretKey() {
    const secret_key = this.get("JWT_KEY");
    return secret_key ? secret_key : "SGC7TUETuD2NRPM3local";
  }

  static get(key) {
    return config[key];
  }
}

module.exports = Config;
