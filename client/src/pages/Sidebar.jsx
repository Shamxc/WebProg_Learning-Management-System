import { Link } from 'react-router-dom';

function Sidebar({ active }) {

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

                <Link to="/dashboard" style={link('Dashboard')}>Dashboard</Link>
                <Link to="/profile" style={link('Profile')}>Profile</Link>
                <Link to="/announcements" style={link('Announcements')}>Announcements</Link>
                <Link to="/my-learning" style={link('My Learning')}>My Learning</Link>
                <Link to="/courses" style={link('Courses')}>Courses</Link>
                <Link to="/my-courses" style={link('My Courses')}>My Courses</Link>
                <Link to="/calendar" style={link('Calendar')}>Calendar</Link>
                <Link to="/assessments" style={link('Assessments')}>Assessments</Link>
                <Link to="/gradebook" style={link('Gradebook')}>Gradebook</Link>

                <Link to="/login" style={link('Logout')}>Logout</Link>

                <div style={{ marginTop: 'auto', marginLeft: -90, marginBottom: -110, width: 240, height: 240, borderRadius: '50%', backgroundColor: '#2F6BFF', flexShrink: 0 }}></div>

            </div>

        </div>
    )

}

export default Sidebar