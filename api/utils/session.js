const jwt = require("jsonwebtoken");
const { Config } = require("../config/config");

const user = function (req) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, Config.jwtSecretKey);
  req.userData = decoded;
  return decoded.id;
};

const validateLogin = function (
  userConnectionTimes,
  username,
  res,
  alternativeMessage
) {
  if (userConnectionTimes[username] >= 2) {
    return res.status(401).json({
      error: "comuníquese con el administrador para obtener otra contraseña.",
      type: "popup",
    });
  } else if (alternativeMessage) {
    return res.status(401).json({
      error: alternativeMessage,
    });
  } else {
    return null;
  }
};

module.exports = {
  user,
  validateLogin,
};
