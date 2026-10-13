import { Alert, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function MyCoursesPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const outlined = { color: '#5B27C9', borderColor: '#5B27C9', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }
    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }
    const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #DFD7F0' }
    const modalTitle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    const closeBtn = { minWidth: 0, fontSize: 20, color: '#1B1535' }

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [enrollStudent, setEnrollStudent] = useState('');
    const [enrollSection, setEnrollSection] = useState('');
    const [announceSection, setAnnounceSection] = useState('');
    const [gradeScore, setGradeScore] = useState('');
    const [gradeLetter, setGradeLetter] = useState('');

    // pangkuwa
    function loadCourses(){
        const studentId = localStorage.getItem("studentId");

        Promise.all([
            axios.get("http://localhost:5000/my-courses"),
            axios.get("http://localhost:5000/courses"),
            axios.get("http://localhost:5000/students")
        ]).then(([myRes, allRes, studentsRes]) => {
            const all = Array.isArray(allRes.data) ? allRes.data : [];
            const mine = Array.isArray(myRes.data) ? myRes.data : [];
            const students = Array.isArray(studentsRes.data) ? studentsRes.data : [];

            const me = students.find((s) => s._id === studentId);
            const myName = me ? ((me.firstName || '') + " " + (me.lastName || '')).trim() : '';

            console.log("Teacher name:", JSON.stringify(myName));
            console.log("All courses:", all.map((c) => `${c.name} -> ${JSON.stringify(c.instructor)}`));
            console.log("My courses (raw):", mine.map((c) => c.name));

            // 1. Courses where I'm the instructor
            const assigned = all.filter(
                (c) => (c.instructor || '').trim().toLowerCase() === myName.toLowerCase()
            );

            console.log("Assigned courses:", assigned.map((c) => c.name));

            // 2. Enrich each with MyCourse data (students, modules) if it exists
            const result = assigned.map((course) => {
                const detailed = mine.find(
                    (m) => (m.name || '').trim().toLowerCase() === (course.name || '').trim().toLowerCase()
                );

                if (detailed) {
                    // has a MyCourse entry -> use its students/modules/code
                    return {
                        ...course,
                        _id: detailed._id,             // use MyCourse id for enroll/grade calls
                        code: detailed.code || '',
                        students: detailed.students || [],
                        modules: detailed.modules || []
                    };
                }

                // no MyCourse entry -> show empty course so teacher still sees it
                return {
                    ...course,
                    code: course.code || '',
                    students: [],
                    modules: []
                };
            });

            console.log("Final courses:", result.map((c) => c.name));

            setCourses(result);
            setPage((p) => (p >= result.length && result.length > 0 ? result.length - 1 : p));
        });
    }

    useEffect(() => {
        loadCourses();

        axios
            .get("http://localhost:5000/students")
            .then((response) => {
                setAllStudents(response.data.filter((s) => s.role === 'STUDENT'));
            });
    }, []);

    function openEnroll(course){
        setSelected(course);
        setEnrollStudent('');
        setEnrollSection('');
        setMessage('');
        setModal('enroll');
    }

    function saveEnroll(){
        if (enrollStudent === "" || enrollSection.trim() === "") {
            setIsError(true);
            setMessage("Please choose a student and enter a section");
            return;
        }

        axios
            .post("http://localhost:5000/my-courses/" + selected._id + "/enroll", {
                student: enrollStudent,
                section: enrollSection.trim().toUpperCase()
            })
            .then(() => {
                loadCourses();
                setModal('');
            })
            .catch((error) => {
                setIsError(true);
                setMessage(error.response ? error.response.data : "Something went wrong");
            });
    }

    function openInfo(course){ setSelected(course); setModal('info'); }

    function openAnnounce(course){
        setSelected(course);
        setTitle(''); setText(''); setMessage(''); setAnnounceSection('');
        setModal('announce');
    }

    function openGrade(course, student){
        setSelected(course);
        setSelectedStudent(student);
        setGradeScore(student.score);
        setGradeLetter(student.grade || '');
        setMessage('');
        setModal('grade');
    }

    function saveGrade(){
        if (gradeScore === "" || isNaN(Number(gradeScore)) || Number(gradeScore) < 0 || Number(gradeScore) > 100 || gradeLetter.trim() === "") {
            setIsError(true);
            setMessage("Enter a score from 0 to 100 and a grade");
            return;
        }

        axios
            .put("http://localhost:5000/my-courses/" + selected._id + "/students/" + selectedStudent.student._id, {
                score: Number(gradeScore),
                grade: gradeLetter.trim().toUpperCase()
            })
            .then(() => { loadCourses(); setModal(''); })
            .catch((error) => {
                setIsError(true);
                setMessage(error.response ? error.response.data : "Something went wrong");
            });
    }

    function openLesson(course, module){
        setSelected(course);
        setSelectedModule(module);
        setModal('lesson');
    }

    function postAnnouncement(){
        if (title.trim() === "" || text.trim() === "" || announceSection === "") {
            setIsError(true);
            setMessage("Please fill in all fields");
            return;
        }

        axios
            .post("http://localhost:5000/announcements", {
                course: selected.name,
                section: announceSection,
                title: title,
                message: text,
                date: new Date().toISOString().slice(0, 10)
            })
            .then((response) => {
                setIsError(false);
                setMessage(response.data);
                setTitle(''); setText('');
            })
            .catch(() => { setIsError(true); setMessage("Something went wrong"); });
    }

    const current = courses[page];
    const totalPages = courses.length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="My Courses" />

            <div style={{ flex: 1, padding: 30, minWidth: 0 }}>

                <h1>My Courses</h1>

                {courses.length === 0 && (
                    <div style={card}>
                        <p>You have no courses assigned yet.</p>
                    </div>
                )}

                {current && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                            <h3>{current.name}{current.code ? " (" + current.code + ")" : ""}</h3>
                            <p>{current.students.length} students enrolled</p>
                            <Button onClick={() => openInfo(current)} variant="contained" sx={{ ...btn, marginRight: 1 }}>Course Information</Button>
                            <Button onClick={() => openEnroll(current)} variant="contained" sx={{ ...btn, marginRight: 1 }}>Enroll Student</Button>
                            <Button onClick={() => openAnnounce(current)} variant="contained" sx={{ ...btn, backgroundColor: '#fff', color: '#5B27C9', '&:hover': { backgroundColor: '#E4F0FF' } }}>Post Announcement</Button>
                        </div>

                        <div style={card}>
                            <h3>Students</h3>
                            {current.students.length === 0 && <p>No students enrolled yet.</p>}
                            {current.students.length > 0 && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={cell}>Name</th>
                                                <th style={cell}>Email</th>
                                                <th style={cell}>Section</th>
                                                <th style={cell}>Score</th>
                                                <th style={cell}>Grade</th>
                                                <th style={cell}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {current.students.map((s) => (
                                                <tr key={s._id}>
                                                    <td style={cell}>{s.student.firstName} {s.student.lastName}</td>
                                                    <td style={cell}>{s.student.email}</td>
                                                    <td style={cell}>{s.section}</td>
                                                    <td style={cell}>{s.score}%</td>
                                                    <td style={cell}>{s.grade}</td>
                                                    <td style={cell}>
                                                        <Button onClick={() => openGrade(current, s)} variant="outlined" size="small" sx={outlined}>Details</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div style={card}>
                            <h3>Course Content</h3>
                            {current.modules.length === 0 && <p>No modules yet.</p>}
                            {current.modules.map((m) => (
                                <div key={m._id} style={row}>
                                    <span>{m.title}</span>
                                    <Button onClick={() => openLesson(current, m)} variant="contained" size="small" sx={btn}>Preview Lesson</Button>
                                </div>
                            ))}
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

            <Dialog open={modal === 'enroll'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Enroll Student
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    <br/>
                    <TextField select label="Student" value={enrollStudent} onChange={(e) => setEnrollStudent(e.target.value)} variant="outlined" fullWidth>
                        {allStudents.map((s) => (
                            <MenuItem key={s._id} value={s._id}>{s.firstName} {s.lastName}</MenuItem>
                        ))}
                    </TextField>
                    <br/> <br/>
                    <TextField label="Section" value={enrollSection} onChange={(e) => setEnrollSection(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}
                    <Button onClick={saveEnroll} variant="contained" fullWidth sx={btn}>Enroll</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'info'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Course Information
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    {selected && (
                        <div>
                            <p><b>{selected.name}{selected.code ? " (" + selected.code + ")" : ""}</b></p>
                            <p>{selected.description}</p>
                            <p><b>Students enrolled:</b> {selected.students.length}</p>
                            <p><b>Modules:</b> {selected.modules.length}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'announce'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Post Announcement
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    <br/>
                    <TextField select label="Section" value={announceSection} onChange={(e) => setAnnounceSection(e.target.value)} variant="outlined" fullWidth>
                        {selected && [...new Set(selected.students.map((s) => s.section))].map((sec) => (
                            <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                        ))}
                    </TextField>
                    <br/> <br/>
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Message" value={text} onChange={(e) => setText(e.target.value)} variant="outlined" fullWidth multiline rows={4} />
                    <br/> <br/>
                    {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}
                    <Button onClick={postAnnouncement} variant="contained" fullWidth sx={btn}>Post</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'grade'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Grade Details
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && selected && (
                        <div>
                            <p><b>Student:</b> {selectedStudent.student.firstName} {selectedStudent.student.lastName}</p>
                            <p><b>Email:</b> {selectedStudent.student.email}</p>
                            <p><b>Course:</b> {selected.name}</p>
                            <br/>
                            <TextField label="Score (%)" type="number" value={gradeScore} onChange={(e) => setGradeScore(e.target.value)} variant="outlined" fullWidth />
                            <br/> <br/>
                            <TextField label="Grade (example: A)" value={gradeLetter} onChange={(e) => setGradeLetter(e.target.value)} variant="outlined" fullWidth />
                            <br/> <br/>
                            {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}
                            <Button onClick={saveGrade} variant="contained" fullWidth sx={btn}>Save Grade</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'lesson'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    {selectedModule && selectedModule.title}
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    {selectedModule && <p>{selectedModule.content}</p>}
                </DialogContent>
            </Dialog>

        </div>
    )

}

export default MyCoursesPage