import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

function Dashboard() {

    const card = { padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', '&:hover': { backgroundColor: '#2559D6' } }

    const navigate = useNavigate();

    const studentId = localStorage.getItem("studentId");
    const role = localStorage.getItem("role");
    const isStudent = role === 'STUDENT';
    const isAdmin = role === 'ADMIN';
    const params = isStudent ? { student: studentId } : {};

    const [courses, setCourses] = useState([]);
    const [events, setEvents] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // teacher only
    const [myCourses, setMyCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    // admin only
    const [allStudents, setAllStudents] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/events", { params })
            .then((response) => {
                setEvents(response.data);
            });

        axios
            .get("http://localhost:5000/students")
            .then((response) => {
                setAllStudents(response.data);
                const student = response.data.find((s) => s._id === studentId);
                if (student) {
                    setFirstName(student.firstName);
                    setLastName(student.lastName);
                }
            });

        if (isStudent) {
            axios
                .get("http://localhost:5000/courses", { params })
                .then((response) => {
                    setCourses(response.data);
                });
        } else if (isAdmin) {
            axios
                .get("http://localhost:5000/courses")
                .then((response) => setAllCourses(response.data));
        } else {
            axios.get("http://localhost:5000/my-courses").then((response) => setMyCourses(response.data));
            axios.get("http://localhost:5000/grades").then((response) => setGrades(response.data));
            axios.get("http://localhost:5000/assessments").then((response) => setAssessments(response.data));
            axios.get("http://localhost:5000/announcements").then((response) => setAnnouncements(response.data));
        }

    }, []);

    // pangformat tlga to ng date
    function toText(d){
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcoming = events
        .filter((e) => e.date >= toText(today))
        .sort((a, b) => a.date.localeCompare(b.date));

    const dueThisWeek = upcoming.filter((e) => e.date <= toText(nextWeek));

    // student
    const average = courses.length === 0 ? 0 : (courses.reduce((sum, c) => sum + c.score, 0) / courses.length).toFixed(2);

    // teacher: submitted but not graded yet
    const pending = grades.filter((g) => g.submission && g.score == null);

    function assessmentName(id){
        const a = assessments.find((x) => x._id === id);
        return a ? a.name : 'Assessment';
    }

    const welcome = (
        <div style={{ ...card, marginBottom: 20 }}>
            <h2 style={{ margin: 0 }}>Welcome back, {firstName} {lastName}!</h2>
            <p style={{ margin: '6px 0 0' }}>Here's your overview for today.</p>
        </div>
    );

    // ---------- ADMIN ----------
    if (isAdmin) {
        const teachers = allStudents.filter((s) => s.role === 'TEACHER');

        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

                <Sidebar active="Dashboard" />

                <div style={{ flex: 1, padding: 30 }}>

                    <h1>Admin Dashboard</h1>

                    {welcome}

                    <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                        <div style={{ ...card, flex: 1, backgroundColor: '#5B27C9', color: '#fff' }}>
                            <p>Total Students</p>
                            <h1>{allStudents.filter((s) => s.role === 'STUDENT').length}</h1>
                        </div>
                        <div style={{ ...card, flex: 1, backgroundColor: '#2F6BFF', color: '#fff' }}>
                            <p>Total Teachers</p>
                            <h1>{teachers.length}</h1>
                        </div>
                        <div style={{ ...card, flex: 1 }}>
                            <p>Total Courses</p>
                            <h1>{allCourses.length}</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20 }}>

                        <div style={{ ...card, flex: 1 }}>
                            <h3>Teachers</h3>
                            {teachers.length === 0 && <p>No teachers yet.</p>}
                            {teachers.map((t) => (
                                <p key={t._id}>
                                    <b>{t.firstName} {t.lastName}</b><br />
                                    <span style={{ fontSize: 13, color: '#6B6485' }}>{t.email}</span>
                                </p>
                            ))}
                        </div>

                        <div style={{ ...card, flex: 1 }}>
                            <h3>Courses</h3>
                            {allCourses.length === 0 && <p>No courses yet.</p>}
                            {allCourses.map((c) => (
                                <p key={c._id}>
                                    <b>{c.name}</b><br />
                                    <span style={{ fontSize: 13, color: '#6B6485' }}>
                                        {c.instructor}
                                    </span>
                                </p>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // ---------- TEACHER ----------
    if (role === 'TEACHER') {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

                <Sidebar active="Dashboard" />

                <div style={{ flex: 1, padding: 30 }}>

                    <h1>Dashboard</h1>

                    {welcome}

                    <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>

                        <div style={{ ...card, flex: 1 }}>
                            <h3>Course Overview</h3>
                            {myCourses.length === 0 && <p>No courses yet.</p>}
                            {myCourses.map((c) => (
                                <p key={c._id}><b>{c.name}</b> ({c.code}) - {c.students.length} students</p>
                            ))}
                        </div>

                        <div style={{ ...card, flex: 1 }}>
                            <h3>Pending Submissions ({pending.length})</h3>
                            {pending.length === 0 && <p>Nothing to grade.</p>}
                            {pending.slice(0, 5).map((g) => (
                                <p key={g._id}>{g.student.firstName} {g.student.lastName} - {assessmentName(g.assessment)} ({g.course})</p>
                            ))}
                            <Button onClick={() => navigate("/gradebook")} variant="contained" sx={btn}>Open Gradebook</Button>
                        </div>

                    </div>

                    <div style={{ display: 'flex', gap: 20 }}>

                        <div style={{ ...card, flex: 1 }}>
                            <h3>Upcoming Deadlines</h3>
                            {upcoming.length === 0 && <p>No upcoming deadlines.</p>}
                            {upcoming.slice(0, 5).map((e) => (
                                <p key={e._id}>{e.course} - {e.title}{e.section && " - " + e.section} ({e.date})</p>
                            ))}
                            <Button onClick={() => navigate("/calendar")} variant="contained" sx={btn}>View All</Button>
                        </div>

                        <div style={{ ...card, flex: 1 }}>
                            <h3>Recent Activity</h3>
                            {announcements.length === 0 && <p>No recent activity.</p>}
                            {announcements.slice(0, 5).map((a) => (
                                <p key={a._id}><b>{a.title}</b> - {a.course} ({String(a.date).slice(0, 10)})</p>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
        )
    }

    // ---------- STUDENT ----------
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

        <Sidebar active="Dashboard" />

            <div style={{ flex: 1, padding: 30 }}>

                <h1>Dashboard</h1>

                {welcome}

                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                    <div style={{ ...card, flex: 1, backgroundColor: '#5B27C9', color: '#fff' }}>
                        <p>Average Grade</p>
                        <h1>{average}%</h1>
                    </div>
                    <div style={{ ...card, flex: 1, backgroundColor: '#2F6BFF', color: '#fff' }}>
                        <p>Enrolled Courses</p>
                        <h1>{courses.length}</h1>
                    </div>
                    <div style={{ ...card, flex: 1 }}>
                        <p>Due This Week</p>
                        <h1>{dueThisWeek.length}</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 20 }}>

                    <div style={{ ...card, flex: 1 }}>
                        <h3>Enrolled Courses</h3>
                        {courses.map((c) => (
                            <p key={c._id}>{c.name}</p>
                        ))}
                    </div>

                    <div style={{ ...card, flex: 1 }}>
                        <h3>Upcoming Assignment Deadlines</h3>
                        {upcoming.slice(0, 3).map((e) => (
                            <p key={e._id}>{e.course} - {e.title} ({e.date})</p>
                        ))}
                        <Button onClick={() => navigate("/calendar")} variant="contained" sx={btn}>View All</Button>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default Dashboard