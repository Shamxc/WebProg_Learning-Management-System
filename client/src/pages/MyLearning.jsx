import { Button, Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function MyLearningPage() {

    const card = { padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', '&:hover': { backgroundColor: '#2559D6' } }

    const colors = ['#5B27C9', '#2F6BFF', 'linear-gradient(135deg, #5B27C9, #2F6BFF)', 'linear-gradient(135deg, #2F6BFF, #5B27C9)'];

    const [courses, setCourses] = useState([]);
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/courses", { params: localStorage.getItem("role") === 'STUDENT' ? { student: localStorage.getItem("studentId") } : {} })
            .then((response) => {
                setCourses(Array.isArray(response.data) ? response.data : []);
            });
    }, []);

    const average = courses.length === 0 ? 0 : (courses.reduce((sum, c) => sum + c.score, 0) / courses.length).toFixed(2);

    function openDetails(course){
        setSelected(course);
        setModal('details');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="My Learning" />

            <div style={{ flex: 1, padding: 30 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>My Learning</h1>
                    <Button onClick={() => setModal('grades')} variant="outlined" sx={{ color: '#5B27C9', borderColor: '#5B27C9' }}>Term Grades</Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                    {courses.map((course, index) => (
                        <div key={course._id} style={card}>
                            <div style={{ height: 80, borderRadius: 12, background: colors[index % colors.length], marginBottom: 12, display: 'flex', alignItems: 'center', padding: '0 16px', color: '#fff' }}>
                                <h3 style={{ margin: 0 }}>{course.name}</h3>
                            </div>
                            <p>Instructor: {course.instructor}</p>
                            <p>Grade: {course.grade}</p>
                            <Button onClick={() => openDetails(course)} variant="contained" sx={btn}>Course Details</Button>
                        </div>
                    ))}
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
                            <p><b>Instructor:</b> {selected.instructor}</p>
                            <p><b>Grade:</b> {selected.grade} ({selected.score}%)</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'grades'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Term Grades
                    <Button onClick={() => setModal('')} sx={{ minWidth: 0, fontSize: 20, color: '#1B1535' }}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Subject</b></TableCell>
                                <TableCell align="center"><b>Score</b></TableCell>
                                <TableCell align="center"><b>Grade</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course._id}>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell align="center">{course.score}%</TableCell>
                                    <TableCell align="center">{course.grade}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell><b>Average</b></TableCell>
                                <TableCell align="center"><b>{average}%</b></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

        </div>
    )

}

export default MyLearningPage