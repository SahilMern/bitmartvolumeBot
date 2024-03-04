const mongoose = require("mongoose")
const volumeBotSehema = mongoose.Schema({
    time:{
        type:Number,
        required:true
    },
    limit:{
        type:Number,
        required:true
    }
})
const volumeBotModel = new mongoose.model("volumeBot",volumeBotSehema );
module.exports = volumeBotModel;