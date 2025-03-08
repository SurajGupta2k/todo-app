const API_KEY = 'b117a9d7ba940b37c31d546ca5d85eb2' // You'll need to replace this with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const getWeatherByCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
        if (!response.ok) {
            throw new Error('Weather data not available')
        }
        return await response.json()
    } catch (error) {
        console.error('Weather API Error:', error)
        throw error
    }
}

export const getLocationByIP = async () => {
    try {
        const response = await fetch('https://ipapi.co/json/')
        if (!response.ok) {
            throw new Error('Location data not available')
        }
        const data = await response.json()
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city
        }
    } catch (error) {
        console.error('IP Geolocation Error:', error)
        throw error
    }
}

// Keep the original city-based function as fallback
export const getWeather = async (city) => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        )
        if (!response.ok) {
            throw new Error('Weather data not available')
        }
        return await response.json()
    } catch (error) {
        console.error('Weather API Error:', error)
        throw error
    }
} 