import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Tabs, Tab, Typography, FormControl, Select, MenuItem, TextField, InputAdornment, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Divider, InputLabel } from '@mui/material'
import TaskItem from './TaskItem'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from '@mui/material/styles'
import { addCategory, removeCategory, refreshWeather } from '../redux/slices/taskSlice'

const TaskList = () => {
    // State for filtering and sorting
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    
    // Dialog states
    const [newCategoryDialog, setNewCategoryDialog] = useState(false)
    const [manageCategoriesDialog, setManageCategoriesDialog] = useState(false)
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [newCategory, setNewCategory] = useState('')
    const [showOutdoorOnly, setShowOutdoorOnly] = useState(false)
    
    const dispatch = useDispatch()
    const { tasks, categories, lastWeatherUpdate } = useSelector(state => state.tasks)
    const theme = useTheme()

    // Checks weather every 30min for outdoor tasks - pretty neat!
    useEffect(() => {
        const hasOutdoorTasks = tasks.some(task => task.isOutdoor)
        if (hasOutdoorTasks) {
            const now = Date.now()
            const thirtyMinutes = 30 * 60 * 1000
            if (!lastWeatherUpdate || now - lastWeatherUpdate > thirtyMinutes) {
                dispatch(refreshWeather())
            }
            const interval = setInterval(() => {
                dispatch(refreshWeather())
            }, thirtyMinutes)
            return () => clearInterval(interval)
        }
    }, [dispatch, tasks, lastWeatherUpdate])

    // Category management functions
    const handleAddCategory = () => {
        if (newCategory.trim()) {
            dispatch(addCategory(newCategory.trim()))
            setNewCategory('')
            setNewCategoryDialog(false)
        }
    }

    const handleDeleteCategory = () => {
        if (categoryToDelete) {
            dispatch(removeCategory(categoryToDelete))
            if (selectedCategory === categoryToDelete) {
                setSelectedCategory('all')
            }
            setCategoryToDelete(null)
            setConfirmDeleteDialog(false)
        }
    }

    // Built-in categories that can't be deleted
    const defaultCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Outdoor']
    const isDefaultCategory = (category) => defaultCategories.includes(category)
    const customCategories = categories.filter(category => !isDefaultCategory(category))

    // Custom styling for dropdown menus
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
        }
    }

    // Main filtering logic - handles search, categories, completion status etc
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = 
            filter === 'all' ? true :
            filter === 'active' ? !task.completed :
            task.completed

        const matchesSearch = 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory =
            selectedCategory === 'all' ? true :
            task.category === selectedCategory

        const matchesOutdoor = 
            showOutdoorOnly ? task.isOutdoor : true

        return matchesFilter && matchesSearch && matchesCategory && matchesOutdoor
    })

    // Sorting logic - can sort by date, priority, category or completion
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'date') {
            return b.id - a.id
        }
        if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        if (sortBy === 'category') {
            return a.category.localeCompare(b.category)
        }
        if (sortBy === 'completion') {
            if (a.completed === b.completed) return b.id - a.id
            return a.completed ? 1 : -1
        }
        return 0
    })

    return (
        <Box sx={{ width: '100%' }}>
            {/* Search and sort controls */}
            <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3,
                alignItems: { xs: 'stretch', sm: 'center' }
            }}>
                <TextField
                    placeholder="Search tasks..."
                    size="small"
                    fullWidth
                    sx={{ flex: 1 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        MenuProps={menuProps}
                        label="Sort By"
                    >
                        <MenuItem value="date">Latest First</MenuItem>
                        <MenuItem value="priority">By Priority</MenuItem>
                        <MenuItem value="category">By Category</MenuItem>
                        <MenuItem value="completion">By Completion</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Filter tabs and category chips */}
            <Box sx={{ mb: 3 }}>
                <Tabs 
                    value={filter}
                    onChange={(e, v) => setFilter(v)}
                    sx={{ mb: 2 }}
                >
                    <Tab value="all" label={`All (${tasks.length})`} />
                    <Tab value="active" label={`Active (${tasks.filter(t => !t.completed).length})`} />
                    <Tab value="completed" label={`Completed (${tasks.filter(t => t.completed).length})`} />
                </Tabs>

                <Box sx={{ 
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <Chip 
                        label="All Categories"
                        onClick={() => setSelectedCategory('all')}
                        color={selectedCategory === 'all' ? 'primary' : 'default'}
                        sx={{ 
                            borderRadius: 1,
                            fontWeight: selectedCategory === 'all' ? 500 : 400
                        }}
                    />
                    {categories.map(category => (
                        <Chip 
                            key={category}
                            label={`${category} (${tasks.filter(t => t.category === category).length})`}
                            onClick={() => setSelectedCategory(category)}
                            color={selectedCategory === category ? 'primary' : 'default'}
                            sx={{ 
                                borderRadius: 1,
                                fontWeight: selectedCategory === category ? 500 : 400
                            }}
                        />
                    ))}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            startIcon={<AddIcon />}
                            size="small"
                            onClick={() => setNewCategoryDialog(true)}
                        >
                            Add
                        </Button>
                        {customCategories.length > 0 && (
                            <Button 
                                startIcon={<DeleteIcon />}
                                size="small"
                                color="error"
                                onClick={() => setManageCategoriesDialog(true)}
                            >
                                Manage
                            </Button>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Chip
                        label="Outdoor Tasks Only"
                        onClick={() => setShowOutdoorOnly(!showOutdoorOnly)}
                        color={showOutdoorOnly ? 'primary' : 'default'}
                        sx={{ 
                            borderRadius: 1,
                            fontWeight: showOutdoorOnly ? 500 : 400
                        }}
                    />
                </Box>
            </Box>

            {/* Task list */}
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {sortedTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
                {sortedTasks.length === 0 && (
                    <Typography 
                        color="text.secondary"
                        sx={{ 
                            textAlign: 'center',
                            py: 4
                        }}
                    >
                        {searchQuery 
                            ? 'No tasks match your search'
                            : filter === 'completed'
                                ? 'No completed tasks yet'
                                : filter === 'active'
                                    ? 'No active tasks'
                                    : 'No tasks found'
                        }
                    </Typography>
                )}
            </Box>

            {/* Dialog for adding new categories */}
            <Dialog 
                open={newCategoryDialog} 
                onClose={() => setNewCategoryDialog(false)}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 400,
                        mx: 2
                    }
                }}
            >
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setNewCategoryDialog(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddCategory}
                        variant="contained"
                        disabled={!newCategory.trim()}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for managing existing categories */}
            <Dialog
                open={manageCategoriesDialog}
                onClose={() => setManageCategoriesDialog(false)}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 400,
                        mx: 2
                    }
                }}
            >
                <DialogTitle>Manage Categories</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Default categories cannot be deleted. You can delete any custom categories you've created.
                    </Typography>
                    <List sx={{ 
                        width: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: 'divider'
                    }}>
                        {defaultCategories.map((category, index) => (
                            <ListItem
                                key={category}
                                sx={{
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                    borderBottom: index !== defaultCategories.length - 1 ? 1 : 0,
                                    borderColor: 'divider'
                                }}
                            >
                                <ListItemText 
                                    primary={category}
                                    secondary="Default category"
                                />
                            </ListItem>
                        ))}
                        {customCategories.length > 0 && <Divider />}
                        {customCategories.map((category) => (
                            <ListItem
                                key={category}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        onClick={() => {
                                            setCategoryToDelete(category)
                                            setConfirmDeleteDialog(true)
                                        }}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText 
                                    primary={category}
                                    secondary={`${tasks.filter(t => t.category === category).length} tasks`}
                                />
                            </ListItem>
                        ))}
                        {customCategories.length === 0 && (
                            <ListItem>
                                <ListItemText 
                                    secondary="No custom categories yet"
                                    sx={{ textAlign: 'center' }}
                                />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setManageCategoriesDialog(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation dialog for deleting categories */}
            <Dialog
                open={confirmDeleteDialog}
                onClose={() => {
                    setConfirmDeleteDialog(false)
                    setCategoryToDelete(null)
                }}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 400,
                        mx: 2
                    }
                }}
            >
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the category "{categoryToDelete}"? Tasks in this category will be moved to "Personal".
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => {
                        setConfirmDeleteDialog(false)
                        setCategoryToDelete(null)
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => {
                            handleDeleteCategory()
                            if (!customCategories.filter(c => c !== categoryToDelete).length) {
                                setManageCategoriesDialog(false)
                            }
                        }}
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default TaskList 