const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const collectionPointsRoutes = require("./api/routes/collectionPoints");
const roleRoutes = require("./api/routes/roles");
const truckRoutes = require("./api/routes/trucks");
const userRoutes = require("./api/routes/users");

app.use(bodyParser.json());
app.use(morgan("dev"));

// if (process.env.NODE_ENV === 'development') {
app.use(cors());
// } else {
//   app.use(cors({
//     origin: process.env.ORIGIN
//   }));
// }

app.use("/api/collectionPoints", collectionPointsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404; // route not found
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
