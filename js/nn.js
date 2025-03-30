// DOM Elements
const locationSearch = document.getElementById('locationSearch');
const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
const locationDisplay = document.getElementById('locationDisplay');
const newsGrid = document.getElementById('newsGrid');

// Current location state
let currentLocation = {
    lat: null,
    lng: null,
    address: null
};

// Event Listeners
getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
locationSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchLocation(locationSearch.value);
});

// Get current location
async function getCurrentLocation() {
    if (navigator.geolocation) {
        locationDisplay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting location...';
        navigator.geolocation.getCurrentPosition(
            async position => {
                currentLocation.lat = position.coords.latitude;
                currentLocation.lng = position.coords.longitude;
                await reverseGeocode(currentLocation.lat, currentLocation.lng);
            },
            error => {
                console.error('Geolocation error:', error);
                locationDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Unable to get location';
            }
        );
    } else {
        locationDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Geolocation not supported';
    }
}

// Search for a location
async function searchLocation(query) {
    try {
        locationDisplay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching location...';
        const response = await fetch(`/api/geocode?address=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0];
            currentLocation.lat = location.geometry.location.lat;
            currentLocation.lng = location.geometry.location.lng;
            currentLocation.address = location.formatted_address;
            
            updateLocationDisplay();
            getNews(currentLocation.address);
        } else {
            locationDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location not found';
        }
    } catch (error) {
        console.error('Error searching location:', error);
        locationDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error finding location';
    }
}

// Reverse geocode coordinates to address
async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            currentLocation.address = data.results[0].formatted_address;
            updateLocationDisplay();
            getNews(currentLocation.address);
        } else {
            locationDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Address not found';
        }
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        locationDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error getting address';
    }
}

// Update location display
function updateLocationDisplay() {
    locationDisplay.innerHTML = `
        <i class="fas fa-map-marker-alt"></i>
        <span>Current Location: ${currentLocation.address}</span>
    `;
}

// Get news based on location
async function getNews(location) {
    try {
        newsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading news...</div>';
        
        const response = await fetch(`/api/news?query=${encodeURIComponent(location + ' disaster OR emergency OR environment')}`);
        if (!response.ok) throw new Error('News API response was not ok');
        
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        newsGrid.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error loading news</div>';
    }
}

// Display news in grid
function displayNews(articles) {
    newsGrid.innerHTML = articles.map(article => {
        const trustScore = calculateTrustScore(article);
        const timeAgo = getTimeAgo(new Date(article.publishedAt));
        
        return `
            <div class="news-card">
                <div class="news-image">
                    <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p>${article.description || ''}</p>
                </div>
                <div class="news-footer">
                    <div class="news-source">
                        <i class="fas fa-newspaper"></i>
                        <span>${article.source.name}</span>
                    </div>
                    <div class="news-trust">
                        <i class="fas fa-shield-alt"></i>
                        <span>Trust: ${trustScore}%</span>
                    </div>
                    <div class="news-date">
                        <i class="fas fa-clock"></i>
                        <span>${timeAgo}</span>
                    </div>
                </div>
                <a href="${article.url}" target="_blank" class="read-more">Read More</a>
            </div>
        `;
    }).join('');
}

// Calculate trust score
function calculateTrustScore(article) {
    let score = 70;
    if (article.source.name.includes('Reuters') || article.source.name.includes('AP')) score += 20;
    if (article.author) score += 5;
    if (article.content && article.content.length > 200) score += 5;
    return Math.min(score, 100);
}

// Get relative time
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    return days + 'd ago';
}
