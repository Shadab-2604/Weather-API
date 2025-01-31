// models/weather.js

const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = '5Y8ZRHM75D36ZFAPS6P5U8X2V';

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

const getWeatherData = async (location) => {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${WEATHER_API_KEY}&contentType=json`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error; // Will be caught in server.js
  }
};

module.exports = { testAPI, getWeatherData };


