import { Alert, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function AssessmentsPage() {

    const cell = { padding: 12, borderBottom: '1px solid #DFD7F0', textAlign: 'left' }
    const btn = { backgroundColor: '#2F6BFF', '&:hover': { backgroundColor: '#2559D6' } }
    const outlined = { color: '#5B27C9', borderColor: '#5B27C9' }
    const red = { backgroundColor: '#D32F2F', '&:hover': { backgroundColor: '#B71C1C' } }
    const modalTitle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    const closeBtn = { minWidth: 0, fontSize: 20, color: '#1B1535' }

    const role = localStorage.getItem("role");
    const canManage = role === 'TEACHER' || role === 'ADMIN';

    const [assessments, setAssessments] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);
    const [message, setMessage] = useState('');
    const [editName, setEditName] = useState('');
    const [editCourse, setEditCourse] = useState('');
    const [editSection, setEditSection] = useState('');
    const [editType, setEditType] = useState('');
    const [editDue, setEditDue] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // dropdown options: courses from mycourse, sections from the students enrolled in the chosen course
    const courses = courseList.map((c) => c.name);
    const [sections, setSections] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:5000/sections")
            .then((response) => {
                console.log("sections:", response.data);
                setSections(Array.isArray(response.data) ? response.data : []);
            })
            .catch((error) => console.log("sections error:", error));
    }, []);

    // pangkuha
    function loadAssessments(){
        axios
            .get("http://localhost:5000/assessments", { params: canManage ? {} : { student: localStorage.getItem("studentId") } })
            .then((response) => {
                setAssessments(Array.isArray(response.data) ? response.data : []);
            })
            .catch((error) => {
                console.log("Failed to load assessments:", error);
                setAssessments([]);
            });
    }

    useEffect(() => {
        loadAssessments();
        axios
            .get("http://localhost:5000/my-courses")
            .then((response) => {
                setCourseList(Array.isArray(response.data) ? response.data : []);
            })
            .catch(() => setCourseList([]));
    }, []);

    function formatDate(value){
        if (!value) return '';
        const d = new Date(String(value).slice(0, 10) + 'T00:00:00');
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function openDetails(assessment){
        setSelected(assessment);
        setModal('details');
    }

    function openAdd(){
        setEditName('');
        setEditCourse('');
        setEditSection('');
        setEditType('');
        setEditDue('');
        setEditDescription('');
        setMessage('');
        setModal('add');
    }

    function openEdit(assessment){
        setSelected(assessment);
        setEditName(assessment.name);
        setEditCourse(assessment.course);
        setEditSection(assessment.section || '');
        setEditType(assessment.type);
        setEditDue(String(assessment.due).slice(0, 10));
        setEditDescription(assessment.description);
        setMessage('');
        setModal('edit');
    }

    function openDelete(assessment){
        setSelected(assessment);
        setMessage('');
        setModal('delete');
    }

    // pang add
    function saveAdd(){
        if (editName.trim() === "" || editCourse.trim() === "" || editType.trim() === "" || editDue.trim() === "") {
            setMessage("Please fill in all fields");
            return;
        }

        axios
            .post("http://localhost:5000/assessments", {
                name: editName,
                course: editCourse,
                section: editSection,
                type: editType,
                due: editDue,
                description: editDescription
            })
            .then(() => {
                loadAssessments();
                setModal('');
            })
            .catch(() => {
                setMessage("Something went wrong");
            });
    }

    // pang edit
    function saveEdit(){
        if (editName.trim() === "" || editCourse.trim() === "" || editType.trim() === "" || editDue.trim() === "") {
            setMessage("Please fill in all fields");
            return;
        }

        axios
            .put("http://localhost:5000/assessments/" + selected._id, {
                name: editName,
                course: editCourse,
                section: editSection,
                type: editType,
                due: editDue,
                description: editDescription
            })
            .then(() => {
                loadAssessments();
                setModal('');
            })
            .catch(() => {
                setMessage("Something went wrong");
            });
    }

    // pang delete
    function deleteAssessment(){
        axios
            .delete("http://localhost:5000/assessments/" + selected._id)
            .then(() => {
                loadAssessments();
                setModal('');
            })
            .catch(() => {
                setMessage("Something went wrong");
            });
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Assessments" />

            <div style={{ flex: 1, padding: 30 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Assessments</h1>
                    {canManage && <Button onClick={openAdd} variant="contained" sx={btn}>Add Assessment</Button>}
                </div>

                <div style={{ padding: 20, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }}>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={cell}>Name</th>
                                <th style={cell}>Class</th>
                                {canManage && <th style={cell}>Section</th>}
                                <th style={cell}>Type</th>
                                <th style={cell}>Due</th>
                                {!canManage && <th style={cell}>Score / Status</th>}
                                <th style={cell}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.map((a) => (
                                <tr key={a._id}>
                                    <td style={cell}>{a.name}</td>
                                    <td style={cell}>{a.course}</td>
                                    {canManage && <td style={cell}>{a.section}</td>}
                                    <td style={cell}>{a.type}</td>
                                    <td style={cell}>{formatDate(a.due)}</td>
                                    {!canManage && <td style={cell}>{a.status}</td>}
                                    <td style={cell}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button onClick={() => openDetails(a)} variant="contained" size="small" sx={btn}>Details</Button>
                                            {canManage && <Button onClick={() => openEdit(a)} variant="outlined" size="small" sx={outlined}>Edit</Button>}
                                            {canManage && <Button onClick={() => openDelete(a)} variant="contained" size="small" sx={red}>Delete</Button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>

            <Dialog open={modal === 'details'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={modalTitle}>
                    {selected && selected.name}
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>

                <DialogContent>
                    {selected && (
                        <div>
                            <p>{selected.description}</p>
                            <p><b>Class:</b> {selected.course}</p>
                            {canManage && <p><b>Section:</b> {selected.section}</p>}
                            <p><b>Type:</b> {selected.type}</p>
                            <p><b>Due:</b> {formatDate(selected.due)}</p>
                            {!canManage && <p><b>Score / Status:</b> {selected.status}</p>}
                        </div>
                    )}
                </DialogContent>

            </Dialog>

            <Dialog open={modal === 'add' || modal === 'edit'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={modalTitle}>
                    {modal === 'add' ? 'Add Assessment' : 'Edit Assessment'}
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <br/>
                    <TextField label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField select label="Class" value={editCourse} onChange={(e) => { setEditCourse(e.target.value); setEditSection(''); }} variant="outlined" fullWidth>
                        {courses.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </TextField>
                    <br/> <br/>
                    <TextField select label="Section" value={editSection} onChange={(e) => setEditSection(e.target.value)} variant="outlined" fullWidth>
                        {sections.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    <br/> <br/>
                    <TextField select label="Type" value={editType} onChange={(e) => setEditType(e.target.value)} variant="outlined" fullWidth>
                        <MenuItem value="Quiz">Quiz</MenuItem>
                        <MenuItem value="Assignment">Assignment</MenuItem>
                    </TextField>
                    <br/> <br/>
                    <TextField label="Due Date" type="date" value={editDue} onChange={(e) => setEditDue(e.target.value)} variant="outlined" fullWidth InputLabelProps={{ shrink: true }} />
                    <br/> <br/>
                    <TextField label="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} variant="outlined" fullWidth multiline rows={3} />
                    <br/> <br/>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={modal === 'add' ? saveAdd : saveEdit} variant="contained" fullWidth sx={btn}>
                        {modal === 'add' ? 'Add Assessment' : 'Save Changes'}
                    </Button>
                </DialogContent>

            </Dialog>

            <Dialog open={modal === 'delete'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={modalTitle}>
                    Delete Assessment
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <p style={{ textAlign: 'center' }}>Are you sure you want to delete "{selected && selected.name}"?</p>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={deleteAssessment} variant="contained" fullWidth sx={red}>Yes, Delete</Button>
                </DialogContent>

            </Dialog>

        </div>
    )

}

export default AssessmentsPage