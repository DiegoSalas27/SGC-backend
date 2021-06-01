const express = require("express");
const router = express.Router();

const collectionPointController = require("../controllers/collectionPoints");

router.post("/", collectionPointController.create);

router.put("/:id", collectionPointController.update);

router.delete("/:id", collectionPointController.delete);

router.get("/all", collectionPointController.get);

router.get("/:id", collectionPointController.getById);

router.post("/optimize", collectionPointController.optimize);

router.get("/sensor/:id", collectionPointController.getQueryParams);

module.exports = router;
