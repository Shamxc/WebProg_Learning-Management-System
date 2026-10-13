const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Student = require("./models/Student");
const Course = require("./models/Courses");
const Assessment = require("./models/Assessment");
const Event = require("./models/Event");
const MyCourse = require("./models/MyCourse");
const Announcements = require("./models/Announcements");
const Grade = require("./models/Grade");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error: ", error);
    });

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// pangread
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.get("/courses", async (req, res) => {
    let courses = await Course.find().lean();

    if (req.query.student) {
        const mine = await getEnrollments(req.query.student);
        courses = courses
            .filter((c) => mine.some((m) => m.names.includes(c.name)))
            .map((c) => {
                const m = mine.find((x) => x.names.includes(c.name));
                return { ...c, section: m.section, score: m.score, grade: m.grade };
            });
    }

    res.json(courses);
});

app.get("/assessments", async (req, res) => {
    let assessments = await Assessment.find().lean();

    if (req.query.student) {
        const mine = await getEnrollments(req.query.student);
        assessments = assessments.filter((a) => mine.some((m) => m.names.includes(a.course) && m.section === a.section));

        if (assessments.length > 0) {
            const grades = await Grade.find({ student: req.query.student });
            assessments = assessments.map((a) => {
                const g = grades.find((x) => String(x.assessment) === String(a._id));
                return g && g.score != null ? { ...a, status: g.score + " / " + g.total } : a;
            });
        }
    }

    res.json(assessments);
});

app.get("/events", async (req, res) => {
    let assessments = await Assessment.find();

    if (req.query.student) {
        const mine = await getEnrollments(req.query.student);
        assessments = assessments.filter((a) => mine.some((m) => m.names.includes(a.course) && m.section === a.section));
    }

    res.json(assessments.map((a) => ({
        _id: a._id,
        title: a.name,
        type: a.type,
        course: a.course,
        section: a.section,
        date: a.due,
    })));
});

app.get("/my-courses", async (req, res) => {
    const courses = await MyCourse.find()
        .populate("students.student", "firstName lastName email")
        .lean();

    courses.forEach((c) => {
        c.students = c.students.filter((s) => s.student);
    });

    res.json(courses);
});

app.get("/sections", async (req, res) => {
    const sections = await MyCourse.distinct("students.section");
    res.json(sections.filter(Boolean));
});

app.get("/announcements", async (req, res) => {
    const announcements = await Announcements.find().sort({ date: -1 });
    res.json(announcements);
});

// pangcreate
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
        role: req.body.role,
    });

    await student.save();
    res.json("Registered successfully");
});

app.post("/announcements", async (req, res) => {
    const announcement = new Announcements({
        course: req.body.course,
        title: req.body.title,
        message: req.body.message,
        date: req.body.date,
    });

    await announcement.save();
    res.json("Announcement posted");
});

app.post("/assessments", async (req, res) => {
    const assessment = new Assessment({
        name: req.body.name,
        course: req.body.course,
        section: req.body.section,
        type: req.body.type,
        due: req.body.due,
        description: req.body.description,
        status: "Not started",
    });

    await assessment.save();
    res.json("Assessment added");
});

// login
app.post("/login", async (req, res) => {
    const student = await Student.findOne({ email: req.body.email });

    if (!student || student.password !== req.body.password) {
        return res.status(400).json("Invalid email or password");
    }

    res.json(student);
});

// pangupdate
app.put("/students/:id", async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json("Updated");
});

app.put("/announcements/:id", async (req, res) => {
    await Announcements.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        message: req.body.message,
    });
    res.json("Announcement updated");
});

app.put("/assessments/:id", async (req, res) => {
    await Assessment.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        course: req.body.course,
        section: req.body.section,
        type: req.body.type,
        due: req.body.due,
        description: req.body.description,
    });
    res.json("Assessment updated");
});

// pangdelete
app.delete("/students/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json("Deleted");
});

app.delete("/announcements/:id", async (req, res) => {
    await Announcements.findByIdAndDelete(req.params.id);
    res.json("Announcement removed");
});

app.delete("/assessments/:id", async (req, res) => {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json("Assessment deleted");
});

// gradebook
app.get("/grades", async (req, res) => {
    const filter = {};

    if (req.query.course) {
        filter.course = req.query.course;
    }
    if (req.query.student) {
        filter.student = req.query.student;
    }

    const grades = await Grade.find(filter)
        .populate("student", "firstName lastName")
        .lean();

    res.json(grades.filter((g) => g.student));
});

app.post("/grades", async (req, res) => {
    // kung may score na yung student sa assessment, i-update lang
    const existing = await Grade.findOne({
        student: req.body.student,
        assessment: req.body.assessment,
    });

    if (existing) {
        existing.score = req.body.score;
        existing.total = req.body.total;
        existing.feedback = req.body.feedback;
        await existing.save();
        return res.json("Grade updated");
    }

    const grade = new Grade({
        course: req.body.course,
        student: req.body.student,
        assessment: req.body.assessment,
        submission: req.body.submission,
        score: req.body.score,
        total: req.body.total,
        feedback: req.body.feedback,
    });

    await grade.save();
    res.json("Grade added");
});

app.put("/grades/:id", async (req, res) => {
    await Grade.findByIdAndUpdate(req.params.id, {
        student: req.body.student,
        assessment: req.body.assessment,
        submission: req.body.submission,
        score: req.body.score,
        total: req.body.total,
        feedback: req.body.feedback,
    });
    res.json("Grade updated");
});

app.delete("/grades/:id", async (req, res) => {
    await Grade.findByIdAndDelete(req.params.id);
    res.json("Grade deleted");
});

app.put("/my-courses/:id/students/:studentId", async (req, res) => {
    const course = await MyCourse.findById(req.params.id);
    if (!course) return res.status(404).json("Course not found");

    const entry = course.students.find((s) => String(s.student) === req.params.studentId);
    if (!entry) return res.status(404).json("Student not enrolled");

    entry.score = Number(req.body.score);
    entry.grade = req.body.grade;
    await course.save();
    res.json("Grade saved");
});

app.post("/my-courses/:id/enroll", async (req, res) => {
    const course = await MyCourse.findById(req.params.id);
    const already = course.students.find((s) => String(s.student) === req.body.student);

    if (already) {
        return res.status(400).json("Student already enrolled");
    }

    course.students.push({ student: req.body.student, section: req.body.section, score: 0, grade: "" });
    await course.save();
    res.json("Student enrolled");
});

// kunin yung course + section
async function getEnrollments(studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return [];

    const courses = await MyCourse.find({ "students.student": studentId });
    return courses.map((c) => {
        const me = c.students.find((s) => String(s.student) === studentId);
        return { names: [c.name, c.code], section: me.section, score: me.score, grade: me.grade };
    });
}
app.listen(5000, () => {
    console.log("Server running on port 5000");
});