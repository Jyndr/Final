const API_KEY = '4ce8ed8fb3dcf42f4624221e595758c8';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_URL = `${BASE_URL}/weather`;
const FORECAST_URL = `${BASE_URL}/forecast`;

// Weather Alert System
let weatherAlerts = [];
let alertUpdateInterval;

export function initializeWeatherAlerts() {
    console.log('Initializing Weather Alerts...'); // Debug log
    
    // Initialize alert update interval
    alertUpdateInterval = setInterval(updateAlerts, 30000); // Update every 30 seconds
    
    // Initial load of alerts
    loadAlerts();
    
    // Add event listeners for alert actions
    setupAlertEventListeners();

    const locationInput = document.getElementById('location-input');
    const updateButton = document.getElementById('update-alerts');
    const getCurrentLocationBtn = document.getElementById('get-current-location');
    const alertsGrid = document.querySelector('.alerts-grid');
    const currentWeather = document.getElementById('current-weather');
    const weatherForecast = document.getElementById('weather-forecast');
    const weatherAnomalies = document.getElementById('weather-anomalies');

    // Add current location button event listener
    getCurrentLocationBtn.addEventListener('click', async () => {
        try {
            getCurrentLocationBtn.disabled = true;
            getCurrentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const position = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation is not supported by your browser'));
                    return;
                }

                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;
            
            // Get location name using reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            if (data.display_name) {
                locationInput.value = data.display_name.split(',')[0]; // Use the first part of the address
                
                // Fetch weather data for the current location
                try {
                    const weatherResponse = await fetch(`${WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                    const forecastResponse = await fetch(`${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                    
                    if (!weatherResponse.ok || !forecastResponse.ok) {
                        throw new Error('Failed to fetch weather data');
                    }

                    const [weatherData, forecastData] = await Promise.all([
                        weatherResponse.json(),
                        forecastResponse.json()
                    ]);

                    // Update all components with the fetched data
                    updateCurrentWeather(weatherData);
                    updateForecast(forecastData);
                    checkForAnomalies(forecastData);
                    updateAlerts(weatherData);
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Location fetched successfully';
                    successMessage.style.backgroundColor = '#4CAF50';
                    successMessage.style.color = 'white';
                    successMessage.style.padding = '10px 20px';
                    successMessage.style.borderRadius = '5px';
                    successMessage.style.marginTop = '20px';
                    successMessage.style.textAlign = 'center';
                    
                    // Insert after the alerts grid
                    const alertsGrid = document.querySelector('.alerts-grid');
                    alertsGrid.parentNode.insertBefore(successMessage, alertsGrid.nextSibling);
                    
                    // Remove the success message after 3 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                } catch (error) {
                    console.error('Weather API Error:', error);
                    showError('Unable to fetch weather data. Please try again later.');
                }
            } else {
                throw new Error('Could not get location name');
            }
        } catch (error) {
            console.error('Geolocation Error:', error);
            showError('Unable to get your location. Please try searching manually.');
        } finally {
            getCurrentLocationBtn.disabled = false;
            getCurrentLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
        }
    });

    updateButton.addEventListener('click', async () => {
        const location = locationInput.value.trim();
        if (location) {
            try {
                updateButton.disabled = true;
                updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                await getWeatherData(location);
            } catch (error) {
                showError('Unable to fetch weather data. Please try again later.');
            } finally {
                updateButton.disabled = false;
                updateButton.innerHTML = 'Update Alerts';
            }
        } else {
            showError('Please enter a location');
        }
    });

    locationInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                try {
                    updateButton.disabled = true;
                    updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                    await getWeatherData(location);
                } catch (error) {
                    showError('Unable to fetch weather data. Please try again later.');
                } finally {
                    updateButton.disabled = false;
                    updateButton.innerHTML = 'Update Alerts';
                }
            } else {
                showError('Please enter a location');
            }
        }
    });
}

async function getWeatherData(city) {
    try {
        // Fetch both current weather and forecast data simultaneously
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

        // Update all components
        updateCurrentWeather(weatherData);
        updateForecast(forecastData);
        checkForAnomalies(forecastData);
        updateAlerts(weatherData);
    } catch (error) {
        console.error('Weather API Error:', error);
        throw error;
    }
}

