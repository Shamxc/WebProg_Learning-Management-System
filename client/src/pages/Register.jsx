import { Button, Typography, TextField } from '@mui/material';

function Register() {

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'rgba(88, 161, 235, 0.66)', position: 'relative', overflow: 'hidden' }}>

            <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', top: -120, right: -120, width: 560, height: 560, borderRadius: '50%', backgroundColor: 'rgba(220, 235, 250, 0.25)' }}></div>
            <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', bottom: -140, left: -90, width: 480, height: 480, borderRadius: '50%', backgroundColor: 'rgba(91, 45, 144, 0.35)' }}></div>
            <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', width: 720, height: 720, borderRadius: '50%', backgroundColor: 'rgba(250, 249, 246, 0.12)' }}></div>

            <div style={{ position: 'relative', zIndex: 1, width: 400, padding: 30, textAlign: 'center', backgroundColor: '#FAF9F6', border: '1px solid #ccc', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

                <h1>Register Account</h1>

                <div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <TextField label="First Name" variant="outlined" fullWidth />
                        <TextField label="Last Name" variant="outlined" fullWidth />
                    </div>
                    <br/> 

                    <TextField  label="Email" variant="outlined" fullWidth />
                    <br/> <br/>

                    <TextField  label="Password" variant="outlined" fullWidth />
                    <br/> <br/>

                    <TextField  label="Re-Enter Password" variant="outlined" fullWidth />
                    <br/> <br/>

                    <Button variant="contained" fullWidth sx={{ backgroundColor: '#1E6BFF', padding: '12px', '&:hover': { backgroundColor: '#1553CC' } }}>Register</Button>
                    <br/> <br/>

                    <a style={{color: 'rgba(30, 107, 255, 0.6)', cursor: 'pointer'}}>Aready have an account? Login</a>
                    <br/> <br/>

                    <a style={{color: 'rgba(30, 107, 255, 0.6)', cursor: 'pointer'}}>Forgot Password</a>

                </div>

            </div>

        </div>
    )

}

export default Register