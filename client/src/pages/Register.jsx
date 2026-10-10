import { Alert, Button, TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

function Register() {

    const btn = { backgroundColor: '#2F6BFF', padding: '12px', borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: 16, '&:hover': { backgroundColor: '#2559D6' } }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    function registerStudent(){

    if (password !== confirmPassword) {
        setIsError(true);
        setMessage("Passwords do not match");
        return;
    }

    axios
        .get("http://localhost:5000/students")
        .then((response) => {
            const existing = response.data.find((student) => student.email === email);
            if (existing) {
                setIsError(true);
                setMessage("Email already registered");
                return;
            }

            axios
                .post("http://localhost:5000/register", {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })

                .then((response) => {
                    setIsError(false);
                    setMessage(response.data);
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                })

                .catch((error) => {
                    setIsError(true);
                    setMessage(error.response ? error.response.data : "Something went wrong");
                });
            });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <div style={{ width: 500, overflow: 'hidden', borderRadius: 24, border: '1px solid #DFD7F0', boxShadow: '0 8px 24px rgba(91, 39, 201, 0.2)' }}>

                <div style={{ position: 'relative', overflow: 'hidden', padding: '30px 30px 60px', backgroundColor: '#5B27C9', color: '#fff' }}>

                    <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', top: -90, right: -90, width: 240, height: 240, borderRadius: '50%', backgroundColor: '#2F6BFF' }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ margin: 0, textAlign: 'right' }}>LUMEN</h2>
                        <h1 style={{ margin: '30px 0 6px' }}>Create your account</h1>
                        <p style={{ margin: 0 }}>Join a course and start your first lesson today.</p>
                    </div>

                </div>

                <div style={{ position: 'relative', marginTop: -30, padding: 30, backgroundColor: '#E4F0FF', borderRadius: '30px 0 0 0' }}>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />
                        <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />
                    </div>
                    <br/>

                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />
                    <br/> <br/>

                    <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />
                    <br/> <br/>

                    <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />
                    <br/> <br/>

                    {message && <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: 2 }}>{message}</Alert>}

                    <Button onClick={registerStudent} variant="contained" fullWidth sx={btn}>Register</Button>

                    <p style={{ textAlign: 'center', marginTop: 24 }}>
                        Already have an account? <a style={{ color: '#5B27C9', cursor: 'pointer', fontWeight: 600 }}>Log in</a>
                    </p>

                </div>

            </div>

        </div>
    )

}

export default Register