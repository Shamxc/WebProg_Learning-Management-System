import { Button } from '@mui/material';
import Sidebar from './Sidebar';

function CoursesPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const outlined = { color: '#5B27C9', borderColor: '#5B27C9', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }
    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }
    const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #DFD7F0' }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Courses" />

            <div style={{ flex: 1, padding: 30, minWidth: 0 }}>

                <h1>Courses</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div style={card}>
                        <h3>Course Management</h3>

                        <div style={row}>
                            <div>
                                <strong>Data Structures (CS201)</strong>
                                <div>Dr. Reyes</div>
                            </div>
                            <div>
                                <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Course Information</Button>
                                <Button variant="contained" size="small" sx={btn}>Post Announcement</Button>
                            </div>
                        </div>

                        <div style={row}>
                            <div>
                                <strong>Business Statistics (MA140)</strong>
                                <div>Prof. Santos</div>
                            </div>
                            <div>
                                <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Course Information</Button>
                                <Button variant="contained" size="small" sx={btn}>Post Announcement</Button>
                            </div>
                        </div>

                        <div style={row}>
                            <div>
                                <strong>Technical Writing (EN110)</strong>
                                <div>Ms. Lim</div>
                            </div>
                            <Button variant="contained" size="small" sx={btn}>Enroll</Button>
                        </div>
                    </div>

                    <div style={card}>
                        <h3>Students</h3>
                        <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={cell}>Name</th>
                                    <th style={cell}>Progress</th>
                                    <th style={cell}>Grade</th>
                                    <th style={cell}></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={cell}>Alex Morales</td>
                                    <td style={cell}>72%</td>
                                    <td style={cell}>A-</td>
                                    <td style={cell}>
                                        <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Progress Details</Button>
                                        <Button variant="outlined" size="small" sx={outlined}>Grade Details</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={cell}>Jamie Cruz</td>
                                    <td style={cell}>48%</td>
                                    <td style={cell}>B+</td>
                                    <td style={cell}>
                                        <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Progress Details</Button>
                                        <Button variant="outlined" size="small" sx={outlined}>Grade Details</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    <div style={card}>
                        <h3>Course Content</h3>

                        <div style={row}>
                            <span>Module 7: Stacks and Queues</span>
                            <div>
                                <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Preview Lesson</Button>
                                <Button variant="contained" size="small" sx={btn}>Mark as Complete</Button>
                            </div>
                        </div>

                        <div style={row}>
                            <span>Module 8: Hash Tables</span>
                            <div>
                                <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Preview Lesson</Button>
                                <Button variant="contained" size="small" sx={btn}>Mark as Complete</Button>
                            </div>
                        </div>

                        <div style={row}>
                            <span>Module 9: Trees and Traversal</span>
                            <div>
                                <Button variant="outlined" size="small" sx={{ ...outlined, marginRight: 1 }}>Preview Lesson</Button>
                                <Button variant="contained" size="small" sx={btn}>Mark as Complete</Button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default CoursesPage