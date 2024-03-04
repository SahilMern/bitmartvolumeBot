require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
require("./config/DB/conn");
app.use(express.json());
//for volume bot
const volumeRouter = require("./Router/volumebot.Router");
app.use("/api/v1", volumeRouter);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
