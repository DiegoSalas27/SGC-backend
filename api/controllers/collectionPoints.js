const db = require("../config/connection");
const fetch = require("node-fetch");

exports.create = (req, res, next) => {
  var message = {};
  var sendMessage = false;

  for (const key in req.body) {
    if (
      req.body[key] === "" &&
      key !== "capacidad_actual" &&
      key !== "capacidad"
    ) {
      message[key] = `El campo ${key} es obligatorio`;
      sendMessage = true;
    }

    if (key === "capacidad_actual") {
      req.body[key] = +req.body[key];
    }
  }

  let {
    name,
    longitude,
    latitude,
    typePoint,
    camionId,
    capacidad,
    capacidad_actual,
    area,
    altura,
  } = req.body;

  capacidad = area * altura;

  if (sendMessage) {
    return res.status(400).json(message);
  } else {
    db("collectionPoints")
      .returning("id")
      .insert({
        nombre: name,
        longitud: longitude,
        latitud: latitude,
        tipo_punto: typePoint,
        camion_id: camionId,
        capacidad,
        capacidad_actual,
        area,
        altura,
      })
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
    if (
      req.body[key] === "" &&
      key !== "capacidad_actual" &&
      key !== "capacidad"
    ) {
      message[key] = `El campo ${key} es obligatorio`;
      sendMessage = true;
    }

    if (key === "capacidad_actual") {
      req.body[key] = +req.body[key];
    }
  }

  let {
    name,
    longitude,
    latitude,
    typePoint,
    camionId,
    capacidad,
    capacidad_actual,
    area,
    altura,
  } = req.body;

  capacidad = area * altura;

  const updateBody = {
    nombre: name,
    longitud: longitude,
    latitud: latitude,
    tipo_punto: typePoint,
    camion_id: camionId,
    capacidad,
    capacidad_actual,
    area,
    altura,
  };

  if (sendMessage) {
    return res.status(400).json(message);
  } else {
    db("collectionPoints")
      .where("id", req.params.id)
      .update(updateBody)
      .then((_) => {
        return res.status(200).json({
          message: "Punto de acopio actualizado",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("Ha ocurrido un error");
      });
  }
};

exports.delete = (req, res, next) => {
  db("collectionPoints")
    .where({
      id: req.params.id,
    })
    .del()
    .then((_) => {
      return res.status(200).json({
        message: "Punto de acopio eliminado",
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
  db.select("*")
    .from("collectionPoints")
    .then((collectionPoints) => {
      res.status(200).json(collectionPoints);
    })
    .catch((err) => res.status(400).json(err));
};

exports.getById = (req, res, next) => {
  db.select("*")
    .from("collectionPoints")
    .where({
      id: req.params.id,
    })
    .then((collectionPoints) => {
      res.status(200).json(collectionPoints[0]);
    })
    .catch((err) => res.status(400).json("Ocurrió un problema"));
};

exports.optimize = (req, res, next) => {
  fetch("http://localhost:5000/optimize", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(JSON.stringify(response, null, 4));
      return res.status(200).json({
        response,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json({
        message: "Ha ocurrido un error",
      });
    });
};

exports.getQueryParams = (req, res) => {
  let trash;
  db.select("*")
    .from("collectionPoints")
    .where({
      id: req.params.id,
    })
    .then((collectionPoints) => {
      trash = collectionPoints[0];

      const capacidad_actual =
        trash.area * (trash.altura - parseFloat(req.query.volume));

      db("collectionPoints")
        .where("id", req.params.id)
        .update({ capacidad_actual })
        .then((_) => {
          return res.status(200).json({
            message: "Punto de acopio actualizado",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json("Ha ocurrido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("Ocurrió un problema");
    });
};
