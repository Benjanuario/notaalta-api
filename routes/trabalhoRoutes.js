const express = require("express");
const router = express.Router();
const trabalhoController = require("../controllers/trabalhoController");

router.post("/secundario", trabalhoController.gerarSecundario);
router.post("/tecnico", trabalhoController.gerarTecnico);
router.post("/universitario", trabalhoController.gerarUniversitario);

module.exports = router;
