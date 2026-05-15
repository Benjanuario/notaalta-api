const express = require("express");
const router = express.Router();

const secundarioController = require("../controllers/secundarioController");
const tecnicoController = require("../controllers/tecnicoController");
const universitarioController = require("../controllers/universitarioController");

router.post("/secundario/gerar-prompt", secundarioController.gerarPrompt);
router.post("/secundario/processar", secundarioController.processarJSON);

router.post("/tecnico/gerar-prompt", tecnicoController.gerarPrompt);
router.post("/tecnico/processar", tecnicoController.processarJSON);

router.post("/universitario/gerar-prompt", universitarioController.gerarPrompt);
router.post("/universitario/processar", universitarioController.processarJSON);

module.exports = router;
