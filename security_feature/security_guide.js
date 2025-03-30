// Disaster data with icons, descriptions, and remedies
const disasters = [
    {
        id: 1,
        name: "Earthquake",
        type: "natural",
        severity: "high",
        icon: "fa-house-crack",
        description: "A sudden shaking of the ground caused by tectonic plate movements.",
        remedy: [
            "Drop, cover, and hold on",
            "Stay away from windows and heavy furniture",
            "If indoors, stay inside until shaking stops",
            "If outdoors, move to an open area away from buildings"
        ]
    },
    {
        id: 2,
        name: "Flood",
        type: "natural",
        severity: "high",
        icon: "fa-water",
        description: "An overflow of water that submerges normally dry land.",
        remedy: [
            "Move to higher ground immediately",
            "Avoid walking or driving through flood waters",
            "Turn off electricity and gas if flooding is imminent",
            "Keep emergency supplies ready"
        ]
    },
    {
        id: 3,
        name: "Wildfire",
        type: "natural",
        severity: "high",
        icon: "fa-fire",
        description: "An uncontrolled fire in a natural area.",
        remedy: [
            "Evacuate immediately if ordered",
            "Close all windows and doors",
            "Turn off gas and electricity",
            "Wear protective clothing and mask"
        ]
    },
    {
        id: 4,
        name: "Cyber Attack",
        type: "human",
        severity: "medium",
        icon: "fa-shield-halved",
        description: "Malicious attempt to damage or gain unauthorized access to computer systems.",
        remedy: [
            "Disconnect from the internet",
            "Back up important data",
            "Update security software",
            "Change all passwords"
        ]
    },
    {
        id: 5,
        name: "Chemical Spill",
        type: "human",
        severity: "high",
        icon: "fa-flask",
        description: "Accidental release of hazardous chemicals into the environment.",
        remedy: [
            "Evacuate the area immediately",
            "Call emergency services",
            "Stay upwind of the spill",
            "Avoid contact with contaminated materials"
        ]
    },
    {
        id: 6,
        name: "Tornado",
        type: "natural",
        severity: "high",
        icon: "fa-tornado",
        description: "A violently rotating column of air extending from a thunderstorm to the ground.",
        remedy: [
            "Seek shelter in a basement or interior room",
            "Stay away from windows",
            "Cover yourself with blankets or mattresses",
            "Listen to weather alerts"
        ]
    },
    {
        id: 7,
        name: "Power Outage",
        type: "human",
        severity: "medium",
        icon: "fa-bolt",
        description: "Loss of electrical power in a specific area.",
        remedy: [
            "Keep emergency lighting ready",
            "Unplug sensitive electronics",
            "Keep refrigerator closed",
            "Have backup power source"
        ]
    },
    {
        id: 8,
        name: "Pandemic",
        type: "human",
        severity: "high",
        icon: "fa-virus",
        description: "Global outbreak of a contagious disease.",
        remedy: [
            "Practice social distancing",
            "Wear protective masks",
            "Maintain good hygiene",
            "Stay informed with reliable sources"
        ]
    },
    {
        id: 9,
        name: "Landslide",
        type: "natural",
        severity: "high",
        icon: "fa-mountain",
        description: "Downward movement of soil and rock.",
        remedy: [
            "Evacuate immediately",
            "Move to higher ground",
            "Stay away from steep slopes",
            "Listen for warning signs"
        ]
    },
    {
        id: 10,
        name: "Gas Leak",
        type: "human",
        severity: "high",
        icon: "fa-fire-flame-curved",
        description: "Uncontrolled release of gas from a container or pipeline.",
        remedy: [
            "Evacuate immediately",
            "Don't use electrical devices",
            "Open windows if safe",
            "Call emergency services"
        ]
    },
    {
        id: 11,
        name: "Tsunami",
        type: "natural",
        severity: "high",
        icon: "fa-wave-square",
        description: "A series of ocean waves with very long wavelengths, usually caused by underwater earthquakes.",
        remedy: [
            "Move to higher ground immediately",
            "Follow evacuation routes",
            "Stay away from coastal areas",
            "Listen to tsunami warnings"
        ]
    },
    {
        id: 12,
        name: "Volcanic Eruption",
        type: "natural",
        severity: "high",
        icon: "fa-volcano",
        description: "Eruption of molten rock, ash, and gases from a volcano.",
        remedy: [
            "Evacuate immediately if ordered",
            "Wear protective masks",
            "Stay indoors with windows closed",
            "Avoid river valleys"
        ]
    },
    {
        id: 13,
        name: "Hurricane",
        type: "natural",
        severity: "high",
        icon: "fa-hurricane",
        description: "A powerful tropical cyclone with sustained winds of 74 mph or higher.",
        remedy: [
            "Board up windows",
            "Stock emergency supplies",
            "Evacuate if ordered",
            "Stay away from flood-prone areas"
        ]
    },
    {
        id: 14,
        name: "Drought",
        type: "natural",
        severity: "medium",
        icon: "fa-sun",
        description: "Extended period of below-average precipitation.",
        remedy: [
            "Conserve water",
            "Store emergency water supply",
            "Use water-efficient appliances",
            "Follow water restrictions"
        ]
    },
    {
        id: 15,
        name: "Avalanche",
        type: "natural",
        severity: "high",
        icon: "fa-snowflake",
        description: "Rapid flow of snow down a sloping surface.",
        remedy: [
            "Stay away from avalanche-prone areas",
            "Carry avalanche safety gear",
            "Travel with a partner",
            "Check avalanche forecasts"
        ]
    },
    {
        id: 16,
        name: "Fog",
        type: "natural",
        severity: "low",
        icon: "fa-cloud-fog",
        description: "A thick cloud of tiny water droplets suspended in the atmosphere at or near the earth's surface.",
        remedy: [
            "Use fog lights when driving",
            "Reduce speed and maintain safe distance",
            "Use windshield wipers and defrosters",
            "Stay alert and focused"
        ]
    },
    {
        id: 17,
        name: "Minor Power Fluctuation",
        type: "human",
        severity: "low",
        icon: "fa-plug",
        description: "Brief interruption or variation in electrical power supply.",
        remedy: [
            "Use surge protectors",
            "Unplug sensitive electronics",
            "Keep emergency lighting ready",
            "Monitor power quality"
        ]
    },
    {
        id: 18,
        name: "Minor Flooding",
        type: "natural",
        severity: "low",
        icon: "fa-droplet",
        description: "Shallow accumulation of water in low-lying areas.",
        remedy: [
            "Avoid walking through standing water",
            "Use waterproof footwear",
            "Keep important items elevated",
            "Monitor water levels"
        ]
    }
];

