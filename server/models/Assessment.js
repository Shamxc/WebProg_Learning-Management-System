const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
    name:String,
    course:String,
    type:String,
    due:String,
    status:String,
    description:String,
});

module.exports = mongoose.model("assessment", assessmentSchema);