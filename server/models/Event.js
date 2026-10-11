const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title:String,
    type:String,
    date:String,
});

module.exports = mongoose.model("event", eventSchema);