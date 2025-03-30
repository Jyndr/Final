require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Weather endpoint
app.get('/weather', async (req, res) => {
    try {
        const { city } = req.query;
        
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        
        const weatherData = {
            temperature: response.data.main.temp,
            feelsLike: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            windSpeed: response.data.wind.speed,
            description: response.data.weather[0].description,
            city: response.data.name,
            country: response.data.sys.country
        };

        res.json(weatherData);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ 
                error: 'City not found or API error',
                details: error.response.data.message 
            });
        } else {
            res.status(500).json({ 
                error: 'Internal server error',
                details: error.message 
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 