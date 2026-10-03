import { Button, Typography, TextField } from '@mui/material';

function LoginPage() {

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

          <div style={{width: 300, padding: 30, textAlign: 'center', border: '1px solid #ccc', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

            <h1>Login</h1>

            <div>
                <TextField  label="Email" variant="outlined" fullWidth />
                <br/> <br/>

                <TextField  label="Password" variant="outlined" fullWidth />
                <br/> <br/>

                <Button variant="contained" fullWidth sx={{ backgroundColor: '#1E6BFF', padding: '12px', '&:hover': { backgroundColor: '#1553CC' } }}>Login</Button>
                <br/> <br/>

                <Button variant="contained" fullWidth sx={{ backgroundColor: '#1E6BFF', padding: '12px', '&:hover': { backgroundColor: '#1553CC' } }}>Sign Up</Button>
                <br/> <br/>

                <a style={{color: '#1E6BFF', cursor: 'pointer'}}>Forgot Password</a>

            </div>

        </div>


        </div>
    )

}

export default LoginPage