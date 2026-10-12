import { Alert, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
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
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/my-courses")
            .then((response) => {
                setCourses(response.data);
            });
    }, []);

    function openInfo(course){
        setSelected(course);
        setModal('info');
    }

    function openAnnounce(course){
        setSelected(course);
        setTitle('');
        setText('');
        setMessage('');
        setModal('announce');
    }

    function openGrade(course, student){
        setSelected(course);
        setSelectedStudent(student);
        setModal('grade');
    }

    function openLesson(course, module){
        setSelected(course);
        setSelectedModule(module);
        setModal('lesson');
    }

    // pang post ng announcement
    function postAnnouncement(){
        if (title.trim() === "" || text.trim() === "") {
            setIsError(true);
            setMessage("Please fill in all fields");
            return;
        }

        axios
            .post("http://localhost:5000/announcements", {
                course: selected.name,
                title: title,
                message: text,
                date: new Date().toISOString().slice(0, 10)
            })
            .then((response) => {
                setIsError(false);
                setMessage(response.data);
                setTitle('');
                setText('');
            })
            .catch(() => {
                setIsError(true);
                setMessage("Something went wrong");
            });
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="My Courses" />

            <div style={{ flex: 1, padding: 30, minWidth: 0 }}>

                <h1>My Courses</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {courses.map((course) => (
                        <Fragment key={course._id}>

                            <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                                <h3>{course.name} ({course.code})</h3>
                                <p>{course.students.length} students enrolled</p>
                                <Button onClick={() => openInfo(course)} variant="contained" sx={{ ...btn, marginRight: 1 }}>Course Information</Button>
                                <Button onClick={() => openAnnounce(course)} variant="contained" sx={{ ...btn, backgroundColor: '#fff', color: '#5B27C9', '&:hover': { backgroundColor: '#E4F0FF' } }}>Post Announcement</Button>
                            </div>

                            <div style={card}>
                                <h3>Students</h3>
                                <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={cell}>Name</th>
                                            <th style={cell}>Email</th>
                                            <th style={cell}>Score</th>
                                            <th style={cell}>Grade</th>
                                            <th style={cell}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.students.map((s) => (
                                            <tr key={s._id}>
                                                <td style={cell}>{s.student.firstName} {s.student.lastName}</td>
                                                <td style={cell}>{s.student.email}</td>
                                                <td style={cell}>{s.score}%</td>
                                                <td style={cell}>{s.grade}</td>
                                                <td style={cell}>
                                                    <Button onClick={() => openGrade(course, s)} variant="outlined" size="small" sx={outlined}>Details</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>

                            <div style={card}>
                                <h3>Course Content</h3>
                                {course.modules.map((m) => (
                                    <div key={m._id} style={row}>
                                        <span>{m.title}</span>
                                        <Button onClick={() => openLesson(course, m)} variant="contained" size="small" sx={btn}>Preview Lesson</Button>
                                    </div>
                                ))}
                            </div>

                        </Fragment>
                    ))}

                </div>

            </div>

            <Dialog open={modal === 'info'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Course Information
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    {selected && (
                        <div>
                            <p><b>{selected.name} ({selected.code})</b></p>
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
                            <p><b>Score:</b> {selectedStudent.score}%</p>
                            <p><b>Grade:</b> {selectedStudent.grade}</p>
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