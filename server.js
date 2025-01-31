const express = require('express');
const { testAPI, getWeatherData } = require('./models/weather');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

app.get('/api/weather/:location', async (req, res) => {
    const location = req.params.location;
    const apiKey = req.headers['authorization']?.split(' ')[1]; // Extract API key from request header
    const secretKey = req.headers['x-secret-key']; // Extract secret key from request header

    // Check if secret key is valid
    if (secretKey !== process.env.SECRET_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid secret key' });
    }

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }

    console.log(`Received weather request for: ${location} with API key: ${apiKey} and secret key: ${secretKey}`);

    try {
        const apiWorking = await testAPI();
        if (!apiWorking) {
            return res.status(500).json({ error: 'Weather API connection failed' });
        }

        const weatherData = await getWeatherData(location);
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
