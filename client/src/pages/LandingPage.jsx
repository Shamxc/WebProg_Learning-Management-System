import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function LandingPage() {

    const card = { flex: 1, minWidth: 220, padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <div style={{ background: 'radial-gradient(circle at 100% 0, #2F6BFF 0 170px, transparent 171px), radial-gradient(circle at 0 100%, rgba(228, 240, 255, 0.18) 0 120px, transparent 121px), #5B27C9', color: '#fff', borderRadius: '0 0 40px 40px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>

                <h2 style={{ margin: 0 }}>LUMEN</h2>

                <div>
                    <Button component={Link} to="/login" sx={{ color: '#fff', textTransform: 'none', fontWeight: 600, marginRight: 1 }}>Log in</Button>
                    <Button component={Link} to="/register" variant="contained" sx={{ backgroundColor: '#fff', color: '#5B27C9', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#E4F0FF' } }}>Register</Button>
                </div>

            </div>

            <div style={{ padding: '80px 40px', textAlign: 'center' }}>

                <h1 style={{ fontSize: 48, margin: 0 }}>Learn at your own pace</h1>
                <p style={{ fontSize: 18, margin: '16px 0 30px' }}>Join a course and start your first lesson today.</p>

                <Button component={Link} to="/register" variant="contained" sx={{ backgroundColor: '#2F6BFF', padding: '12px 32px', fontSize: 16, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#2559D6' } }}>Get Started</Button>

            </div>

            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, maxWidth: 900, margin: '0 auto', padding: '50px 20px' }}>

                <div style={card}>
                    <h3>Courses</h3>
                    <p>Browse your courses and pick up your lessons where you left off.</p>
                </div>

                <div style={card}>
                    <h3>Assessments</h3>
                    <p>Keep track of quizzes, assignments and your grades.</p>
                </div>

                <div style={card}>
                    <h3>Calendar</h3>
                    <p>See every deadline in one place so nothing slips by.</p>
                </div>

            </div>

            <p style={{ textAlign: 'center', padding: 20, margin: 0 }}>LUMEN Learning Management System</p>

        </div>
    )

}

export default LandingPage