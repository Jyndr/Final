// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const mainContent = document.getElementById('mainContent');
const getStartedBtn = document.getElementById('getStartedBtn');
const backToWelcomeBtn = document.getElementById('backToWelcome');
const newsGrid = document.getElementById('newsGrid');
const sourceFilter = document.getElementById('sourceFilter');
const trustScoreFilter = document.getElementById('trustScoreFilter');
const sortBy = document.getElementById('sortBy');

// State
let newsData = [];

// Event Listeners
getStartedBtn.addEventListener('click', () => {
    // Redirect to the server
    window.location.href = 'http://localhost:3001';
});

backToWelcomeBtn.addEventListener('click', () => {
    mainContent.style.display = 'none';
    welcomeScreen.style.display = 'flex';
});

// Check if we're on the main page
if (window.location.hostname === 'localhost' && window.location.port === '3001') {
    // Show main content and hide welcome screen
    welcomeScreen.style.display = 'none';
    mainContent.style.display = 'block';
    // Fetch news immediately
    fetchNews();
}

// Fetch news from server
async function fetchNews() {
    try {
        newsGrid.innerHTML = '<div class="loading"></div>';
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        newsData = await response.json();
        populateSourceFilter();
        displayNews(newsData);
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Failed to fetch news. Please try again later.');
    }
}

// Populate source filter
function populateSourceFilter() {
    const sources = [...new Set(newsData.map(news => news.source))];
    sourceFilter.innerHTML = '<option value="">All Sources</option>';
    sources.forEach(source => {
        const option = document.createElement('option');
        option.value = source;
        option.textContent = source;
        sourceFilter.appendChild(option);
    });
}

// Display news cards
function displayNews(news) {
    newsGrid.innerHTML = '';
    
    if (!news || news.length === 0) {
        newsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-newspaper"></i>
                <p>No news articles found.</p>
            </div>
        `;
        return;
    }
    
    news.forEach(item => {
        const card = createNewsCard(item);
        newsGrid.appendChild(card);
    });
}

// Create news card element
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const trustScoreClass = getTrustScoreClass(news.trust_score || 0);
    const formattedDate = formatDate(news.date || news.retrieved_at || new Date());
    
    card.innerHTML = `
        <div class="news-card-header">
            <div class="source-badge">
                <i class="fas fa-newspaper"></i>
                ${news.source || 'Unknown Source'}
            </div>
            <div class="date">${formattedDate}</div>
        </div>
        <h3>${news.title || 'No Title Available'}</h3>
        <div class="news-card-footer">
            <div class="trust-score ${trustScoreClass}">
                <i class="fas fa-shield-alt"></i>
                Trust Score: ${news.trust_score || 0}%
            </div>
            ${news.url ? `
                <a href="${news.url}" target="_blank" class="read-more">
                    Read More <i class="fas fa-external-link-alt"></i>
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Format date without time
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Date not available';
        }
        
        // Show only date in a simple format
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date not available';
    }
}

// Get trust score class with better handling
function getTrustScoreClass(score) {
    if (!score || isNaN(score)) return 'low';
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

// Filter news based on selected filters
function filterNews() {
    let filteredNews = [...newsData];
    
    // Apply source filter
    const selectedSource = sourceFilter.value;
    if (selectedSource) {
        filteredNews = filteredNews.filter(news => news.source === selectedSource);
    }
    
    // Apply trust score filter
    const selectedTrust = trustScoreFilter.value;
    if (selectedTrust) {
        switch (selectedTrust) {
            case 'high':
                filteredNews = filteredNews.filter(news => news.trust_score >= 80);
                break;
            case 'medium':
                filteredNews = filteredNews.filter(news => 
                    news.trust_score >= 50 && news.trust_score < 80
                );
                break;
            case 'low':
                filteredNews = filteredNews.filter(news => news.trust_score < 50);
                break;
        }
    }
    
    // Apply sorting
    sortNews(filteredNews);
}

// Sort news
function sortNews(news = newsData) {
    const sortValue = sortBy.value;
    let sortedNews = [...news];
    
    switch (sortValue) {
        case 'newest':
            sortedNews.sort((a, b) => {
                const dateA = new Date(a.date || a.retrieved_at || 0);
                const dateB = new Date(b.date || b.retrieved_at || 0);
                return dateB - dateA;
            });
            break;
        case 'oldest':
            sortedNews.sort((a, b) => {
                const dateA = new Date(a.date || a.retrieved_at || 0);
                const dateB = new Date(b.date || b.retrieved_at || 0);
                return dateA - dateB;
            });
            break;
        case 'trust':
            sortedNews.sort((a, b) => (b.trust_score || 0) - (a.trust_score || 0));
            break;
    }
    
    displayNews(sortedNews);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    newsGrid.appendChild(errorDiv);
} 