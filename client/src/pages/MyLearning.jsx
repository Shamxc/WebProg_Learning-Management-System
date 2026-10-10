import { Button } from '@mui/material';
import Sidebar from './Sidebar';

function MyLearningPage() {

    const card = { flex: 1, padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', '&:hover': { backgroundColor: '#2559D6' } }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="My Learning" />

            <div style={{ flex: 1, padding: 30 }}>

                

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>My Learning</h1>
                    <Button variant="outlined" sx={{ color: '#5B27C9', borderColor: '#5B27C9' }}>Term Grades</Button>
                </div>

                <div style={{ display: 'flex', gap: 20 }}>

                    <div style={card}>
                        <div style={{ height: 80, borderRadius: 12, backgroundColor: '#5B27C9', marginBottom: 12 }}></div>
                        <h3>Data Structures</h3>
                        <p>Progress: 72%</p>
                        <p>Grade: A</p>
                        <Button variant="contained" sx={btn}>Course Details</Button>
                    </div>

                    <div style={card}>
                        <div style={{ height: 80, borderRadius: 12, backgroundColor: '#2F6BFF', marginBottom: 12 }}></div>
                        <h3>Business Statistics</h3>
                        <p>Progress: 48%</p>
                        <p>Grade: B</p>
                        <Button variant="contained" sx={btn}>Course Details</Button>
                    </div>

                    <div style={card}>
                        <div style={{ height: 80, borderRadius: 12, background: 'linear-gradient(135deg, #5B27C9, #2F6BFF)', marginBottom: 12 }}></div>
                        <h3>Technical Writing</h3>
                        <p>Progress: 91%</p>
                        <p>Grade: A</p>
                        <Button variant="contained" sx={btn}>Course Details</Button>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default MyLearningPage