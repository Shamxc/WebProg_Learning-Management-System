import { Button, Typography, TextField } from '@mui/material';

function LoginPage() {

    return (
        <div>

            <h1>Login Page</h1>

            <div>
                <TextField  label="Email" variant="outlined" />
                <br/> <br/>

                <TextField  label="Password" variant="outlined" />
                <br/> <br/>

                <Button variant="contained">Login</Button>
                <br/> <br/>

                <Button variant="contained">Sign Up</Button>
                <br/> <br/>
                
                <a>Forgot Password</a>

            </div>




        </div>
    )

}

export default LoginPage