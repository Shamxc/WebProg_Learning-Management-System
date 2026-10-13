const mongoose = require("mongoose");

const myCourseSchema = new mongoose.Schema({
    name:String,
    code:String,
    description:String,
    students:[{ student:{ type: mongoose.Schema.Types.ObjectId, ref: "student" }, section:String, score:Number, grade:String }],
    modules:[{ title:String, content:String }],
});

module.exports = mongoose.model("mycourse", myCourseSchema);