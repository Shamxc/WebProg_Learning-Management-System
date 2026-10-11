import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

function Dashboard() {

    const card = { padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [events, setEvents] = useState([]);

    const studentId = localStorage.getItem("studentId");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/courses")
            .then((response) => {
                setCourses(response.data);
            });

        axios
            .get("http://localhost:5000/events")
            .then((response) => {
                setEvents(response.data);
            });

        axios
            .get("http://localhost:5000/students")
            .then((response) => {
                const student = response.data.find((s) => s._id === studentId);
                if (student) {
                    setFirstName(student.firstName);
                    setLastName(student.lastName);
                }
            });

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

    const average = courses.length === 0 ? 0 : (courses.reduce((sum, c) => sum + c.score, 0) / courses.length).toFixed(2);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

        <Sidebar active="Dashboard" />

            <div style={{ flex: 1, padding: 30 }}>

                <h1>Dashboard</h1>

                <div style={{ ...card, marginBottom: 20 }}>
                    <h2 style={{ margin: 0 }}>Welcome back, {firstName} {lastName}!</h2>
                    <p style={{ margin: '6px 0 0' }}>Here's your overview for today.</p>
                </div>

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
                            <p key={e._id}>{e.title} ({e.date})</p>
                        ))}
                        <Button onClick={() => navigate("/calendar")} variant="contained" sx={{ backgroundColor: '#2F6BFF', '&:hover': { backgroundColor: '#2559D6' } }}>View All</Button>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default Dashboard