// Function to create a disaster card
function createDisasterCard(disaster) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <i class="fas ${disaster.icon} card-icon"></i>
            <h2 class="card-title">${disaster.name}</h2>
        </div>
        <div class="card-content">
            <p class="disaster-description">${disaster.description}</p>
            <h3 class="remedy-title">Remedies:</h3>
            <ul class="remedy-steps">
                ${disaster.remedy.map(step => `<li>${step}</li>`).join('')}
            </ul>
            <span class="severity-badge severity-${disaster.severity}">${disaster.severity}</span>
        </div>
    `;
    return card;
}

// Function to filter disasters
function filterDisasters() {
    const typeFilter = document.getElementById('disasterType').value;
    const severityFilter = document.getElementById('severity').value;
    const container = document.getElementById('cardsContainer');
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Filter and display cards
    const filteredDisasters = disasters.filter(disaster => {
        const typeMatch = typeFilter === 'all' || disaster.type === typeFilter;
        const severityMatch = severityFilter === 'all' || disaster.severity === severityFilter;
        return typeMatch && severityMatch;
    });

    // Add animation class to container
    container.classList.add('filtering');
    
    // Display filtered cards with a slight delay for animation
    setTimeout(() => {
        filteredDisasters.forEach(disaster => {
            container.appendChild(createDisasterCard(disaster));
        });
        container.classList.remove('filtering');
    }, 300);
}

// Function to handle filter button clicks
function setupFilterButtons() {
    const typeSelect = document.getElementById('disasterType');
    const severitySelect = document.getElementById('severity');

    // Add click event listeners to options
    typeSelect.addEventListener('change', filterDisasters);
    severitySelect.addEventListener('change', filterDisasters);

    // Add keyboard navigation support
    typeSelect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            filterDisasters();
        }
    });

    severitySelect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            filterDisasters();
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupFilterButtons();
    filterDisasters();
}); 