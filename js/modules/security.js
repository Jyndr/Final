export function renderSecurityGuide() {
    const container = document.querySelector('.content-container');
    container.innerHTML = `
        <div class="security-guide">
            <h1>Security Guide</h1>
            <div class="filters">
                <select id="categoryFilter">
                    <option value="all">All Categories</option>
                    <option value="cyber">Cyber Security</option>
                    <option value="physical">Physical Security</option>
                    <option value="emergency">Emergency Response</option>
                </select>
                <input type="text" id="searchGuide" placeholder="Search security tips...">
            </div>
            <div class="security-cards">
                ${generateSecurityCards()}
            </div>
        </div>
    `;
    initializeSecurityGuide();
}

function generateSecurityCards() {
    const securityTips = [
        {
            category: 'cyber',
            title: 'Password Security',
            description: 'Use strong, unique passwords and enable two-factor authentication.',
            icon: '🔒'
        },
        {
            category: 'cyber',
            title: 'Data Protection',
            description: 'Regularly backup important data and use encryption when possible.',
            icon: '💾'
        },
        {
            category: 'physical',
            title: 'Home Security',
            description: 'Install proper locks, security cameras, and maintain good lighting.',
            icon: '🏠'
        },
        {
            category: 'physical',
            title: 'Personal Safety',
            description: 'Stay aware of surroundings and keep emergency contacts readily available.',
            icon: '👤'
        },
        {
            category: 'emergency',
            title: 'Emergency Plan',
            description: 'Create and maintain an emergency evacuation plan and kit.',
            icon: '🚨'
        },
        {
            category: 'emergency',
            title: 'Communication',
            description: 'Establish emergency communication protocols with family and colleagues.',
            icon: '📱'
        }
    ];

    return securityTips.map(tip => `
        <div class="security-card" data-category="${tip.category}">
            <div class="card-icon">${tip.icon}</div>
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
            <button class="learn-more">Learn More</button>
        </div>
    `).join('');
}

function initializeSecurityGuide() {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchGuide');
    const cards = document.querySelectorAll('.security-card');

    categoryFilter.addEventListener('change', filterCards);
    searchInput.addEventListener('input', filterCards);

    function filterCards() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const category = card.dataset.category;
            const content = card.textContent.toLowerCase();
            const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
            const searchMatch = content.includes(searchTerm);

            card.style.display = categoryMatch && searchMatch ? 'flex' : 'none';
        });
    }

    // Initialize learn more buttons
    document.querySelectorAll('.learn-more').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.security-card');
            const title = card.querySelector('h3').textContent;
            alert(`Detailed guide for ${title} will be displayed here.`);
        });
    });
}

// Add CSS styles for the new layout
const style = document.createElement('style');
style.textContent = `
    .guide-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .guide-title {
        font-size: 2.5rem;
        color: #9370DB;
        text-align: center;
        margin-bottom: 1rem;
        text-shadow: 0 0 20px rgba(147, 112, 219, 0.3);
    }

    .guide-subtitle {
        text-align: center;
        color: #888;
        margin-bottom: 2rem;
    }

    .filter-section {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .filter-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .filter-select {
        padding: 0.5rem 1rem;
        border: 1px solid #9370DB;
        border-radius: 4px;
        background: #2a2a2a;
        color: #fff;
        cursor: pointer;
    }

    .disaster-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .disaster-card {
        background: #2a2a2a;
        border-radius: 10px;
        padding: 1.5rem;
        border: 1px solid rgba(147, 112, 219, 0.2);
        transition: all 0.3s ease;
    }

    .disaster-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(147, 112, 219, 0.2);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .disaster-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .disaster-title i {
        color: #9370DB;
        font-size: 1.2rem;
    }

    .severity-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }

    .severity-badge.high {
        background: rgba(255, 69, 58, 0.2);
        color: #ff453a;
    }

    .severity-badge.medium {
        background: rgba(255, 159, 10, 0.2);
        color: #ff9f0a;
    }

    .severity-badge.low {
        background: rgba(48, 209, 88, 0.2);
        color: #30d158;
    }

    .disaster-description {
        color: #888;
        margin-bottom: 1rem;
        line-height: 1.4;
    }

    .remedies-section h4 {
        color: #9370DB;
        margin-bottom: 0.5rem;
    }

    .remedies-section ul {
        list-style: none;
        padding: 0;
    }

    .remedies-section li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
    }

    .remedies-section li:before {
        content: "•";
        color: #9370DB;
        position: absolute;
        left: 0;
    }

    @media (max-width: 768px) {
        .filter-section {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }

        .guide-title {
            font-size: 2rem;
        }
    }
`;

document.head.appendChild(style); 