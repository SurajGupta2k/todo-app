import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from './redux/store'
import { useSelector } from 'react-redux'
import getTheme from './theme'
import { Login, Dashboard } from './pages'

const ThemedApp = () => {
    const { mode } = useSelector(state => state.theme)
    const theme = getTheme(mode)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

// Private Route component
const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user ? children : <Navigate to="/login" />
}

const App = () => {
    return (
        <Provider store={store}>
            <ThemedApp />
        </Provider>
    )
}

export default App