function updateCurrentWeather(data) {
    const { main, weather, wind } = data;
    const weatherIcon = getWeatherIcon(weather[0].main);
    
    document.getElementById('current-weather').innerHTML = `
        <div class="weather-icon">
            <i class="fas ${weatherIcon}"></i>
        </div>
        <div class="weather-details">
            <p class="temperature">${Math.round(main.temp)}°C</p>
            <p class="condition">${weather[0].description}</p>
            <p class="humidity">Humidity: ${main.humidity}%</p>
            <p class="wind">Wind: ${Math.round(wind.speed * 3.6)} km/h</p>
        </div>
    `;
}

function updateForecast(data) {
    const forecastList = data.list.slice(0, 5); // Get next 5 forecast periods
    const forecastHTML = forecastList.map(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const icon = getWeatherIcon(item.weather[0].main);
        return `
            <div class="forecast-item">
                <span class="time">${time}</span>
                <i class="fas ${icon}"></i>
                <span class="temp">${Math.round(item.main.temp)}°C</span>
            </div>
        `;
    }).join('');

    const forecastContainer = document.getElementById('weather-forecast');
    if (forecastContainer) {
        // Create forecast list if it doesn't exist
        let forecastList = forecastContainer.querySelector('.forecast-list');
        if (!forecastList) {
            forecastList = document.createElement('div');
            forecastList.className = 'forecast-list';
            forecastContainer.appendChild(forecastList);
        }
        forecastList.innerHTML = forecastHTML;
    }
}

function checkForAnomalies(data) {
    const anomalies = [];
    const forecastList = data.list.slice(0, 5); // Get next 5 forecast periods
    
    // Check for significant temperature changes
    for (let i = 1; i < forecastList.length; i++) {
        const tempDiff = forecastList[i].main.temp - forecastList[i-1].main.temp;
        if (Math.abs(tempDiff) > 5) {
            anomalies.push({
                type: 'Temperature Change',
                description: `${Math.abs(tempDiff.toFixed(1))}°C ${tempDiff > 0 ? 'increase' : 'decrease'} expected`,
                time: new Date(forecastList[i].dt * 1000).toLocaleString()
            });
            break;
        }
    }

    // Check for extreme weather conditions
    forecastList.forEach(item => {
        if (item.weather[0].main === 'Thunderstorm' || 
            item.weather[0].main === 'Snow' || 
            item.main.temp > 35 || 
            item.main.temp < 5) {
            anomalies.push({
                type: 'Extreme Weather',
                description: `${item.weather[0].description} (${Math.round(item.main.temp)}°C)`,
                time: new Date(item.dt * 1000).toLocaleString()
            });
            return;
        }
    });

    const anomaliesContainer = document.getElementById('weather-anomalies');
    if (anomaliesContainer) {
        // Create anomaly list if it doesn't exist
        let anomalyList = anomaliesContainer.querySelector('.anomaly-list');
        if (!anomalyList) {
            anomalyList = document.createElement('div');
            anomalyList.className = 'anomaly-list';
            anomaliesContainer.appendChild(anomalyList);
        }

    const anomaliesHTML = anomalies.length > 0 
        ? anomalies.map(anomaly => `
            <div class="anomaly-item">
                <div class="anomaly-type">${anomaly.type}</div>
                <div class="anomaly-description">${anomaly.description}</div>
                <div class="anomaly-time">${anomaly.time}</div>
            </div>
        `).join('')
        : '<div class="no-anomalies">No significant weather anomalies detected</div>';

        anomalyList.innerHTML = anomaliesHTML;
    }
}

function getWeatherIcon(weatherType) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Drizzle': 'fa-cloud-rain',
        'Thunderstorm': 'fa-cloud-bolt',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Smoke': 'fa-smog',
        'Haze': 'fa-smog',
        'Dust': 'fa-smog',
        'Fog': 'fa-smog',
        'Sand': 'fa-smog',
        'Ash': 'fa-smog',
        'Squall': 'fa-wind',
        'Tornado': 'fa-tornado'
    };
    return iconMap[weatherType] || 'fa-cloud';
}

