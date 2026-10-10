import { Button } from '@mui/material';
import Sidebar from './Sidebar';

function AnnouncementsPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #DFD7F0' }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Announcements" />

            <div style={{ flex: 1, padding: 30 }}>

            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <h1>Announcements</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                        <h3>System Announcements</h3>
                        <p>Updates and notices for everyone using Learnly.</p>
                    </div>

                    <div style={card}>

                        <div style={row}>
                            <div>
                                <strong>Scheduled maintenance</strong>
                                <div>The system will be unavailable on Oct 18, 10 PM to 12 AM.</div>
                            </div>
                            <Button variant="contained" size="small" sx={btn}>Date Details</Button>
                        </div>

                        <div style={row}>
                            <div>
                                <strong>Midterm week schedule</strong>
                                <div>Midterm quizzes open on Oct 21.</div>
                            </div>
                            <Button variant="contained" size="small" sx={btn}>Date Details</Button>
                        </div>

                        <div style={row}>
                            <div>
                                <strong>Enrollment for next term</strong>
                                <div>Enrollment opens on Nov 2.</div>
                            </div>
                            <Button variant="contained" size="small" sx={btn}>Date Details</Button>
                        </div>

                    </div>

                </div>

            </div>

            </div>

        </div>
    )

}

export default AnnouncementsPage