// netlify/functions/server.js
const axios = require('axios');
require('dotenv').config();
const { testAPI, getWeatherData } = require('../../models/weather'); // Import from models

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Test if the weather API is working
const testAPI = async () => {
  const testUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/thane?unitGroup=us&key=${WEATHER_API_KEY}&contentType=json`;
  
  try {
    const response = await axios.get(testUrl);
    if (response.status === 200) {
      console.log('API is working');
      return true;
    } else {
      console.error('API responded with an unexpected status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('API is not working:', error.response ? error.response.data : error.message);
    return false;
  }
};

// Fetch weather data for the specified location
const getWeatherData = async (location) => {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${WEATHER_API_KEY}&contentType=json`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    throw error; // This will be caught in server.js
  }
};

// Main handler function for Netlify Function
module.exports.handler = async (event, context) => {
  const location = event.path.split('/').pop(); // Get the location from the URL
  
  // Handle the root route
  if (event.rawPath === '/') {
    return {
      statusCode: 200,
      body: 'Welcome to the Weather API! Use /api/weather/{city} to get weather data.'
    };
  }

  // Handle weather API requests
  if (event.rawPath.startsWith('/api/weather/')) {
    console.log(`Received weather request for: ${location}`);
    
    try {
      const apiWorking = await testAPI();
      if (!apiWorking) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Weather API connection failed' }) };
      }

      const weatherData = await getWeatherData(location);
      return {
        statusCode: 200,
        body: JSON.stringify(weatherData)
      };
    } catch (error) {
      return {
        statusCode: error.response?.status || 500,
        body: JSON.stringify({ error: 'Weather data fetch failed', details: error.message })
      };
    }
  }

  // If no valid route, return 404
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Page not found' })
  };
};
