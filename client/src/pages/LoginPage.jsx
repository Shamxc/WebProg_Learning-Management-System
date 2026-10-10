import { Button, TextField } from '@mui/material';

function LoginPage() {

    const btn = { backgroundColor: '#2F6BFF', padding: '12px', borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: 16, '&:hover': { backgroundColor: '#2559D6' } }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <div style={{ width: 480, overflow: 'hidden', borderRadius: 24, border: '1px solid #DFD7F0', boxShadow: '0 8px 24px rgba(91, 39, 201, 0.2)' }}>

                <div style={{ position: 'relative', overflow: 'hidden', padding: '30px 30px 60px', backgroundColor: '#5B27C9', color: '#fff' }}>

                    <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', top: -90, right: -90, width: 240, height: 240, borderRadius: '50%', backgroundColor: '#2F6BFF' }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ margin: 0, textAlign: 'right' }}>LUMEN</h2>
                        <h1 style={{ margin: '30px 0 6px' }}>Welcome back</h1>
                        <p style={{ margin: 0 }}>Log in to pick up your lessons where you left off.</p>
                    </div>

                </div>

                <div style={{ position: 'relative', marginTop: -30, padding: 30, backgroundColor: '#E4F0FF', borderRadius: '30px 0 0 0' }}>

                    <TextField label="Email" variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />
                    <br/> <br/>

                    <TextField label="Password" type="password" variant="outlined" fullWidth sx={{ backgroundColor: '#fff' }} />

                    <div style={{ textAlign: 'right', margin: '10px 0 20px' }}>
                        <a style={{ color: '#5B27C9', cursor: 'pointer', textDecoration: 'underline' }}>Forgot password?</a>
                    </div>

                    <Button variant="contained" fullWidth sx={btn}>Log in</Button>

                    <p style={{ textAlign: 'center', marginTop: 24 }}>
                        New to LUMEN? <a style={{ color: '#5B27C9', cursor: 'pointer', fontWeight: 600 }}>Create an account</a>
                    </p>

                </div>

            </div>

        </div>
    )

}

export default LoginPage