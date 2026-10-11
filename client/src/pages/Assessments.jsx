import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function AssessmentsPage() {

    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }

    const [assessments, setAssessments] = useState([]);
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/assessment")
            .then((response) => {
                setAssessments(response.data);
            });
    }, []);

    function openDetails(assessment){
        setSelected(assessment);
        setModal('details');
    }

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
                                <th style={cell}>Class</th>
                                <th style={cell}>Type</th>
                                <th style={cell}>Due</th>
                                <th style={cell}>Score / Status</th>
                                <th style={cell}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.map((a) => (
                                <tr key={a._id}>
                                    <td style={cell}>{a.name}</td>
                                    <td style={cell}>{a.course}</td>
                                    <td style={cell}>{a.type}</td>
                                    <td style={cell}>{a.due}</td>
                                    <td style={cell}>{a.status}</td>
                                    <td style={cell}><Button onClick={() => openDetails(a)} variant="contained" size="small" sx={{ backgroundColor: '#2F6BFF' }}>Details</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>

            <Dialog open={modal === 'details'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {selected && selected.name}
                    <Button onClick={() => setModal('')} sx={{ minWidth: 0, fontSize: 20, color: '#1B1535' }}>X</Button>
                </DialogTitle>

                <DialogContent>
                    {selected && (
                        <div>
                            <p>{selected.description}</p>
                            <p><b>Class:</b> {selected.course}</p>
                            <p><b>Type:</b> {selected.type}</p>
                            <p><b>Due:</b> {selected.due}</p>
                            <p><b>Score / Status:</b> {selected.status}</p>
                        </div>
                    )}
                </DialogContent>

            </Dialog>

        </div>
    )

}

export default AssessmentsPage