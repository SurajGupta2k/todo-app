import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Checkbox, Select, MenuItem, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControl, InputLabel, Chip, Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, WbSunny as WbSunnyIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { toggleComplete, setPriority, removeTask, updateTask } from '../redux/slices/taskSlice';

// Main task item component that displays individual tasks
const TaskItem = ({ task }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    
    // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description || '');
    const [editedCategory, setEditedCategory] = useState(task.category || 'Personal');
    const [isOutdoor, setIsOutdoor] = useState(task.isOutdoor || false);
    const weatherData = useSelector(state => state.tasks.weatherData);

    // Task action handlers
    const handleToggle = () => {
        dispatch(toggleComplete(task.id));
    };

    const handlePriorityChange = (event) => {
        dispatch(setPriority({ id: task.id, priority: event.target.value }));
    };

    const handleDelete = () => {
        dispatch(removeTask(task.id));
    };

    // Save edited task details
    const handleEdit = () => {
        if (editedTitle.trim() !== '') {
            dispatch(updateTask({
                id: task.id,
                title: editedTitle.trim(),
                description: editedDescription.trim(),
                category: editedCategory,
                isOutdoor
            }));
            setEditDialogOpen(false);
        }
    };

    // Custom menu styling
    const menuProps = {
        PaperProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
                backgroundImage: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '& .MuiMenuItem-root': {
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.08)' 
                            : 'rgba(0,0,0,0.04)'
                    }
                }
            }
        }
    };

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
    };

    // Get color based on priority level
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return theme.palette.error.main;
            case 'medium':
                return theme.palette.warning.main;
            case 'low':
                return theme.palette.success.main;
            default:
                return theme.palette.text.secondary;
        }
    };

    // Get weather info for outdoor tasks
    const getWeatherInfo = () => {
        if (!weatherData || !isOutdoor) return null;
        const temp = Math.round(weatherData.main.temp);
        const condition = weatherData.weather[0].main;
        return `${temp}°C, ${condition}`;
    };

    return (
        <>
            {/* Main task container */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    opacity: task.completed ? 0.8 : 1,
                    '&:hover': {
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transform: 'translateY(-1px)',
                        backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)'
                    },
                    ...noOutline,
                    borderLeft: 6,
                    borderLeftColor: task.completed 
                        ? theme.palette.success.main 
                        : getPriorityColor(task.priority)
                }}
                onClick={handleToggle}
            >
                {/* Checkbox for task completion */}
                <Checkbox
                    checked={task.completed}
                    onChange={handleToggle}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&.Mui-checked': {
                            color: theme.palette.success.main
                        },
                        ...noOutline,
                        mt: 0.5
                    }}
                />

                {/* Task content area */}
                <Box 
                    sx={{ 
                        flex: 1, 
                        ml: 2,
                        mr: 2,
                        cursor: 'pointer',
                        userSelect: 'none',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 1
                    }}>
                        {/* Task title */}
                        <Typography
                            variant="body1"
                            sx={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                                fontWeight: 500,
                                wordBreak: 'break-word'
                            }}
                        >
                            {task.title}
                        </Typography>

                        {/* Task tags/chips */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={task.category || 'Personal'}
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255,255,255,0.05)'
                                        : 'rgba(0,0,0,0.04)',
                                    color: theme.palette.text.secondary
                                }}
                            />
                            {task.completed && (
                                <Chip
                                    label="Completed"
                                    size="small"
                                    color="success"
                                    sx={{ fontWeight: 500 }}
                                />
                            )}
                            {isOutdoor && weatherData && (
                                <Tooltip title="Current weather for outdoor task">
                                    <Chip
                                        icon={<WbSunnyIcon sx={{ fontSize: 16 }} />}
                                        label={getWeatherInfo()}
                                        size="small"
                                        sx={{
                                            backgroundColor: theme.palette.info.main,
                                            color: '#fff'
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    </Box>

                    {/* Task description if exists */}
                    {task.description && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                mt: 0.5,
                                wordBreak: 'break-word',
                                textDecoration: task.completed ? 'line-through' : 'none'
                            }}
                        >
                            {task.description}
                        </Typography>
                    )}
                </Box>

                {/* Task actions - priority, edit, delete */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0
                }}>
                    <Select
                        value={task.priority}
                        onChange={handlePriorityChange}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        MenuProps={menuProps}
                        sx={{
                            minWidth: 100,
                            backgroundColor: theme.palette.background.paper,
                            color: getPriorityColor(task.priority),
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(255,255,255,0.2)' 
                                    : 'rgba(0,0,0,0.23)'
                            },
                            ...noOutline
                        }}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                    <Box sx={{ display: 'flex' }}>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditDialogOpen(true);
                                setEditedTitle(task.title);
                                setEditedDescription(task.description || '');
                                setEditedCategory(task.category || 'Personal');
                                setIsOutdoor(task.isOutdoor || false);
                            }}
                            sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    color: theme.palette.primary.main
                                },
                                ...noOutline
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    color: theme.palette.error.main
                                },
                                ...noOutline
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* Edit task dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: 'none',
                        width: '100%',
                        maxWidth: 400,
                        mx: 2
                    }
                }}
            >
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={editedCategory}
                            onChange={(e) => setEditedCategory(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="Personal">Personal</MenuItem>
                            <MenuItem value="Work">Work</MenuItem>
                            <MenuItem value="Shopping">Shopping</MenuItem>
                            <MenuItem value="Health">Health</MenuItem>
                            <MenuItem value="Outdoor">Outdoor</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <Button
                            onClick={() => setIsOutdoor(!isOutdoor)}
                            variant={isOutdoor ? "contained" : "outlined"}
                            startIcon={<WbSunnyIcon />}
                            color={isOutdoor ? "primary" : "inherit"}
                        >
                            {isOutdoor ? "Outdoor Task" : "Mark as Outdoor Task"}
                        </Button>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button 
                        onClick={() => setEditDialogOpen(false)}
                        sx={noOutline}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEdit}
                        variant="contained"
                        disabled={!editedTitle.trim()}
                        sx={noOutline}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskItem;