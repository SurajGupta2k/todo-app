// Redux and routing imports
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { toggleTheme } from '../redux/slices/themeSlice'

// MUI components and icons
import { Box, IconButton, Tooltip, useTheme } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { Weather } from './'

// Header component with theme toggle and logout
const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // Get current theme mode from redux store
    const { mode } = useSelector(state => state.theme)
    const theme = useTheme()

    // Handle user logout and redirect
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        // Main header container - fixed at top
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
            p: { xs: 2, sm: 3 }, // responsive padding
            zIndex: 1
        }}>
            {/* Right side content wrapper */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: { xs: 1, sm: 2 } // responsive gap
            }}>
                {/* Weather widget */}
                <Box sx={{ width: 'auto' }}>
                    <Weather compact />
                </Box>

                {/* Theme toggle button */}
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                    <IconButton 
                        onClick={() => dispatch(toggleTheme())}
                        color="inherit"
                        size="small"
                    >
                        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>
                </Tooltip>

                {/* Logout button */}
                <Tooltip title="Logout">
                    <IconButton 
                        onClick={handleLogout}
                        color="inherit"
                        size="small"
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default Header 