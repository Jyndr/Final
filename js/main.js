// Import modules
import { initializeNavigation } from './modules/navigation.js';
import { initializeWeather } from './modules/weather.js';
import { initializeNews } from './modules/news.js';
import { initializeInsurance } from './modules/insurance.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeWeather();
    initializeNews();
    initializeInsurance();
}); 