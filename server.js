require("dotenv").config();
const http = require("http");
const Config = require("./api/config/config");
const socketio = require("socket.io");
const app = require("./app");
const Sockets = require("./models/sockets");

const port = Config.port;
const server = http.createServer(app);
const io = socketio(server, {
  /* configuraciones */
});
new Sockets(io);

server.listen(8080, "127.0.0.1", () => {
  console.log(`Server running and listening on port 8080!`);
});
