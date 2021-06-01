const express = require("express");
const router = express.Router();

const truckController = require("../controllers/truckController");

router.post("/", truckController.create);

router.put("/:id", truckController.update);

router.delete("/:id", truckController.delete);

router.get("/all", truckController.get);

router.get("/getAllDrivers", truckController.getAllDrivers);

router.get("/getEntryPoints", truckController.getEntryPoints);

router.post("/editEntryPoints", truckController.editEntryPoints);

router.get("/:id", truckController.getById);

module.exports = router;
