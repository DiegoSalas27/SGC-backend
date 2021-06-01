const db = require("../config/connection");

exports.create = (req, res, next) => {
  const { nombre } = req.body;
  var message = {};
  var sendMessage = false;

  if (nombre == "") {
    message["nombre"] = "Nombre de rol es obligatoria";
    sendMessage = true;
  }

  if (sendMessage) {
    return res.status(400).json(message);
  } else {
    db("roles")
      .returning("id")
      .insert({
        nombre,
      })
      .then((role) => {
        return res.status(200).json(role[0]);
      })
      .catch((err) => {
        message["error"] = "Ha ocurrido un error";
        return res.status(400).json(message);
      });
  }
};

exports.update = (req, res, next) => {
  db("roles")
    .where("id", req.params.id)
    .update(req.body)
    .then(_ => {
      return res.status(200).json({
        message: "Datos del rol actualizado",
      });
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json("Ha ocurrido un error")
    });
};

exports.delete = (req, res, next) => {
  db("roles")
    .where({
      id: req.params.id,
    })
    .del()
    .then(_ => {
      return res.status(200).json({
        message: "Rol eliminado",
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
  db.select('*').from('roles')
  .then(roles => {
      res.status(200).json(roles);
  })
  .catch(err => res.status(400).json('Ocurrió un problema'));
}

exports.getById = (req, res, next) => {
  db.select('*').from('roles').where({
      'id': req.params.id,
  })
  .then(roles => {
      res.status(200).json(roles[0])
  })
  .catch(err => res.status(400).json('Ocurrió un problema'));
} 

