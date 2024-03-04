const express = require("express");
const { setvolumeBotInformation } = require("../controllers/volume.controller");
const router = express.Router();

router.post("/setvolumeBotInformation", setvolumeBotInformation);

module.exports = router;