function updateAlerts(data) {
    console.log('Updating weather alerts...'); // Debug log
    
    // Update timestamps and status
    weatherAlerts = weatherAlerts.map(alert => {
        const alertAge = new Date() - new Date(alert.timestamp);
        const hoursOld = alertAge / (1000 * 60 * 60);
        
        // Update status based on age
        if (hoursOld > 24) {
            return { ...alert, status: 'expired' };
        } else if (hoursOld > 12) {
            return { ...alert, status: 'warning' };
        }
        return alert;
    });
    
    // Remove expired alerts
    weatherAlerts = weatherAlerts.filter(alert => alert.status !== 'expired');
    
    // Add new alerts (simulate new alerts)
    if (Math.random() < 0.3) { // 30% chance of new alert
        const newAlert = {
            id: weatherAlerts.length + 1,
            type: ['storm', 'flood', 'heat', 'cold'][Math.floor(Math.random() * 4)],
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            location: ['Northern Region', 'Southern Region', 'Eastern Region', 'Western Region'][Math.floor(Math.random() * 4)],
            description: 'New weather alert: ' + Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
            status: 'active'
        };
        weatherAlerts.push(newAlert);
    }
    
    renderAlerts();
}

function renderAlerts() {
    const alertsContainer = document.querySelector('.alerts-container');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = weatherAlerts.map(alert => `
        <div class="alert-card ${alert.type} ${alert.severity} ${alert.status}" data-id="${alert.id}">
            <div class="alert-header">
                <div class="alert-type">
                    <i class="fas ${getAlertIcon(alert.type)}"></i>
                    <span>${alert.type.toUpperCase()}</span>
                </div>
                <div class="alert-severity ${alert.severity}">
                    ${alert.severity.toUpperCase()}
                </div>
            </div>
            <div class="alert-content">
                <h3>${alert.location}</h3>
                <p>${alert.description}</p>
                <div class="alert-meta">
                    <span><i class="fas fa-clock"></i> ${formatTimeAgo(alert.timestamp)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${alert.location}</span>
                </div>
            </div>
            <div class="alert-actions">
                <button class="action-btn acknowledge" data-action="acknowledge">
                    <i class="fas fa-check"></i> Acknowledge
                </button>
                <button class="action-btn dismiss" data-action="dismiss">
                    <i class="fas fa-times"></i> Dismiss
                </button>
            </div>
        </div>
    `).join('');
}

function setupAlertEventListeners() {
    document.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;
        
        const alertCard = actionBtn.closest('.alert-card');
        const alertId = parseInt(alertCard.dataset.id);
        const action = actionBtn.dataset.action;
        
        handleAlertAction(alertId, action);
    });
}

function handleAlertAction(alertId, action) {
    const alert = weatherAlerts.find(a => a.id === alertId);
    if (!alert) return;
    
    switch(action) {
        case 'acknowledge':
            alert.status = 'acknowledged';
            break;
        case 'dismiss':
            weatherAlerts = weatherAlerts.filter(a => a.id !== alertId);
            break;
    }
    
    renderAlerts();
}

function getAlertIcon(type) {
    const icons = {
        storm: 'fa-bolt',
        flood: 'fa-water',
        heat: 'fa-sun',
        cold: 'fa-snowflake'
    };
    return icons[type] || 'fa-exclamation-triangle';
}

function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}

function loadAlerts() {
    // Sample alerts (replace with actual API calls)
    weatherAlerts = [
        {
            id: 1,
            type: 'storm',
            severity: 'high',
            location: 'Northern Region',
            description: 'Severe thunderstorm warning with potential hail',
            timestamp: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 2,
            type: 'flood',
            severity: 'medium',
            location: 'Coastal Area',
            description: 'Flood watch in effect due to heavy rainfall',
            timestamp: new Date().toISOString(),
            status: 'active'
        }
    ];
    
    renderAlerts();
}

function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.weather-error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'weather-error-message';
    errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    // Insert after the weather cards
    const weatherCards = document.querySelector('.weather-cards');
    if (weatherCards) {
        weatherCards.parentNode.insertBefore(errorMessage, weatherCards.nextSibling);
    } else {
        document.querySelector('.weather-section').appendChild(errorMessage);
    }

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// Clean up function
export function cleanupWeatherAlerts() {
    if (alertUpdateInterval) {
        clearInterval(alertUpdateInterval);
    }
}

