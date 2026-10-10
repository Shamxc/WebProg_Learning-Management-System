const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    role:String,
    
});

module.exports = mongoose.model("student", studentSchema);