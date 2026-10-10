const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then( ()=> {
        console.log("Connected to MongoDB");
    })

    .catch( (error)=> {
        console.log("MongoDB connection error: ",error);
    }); 


app.get("/", (req, res) => {
    res.send("Server is running!");
});

//pangread
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});


//pangcreate
app.post("/register", async (req, res) => {

    const existing = await Student.findOne({ email: req.body.email });
    if (existing) {
        return res.status(400).json("Email already registered");
    }

    const student = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    await student.save();
    res.json("Registered successfully");
});

// pangupdate


//pangdelete

app.get("/students", (req, res) => {
    res.json(students);
});

app.listen( 5000, () => {
    console.log("Server running on port 5000");
});