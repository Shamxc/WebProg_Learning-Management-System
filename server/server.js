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

    const student = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });

    await student.save();
    res.json("Registered successfully");
});

//login to
app.post("/login", async (req, res) => {

    const student = await Student.findOne({ email: req.body.email });

    if (!student || student.password !== req.body.password) {
        return res.status(400).json("Invalid email or password");
    }

    res.json(student);
});


// pangupdate


//pangdelete


app.listen( 5000, () => {
    console.log("Server running on port 5000");
});