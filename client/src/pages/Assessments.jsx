import { Button } from '@mui/material';
import Sidebar from './Sidebar';

function AssessmentsPage() {

    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Assessments" />
           
            <div style={{ flex: 1, padding: 30 }}>

                <h1>Assessments</h1>

                <div style={{ padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }}>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={cell}>Name</th>
                                <th style={cell}>Type</th>
                                <th style={cell}>Due</th>
                                <th style={cell}>Score / Status</th>
                                <th style={cell}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={cell}>Linked List Lab</td>
                                <td style={cell}>Assignment</td>
                                <td style={cell}>Oct 14</td>
                                <td style={cell}>Not submitted</td>
                                <td style={cell}><Button variant="contained" size="small" sx={{ backgroundColor: '#2F6BFF' }}>Details</Button></td>
                            </tr>
                            <tr>
                                <td style={cell}>Week 5 Quiz</td>
                                <td style={cell}>Quiz</td>
                                <td style={cell}>Oct 12</td>
                                <td style={cell}>Not started</td>
                                <td style={cell}><Button variant="contained" size="small" sx={{ backgroundColor: '#2F6BFF' }}>Details</Button></td>
                            </tr>
                            <tr>
                                <td style={cell}>Sorting Quiz</td>
                                <td style={cell}>Quiz</td>
                                <td style={cell}>Oct 3</td>
                                <td style={cell}>18 / 20</td>
                                <td style={cell}><Button variant="contained" size="small" sx={{ backgroundColor: '#2F6BFF' }}>Details</Button></td>
                            </tr>
                            <tr>
                                <td style={cell}>Regression Problem Set</td>
                                <td style={cell}>Assignment</td>
                                <td style={cell}>Sep 28</td>
                                <td style={cell}>42 / 50</td>
                                <td style={cell}><Button variant="contained" size="small" sx={{ backgroundColor: '#2F6BFF' }}>Details</Button></td>
                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>

        </div>
    )

}

export default AssessmentsPage