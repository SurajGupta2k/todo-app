// Import Redux Toolkit for creating slice
import { createSlice } from '@reduxjs/toolkit'

// Initial state - get user from localStorage if exists
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
}

// Auth slice with login/logout actions
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set loading state when login starts
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        // Handle successful login
        loginSuccess: (state, action) => {
            state.loading = false
            state.user = {
                email: action.payload.email,
                username: action.payload.username
            }
            state.error = null
            // Save user to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        // Handle failed login attempt
        loginFail: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        // Clear user data on logout
        logout: (state) => {
            state.user = null 
            state.error = null
            localStorage.removeItem('user')
        }
    }
})

// Export actions and reducer
export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions
export default authSlice.reducer 