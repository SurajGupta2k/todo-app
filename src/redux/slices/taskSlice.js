import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getWeather, getWeatherByCoords, getLocationByIP } from '../../utils/weatherApi'

// Fetches weather data for a specific city
export const fetchWeather = createAsyncThunk(
    'tasks/fetchWeather',
    async (city) => {
        const response = await getWeather(city)
        return response
    }
)

// Gets weather based on user location - tries browser geolocation first, falls back to IP
export const fetchWeatherByLocation = createAsyncThunk(
    'tasks/fetchWeatherByLocation',
    async (_, { rejectWithValue }) => {
        try {
            // Check cached coords first to avoid unnecessary lookups
            const cachedLocation = localStorage.getItem('userLocation')
            if (cachedLocation) {
                const { latitude, longitude } = JSON.parse(cachedLocation)
                const response = await getWeatherByCoords(latitude, longitude)
                return response
            }

            // Try browser geolocation with timeout
            const position = await Promise.race([
                new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Location request timed out')), 5000)
                )
            ])
            
            const { latitude, longitude } = position.coords
            // Save coords for next time
            localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }))
            const response = await getWeatherByCoords(latitude, longitude)
            return response
        } catch (error) {
            // Browser geolocation failed - try IP fallback
            try {
                const ipLocation = await getLocationByIP()
                localStorage.setItem('userLocation', JSON.stringify({
                    latitude: ipLocation.latitude,
                    longitude: ipLocation.longitude
                }))
                const response = await getWeatherByCoords(ipLocation.latitude, ipLocation.longitude)
                return response
            } catch (fallbackError) {
                return rejectWithValue('Unable to fetch weather data')
            }
        }
    }
)

// Updates weather data if we already have some
export const refreshWeather = createAsyncThunk(
    'tasks/refreshWeather',
    async (_, { dispatch, getState }) => {
        const { tasks } = getState()
        if (tasks.weatherData) {
            dispatch(fetchWeatherByLocation())
        }
    }
)

// Initial state with local storage persistence
const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    categories: JSON.parse(localStorage.getItem('categories')) || ['Work', 'Personal', 'Shopping', 'Health', 'Outdoor'],
    loading: false,
    error: null,
    weatherData: null,
    weatherLoading: false,
    weatherError: null,
    locationPermissionAsked: false,
    isLocating: false,
    lastWeatherUpdate: null
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Adds new task with defaults
        addTask: (state, action) => {
            const newTask = {
                ...action.payload,
                category: action.payload.category || 'Personal',
                isOutdoor: action.payload.isOutdoor || false
            }
            state.tasks.push(newTask)
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        // Removes task by id
        removeTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload)
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        // Updates existing task
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id)
            if (index !== -1) {
                state.tasks[index] = { 
                    ...state.tasks[index], 
                    ...action.payload,
                    isOutdoor: action.payload.isOutdoor || false
                }
                localStorage.setItem('tasks', JSON.stringify(state.tasks))
            }
        },
        // Toggles task completion status
        toggleComplete: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload)
            if (task) {
                task.completed = !task.completed
                localStorage.setItem('tasks', JSON.stringify(state.tasks))
            }
        },
        // Sets task priority level
        setPriority: (state, action) => {
            const { id, priority } = action.payload
            const task = state.tasks.find(task => task.id === id)
            if (task) {
                task.priority = priority
                localStorage.setItem('tasks', JSON.stringify(state.tasks))
            }
        },
        // Location permission tracking
        setLocationPermissionAsked: (state, action) => {
            state.locationPermissionAsked = action.payload
        },
        setIsLocating: (state, action) => {
            state.isLocating = action.payload
        },
        // Category management
        addCategory: (state, action) => {
            if (!state.categories.includes(action.payload)) {
                state.categories.push(action.payload)
                localStorage.setItem('categories', JSON.stringify(state.categories))
            }
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(cat => cat !== action.payload)
            // Reset removed category to Personal
            state.tasks = state.tasks.map(task => ({
                ...task,
                category: task.category === action.payload ? 'Personal' : task.category
            }))
            localStorage.setItem('categories', JSON.stringify(state.categories))
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        }
    },
    // Handle async weather actions
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.weatherLoading = true
                state.weatherError = null
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.weatherLoading = false
                state.weatherData = action.payload
                state.lastWeatherUpdate = Date.now()
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.weatherLoading = false
                state.weatherError = action.payload || 'Failed to fetch weather data'
            })
            .addCase(fetchWeatherByLocation.pending, (state) => {
                state.weatherLoading = true
                state.isLocating = true
                state.weatherError = null
            })
            .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
                state.weatherLoading = false
                state.isLocating = false
                state.weatherData = action.payload
                state.lastWeatherUpdate = Date.now()
            })
            .addCase(fetchWeatherByLocation.rejected, (state, action) => {
                state.weatherLoading = false
                state.isLocating = false
                state.weatherError = action.payload || 'Failed to fetch weather data'
            })
    }
})

export const { 
    addTask, removeTask, updateTask, toggleComplete, setPriority,
    setLocationPermissionAsked, setIsLocating, addCategory, removeCategory
} = taskSlice.actions

export default taskSlice.reducer 