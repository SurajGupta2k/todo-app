// Import MUI components and our custom components
import { Box, Container, Paper, Typography, Avatar } from '@mui/material'
import { Header } from '../components'
import { AddTask } from '../components'
import { TaskList } from '../components'
import { useSelector } from 'react-redux'

// Main dashboard component
const Dashboard = () => {
    // Get user info from Redux store
    const { user } = useSelector(state => state.auth)

    return (
        // Main container with scroll
        <Box sx={{ 
            minHeight: '100vh',
            width: '100%',
            backgroundColor: 'background.default',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            <Header />
            {/* Content container with responsive spacing */}
            <Container 
                maxWidth="xl" 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3 },
                    pt: { xs: 2, sm: 3 },
                    pb: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                    height: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}
            >
                {/* User profile section */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                }}>
                    {/* User avatar - shows first letter of username */}
                    <Avatar 
                        sx={{ 
                            bgcolor: 'primary.main',
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            fontSize: { xs: '1rem', sm: '1.2rem' }
                        }}
                    >
                        {user?.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        {/* Page title and welcome message */}
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                fontWeight: 600,
                                mb: 0.5,
                                lineHeight: 1.2
                            }}
                        >
                            My Tasks
                        </Typography>
                        <Typography 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        >
                            Welcome back, {user?.username}
                        </Typography>
                    </Box>
                </Box>
                
                {/* Main content area with task list */}
                <Paper 
                    elevation={0}
                    sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 3,
                        p: { xs: 2, sm: 3 },
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <AddTask />
                    <TaskList />
                </Paper>

                {/* Footer text */}
                <Box sx={{ 
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    py: 2,
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    Made by Suraj
                </Box>
            </Container>
        </Box>
    )
}

export default Dashboard 