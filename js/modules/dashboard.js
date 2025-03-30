// Sample disaster news data - in a real app, this would come from an API
const newsData = [
    {
        title: "Major Earthquake Hits Pacific Region",
        source: "Reuters",
        url: "https://reuters.com/article",
        trustScore: 95,
        description: "A powerful earthquake has struck the Pacific region, triggering tsunami warnings."
    },
    {
        title: "Hurricane Warning Issued for Coastal Areas",
        source: "Associated Press",
        url: "https://ap.org/article",
        trustScore: 92,
        description: "Meteorologists warn of an approaching Category 4 hurricane threatening coastal regions."
    },
    {
        title: "Emergency Response Teams Deployed",
        source: "BBC News",
        url: "https://bbc.com/news/article",
        trustScore: 85,
        description: "Rapid response units mobilized to assist in flood-affected areas."
    },
    {
        title: "Flood Alert: River Levels Rising",
        source: "CNN",
        url: "https://cnn.com/article",
        trustScore: 90,
        description: "Several communities placed under evacuation orders as river levels reach critical points."
    },
    {
        title: "Wildfire Prevention Measures Announced",
        source: "The Guardian",
        url: "https://theguardian.com/article",
        trustScore: 88,
        description: "New preventive measures implemented as dry season approaches high-risk areas."
    },
    {
        title: "Emergency Preparedness Guidelines Updated",
        source: "New York Times",
        url: "https://nytimes.com/article",
        trustScore: 94,
        description: "Officials release revised emergency preparedness protocols for natural disasters."
    }
];

function renderDashboard() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="dashboard-container">
            <div class="page-header">
                <h1>Disaster News & Updates</h1>
                <div class="subtitle">Stay informed with trusted emergency-related news</div>
            </div>
            <div class="news-grid">
                ${renderNewsCards()}
            </div>
        </div>
    `;

    // Add event listeners after rendering
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 20px rgba(147, 112, 219, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

function renderNewsCards() {
    return newsData.map(news => `
        <div class="news-card">
            <div class="news-header">
                <h3>${news.title}</h3>
                <div class="trust-score ${getTrustScoreClass(news.trustScore)}">
                    <i class="fas fa-shield-alt"></i>
                    <span>Trust Score: ${news.trustScore}%</span>
                </div>
            </div>
            <p class="news-description">${news.description}</p>
            <div class="news-source">
                <i class="fas fa-newspaper"></i>
                <span>${news.source}</span>
            </div>
            <a href="${news.url}" class="news-link" target="_blank" rel="noopener noreferrer">
                Read Full Article
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `).join('');
}

function getTrustScoreClass(score) {
    if (score >= 90) return 'high';
    if (score >= 80) return 'medium';
    return 'low';
}

// Initialize dashboard when the module loads
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
}); 