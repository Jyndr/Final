// Weather Feature
export class WeatherFeature {
    constructor() {
        this.map = null;
        this.weatherData = null;
        this.weatherChart = null;
    }

    initialize() {
        this.initializeMap();
        this.initializeWeatherChart();
        this.setupEventListeners();
    }

    initializeMap() {
        this.map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    initializeWeatherChart() {
        const ctx = document.getElementById('weather-chart').getContext('2d');
        this.weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [25, 24, 23, 26, 28, 27, 25, 24],
                    borderColor: '#4a90e2',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Add event listeners for weather-related interactions
        document.getElementById('location-search').addEventListener('click', () => this.handleLocationSearch());
        document.getElementById('current-location').addEventListener('click', () => this.handleCurrentLocation());
    }

    async handleLocationSearch() {
        const location = document.getElementById('location-search').value;
        if (location) {
            await this.updateWeatherData(location);
        }
    }

    async handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await this.updateWeatherData(`${latitude},${longitude}`);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please try searching manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    async updateWeatherData(location) {
        try {
            // Show loading state
            this.showLoadingState();

            // Get weather data from API
            const weatherData = await this.fetchWeatherData(location);
            this.weatherData = weatherData;

            // Update map
            this.updateMap(weatherData);

            // Update chart
            this.updateChart(weatherData);

            // Update weather info
            this.updateWeatherInfo(weatherData);

        } catch (error) {
            console.error('Error updating weather data:', error);
            this.showError('Failed to fetch weather data. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }

    async fetchWeatherData(location) {
        // This is a placeholder. Replace with actual API call
        return {
            temperature: 25,
            feelsLike: 27,
            conditions: 'Partly Cloudy',
            windSpeed: 12,
            windDirection: 'NE',
            humidity: 65,
            pressure: 1013,
            visibility: 10,
            uvIndex: 6,
            precipitation: 20,
            airQuality: {
                index: 45,
                level: 'Good',
                mainPollutant: 'PM2.5',
                description: 'Air quality is satisfactory'
            },
            astronomy: {
                sunrise: '06:15 AM',
                sunset: '06:45 PM',
                moonPhase: 'Waxing Crescent',
                moonIllumination: '35%'
            },
            precipitation: {
                probability: 30,
                type: 'Rain',
                intensity: 'Light',
                accumulation: '2.5 mm'
            },
            forecast: [
                { time: '00:00', temp: 25, conditions: 'Clear', precipitation: '0%' },
                { time: '03:00', temp: 24, conditions: 'Partly Cloudy', precipitation: '10%' },
                { time: '06:00', temp: 23, conditions: 'Cloudy', precipitation: '20%' },
                { time: '09:00', temp: 26, conditions: 'Light Rain', precipitation: '60%' },
                { time: '12:00', temp: 28, conditions: 'Sunny', precipitation: '0%' },
                { time: '15:00', temp: 27, conditions: 'Partly Cloudy', precipitation: '15%' },
                { time: '18:00', temp: 25, conditions: 'Clear', precipitation: '5%' },
                { time: '21:00', temp: 24, conditions: 'Clear', precipitation: '0%' }
            ]
        };
    }

    updateMap(weatherData) {
        // Clear existing markers
        this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
            }
        });

        // Add new marker
        const marker = L.marker([20.5937, 78.9629]).addTo(this.map);
        marker.bindPopup(`
            <div class="weather-popup">
                <h4>Current Weather</h4>
                <p><i class="fas fa-thermometer-half"></i> ${weatherData.temperature}°C (Feels like ${weatherData.feelsLike}°C)</p>
                <p><i class="fas fa-cloud"></i> ${weatherData.conditions}</p>
                <p><i class="fas fa-wind"></i> ${weatherData.windSpeed} km/h ${weatherData.windDirection}</p>
                <p><i class="fas fa-tint"></i> ${weatherData.humidity}%</p>
            </div>
        `).openPopup();
    }

    updateChart(weatherData) {
        this.weatherChart.data = {
            labels: weatherData.forecast.map(f => f.time),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: weatherData.forecast.map(f => f.temp),
                    borderColor: '#4a90e2',
                    tension: 0.4,
                    yAxisID: 'y'
                }
            ]
        };
        this.weatherChart.options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const forecast = weatherData.forecast[context.dataIndex];
                            return [
                                `Temperature: ${forecast.temp}°C`,
                                `Conditions: ${forecast.conditions}`
                            ];
                        }
                    }
                }
            }
        };
        this.weatherChart.update();
    }

    updateWeatherInfo(weatherData) {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = `
            <div class="weather-details">
                <div class="current-conditions">
                    <h3>Current Weather</h3>
                    <div class="main-temp">
                        <i class="fas fa-thermometer-half"></i>
                        <span class="temperature">${weatherData.temperature}°C</span>
                        <span class="feels-like">Feels like ${weatherData.feelsLike}°C</span>
                    </div>
                    <div class="conditions">
                        <i class="fas fa-cloud"></i>
                        <span>${weatherData.conditions}</span>
                    </div>
                </div>
                
                <div class="weather-grid">
                    <div class="weather-item">
                        <i class="fas fa-wind"></i>
                        <span>Wind</span>
                        <strong>${weatherData.windSpeed} km/h ${weatherData.windDirection}</strong>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-tint"></i>
                        <span>Humidity</span>
                        <strong>${weatherData.humidity}%</strong>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-compress-arrows-alt"></i>
                        <span>Pressure</span>
                        <strong>${weatherData.pressure} hPa</strong>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-eye"></i>
                        <span>Visibility</span>
                        <strong>${weatherData.visibility} km</strong>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-sun"></i>
                        <span>UV Index</span>
                        <strong>${weatherData.uvIndex}</strong>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-cloud-rain"></i>
                        <span>Precipitation</span>
                        <strong>${weatherData.precipitation}%</strong>
                    </div>
                </div>

                <div class="weather-sections">
                    <!-- Air Quality Section -->
                    <div class="weather-section air-quality">
                        <h4><i class="fas fa-lungs"></i> Air Quality</h4>
                        <div class="aqi-indicator aqi-${weatherData.airQuality.level.toLowerCase()}">
                            <div class="aqi-value">${weatherData.airQuality.index}</div>
                            <div class="aqi-label">${weatherData.airQuality.level}</div>
                        </div>
                        <p class="aqi-details">
                            <span>Main Pollutant: ${weatherData.airQuality.mainPollutant}</span>
                            <span>${weatherData.airQuality.description}</span>
                        </p>
                    </div>

                    <!-- Astronomy Section -->
                    <div class="weather-section astronomy">
                        <h4><i class="fas fa-moon"></i> Sun & Moon</h4>
                        <div class="astronomy-grid">
                            <div class="astronomy-item">
                                <i class="fas fa-sunrise"></i>
                                <span>Sunrise</span>
                                <strong>${weatherData.astronomy.sunrise}</strong>
                            </div>
                            <div class="astronomy-item">
                                <i class="fas fa-sunset"></i>
                                <span>Sunset</span>
                                <strong>${weatherData.astronomy.sunset}</strong>
                            </div>
                            <div class="astronomy-item">
                                <i class="fas fa-moon"></i>
                                <span>Moon Phase</span>
                                <strong>${weatherData.astronomy.moonPhase}</strong>
                            </div>
                            <div class="astronomy-item">
                                <i class="fas fa-adjust"></i>
                                <span>Moon Illumination</span>
                                <strong>${weatherData.astronomy.moonIllumination}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Precipitation Forecast -->
                    <div class="weather-section precipitation">
                        <h4><i class="fas fa-cloud-rain"></i> Precipitation Forecast</h4>
                        <div class="precipitation-details">
                            <div class="precip-item">
                                <span>Probability</span>
                                <strong>${weatherData.precipitation.probability}%</strong>
                            </div>
                            <div class="precip-item">
                                <span>Type</span>
                                <strong>${weatherData.precipitation.type}</strong>
                            </div>
                            <div class="precip-item">
                                <span>Intensity</span>
                                <strong>${weatherData.precipitation.intensity}</strong>
                            </div>
                            <div class="precip-item">
                                <span>Expected</span>
                                <strong>${weatherData.precipitation.accumulation}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showLoadingState() {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = '<div class="loading">Loading weather data...</div>';
    }

    hideLoadingState() {
        // Loading state is cleared when weather info is updated
    }

    showError(message) {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = `<div class="error">${message}</div>`;
    }
} 