// Weather API configuration
const API_KEY = '4ce8ed8fb3dcf42f4624221e595758c8';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_URL = `${BASE_URL}/weather`;
const FORECAST_URL = `${BASE_URL}/forecast`;

// DOM Elements
const locationInput = document.getElementById('location-input');
const updateButton = document.getElementById('update-alerts');
const alertsGrid = document.querySelector('.alerts-grid');

// Add back button if coming from dashboard
if (document.referrer.includes('dashboard.html')) {
    const backButton = document.createElement('button');
    backButton.classList.add('back-button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Dashboard';
    backButton.addEventListener('click', () => {
        window.location.href = sessionStorage.getItem('previousPage') || '../dashboard.html';
    });
    document.body.insertBefore(backButton, document.body.firstChild);
}

// Event Listeners
updateButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeatherData(location);
    } else {
        showError('Please enter a location');
    }
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherData(location);
        } else {
            showError('Please enter a location');
        }
    }
});

// Functions
async function getWeatherData(city) {
    try {
        updateButton.disabled = true;
        updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        
        // Fetch both current weather and forecast data
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`),
            fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const [weatherData, forecastData] = await Promise.all([
            weatherResponse.json(),
            forecastResponse.json()
        ]);
        
        // Combine current weather and forecast data
        const combinedData = {
            ...weatherData,
            forecast: forecastData.list.slice(0, 5) // Get next 5 forecast periods
        };
        
        updateAlerts(combinedData);
    } catch (error) {
        console.error('Weather API Error:', error);
        showError('Unable to fetch weather data. Please try again later.');
    } finally {
        updateButton.disabled = false;
        updateButton.innerHTML = 'Update Alerts';
    }
}

function updateAlerts(data) {
    alertsGrid.innerHTML = ''; // Clear existing alerts
    const alerts = generateAlerts(data);
    
    if (alerts.length === 0) {
        alertsGrid.innerHTML = `
            <div class="alert-card">
                <div class="alert-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 class="alert-title">No Alerts</h3>
                <p class="alert-description">No weather alerts for ${data.name} at this time.</p>
                <div class="alert-meta">
                    <span><i class="fas fa-location-dot"></i>${data.name}</span>
                    <span><i class="far fa-clock"></i>${new Date().toLocaleString()}</span>
                </div>
            </div>
        `;
        return;
    }
    
    alerts.forEach(alert => {
        const alertCard = createAlertCard(alert);
        alertsGrid.appendChild(alertCard);
    });
}

function generateAlerts(data) {
    const alerts = [];
    const { main, weather, wind, name, forecast } = data;
    const currentTime = new Date();
    
    // Current Weather Alerts
    // Rainfall Alert
    if (weather[0].main === 'Rain' || weather[0].main === 'Thunderstorm') {
        alerts.push({
            type: 'rainfall',
            icon: 'fa-cloud-rain',
            title: 'Current Rainfall Alert',
            description: 'Heavy rainfall detected. Please take necessary precautions.',
            location: name,
            time: 'Current'
        });
    }
    
    // Temperature Alert
    if (main.temp > 35) {
        alerts.push({
            type: 'temperature',
            icon: 'fa-temperature-high',
            title: 'High Temperature Alert',
            description: `Current temperature is ${Math.round(main.temp)}°C. Stay hydrated and avoid outdoor activities.`,
            location: name,
            time: 'Current'
        });
    } else if (main.temp < 0) {
        alerts.push({
            type: 'temperature',
            icon: 'fa-temperature-low',
            title: 'Low Temperature Alert',
            description: `Current temperature is ${Math.round(main.temp)}°C. Risk of ice formation.`,
            location: name,
            time: 'Current'
        });
    }
    
    // Wind Alert
    if (wind.speed > 20) {
        alerts.push({
            type: 'wind',
            icon: 'fa-wind',
            title: 'Strong Winds Warning',
            description: `Current wind speeds are ${Math.round(wind.speed * 3.6)} km/h. Secure loose objects and stay indoors.`,
            location: name,
            time: 'Current'
        });
    }

    // Forecast Alerts
    if (forecast && forecast.length > 0) {
        forecast.forEach((period, index) => {
            const forecastTime = new Date(period.dt * 1000);
            const timeString = forecastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Check for forecast rainfall
            if (period.weather[0].main === 'Rain' || period.weather[0].main === 'Thunderstorm') {
                alerts.push({
                    type: 'rainfall',
                    icon: 'fa-cloud-rain',
                    title: 'Forecast Rainfall Alert',
                    description: `Rain expected at ${timeString}. Please prepare accordingly.`,
                    location: name,
                    time: `Forecast: ${timeString}`
                });
            }

            // Check for forecast temperature extremes
            if (period.main.temp > 35) {
                alerts.push({
                    type: 'temperature',
                    icon: 'fa-temperature-high',
                    title: 'Forecast High Temperature Alert',
                    description: `Temperature expected to reach ${Math.round(period.main.temp)}°C at ${timeString}.`,
                    location: name,
                    time: `Forecast: ${timeString}`
                });
            } else if (period.main.temp < 0) {
                alerts.push({
                    type: 'temperature',
                    icon: 'fa-temperature-low',
                    title: 'Forecast Low Temperature Alert',
                    description: `Temperature expected to drop to ${Math.round(period.main.temp)}°C at ${timeString}.`,
                    location: name,
                    time: `Forecast: ${timeString}`
                });
            }

            // Check for forecast strong winds
            if (period.wind.speed > 20) {
                alerts.push({
                    type: 'wind',
                    icon: 'fa-wind',
                    title: 'Forecast Strong Winds Warning',
                    description: `Wind speeds may reach ${Math.round(period.wind.speed * 3.6)} km/h at ${timeString}.`,
                    location: name,
                    time: `Forecast: ${timeString}`
                });
            }
        });
    }
    
    return alerts;
}

function createAlertCard(alert) {
    const card = document.createElement('div');
    card.className = `alert-card ${alert.type}`;
    
    card.innerHTML = `
        <div class="alert-icon">
            <i class="fas ${alert.icon}"></i>
        </div>
        <h3 class="alert-title">${alert.title}</h3>
        <p class="alert-description">${alert.description}</p>
        <div class="alert-meta">
            <span><i class="fas fa-location-dot"></i>${alert.location}</span>
            <span><i class="far fa-clock"></i>${alert.time}</span>
        </div>
    `;
    
    return card;
}

function showError(message) {
    const errorCard = document.createElement('div');
    errorCard.className = 'alert-card error';
    errorCard.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <h3 class="alert-title">Error</h3>
        <p class="alert-description">${message}</p>
    `;
    
    alertsGrid.innerHTML = '';
    alertsGrid.appendChild(errorCard);
}

function updateWeatherDisplay(data) {
    const weatherContainer = document.querySelector('.weather-container');
    weatherContainer.innerHTML = `
        <div class="weather-card main-weather">
            <div class="weather-header">
                <h2>Current Weather</h2>
                <p class="location">${data.location}</p>
            </div>
            <div class="weather-body">
                <div class="temperature">
                    <span class="temp-value">${data.temperature}°C</span>
                    <span class="feels-like">Feels like ${data.feelsLike}°C</span>
                </div>
                <div class="weather-icon">
                    <i class="fas ${getWeatherIcon(data.conditions)}"></i>
                    <span>${data.conditions}</span>
                </div>
                <div class="weather-details">
                    <div class="detail-item">
                        <i class="fas fa-wind"></i>
                        <span>${data.windSpeed} km/h</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tint"></i>
                        <span>${data.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-sun"></i>
                        <span>UV: ${data.uvIndex}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="weather-card air-quality">
            <div class="card-header">
                <h3><i class="fas fa-lungs"></i> Air Quality</h3>
            </div>
            <div class="aqi-display">
                <div class="aqi-value ${getAQIClass(data.airQuality.index)}">
                    <span class="value">${data.airQuality.index}</span>
                    <span class="label">AQI</span>
                </div>
                <div class="aqi-description">
                    <p class="quality-level">${data.airQuality.level}</p>
                    <p class="pollutant">Main pollutant: ${data.airQuality.mainPollutant}</p>
                </div>
            </div>
            <div class="air-details">
                <div class="detail-row">
                    <span class="label">PM2.5</span>
                    <span class="value">${data.airQuality.pm25} µg/m³</span>
                </div>
                <div class="detail-row">
                    <span class="label">PM10</span>
                    <span class="value">${data.airQuality.pm10} µg/m³</span>
                </div>
                <div class="detail-row">
                    <span class="label">O₃</span>
                    <span class="value">${data.airQuality.o3} ppb</span>
                </div>
                <div class="detail-row">
                    <span class="label">NO₂</span>
                    <span class="value">${data.airQuality.no2} ppb</span>
                </div>
            </div>
            <div class="health-recommendation">
                <p><i class="fas fa-info-circle"></i> ${data.airQuality.healthAdvice}</p>
            </div>
        </div>

        <div class="weather-card atmospheric">
            <div class="card-header">
                <h3><i class="fas fa-cloud"></i> Atmospheric Conditions</h3>
            </div>
            <div class="atmospheric-grid">
                <div class="condition-item">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <span class="label">Pressure</span>
                    <span class="value">${data.pressure} hPa</span>
                </div>
                <div class="condition-item">
                    <i class="fas fa-eye"></i>
                    <span class="label">Visibility</span>
                    <span class="value">${data.visibility} km</span>
                </div>
                <div class="condition-item">
                    <i class="fas fa-tint"></i>
                    <span class="label">Dew Point</span>
                    <span class="value">${data.dewPoint}°C</span>
                </div>
                <div class="condition-item">
                    <i class="fas fa-cloud-rain"></i>
                    <span class="label">Precipitation</span>
                    <span class="value">${data.precipitation}%</span>
                </div>
            </div>
        </div>

        <div class="weather-card sun-position">
            <div class="card-header">
                <h3><i class="fas fa-sun"></i> Sun & Moon</h3>
            </div>
            <div class="astronomy-grid">
                <div class="astronomy-item">
                    <i class="fas fa-sunrise"></i>
                    <span class="label">Sunrise</span>
                    <span class="value">${data.astronomy.sunrise}</span>
                </div>
                <div class="astronomy-item">
                    <i class="fas fa-sunset"></i>
                    <span class="label">Sunset</span>
                    <span class="value">${data.astronomy.sunset}</span>
                </div>
                <div class="astronomy-item">
                    <i class="fas fa-moon"></i>
                    <span class="label">Moon Phase</span>
                    <span class="value">${data.astronomy.moonPhase}</span>
                </div>
                <div class="astronomy-item">
                    <i class="fas fa-adjust"></i>
                    <span class="label">Moon Illumination</span>
                    <span class="value">${data.astronomy.moonIllumination}</span>
                </div>
            </div>
        </div>
    `;
}

function getAQIClass(aqi) {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-unhealthy-sensitive';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-very-unhealthy';
    return 'aqi-hazardous';
}

function getWeatherIcon(condition) {
    const conditions = {
        'Clear': 'fa-sun',
        'Partly Cloudy': 'fa-cloud-sun',
        'Cloudy': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Snow': 'fa-snowflake',
        'Thunderstorm': 'fa-bolt',
        'Fog': 'fa-smog',
        'Windy': 'fa-wind'
    };
    return conditions[condition] || 'fa-cloud';
} 