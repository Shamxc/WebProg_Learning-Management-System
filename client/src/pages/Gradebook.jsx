import { Alert, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function GradebookPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const delBtn = { backgroundColor: '#D93B3B', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#B52E2E' } }
    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }
    const modalTitle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    const closeBtn = { minWidth: 0, fontSize: 20, color: '#1B1535' }

    const courseCode = 'CS201';

    const [courseName, setCourseName] = useState('');
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [modal, setModal] = useState('');
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [student, setStudent] = useState('');
    const [assessment, setAssessment] = useState('');
    const [score, setScore] = useState('');
    const [total, setTotal] = useState('50');
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // assessments ng course lang
    const courseAssessments = assessments.filter((a) => a.course === courseName || a.course === courseCode);

    // pangkuwa ng grades
    function loadGrades(){
        axios
            .get("http://localhost:5000/grades?course=" + courseCode)
            .then((response) => {
                setGrades(response.data);
            });
    }

    // pangkuwa ng assessments
    function loadAssessments(){
        axios
            .get("http://localhost:5000/assessments")
            .then((response) => {
                setAssessments(response.data);
            });
    }

    // pangkuwa ng students ng course
    useEffect(() => {
        axios
            .get("http://localhost:5000/my-courses")
            .then((response) => {
                const course = response.data.find((c) => c.code === courseCode);
                if (course) {
                    setCourseName(course.name);
                    setStudents(course.students.map((s) => s.student));
                }
            });

        loadGrades();
        loadAssessments();
    }, []);

    function openAdd(){
        setEditingId(null);
        setStudent('');
        setAssessment('');
        setScore('');
        setTotal('50');
        setFeedback('');
        setMessage('');
        setModal('form');
    }

    function openEdit(grade){
        setEditingId(grade._id);
        setStudent(grade.student._id);
        setAssessment(grade.assessment || '');
        setScore(grade.score);
        setTotal(grade.total);
        setFeedback(grade.feedback || '');
        setMessage('');
        setModal('form');
    }

    function openFeedback(grade){
        setSelectedGrade(grade);
        setModal('feedback');
    }

    // pang save (add o edit)
    function saveGrade(){
        if (student === "" || assessment === "" || score === "" || total === "") {
            setIsError(true);
            setMessage("Please fill in all fields");
            return;
        }

        const chosen = assessments.find((a) => a._id === assessment);

        const data = {
            course: courseCode,
            student: student,
            assessment: assessment,
            submission: chosen.name,
            score: score,
            total: total,
            feedback: feedback
        };

        if (editingId) {
            axios
                .put("http://localhost:5000/grades/" + editingId, data)
                .then(() => {
                    setModal('');
                    loadGrades();
                    loadAssessments();
                })
                .catch(() => {
                    setIsError(true);
                    setMessage("Something went wrong");
                });
        } else {
            axios
                .post("http://localhost:5000/grades", data)
                .then(() => {
                    setModal('');
                    loadGrades();
                    loadAssessments();
                })
                .catch(() => {
                    setIsError(true);
                    setMessage("Something went wrong");
                });
        }
    }

    // pang delete
    function deleteGrade(id){
        axios
            .delete("http://localhost:5000/grades/" + id)
            .then(() => {
                loadGrades();
                loadAssessments();
            });
    }

    // class average (number)
    function getAverage(){
        if (grades.length === 0) {
            return 0;
        }

        let sum = 0;
        for (let i = 0; i < grades.length; i++) {
            sum = sum + (grades[i].score / grades[i].total) * 100;
        }

        return (sum / grades.length).toFixed(1);
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Gradebook" />

            <div style={{ flex: 1, padding: 30 }}>

            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <h1>Gradebook</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                        <h3>Data Structures (CS201)</h3>
                        <p>Class average: {getAverage()}%</p>
                    </div>

                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Course Grades</h3>
                            <Button onClick={openAdd} variant="contained" size="small" sx={btn}>Add Grade</Button>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={cell}>Student</th>
                                    <th style={cell}>Submission</th>
                                    <th style={cell}>Score</th>
                                    <th style={cell}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((g) => (
                                    <tr key={g._id}>
                                        <td style={cell}>{g.student.firstName} {g.student.lastName}</td>
                                        <td style={cell}>{g.submission}</td>
                                        <td style={cell}>{g.score} / {g.total}</td>
                                        <td style={cell}>
                                            <Button onClick={() => openFeedback(g)} variant="contained" size="small" sx={{ ...btn, marginRight: 1 }}>Feedback</Button>
                                            <Button onClick={() => openEdit(g)} variant="contained" size="small" sx={{ ...btn, marginRight: 1 }}>Edit</Button>
                                            <Button onClick={() => deleteGrade(g._id)} variant="contained" size="small" sx={delBtn}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {grades.length === 0 && <p>No grades yet.</p>}
                    </div>

                </div>

            </div>

            </div>

            <Dialog open={modal === 'form'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    {editingId ? 'Edit Grade' : 'Add Grade'}
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    <br/>
                    <TextField select label="Student" value={student} onChange={(e) => setStudent(e.target.value)} variant="outlined" fullWidth>
                        {students.map((s) => (
                            <MenuItem key={s._id} value={s._id}>{s.firstName} {s.lastName}</MenuItem>
                        ))}
                    </TextField>
                    <br/> <br/>
                    <TextField select label="Assessment" value={assessment} onChange={(e) => setAssessment(e.target.value)} variant="outlined" fullWidth>
                        {courseAssessments.map((a) => (
                            <MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>
                        ))}
                    </TextField>
                    <br/> <br/>
                    <TextField label="Score" type="number" value={score} onChange={(e) => setScore(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Total" type="number" value={total} onChange={(e) => setTotal(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} variant="outlined" fullWidth multiline rows={3} />
                    <br/> <br/>

                    {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={saveGrade} variant="contained" fullWidth sx={btn}>{editingId ? 'Update' : 'Add'}</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'feedback'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Feedback
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    {selectedGrade && (
                        <div>
                            <p><b>Student:</b> {selectedGrade.student.firstName} {selectedGrade.student.lastName}</p>
                            <p><b>Submission:</b> {selectedGrade.submission}</p>
                            <p><b>Score:</b> {selectedGrade.score} / {selectedGrade.total}</p>
                            <p><b>Feedback:</b> {selectedGrade.feedback || 'No feedback yet'}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )

}

export default GradebookPage