export function initializeWeather() {
    const weatherContainer = document.querySelector('.weather-container');
    const searchInput = document.querySelector('.search-input input');
    const locationBtn = document.querySelector('.location-btn');
    const updateBtn = document.querySelector('.update-btn');

    // Sample weather data
    const sampleWeatherData = {
        current: {
            temp: 28,
            feels_like: 32,
            humidity: 65,
            wind_speed: 12,
            condition: 'Partly Cloudy',
            icon: 'fa-cloud-sun'
        },
        alerts: [
            {
                type: 'Heat Wave',
                severity: 'high',
                description: 'High temperature alert: Temperatures expected to reach 35°C in the next 24 hours.',
                time: '2 hours ago'
            },
            {
                type: 'Rain Alert',
                severity: 'moderate',
                description: 'Heavy rainfall expected in the evening. Prepare for potential flooding.',
                time: '4 hours ago'
            },
            {
                type: 'Wind Warning',
                severity: 'low',
                description: 'Strong winds expected with speeds up to 25 km/h.',
                time: '6 hours ago'
            }
        ],
        forecast: [
            {
                time: '12:00',
                temp: 30,
                condition: 'Sunny',
                icon: 'fa-sun'
            },
            {
                time: '15:00',
                temp: 32,
                condition: 'Partly Cloudy',
                icon: 'fa-cloud-sun'
            },
            {
                time: '18:00',
                temp: 28,
                condition: 'Rain',
                icon: 'fa-cloud-rain'
            }
        ]
    };

    // Function to display weather data
    function displayWeatherData(data) {
        weatherContainer.innerHTML = `
            <div class="weather-overview">
                <!-- Current Weather -->
                <div class="weather-card current">
                    <div class="card-header">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Current Weather</h3>
                    </div>
                    <div class="weather-icon">
                        <i class="fas ${data.current.icon}"></i>
                    </div>
                    <div class="weather-details">
                        <div class="temperature">${data.current.temp}°C</div>
                        <div class="condition">${data.current.condition}</div>
                        <div class="humidity">
                            <i class="fas fa-tint"></i> Humidity: ${data.current.humidity}%
                        </div>
                        <div class="wind">
                            <i class="fas fa-wind"></i> Wind: ${data.current.wind_speed} km/h
                        </div>
                    </div>
                </div>

                <!-- Weather Alerts -->
                <div class="weather-card alerts">
                    <div class="card-header">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Weather Alerts</h3>
                    </div>
                    <div class="alerts-list">
                        ${data.alerts.map(alert => `
                            <div class="alert-item">
                                <div class="alert-header">
                                    <i class="fas fa-exclamation-circle"></i>
                                    <strong>${alert.type}</strong>
                                    <span class="severity severity-${alert.severity}">${alert.severity}</span>
                                </div>
                                <p>${alert.description}</p>
                                <div class="alert-time">
                                    <i class="far fa-clock"></i> ${alert.time}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Forecast -->
                <div class="weather-card forecast">
                    <div class="card-header">
                        <i class="fas fa-calendar-alt"></i>
                        <h3>Forecast</h3>
                    </div>
                    <div class="forecast-list">
                        ${data.forecast.map(item => `
                            <div class="forecast-item">
                                <span class="time">${item.time}</span>
                                <i class="fas ${item.icon}"></i>
                                <span class="temp">${item.temp}°C</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="search-section">
                <div class="search-container">
                    <div class="search-input">
                        <i class="fas fa-map-marker-alt location-icon"></i>
                        <input type="text" placeholder="Enter your location">
                    </div>
                    <button class="location-btn">
                        <i class="fas fa-location-arrow"></i>
                        Use My Location
                    </button>
                    <button class="update-btn">
                        <i class="fas fa-sync-alt"></i>
                        Update
                    </button>
                </div>
            </div>
        `;

        // Reattach event listeners
        attachEventListeners();
    }

    // Function to attach event listeners
    function attachEventListeners() {
        const newSearchInput = document.querySelector('.search-input input');
        const newLocationBtn = document.querySelector('.location-btn');
        const newUpdateBtn = document.querySelector('.update-btn');

        newLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        // Here you would typically make an API call to get weather data
                        // For now, we'll just show a success message
                        showNotification('Location updated successfully!', 'success');
                    },
                    error => {
                        showNotification('Error getting location. Please try again.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser.', 'error');
            }
        });

        newUpdateBtn.addEventListener('click', () => {
            showNotification('Weather data updated!', 'success');
        });
    }

    // Function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize with sample data
    displayWeatherData(sampleWeatherData);
} 