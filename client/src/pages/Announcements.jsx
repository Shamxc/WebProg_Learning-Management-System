import { Alert, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function AnnouncementsPage() {

    const card = { padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', textTransform: 'none', fontWeight: 600, borderRadius: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const outlined = { color: '#5B27C9', borderColor: '#5B27C9', textTransform: 'none', fontWeight: 600, borderRadius: '12px' }
    const red = { ...btn, backgroundColor: '#D32F2F', '&:hover': { backgroundColor: '#B71C1C' } }
    const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #DFD7F0' }
    const modalTitle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    const closeBtn = { minWidth: 0, fontSize: 20, color: '#1B1535' }

    const role = localStorage.getItem("role");
    const canManage = role === 'TEACHER' || role === 'ADMIN';

    const [announcements, setAnnouncements] = useState([]);
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [message, setMessage] = useState('');

    // pangkuwa
    function loadAnnouncements(){
        axios
            .get("http://localhost:5000/announcements")
            .then((response) => {
                setAnnouncements(response.data);
            });
    }

    useEffect(() => {
        loadAnnouncements();
    }, []);

    function openDetails(a){
        setSelected(a);
        setModal('details');
    }

    function openEdit(a){
        setSelected(a);
        setEditTitle(a.title);
        setEditMessage(a.message);
        setMessage('');
        setModal('edit');
    }

    function openRemove(a){
        setSelected(a);
        setMessage('');
        setModal('remove');
    }

    // pangedit
    function saveEdit(){
        if (editTitle.trim() === "" || editMessage.trim() === "") {
            setMessage("Please fill in all fields");
            return;
        }

        axios
            .put("http://localhost:5000/announcements/" + selected._id, {
                title: editTitle,
                message: editMessage
            })
            .then(() => {
                loadAnnouncements();
                setModal('');
            })
            .catch(() => {
                setMessage("Something went wrong");
            });
    }

    // pangremove
    function removeAnnouncement(){
        axios
            .delete("http://localhost:5000/announcements/" + selected._id)
            .then(() => {
                loadAnnouncements();
                setModal('');
            })
            .catch(() => {
                setMessage("Something went wrong");
            });
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Announcements" />

            <div style={{ flex: 1, padding: 30 }}>

            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                <h1>Announcements</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div style={{ ...card, backgroundColor: '#5B27C9', color: '#fff' }}>
                        <h3>COURSE ANNOUNCEMENTS</h3>
                        <p>Updates and notices from your courses.</p>
                    </div>

                    <div style={card}>

                        {announcements.length === 0 && <p>No announcements yet.</p>}

                        {announcements.map((a) => (
                            <div key={a._id} style={row}>
                                <div>
                                    <strong>{a.title}</strong>
                                    <div>{a.course} - {a.message}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Button onClick={() => openDetails(a)} variant="contained" size="small" sx={btn}>Details</Button>
                                    {canManage && <Button onClick={() => openEdit(a)} variant="outlined" size="small" sx={outlined}>Edit</Button>}
                                    {canManage && <Button onClick={() => openRemove(a)} variant="contained" size="small" sx={red}>Remove</Button>}
                                </div>
                            </div>
                        ))}

                    </div>

                </div>

            </div>

            </div>

            <Dialog open={modal === 'details'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    {selected && selected.title}
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>

                <DialogContent>
                    {selected && (
                        <div>
                            <p>{selected.message}</p>
                            <p><b>Course:</b> {selected.course}</p>
                            <p><b>Posted:</b> {selected.date}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'edit'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Edit Announcement
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <br/>
                    <TextField label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Message" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} variant="outlined" fullWidth multiline rows={4} />
                    <br/> <br/>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={saveEdit} variant="contained" fullWidth sx={btn}>Save Changes</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'remove'} onClose={() => setModal('')} fullWidth maxWidth="sm">
                <DialogTitle style={modalTitle}>
                    Remove Announcement
                    <Button onClick={() => setModal('')} sx={closeBtn}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <p style={{ textAlign: 'center' }}>Are you sure you want to remove "{selected && selected.title}"?</p>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={removeAnnouncement} variant="contained" fullWidth sx={red}>Yes, Remove</Button>
                </DialogContent>
            </Dialog>

        </div>
    )

}

export default AnnouncementsPage