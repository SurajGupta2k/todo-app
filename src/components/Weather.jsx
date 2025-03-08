// MUI and icon imports
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWeatherByLocation, setLocationPermissionAsked } from '../redux/slices/taskSlice'
import { Box, Typography, CircularProgress, IconButton, Tooltip, Stack } from '@mui/material'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import CloudIcon from '@mui/icons-material/Cloud'
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'

const Weather = ({ compact = false }) => {
    const dispatch = useDispatch()
    // Get weather states from Redux store
    const { 
        weatherData, 
        weatherLoading, 
        weatherError, 
        locationPermissionAsked,
        isLocating 
    } = useSelector(state => state.tasks)

    // Request location access and fetch weather
    const requestLocationPermission = () => {
        localStorage.removeItem('userLocation')
        dispatch(setLocationPermissionAsked(true))
        dispatch(fetchWeatherByLocation())
    }

    // Ask for location permission on first load
    useEffect(() => {
        if (!locationPermissionAsked) {
            requestLocationPermission()
        }
    }, [locationPermissionAsked, dispatch])

    // Helper to show different weather icons based on weather code
    const getWeatherIcon = (weatherId) => {
        const iconProps = { sx: { fontSize: compact ? 18 : { xs: 20, sm: 24 } } }
        if (weatherId >= 200 && weatherId < 300) return <ThunderstormIcon {...iconProps} />
        if (weatherId >= 800) return <WbSunnyIcon {...iconProps} />
        return <CloudIcon {...iconProps} />
    }

    // Show loading state
    if (weatherLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 0.5,
                px: 1.5,
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'white',
                width: 'auto',
                justifyContent: 'center'
            }}>
                <CircularProgress size={14} color="inherit" />
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {isLocating ? 'Locating...' : 'Loading...'}
                </Typography>
            </Box>
        )
    }

    // Show error state with retry button
    if (weatherError) {
        return (
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                py: 0.5,
                px: 1.5,
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'white',
                width: 'auto',
                justifyContent: 'center'
            }}>
                <Tooltip title="Update location">
                    <IconButton 
                        size="small" 
                        onClick={requestLocationPermission}
                        sx={{ 
                            color: 'inherit',
                            opacity: 0.8,
                            padding: '2px',
                            '&:hover': { opacity: 1 }
                        }}
                    >
                        <LocationSearchingIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }

    if (!weatherData) return null

    // Main weather display with temp, location and update button
    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.75,
            py: 0.5,
            px: 1.5,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'white',
            width: 'auto',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
        }}>
            {getWeatherIcon(weatherData.weather[0].id)}
            <Stack 
                spacing={0} 
                direction="row" 
                alignItems="baseline"
                sx={{ gap: 0.5 }}
            >
                <Typography sx={{ 
                    fontWeight: 500,
                    fontSize: '1rem',
                    lineHeight: 1
                }}>
                    {Math.round(weatherData.main.temp)}°C
                </Typography>
                {/* Only show location name in compact mode */}
                {compact && (
                    <Typography 
                        sx={{ 
                            opacity: 0.9,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            lineHeight: 1,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        {weatherData.name}
                    </Typography>
                )}
            </Stack>
            <Tooltip title="Update location">
                <IconButton 
                    size="small" 
                    onClick={requestLocationPermission}
                    sx={{ 
                        color: 'inherit',
                        opacity: 0.8,
                        padding: '2px',
                        '&:hover': { opacity: 1 }
                    }}
                >
                    <LocationOnIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default Weather 