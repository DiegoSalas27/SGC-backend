const db = require("../config/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/config");
const { validateLogin } = require("../utils/session");

const userConnectionTimes = {};

exports.userRegister = (req, res, next) => {
  const { nombre_usuario, contrasena, licencia_de_conducir } = req.body;
  var message = {};
  var sendMessage = false;

  db.select("*")
    .from("users")
    .where("nombre_usuario", nombre_usuario)
    .then((user) => {
      if (user[0]) {
        message["error"] = "El nombre de usuario ya existe";
        sendMessage = true;
      }

      if (nombre_usuario == "") {
        message["nombre_usuario"] = "El nombre de usuario es obligatorio";
        sendMessage = true;
      }

      if (contrasena.length < 6 && contrasena != "") {
        message["contrasena"] =
          "La contraseña debe contener al menos 6 caracteres";
        sendMessage = true;
      }
      if (contrasena == "") {
        message["contrasena"] = "La contraseña es obligatoria";
        sendMessage = true;
      }
      if (contrasena != contrasena) {
        message["contrasena"] = "Las contraseñas deben coincidir";
        sendMessage = true;
      }

      if (
        licencia_de_conducir &&
        licencia_de_conducir.length !== 0 &&
        licencia_de_conducir.length !== 9
      ) {
        message["licencia_de_conducir"] =
          "Licencia de conducir debe contener 9 caracteres";
        sendMessage = true;
      }

      if (req.body.rol_id === 2 && !licencia_de_conducir) {
        message["licencia_de_conducir"] = "Este campo es obligatorio";
        sendMessage = true;
      }

      if (sendMessage) {
        res.status(400).json(message);
      } else {
        bcrypt.hash(contrasena, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err,
            });
          } else {
            req.body.contrasena = hash;
            db("users")
              .returning("id")
              .insert(req.body)
              .then((user) => {
                res.status(200).json(user[0]);
              })
              .catch((err) => {
                console.log(err);
                message["nombre_usuario"] = "Ha ocurrido un error";
                res.status(400).json(message);
              });
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
      message["error"] = "Ha ocurrido un error";
      res.status(400).json(message);
    });
};

exports.userLogin = (req, res, next) => {
  const { username, password } = req.body;
  var message = {};

  if (!validateLogin(userConnectionTimes, username, res)) {
    userConnectionTimes[username] = !userConnectionTimes[username] ? 1 : 2;

    db.select("*")
      .from("Users")
      .where("nombre_usuario", username)
      .then((user) => {
        bcrypt.compare(password, user[0].contrasena, (error, result) => {
          if (error) {
            validateLogin(userConnectionTimes, username, res, error);
          }
          if (result) {
            const token = jwt.sign(
              {
                nombre_usuario: user[0].nombre_usuario,
                rol_id: user[0].rol_id,
                id: user[0].id,
              },
              Config.jwtSecretKey,
              {
                expiresIn: "12h",
              }
            );
            delete userConnectionTimes[username];

            return res.status(200).json({
              message: "Autenticación exitosa",
              token: token,
            });
          } else {
            validateLogin(
              userConnectionTimes,
              username,
              res,
              "Nombre de usuario o contraseña inválida"
            );
          }
        });
      })
      .catch((_) => {
        validateLogin(
          userConnectionTimes,
          username,
          res,
          "Nombre de usuario o contraseña inválida"
        );
      });
  }
};

exports.update = (req, res, next) => {
  const { nombre_usuario, contrasena, licencia_de_conducir } = req.body;
  var message = {};
  var sendMessage = false;

  db.select("*")
    .from("users")
    .where("id", req.params.id)
    .then((user) => {
      if (nombre_usuario == "") {
        message["nombre_usuario"] = "El nombre de usuario es obligatorio";
        sendMessage = true;
      }

      if (contrasena.length < 6 && contrasena != "") {
        message["contrasena"] =
          "La contraseña debe contener al menos 6 caracteres";
        sendMessage = true;
      }

      if (
        licencia_de_conducir &&
        licencia_de_conducir.length !== 0 &&
        licencia_de_conducir.length !== 9
      ) {
        message["licencia_de_conducir"] =
          "Licencia de conducir debe contener 9 números";
        sendMessage = true;
      }

      if (req.body.rol_id === 2 && !licencia_de_conducir) {
        message["licencia_de_conducir"] = "Este campo es obligatorio";
        sendMessage = true;
      }

      if (sendMessage) {
        res.status(400).json(message);
      } else {
        if (req.body.contrasena !== "") {
          bcrypt.hash(req.body.contrasena, 10, (err, hash) => {
            if (err) {
              res.status(500).json({
                error: err,
              });
            } else {
              req.body.contrasena = hash;
              db("users")
                .where("id", req.params.id)
                .update(req.body)
                .then((_) => {
                  res.status(200).json({
                    message: "Usuario actualizado",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  message["nombre_usuario"] = "Ha ocurrido un error";
                  res.status(400).json(message);
                });
            }
          });
        } else {
          delete req.body.contrasena;
          db("users")
            .where("id", req.params.id)
            .update(req.body)
            .then((_) => {
              res.status(200).json({
                message: "Usuario actualizado",
              });
            })
            .catch((err) => {
              console.log(err);
              message["nombre_usuario"] = "Ha ocurrido un error";
              res.status(400).json(message);
            });
        }
      }
    });
};

exports.delete = (req, res, next) => {
  db("users")
    .where({
      id: req.params.id,
    })
    .del()
    .then((_) => {
      res.status(200).json({
        message: "Usuario eliminado",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get = (req, res, next) => {
  db.select("*")
    .from("users")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.status(400).json("Ocurrió un problema"));
};

exports.getById = (req, res, next) => {
  db.select(
    "u.nombre AS nombre",
    "u.apellido AS apellido",
    "u.dni AS dni",
    "u.fecha_nacimiento AS fecha_nacimiento",
    "u.anio_ingreso AS anio_ingreso",
    "u.licencia_de_conducir AS licencia_de_conducir",
    "u.nombre_usuario AS nombre_usuario",
    "u.rol_id AS rol_id",
    "ca.placa AS camion_id",
    "ca.id AS camion_id_id"
  )
    .from("users AS u")
    .leftJoin("vehicles AS ca", "u.camion_id", "ca.id")
    .where({ "u.id": req.params.id })
    .then((user) => {
      res.status(200).json(user[0]);
    })
    .catch((err) => res.status(400).json("Ocurrió un problema"));
};
