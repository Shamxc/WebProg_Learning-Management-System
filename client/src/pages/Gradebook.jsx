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
    const outlined = { color: '#5B27C9', borderColor: '#5B27C9', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);

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

    const current = courses[page];
    const totalPages = courses.length;
    const courseCode = current ? current.code : '';
    const courseName = current ? current.name : '';
    const students = current ? current.students.map((s) => s.student) : [];

    // grades ng current course (match by name OR code para kasama yung luma at bago)
    const courseGrades = grades.filter(
        (g) => g.course === courseName || g.course === courseCode
    );

    // assessments ng course lang
    const courseAssessments = assessments.filter(
        (a) => a.course === courseName || a.course === courseCode
    );

    // pangkuwa ng lahat ng grades
    function loadGrades(){
        axios
            .get("http://localhost:5000/grades")
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

    // pangkuwa ng courses + students ng teacher
    useEffect(() => {
        const studentId = localStorage.getItem("studentId");

        Promise.all([
            axios.get("http://localhost:5000/my-courses"),
            axios.get("http://localhost:5000/courses"),
            axios.get("http://localhost:5000/students")
        ]).then(([myRes, allRes, studentsRes]) => {
            const all = Array.isArray(allRes.data) ? allRes.data : [];
            const mine = Array.isArray(myRes.data) ? myRes.data : [];
            const everyone = Array.isArray(studentsRes.data) ? studentsRes.data : [];

            const me = everyone.find((s) => s._id === studentId);
            const myName = me ? ((me.firstName || '') + " " + (me.lastName || '')).trim() : '';

            const assigned = all.filter(
                (c) => (c.instructor || '').trim().toLowerCase() === myName.toLowerCase()
            );

            const result = assigned.map((course) => {
                const detailed = mine.find(
                    (m) => (m.name || '').trim().toLowerCase() === (course.name || '').trim().toLowerCase()
                );

                if (detailed) {
                    return {
                        ...course,
                        _id: detailed._id,
                        code: detailed.code || '',
                        students: detailed.students || []
                    };
                }

                return {
                    ...course,
                    code: course.code || '',
                    students: []
                };
            });

            setCourses(result);
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
            course: courseName,
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
        if (courseGrades.length === 0) {
            return 0;
        }

        let sum = 0;
        for (let i = 0; i < courseGrades.length; i++) {
            sum = sum + (courseGrades[i].score / courseGrades[i].total) * 100;
        }

        return (sum / courseGrades.length).toFixed(1);
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Gradebook" />

            <div style={{ flex: 1, padding: 30 }}>

            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <h1>Gradebook</h1>

                {courses.length === 0 && <p>You have no courses assigned yet.</p>}

                {current && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                            <h3>{courseName}{courseCode ? " (" + courseCode + ")" : ""}</h3>
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
                                    {courseGrades.map((g) => (
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

                            {courseGrades.length === 0 && <p>No grades yet.</p>}
                        </div>

                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 10 }}>
                                <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outlined" sx={outlined}>← Previous</Button>
                                <span style={{ fontWeight: 600 }}>Page {page + 1} of {totalPages}</span>
                                <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} variant="outlined" sx={outlined}>Next →</Button>
                            </div>
                        )}

                    </div>
                )}

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