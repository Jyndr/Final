// Helper function to load scripts
async function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function loadNewsContent() {
    try {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) {
            throw new Error('News container not found');
        }

        // First, set up a loading state
        newsContainer.innerHTML = `
            <div class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading news content...</p>
            </div>
        `;

        // Load required libraries first
        await loadScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js');
        
        // Load Leaflet CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            document.head.appendChild(leafletCSS);
        }

        // Load news CSS if not already loaded
        if (!document.querySelector('link[href="disas-news/news.css"]')) {
            const newsCSS = document.createElement('link');
            newsCSS.rel = 'stylesheet';
            newsCSS.href = 'disas-news/news.css';
            document.head.appendChild(newsCSS);
        }

        // Create the initial structure with search controls and map above news content
        newsContainer.innerHTML = `
            <div class="map-section" style="margin-bottom: 20px;">
                <div class="search-controls" style="margin-bottom: 15px;">
                    <div class="search-input">
                        <input type="text" id="location-search" placeholder="Enter location...">
                        <button id="search-button">Search</button>
                    </div>
                    <button id="current-location" class="location-btn">
                        <i class="fas fa-location-dot"></i> Use Current Location
                    </button>
                </div>
                <div class="map-container">
                    <div id="map" style="height: 300px; width: 100%; border-radius: 8px;"></div>
                </div>
            </div>
            <div id="news-content">
                <!-- News content will be loaded here -->
            </div>
        `;

        // Initialize map
        const map = L.map('map').setView([20.5937, 78.9629], 4); // Default view centered on India
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Fetch news HTML content
        const response = await fetch('disas-news/news.html');
        if (!response.ok) {
            throw new Error('Failed to load news content');
        }
        const html = await response.text();
        
        // Parse the HTML and extract the main content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('main') || doc.querySelector('.news-content') || doc.body;

        // Insert the news content
        const newsContent = document.getElementById('news-content');
        if (newsContent) {
            newsContent.innerHTML = mainContent.innerHTML;
        }

        // Load and execute the news script
        const scriptResponse = await fetch('disas-news/news.js');
        if (!scriptResponse.ok) {
            throw new Error('Failed to load news script');
        }
        const scriptContent = await scriptResponse.text();
        
        // Execute the script in the proper context
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);

    } catch (error) {
        console.error('Error loading news content:', error);
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error Loading News Content</h3>
                    <p>Unable to load the news section. Please try refreshing the page.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        }
    }
}

// Function to show error message
export function showError(message) {
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        newsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Function to add sample news data
export function addSampleNewsData(lat, lon) {
    const newsData = [
        {
            title: 'Flash Flood Warning',
            description: 'Heavy rainfall has caused flash flooding in several areas. Residents are advised to stay alert and avoid low-lying areas.',
            date: new Date().toLocaleDateString(),
            location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
        },
        {
            title: 'Emergency Response Teams Deployed',
            description: 'Local emergency response teams have been deployed to assist affected communities and provide immediate relief.',
            date: new Date().toLocaleDateString(),
            location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
        },
        {
            title: 'Weather Update',
            description: 'Meteorological department predicts continued heavy rainfall in the region for the next 24 hours.',
            date: new Date().toLocaleDateString(),
            location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`
        }
    ];

    // Update news cards
    const newsGrid = document.querySelector('.news-grid');
    if (newsGrid) {
        newsGrid.innerHTML = newsData.map(news => `
            <div class="news-card">
                <h3>${news.title}</h3>
                <p>${news.description}</p>
                <div class="news-meta">
                    <span><i class="fas fa-calendar"></i> ${news.date}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${news.location}</span>
                </div>
            </div>
        `).join('');
    }

    // Update chart
    const ctx = document.getElementById('newsChart');
    if (ctx) {
        if (window.newsChart) {
            window.newsChart.destroy();
        }
        window.newsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [{
                    label: 'Incident Reports',
                    data: [12, 19, 15, 8, 22],
                    borderColor: '#4a90e2',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
} 