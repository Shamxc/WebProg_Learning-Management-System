    const mongoose = require("mongoose");

    const eventSchema = new mongoose.Schema({
        title:String,
        type:String,
        date:String,
        section:String,
        course:String,
    });

    module.exports = mongoose.model("event", eventSchema);