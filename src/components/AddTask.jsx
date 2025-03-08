import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, addCategory, fetchWeatherByLocation } from '../redux/slices/taskSlice'
import { 
    Box, TextField, Button, Select, MenuItem, 
    FormControl, InputLabel, Dialog, DialogTitle,
    DialogContent, DialogActions, useMediaQuery,
    Typography, Chip, Tooltip, Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import { useTheme } from '@mui/material/styles'

// Main component for adding new tasks
const AddTask = () => {
    // Basic task form state
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [category, setCategory] = useState('Personal')
    const [isOutdoor, setIsOutdoor] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    
    const dispatch = useDispatch()
    // Get weather and categories from redux store
    const { categories, weatherData, weatherLoading, weatherError } = useSelector(state => state.tasks)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    // Get weather data when user marks task as outdoor
    useEffect(() => {
        if (isOutdoor && !weatherData && !weatherLoading && !weatherError) {
            dispatch(fetchWeatherByLocation())
        }
    }, [isOutdoor, weatherData, weatherLoading, weatherError, dispatch])

    // Handle task submission
    const handleSubmit = () => {
        if (!title.trim()) return

        const newTask = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            completed: false,
            priority,
            category,
            isOutdoor
        }

        dispatch(addTask(newTask))
        // Reset form after submit
        setTitle('')
        setDescription('')
        setPriority('medium')
        setIsOutdoor(false)
        setAddDialogOpen(false)
    }

    // Add new category to the list
    const handleAddCategory = () => {
        if (newCategory.trim()) {
            dispatch(addCategory(newCategory.trim()))
            setCategory(newCategory.trim())
            setNewCategory('')
        }
        setDialogOpen(false)
    }

    // Format weather info for display
    const getWeatherInfo = () => {
        if (!weatherData) return null
        const temp = Math.round(weatherData.main.temp)
        const condition = weatherData.weather[0].main
        const location = weatherData.name
        return `${temp}°C, ${condition} in ${location}`
    }

    // Custom menu styling props
    const menuProps = {
        PaperProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
                backgroundImage: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                maxHeight: '300px',
                '& .MuiMenuItem-root': {
                    color: theme.palette.text.primary,
                    padding: '8px 16px',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.08)' 
                            : 'rgba(0,0,0,0.04)'
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.12)' 
                            : 'rgba(0,0,0,0.08)'
                    }
                }
            }
        },
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
        },
        slotProps: {
            paper: {
                elevation: 4
            }
        }
    }

    // Remove focus outline for better UX
    const noOutline = {
        '&:focus': {
            outline: 'none',
            boxShadow: 'none'
        },
        '&.MuiButtonBase-root:focus-visible': {
            outline: 'none',
            boxShadow: 'none'
        }
    }

    return (
        <>
            {/* Add task button */}
            <Box 
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    width: '100%',
                    mb: 3,
                    px: { xs: 1, sm: 0 }
                }}
            >
                <Button
                    fullWidth={isMobile}
                    variant="contained"
                    onClick={() => setAddDialogOpen(true)}
                    startIcon={<AddIcon />}
                    sx={{
                        py: 1.5,
                        px: 3,
                        ...noOutline
                    }}
                >
                    Add New Task
                </Button>
            </Box>

            {/* Main task creation dialog */}
            <Dialog 
                open={addDialogOpen} 
                onClose={() => setAddDialogOpen(false)}
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: 'none',
                        width: '100%',
                        maxWidth: isMobile ? '100%' : 400,
                        m: 0,
                        height: isMobile ? '100%' : 'auto',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    px: 2,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    Add New Task
                </DialogTitle>
                <DialogContent sx={{ 
                    p: 2,
                    overflowX: 'hidden',
                    '&.MuiDialogContent-root': {
                        paddingTop: 2
                    }
                }}>
                    {/* Task title input */}
                    <TextField
                        autoFocus={!isMobile}
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {/* Task description input */}
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={isMobile ? 4 : 3}
                        sx={{ mb: 2 }}
                    />
                    {/* Category selector */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category"
                            MenuProps={menuProps}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Priority selector */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            label="Priority"
                            MenuProps={menuProps}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Outdoor toggle button */}
                    <Box sx={{ mb: 2 }}>
                        <Button
                            fullWidth
                            onClick={() => setIsOutdoor(!isOutdoor)}
                            variant={isOutdoor ? "contained" : "outlined"}
                            startIcon={<WbSunnyIcon />}
                            color={isOutdoor ? "primary" : "inherit"}
                        >
                            {isOutdoor ? "Outdoor Task" : "Mark as Outdoor Task"}
                        </Button>
                    </Box>
                    {/* Weather info for outdoor tasks */}
                    {isOutdoor && (
                        <Box sx={{ mb: 2 }}>
                            {weatherLoading && (
                                <Alert severity="info">
                                    Fetching weather information...
                                </Alert>
                            )}
                            {weatherError && (
                                <Alert severity="warning">
                                    Unable to fetch weather data. You can still create the task.
                                </Alert>
                            )}
                            {weatherData && (
                                <Alert 
                                    severity="info"
                                    icon={<WbSunnyIcon />}
                                >
                                    <Typography variant="body2">
                                        Current weather conditions:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                                        {getWeatherInfo()}
                                    </Typography>
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ 
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1
                }}>
                    <Button 
                        onClick={() => setAddDialogOpen(false)}
                        fullWidth={isMobile}
                        sx={noOutline}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!title.trim()}
                        fullWidth={isMobile}
                        sx={noOutline}
                    >
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for adding new categories */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)}
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: 'none',
                        m: 0,
                        width: '100%',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    px: 2,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    Add New Category
                </DialogTitle>
                <DialogContent sx={{ 
                    p: 2,
                    overflowX: 'hidden'
                }}>
                    <TextField
                        autoFocus={!isMobile}
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ 
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1
                }}>
                    <Button 
                        onClick={() => setDialogOpen(false)} 
                        sx={noOutline}
                        fullWidth={isMobile}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddCategory} 
                        disabled={!newCategory.trim()}
                        variant="contained"
                        sx={{ 
                            ...noOutline,
                            width: isMobile ? '100%' : 'auto'
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddTask 