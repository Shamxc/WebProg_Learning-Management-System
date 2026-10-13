import { Alert, Button, Dialog, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function CoursesPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const outlined = { color: '#5B27C9', borderColor: '#5B27C9', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }
    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }
    const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #DFD7F0' }
    const modalTitle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    const closeBtn = { minWidth: 0, fontSize: 20, color: '#1B1535' }

    const isAdmin = localStorage.getItem("role") === 'ADMIN';

    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [page, setPage] = useState(0);

    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const [allTeachers, setAllTeachers] = useState([]);

    // edit instructor
    const [instructor, setInstructor] = useState('');
    // add course
    const [name, setName] = useState('');
    const [newInstructor, setNewInstructor] = useState('');
    const [description, setDescription] = useState('');

    function loadCourses(){
        axios.get("http://localhost:5000/courses").then((response) => {
            setCourses(Array.isArray(response.data) ? response.data : []);
        });
        axios.get("http://localhost:5000/my-courses").then((response) => {
            setMyCourses(Array.isArray(response.data) ? response.data : []);
        });
    }

    useEffect(() => {
    loadCourses();
        axios.get("http://localhost:5000/students").then((response) => {
            setAllTeachers(response.data.filter((s) => s.role === 'TEACHER'));
        });
    }, []);

    // students for a course = match by name in my-courses
    function studentsFor(courseName){
        const match = myCourses.find((c) => c.name === courseName);
        return match && match.students ? match.students : [];
    }

    // modules for a course = match by name in my-courses
    function modulesFor(courseName){
        const match = myCourses.find((c) => c.name === courseName);
        return match && match.modules ? match.modules : [];
    }

    function openEdit(course){
        setSelected(course);
        setInstructor(course.instructor || '');
        setMessage('');
        setModal('edit');
    }

    function saveInstructor(){
        if (instructor.trim() === "") {
            setIsError(true);
            setMessage("Please enter an instructor");
            return;
        }
        axios
            .put("http://localhost:5000/courses/" + selected._id, { instructor: instructor.trim() })
            .then(() => {
                loadCourses();
                setModal('');
            })
            .catch((error) => {
                setIsError(true);
                setMessage(error.response ? error.response.data : "Something went wrong");
            });
    }

    function openAdd(){
        setName('');
        setNewInstructor('');
        setDescription('');
        setMessage('');
        setModal('add');
    }

    function saveNewCourse(){
        if (name.trim() === "" || newInstructor.trim() === "") {
            setIsError(true);
            setMessage("Please enter a course name and instructor");
            return;
        }
        axios
            .post("http://localhost:5000/courses", {
                name: name.trim(),
                instructor: newInstructor.trim(),
                description: description.trim()
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

    const current = courses[page];
    const totalPages = courses.length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Courses" />

            <div style={{ flex: 1, padding: 30, minWidth: 0 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Courses</h1>
                    {isAdmin && <Button onClick={openAdd} variant="contained" sx={btn}>Add Course</Button>}
                </div>

                {courses.length === 0 && (
                    <div style={card}><p>No courses yet.</p></div>
                )}

                {current && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Course header card */}
                        <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                            <h2 style={{ margin: 0 }}>{current.name}</h2>
                            <p style={{ margin: '6px 0 0' }}>Instructor: {current.instructor}</p>
                            {current.description && <p style={{ margin: '6px 0 0' }}>{current.description}</p>}
                            {isAdmin && (
                                <Button
                                    onClick={() => openEdit(current)}
                                    variant="contained"
                                    sx={{ ...btn, marginTop: 2, backgroundColor: '#fff', color: '#5B27C9', '&:hover': { backgroundColor: '#E4F0FF' } }}
                                >
                                    Edit Instructor
                                </Button>
                            )}
                        </div>

                        {/* Students card */}
                        <div style={card}>
                            <h3>Students ({studentsFor(current.name).length})</h3>
                            {studentsFor(current.name).length === 0 && <p>No students enrolled yet.</p>}
                            {studentsFor(current.name).length > 0 && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={cell}>Name</th>
                                                <th style={cell}>Email</th>
                                                <th style={cell}>Section</th>
                                                <th style={cell}>Score</th>
                                                <th style={cell}>Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentsFor(current.name).map((s) => (
                                                <tr key={s._id}>
                                                    <td style={cell}>{s.student ? s.student.firstName + " " + s.student.lastName : "—"}</td>
                                                    <td style={cell}>{s.student ? s.student.email : "—"}</td>
                                                    <td style={cell}>{s.section}</td>
                                                    <td style={cell}>{s.score}</td>
                                                    <td style={cell}>{s.grade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Course content card (only if modules exist) */}
                        {modulesFor(current.name).length > 0 && (
                            <div style={card}>
                                <h3>Course Content</h3>
                                {modulesFor(current.name).map((m) => (
                                    <div key={m._id} style={row}>
                                        <span>{m.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 10 }}>
                            <Button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 0}
                                variant="outlined"
                                sx={outlined}
                            >
                                ← Previous
                            </Button>

                            <span style={{ fontWeight: 600 }}>
                                Page {page + 1} of {totalPages}
                            </span>

                            <Button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages - 1}
                                variant="outlined"
                                sx={outlined}
                            >
                                Next →
                            </Button>
                        </div>

                    </div>
                )}

            </div>

            {/* Edit Instructor */}
            <Dialog open={modal === 'edit'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Edit Instructor
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    <br/>
                    {selected && <p><b>{selected.name}</b></p>}
                    <TextField
                        select
                        label="Instructor"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        variant="outlined"
                        fullWidth
                    >
                        {allTeachers.length === 0 && <MenuItem value="">No teachers available</MenuItem>}
                        {allTeachers.map((t) => {
                            const fullName = t.firstName + " " + t.lastName;
                            return (
                                <MenuItem key={t._id} value={fullName}>
                                    {fullName} — {t.email}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                    <br/> <br/>
                    {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}
                    <Button onClick={saveInstructor} variant="contained" fullWidth sx={btn}>Save</Button>
                </DialogContent>
            </Dialog>

            {/* Add Course */}
            <Dialog open={modal === 'add'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Add Course
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>
                <DialogContent>
                    <br/>
                    <TextField label="Course Name" value={name} onChange={(e) => setName(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Instructor" value={newInstructor} onChange={(e) => setNewInstructor(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} variant="outlined" fullWidth multiline rows={3} />
                    <br/> <br/>
                    {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}
                    <Button onClick={saveNewCourse} variant="contained" fullWidth sx={btn}>Add</Button>
                </DialogContent>
            </Dialog>

        </div>
    )

}

export default CoursesPage