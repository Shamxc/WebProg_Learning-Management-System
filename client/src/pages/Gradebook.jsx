import { Button } from '@mui/material';
import Sidebar from './Sidebar';

function GradebookPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Gradebook" />

            <div style={{ flex: 1, padding: 30 }}>

            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <h1>Gradebook</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                        <h3>Data Structures (CS201)</h3>
                        <p>Class average: B+</p>
                    </div>

                    <div style={card}>
                        <h3>Course Grades</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={cell}>Student</th>
                                    <th style={cell}>Submission</th>
                                    <th style={cell}>Score</th>
                                    <th style={cell}></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={cell}>Alex Morales</td>
                                    <td style={cell}>Linked List Lab</td>
                                    <td style={cell}>45 / 50</td>
                                    <td style={cell}><Button variant="contained" size="small" sx={btn}>Feedback</Button></td>
                                </tr>
                                <tr>
                                    <td style={cell}>Jamie Cruz</td>
                                    <td style={cell}>Linked List Lab</td>
                                    <td style={cell}>38 / 50</td>
                                    <td style={cell}><Button variant="contained" size="small" sx={btn}>Feedback</Button></td>
                                </tr>
                                <tr>
                                    <td style={cell}>Sam Reyes</td>
                                    <td style={cell}>Linked List Lab</td>
                                    <td style={cell}>49 / 50</td>
                                    <td style={cell}><Button variant="contained" size="small" sx={btn}>Feedback</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

            </div>

        </div>
    )

}

export default GradebookPage