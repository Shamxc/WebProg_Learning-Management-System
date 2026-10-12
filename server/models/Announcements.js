const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    course:String,
    title:String,
    message:String,
    date:String,
});

module.exports = mongoose.model("announcement", announcementSchema);