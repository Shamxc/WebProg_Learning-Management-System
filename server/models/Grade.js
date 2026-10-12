const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    course: String,
    student: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: "assessment" },
    submission: String,
    score: Number,
    total: Number,
    feedback: String,
});

module.exports = mongoose.model("grade", gradeSchema);