const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name:String,
    instructor:String,
    description:String,
    grade:String,
    score:Number,
});

module.exports = mongoose.model("course", courseSchema);