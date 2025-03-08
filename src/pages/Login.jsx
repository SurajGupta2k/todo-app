// Import required dependencies
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFail } from '../redux/slices/authSlice'
import { toggleTheme } from '../redux/slices/themeSlice'
import { 
    Box, TextField, Button, Typography, Alert, Paper, 
    IconButton, Tooltip, Container
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

const Login = () => {
    // Form state
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // Get auth and theme state from Redux
    const { loading, error } = useSelector(state => state.auth)
    const { mode } = useSelector(state => state.theme)

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Basic validation
        if (!email || !password || !username) {
            dispatch(loginFail('Please fill all fields'))
            return
        }

        try {
            dispatch(loginStart())
            // Fake API delay
            await new Promise(r => setTimeout(r, 1000))
            
            // Super basic auth check - just for demo
            if (email === 'test@test.com' && password === 'test123') {
                dispatch(loginSuccess({ email, username }))
                navigate('/dashboard')
            } else {
                throw new Error('Invalid credentials')
            }
        } catch (err) {
            dispatch(loginFail(err.message))
        }
    }

    return (
        // Main container
        <Box 
            sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                position: 'fixed',
                top: 0,
                left: 0
            }}
        >
            {/* Theme toggle button */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton 
                    onClick={() => dispatch(toggleTheme())}
                    sx={{ 
                        position: 'fixed',
                        top: 16,
                        right: 16,
                        zIndex: 1
                    }}
                >
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
            </Tooltip>

            {/* Login form card */}
            <Paper 
                elevation={2} 
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    mx: 2,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 3
                }}
            >
                {/* Lock icon */}
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                }}>
                    <LockOutlinedIcon sx={{ color: 'white' }} />
                </Box>

                <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
                    Welcome Back
                </Typography>

                {/* Show error if any */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 2, 
                            width: '100%',
                            borderRadius: 2
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Enter your username"
                    />
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="test@test.com"
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        placeholder="test123"
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ 
                            py: 1.5,
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    {/* Demo credentials hint */}
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            mt: 3,
                            textAlign: 'center',
                            p: 2,
                            backgroundColor: 'background.default',
                            borderRadius: 1
                        }}
                    >
                        Use any username with test@test.com / test123 to login
                    </Typography>
                </form>
            </Paper>
        </Box>
    )
}

export default Login 