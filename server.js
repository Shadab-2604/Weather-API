// server.js

const express = require('express');
const { testAPI, getWeatherData } = require('./models/weather');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// server.js
const cors = require('cors');
app.use(cors());

// Root route to show a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the Weather API! Use /api/weather/{city} to get weather data.');
});

app.get('/api/weather/:location', async (req, res) => {
  const location = req.params.location;
  console.log(`Received weather request for: ${location}`);

  try {
    const apiWorking = await testAPI();
    if (!apiWorking) {
      return res.status(500).json({ error: 'Weather API connection failed' });
    }

    const weatherData = await getWeatherData(location);
    console.log('Weather data retrieved successfully');
    res.json(weatherData);
  } catch (error) {
    console.error('Detailed API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    res.status(error.response?.status || 500).json({ 
      error: 'Weather data fetch failed', 
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
