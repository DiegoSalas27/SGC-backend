const db = require("../config/connection");
const fs = require("fs");
const path = require("path");

exports.create = (req, res, next) => {
  var message = {};
  var sendMessage = false;

  for (const key in req.body) {
    if (req.body[key] === "" && key !== "capacidad_actual") {
      message[key] = `El campo ${key} es obligatorio`;
      sendMessage = true;
    }

    if (key === "capacidad_actual") {
      req.body[key] = +req.body[key];
    }

    if (
      key === "placa" &&
      (req.body[key].length < 2 || req.body[key].length > 6)
    ) {
      message[key] = `Este campo debe contener entre 2 a 6 dígitos`;
      sendMessage = true;
    }
  }

  if (sendMessage) {
    return res.status(400).json(message);
  } else {
    db("vehicles")
      .returning("id")
      .insert(req.body)
      .then((vehicle) => {
        return res.status(200).json(vehicle[0]);
      })
      .catch((err) => {
        message["error"] = "Ha ocurrido un error";
        return res.status(400).json(message);
      });
  }
};

exports.update = (req, res, next) => {
  var message = {};
  var sendMessage = false;

  for (const key in req.body) {
    if (req.body[key] === "" && key !== "capacidad_actual") {
      message[key] = `El campo ${key} es obligatorio`;
      sendMessage = true;
    }

    if (key === "capacidad_actual") {
      req.body[key] = +req.body[key];
    }

    if (
      key === "placa" &&
      (req.body[key].length < 2 || req.body[key].length > 6)
    ) {
      message[key] = `Este campo debe contener entre 2 a 6 dígitos`;
      sendMessage = true;
    }
  }

  if (sendMessage) {
    return res.status(400).json(message);
  } else {
    db("vehicles")
      .where("id", req.params.id)
      .update(req.body)
      .then((_) => {
        return res.status(200).json({
          message: "Datos del camión actualizado",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("Ha ocurrido un error");
      });
  }
};

exports.delete = (req, res, next) => {
  db("vehicles")
    .where({
      id: req.params.id,
    })
    .del()
    .then((_) => {
      return res.status(200).json({
        message: "Camión eliminado",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
};

exports.get = (req, res, next) => {
  if (req.query.available) {
    db.select("camion_id")
      .from("users")
      .then((users) => {
        let ids = users.map((user) => {
          if (user.camion_id !== null) {
            return user.camion_id;
          }
        });
        ids = ids.filter((id) => id != null && id != undefined);
        db.select("*")
          .from("vehicles")
          .whereNotIn("id", ids)
          .then((vehicles) => {
            res.status(200).json(vehicles);
          })
          .catch((err) => res.status(400).json("Ocurrió un problema"));
      })
      .catch((err) => res.status(400).json("Ocurrió un problema"));
  } else {
    db.select("*")
      .from("vehicles")
      .then((vehicles) => {
        res.status(200).json(vehicles);
      })
      .catch((err) => res.status(400).json("Ocurrió un problema"));
  }
};

exports.getEntryPoints = (req, res) => {
  const entryPoint = fs.readFileSync(
    path.join(__dirname, "../utils/entryPoint.json"),
    "utf8"
  );

  let parsedEntryPoint = JSON.parse(entryPoint);

  res.status(200).json(parsedEntryPoint);
};

exports.editEntryPoints = (req, res) => {
  fs.writeFileSync(
    path.join(__dirname, "../utils/entryPoint.json"),
    JSON.stringify(req.body)
  );
  res.status(200).json({ message: "punto de partida actualizado" });
};

exports.getAllDrivers = (req, res, next) => {
  const entryPoint = fs.readFileSync(
    path.join(__dirname, "../utils/entryPoint.json"),
    "utf8"
  );

  let parsedEntryPoint = JSON.parse(entryPoint);

  db.select("*")
    .from("users")
    .then((users) => {
      db.select("*")
        .from("vehicles")
        .then((vehicles) => {
          const vehiclesToSend = [];
          for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < vehicles.length; j++) {
              if (users[i].rol_id === 2) {
                if (users[i].camion_id === vehicles[j].id) {
                  vehicles[j].driver =
                    users[i].nombre + " " + users[i].apellido;
                  vehicles[j].lat = parsedEntryPoint.lat;
                  vehicles[j].lng = parsedEntryPoint.lng;
                  vehicles[j].id = users[i].id;
                  vehiclesToSend.push(vehicles[j]);
                }
              }
            }
          }
          res.status(200).json(vehiclesToSend);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

exports.getById = (req, res, next) => {
  db.select("*")
    .from("vehicles")
    .where({
      id: req.params.id,
    })
    .then((vehicles) => {
      res.status(200).json(vehicles[0]);
    })
    .catch((err) => res.status(400).json("Ocurrió un problema"));
};
