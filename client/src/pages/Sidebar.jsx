import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Sidebar({ active }) {

    const studentId = localStorage.getItem("studentId");

    const [firstName, setFirstName] = useState(localStorage.getItem("firstName") || '');
    const [lastName, setLastName] = useState(localStorage.getItem("lastName") || '');
    const [role, setRole] = useState(localStorage.getItem("role") || '');

    useEffect(() => {
        axios
            .get("http://localhost:5000/students")
            .then((response) => {
                const student = response.data.find((s) => s._id === studentId);
                if (student) {
                    setFirstName(student.firstName);
                    setLastName(student.lastName);
                    setRole(student.role);
                    localStorage.setItem("firstName", student.firstName);
                    localStorage.setItem("lastName", student.lastName);
                    localStorage.setItem("role", student.role);
                }
            });
    }, []);

    const link = (name) => ({
        display: 'block',
        padding: '12px 16px',
        marginBottom: 6,
        borderRadius: 12,
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 600,
        backgroundColor: active === name ? '#2F6BFF' : 'transparent'
    })

    return (
        <div style={{ width: 230, flexShrink: 0 }}>

            <div style={{ position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: 230, height: '100vh', padding: 20, backgroundColor: '#5B27C9', boxSizing: 'border-box' }}>

                <h2 style={{ color: '#fff', marginBottom: 30 }}>LUMEN</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 12, padding: '10px 12px', marginBottom: 20 }}>
                    <AccountCircleIcon />
                    <div style={{ fontSize: 14, fontWeight: 400 }}>{firstName} {lastName}</div>
                </div>

                <Link to="/dashboard" style={link('Dashboard')}>Dashboard</Link>
                <Link to="/profile" style={link('Profile')}>Profile</Link>
                {role === 'ADMIN' && <Link to="/announcements" style={link('Announcements')}>Announcements</Link>}
                {role === 'STUDENT' && <Link to="/my-learning" style={link('My Learning')}>My Learning</Link>}
                {role === 'ADMIN' && <Link to="/courses" style={link('Courses')}>Courses</Link>}
                {role === 'TEACHER' && <Link to="/my-courses" style={link('My Courses')}>My Courses</Link>}
                <Link to="/calendar" style={link('Calendar')}>Calendar</Link>
                <Link to="/assessments" style={link('Assessments')}>Assessments</Link>
                {role === 'TEACHER' && <Link to="/gradebook" style={link('Gradebook')}>Gradebook</Link>}

                <Link to="/login" style={link('Logout')}>Logout</Link>

                <div style={{ marginTop: 'auto', marginLeft: -90, marginBottom: -110, width: 240, height: 240, borderRadius: '50%', backgroundColor: '#2F6BFF', flexShrink: 0 }}></div>

            </div>

        </div>
    )

}

export default Sidebar