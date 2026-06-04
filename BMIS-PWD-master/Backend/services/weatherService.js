import axios from 'axios';

// Ensure your .env variable is prefixed with VITE_ if using Vite
const apiKey = import.meta.env.VITE_WEATHER_KEY || '437db0f0267f40b1bcc173618260105';
const baseUrl = 'https://api.weatherapi.com/v1/current.json';

/**
 * Fetches current weather for a specific city
 * @param {string} city - The name of the city (e.g., 'Imus')
 */
export const fetchWeather = async (city) => {
    try {
        const response = await axios.get(baseUrl, {
            params: {
                key: apiKey,
                q: city,
                aqi: 'no'
            }
        });

        // Axios automatically throws for 4xx/5xx errors, 
        // and parses JSON into response.data
        return response.data;

    } catch (error) {
        // Log more specific error info from the API response
        const errorMessage = error.response?.data?.error?.message || "Failed to fetch weather data";
        console.error("WeatherAPI Error:", errorMessage);
        throw new Error(errorMessage);
    }
};