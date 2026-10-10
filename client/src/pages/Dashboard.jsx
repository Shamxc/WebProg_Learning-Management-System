import { Button } from '@mui/material';
import Sidebar from './Sidebar';

function Dashboard() {

    const card = { padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

        <Sidebar active="Dashboard" />

            <div style={{ flex: 1, padding: 30 }}>

                <h1>Dashboard</h1>

                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                    <div style={{ ...card, flex: 1, backgroundColor: '#5B27C9', color: '#fff' }}>
                        <p>Overall Progress</p>
                        <h1>70%</h1>
                    </div>
                    <div style={{ ...card, flex: 1, backgroundColor: '#2F6BFF', color: '#fff' }}>
                        <p>Enrolled Courses</p>
                        <h1>3</h1>
                    </div>
                    <div style={{ ...card, flex: 1 }}>
                        <p>Due This Week</p>
                        <h1>3</h1>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 20 }}>

                    <div style={{ ...card, flex: 1 }}>
                        <h3>Enrolled Courses</h3>
                        <p>Data Structures </p>
                        <p>Business Statistics </p>
                        <p>Technical Writing </p>
                    </div>

                    <div style={{ ...card, flex: 1 }}>
                        <h3>Upcoming Assignment Deadlines</h3>
                        <p>Week 5 Quiz </p>
                        <p>Linked List Lab </p>
                        <p>Case Study Report </p>
                        <Button variant="contained" sx={{ backgroundColor: '#2F6BFF', '&:hover': { backgroundColor: '#2559D6' } }}>View All</Button>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default Dashboard