// Redux toolkit for state management
import { createSlice } from '@reduxjs/toolkit'

// Helper function to get initial theme on app load
const getInitialTheme = () => {
    // Try to get user's saved preference first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme

    // If no saved preference, check system theme
    // Most modern browsers support this
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }
    // Default to light if no preference found
    return 'light'
}

// Theme slice to manage dark/light mode
const themeSlice = createSlice({
    name: 'theme',
    // Set initial theme using helper function
    initialState: {
        mode: getInitialTheme()
    },
    reducers: {
        // Toggle between light/dark
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
            // Save to localStorage for persistence
            localStorage.setItem('theme', state.mode)
        },
        // Directly set theme (useful for system sync)
        setTheme: (state, action) => {
            state.mode = action.payload
            localStorage.setItem('theme', action.payload)
        }
    }
})

// Export actions and reducer
export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer 