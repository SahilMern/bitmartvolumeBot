const express = require("express");
const { setvolumeBotInformation } = require("../controllers/volume.controller");
const { startBot, stopBot } = require("../controllers/bot.controller");
const router = express.Router();

router.post("/setvolumeBotInformation", setvolumeBotInformation);
router.get("/startBot", startBot);
router.get("/stopBot", stopBot)


module.exports = router;
