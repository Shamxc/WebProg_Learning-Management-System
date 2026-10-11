import { Alert, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {

    const card = {padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', padding: '12px', '&:hover': { backgroundColor: '#2559D6' } }
    const studentId = localStorage.getItem("studentId");
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [modal, setModal] = useState('');
    const [message, setMessage] = useState('');
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // pangkuwa
    useEffect(() => {
        axios
            .get("http://localhost:5000/students")
            .then((response) => {
                const student = response.data.find((s) => s._id === studentId);
                if (student) {
                    setFirstName(student.firstName);
                    setLastName(student.lastName);
                    setEmail(student.email);
                    setPassword(student.password);
                }
            });
    }, []);

    function openProfile(){
        setEditFirstName(firstName);
        setEditLastName(lastName);
        setEditEmail(email);
        setMessage('');
        setModal('profile');
    }

    function openPassword(){
        setCurrentPassword('');
        setNewPassword('');
        setMessage('');
        setModal('password');
    }

    // pang upd ng profile
    function saveProfile(){
        if (editFirstName.trim() === "" || editLastName.trim() === "" || editEmail.trim() === "") {
        setMessage("Please fill in all fields");
        return;
        }

        if (editFirstName.trim().length < 3 || editFirstName.trim().length > 20) {
            setMessage("First name must be 3 to 20 characters");
            return;
        }

        if (editLastName.trim().length < 3 || editLastName.trim().length > 20) {
            setMessage("Last name must be 3 to 20 characters");
            return;
        }

        if (!editEmail.includes("@") || !editEmail.includes(".") || editEmail.length > 30) {
            setMessage("Please enter a valid email");
            return;
        }

        axios
            .put("http://localhost:5000/students/" + studentId, {
                firstName: editFirstName,
                lastName: editLastName,
                email: editEmail
            })
            .then(() => {
                setFirstName(editFirstName);
                setLastName(editLastName);
                setEmail(editEmail);
                setModal('');
            });
    }

    // pang upd ng pass
    function savePassword(){
        if (currentPassword === "" || newPassword === "") {
            setMessage("Please fill in all fields");
            return;
        }

        if (currentPassword !== password) {
            setMessage("Current password is incorrect");
            return;
        }

        if (newPassword.length < 8 || newPassword.length > 16) {
            setMessage("Password must be 8 to 16 characters");
            return;
        }

        axios
            .put("http://localhost:5000/students/" + studentId, { password: newPassword })
            .then(() => {
                setPassword(newPassword);
                setModal('');
            });
    }


     function openDelete(){
        setMessage('');
        setModal('delete');
    }

    // pang delete ng acc
    function deleteAccount(){
        axios
            .delete("http://localhost:5000/students/" + studentId)
            .then(() => {
                localStorage.removeItem("studentId");
                navigate("/");
            })
            .catch(() => {
                setMessage("Something went wrong");
            });
    }


    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Profile" />
        
            <div style={{ flex: 1, padding: 30 }}>

                <div style={{ maxWidth: 600, margin: '0 auto' }}>

                <h1>Profile</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>

                    <div style={card}>
                        <h3>Profile Information</h3>
                        <TextField label="First Name" value={firstName} InputProps={{ readOnly: true }} variant="outlined" fullWidth />
                        <br/> <br/>

                        <TextField label="Last Name" value={lastName} InputProps={{ readOnly: true }} variant="outlined" fullWidth />
                        <br/> <br/>

                        <TextField label="Email" value={email} InputProps={{ readOnly: true }} variant="outlined" fullWidth />
                        <br/> <br/>
                        <Button onClick={openProfile} variant="contained" fullWidth sx={btn}>Edit Profile</Button>
                    </div>

                    <div style={card}>
                        <h3>Change Password</h3>
                        <Button onClick={openPassword} variant="contained" fullWidth sx={btn}>Change Password</Button>
                    </div>

                    <div style={card}>
                        <h3>Delete Account</h3>
                        <Button onClick={openDelete} variant="contained" fullWidth sx={{ ...btn, backgroundColor: '#D32F2F', '&:hover': { backgroundColor: '#B71C1C' } }}>Delete Account</Button>
                    </div>

                    </div>
                </div>
            </div>



        <Dialog open={modal === 'profile'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Edit Profile
                    <Button onClick={() => setModal('')} sx={{ minWidth: 0, fontSize: 20, color: '#1B1535' }}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <br/>
                    <TextField label="First Name" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Last Name" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={saveProfile} variant="contained" fullWidth sx={btn}>Save Changes</Button>
                </DialogContent>

            </Dialog>

            <Dialog open={modal === 'password'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Change Password
                    <Button onClick={() => setModal('')} sx={{ minWidth: 0, fontSize: 20, color: '#1B1535' }}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <br/>
                    <TextField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>
                    <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} variant="outlined" fullWidth />
                    <br/> <br/>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={savePassword} variant="contained" fullWidth sx={btn}>Save Changes</Button>
                </DialogContent>

            </Dialog>

            <Dialog open={modal === 'delete'} onClose={() => setModal('')} fullWidth maxWidth="sm">

                <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Delete Account
                    <Button onClick={() => setModal('')} sx={{ minWidth: 0, fontSize: 20, color: '#1B1535' }}>X</Button>
                </DialogTitle>

                <DialogContent>
                    <p style={{ textAlign: 'center' }}>Are you sure you want to delete your account?</p>

                    {message && <Alert severity="error" sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={deleteAccount} variant="contained" fullWidth sx={{ ...btn, backgroundColor: '#D32F2F', '&:hover': { backgroundColor: '#B71C1C' } }}>Yes, Delete My Account</Button>
            </DialogContent>

        </Dialog>
    </div>
    )
}

export default ProfilePage