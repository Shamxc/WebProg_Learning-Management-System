import { Button, TextField } from '@mui/material';
import Sidebar from './Sidebar';

function ProfilePage() {

    const card = {padding: 30, backgroundColor: '#fff', border: '1px solid #DFD7F0', borderRadius: 16 }
    const btn = { backgroundColor: '#2F6BFF', padding: '12px', '&:hover': { backgroundColor: '#2559D6' } }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E4F0FF', color: '#1B1535', fontFamily: 'Figtree, sans-serif' }}>

            <Sidebar active="Profile" />
        
            <div style={{ flex: 1, padding: 30 }}>

                <div style={{ maxWidth: 600, margin: '0 auto' }}>

                <h1>Profile</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>

                    <div style={card}>
                        <h3>Profile Information</h3>
                        <TextField label="First Name" variant="outlined" fullWidth />
                        <br/> <br/>

                        <TextField label="Last Name" variant="outlined" fullWidth />
                        <br/> <br/>

                        <TextField label="Email" variant="outlined" fullWidth />
                        <br/> <br/>
                        <Button variant="contained" fullWidth sx={btn}>Save Changes</Button>
                    </div>

                    <div style={card}>
                        <h3>Change Password</h3>
                        <TextField label="Current Password" type="password" variant="outlined" fullWidth />
                        <br/> <br/>
                        <TextField label="New Password" type="password" variant="outlined" fullWidth />
                        <br/> <br/>
                        <Button variant="contained" fullWidth sx={btn}>Update Password</Button>
                    </div>


                    </div>
                </div>
            </div>

        </div>
    )

}

export default ProfilePage