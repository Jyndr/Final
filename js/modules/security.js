export function renderSecurityGuide() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="guide-container">
            <h1 class="guide-title">Top Disasters and Their Remedies</h1>
            <p class="guide-subtitle">Essential guide for emergency preparedness and response</p>

            <div class="filter-section">
                <div class="filter-group">
                    <i class="fas fa-filter"></i>
                    <select id="disasterType" class="filter-select">
                        <option value="all">All Disasters</option>
                        <option value="natural">Natural Disasters</option>
                        <option value="human">Human-Made Disasters</option>
                    </select>
                </div>
                <div class="filter-group">
                    <i class="fas fa-exclamation-triangle"></i>
                    <select id="severityLevel" class="filter-select">
                        <option value="all">All Severities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            <div class="disaster-grid">
                <!-- Earthquake -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-house-crack"></i>
                            <h3>Earthquake</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">A sudden shaking of the ground caused by tectonic plate movements.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Drop, cover, and hold on</li>
                            <li>Stay away from windows and heavy furniture</li>
                            <li>If indoors, stay inside until shaking stops</li>
                            <li>If outdoors, move to an open area away from buildings</li>
                        </ul>
                    </div>
                </div>

                <!-- Flood -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-water"></i>
                            <h3>Flood</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">An overflow of water that submerges normally dry land.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Move to higher ground immediately</li>
                            <li>Avoid walking or driving through flood waters</li>
                            <li>Turn off electricity and gas if flooding is imminent</li>
                            <li>Keep emergency supplies ready</li>
                        </ul>
                    </div>
                </div>

                <!-- Wildfire -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-fire"></i>
                            <h3>Wildfire</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">An uncontrolled fire in a natural area.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Evacuate immediately if ordered</li>
                            <li>Close all windows and doors</li>
                            <li>Turn off gas and electricity</li>
                            <li>Wear protective clothing and mask</li>
                        </ul>
                    </div>
                </div>

                <!-- Cyber Attack -->
                <div class="disaster-card" data-type="human" data-severity="medium">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-shield-halved"></i>
                            <h3>Cyber Attack</h3>
                        </div>
                        <span class="severity-badge medium">MEDIUM</span>
                    </div>
                    <p class="disaster-description">Malicious attempt to damage or gain unauthorized access to computer systems.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Disconnect from the internet</li>
                            <li>Back up important data</li>
                            <li>Update security software</li>
                            <li>Change all passwords</li>
                        </ul>
                    </div>
                </div>

                <!-- Chemical Spill -->
                <div class="disaster-card" data-type="human" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-flask"></i>
                            <h3>Chemical Spill</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">Accidental release of hazardous chemicals into the environment.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Evacuate the area immediately</li>
                            <li>Call emergency services</li>
                            <li>Stay upwind of the spill</li>
                            <li>Avoid contact with contaminated materials</li>
                        </ul>
                    </div>
                </div>

                <!-- Tornado -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-tornado"></i>
                            <h3>Tornado</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">A violently rotating column of air extending from a thunderstorm to the ground.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Seek shelter in a basement or interior room</li>
                            <li>Stay away from windows</li>
                            <li>Cover yourself with blankets or mattresses</li>
                            <li>Listen to weather alerts</li>
                        </ul>
                    </div>
                </div>

                <!-- Power Outage -->
                <div class="disaster-card" data-type="human" data-severity="medium">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-bolt"></i>
                            <h3>Power Outage</h3>
                        </div>
                        <span class="severity-badge medium">MEDIUM</span>
                    </div>
                    <p class="disaster-description">Loss of electrical power in a specific area.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Keep emergency lighting ready</li>
                            <li>Unplug sensitive electronics</li>
                            <li>Keep refrigerator closed</li>
                            <li>Have backup power source</li>
                        </ul>
                    </div>
                </div>

                <!-- Pandemic -->
                <div class="disaster-card" data-type="human" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-virus"></i>
                            <h3>Pandemic</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">Global outbreak of a contagious disease.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Practice social distancing</li>
                            <li>Wear protective masks</li>
                            <li>Maintain good hygiene</li>
                            <li>Stay informed with reliable sources</li>
                        </ul>
                    </div>
                </div>

                <!-- Landslide -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-mountain"></i>
                            <h3>Landslide</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">Downward movement of soil and rock.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Evacuate immediately</li>
                            <li>Move to higher ground</li>
                            <li>Stay away from steep slopes</li>
                            <li>Listen for warning signs</li>
                        </ul>
                    </div>
                </div>

                <!-- Gas Leak -->
                <div class="disaster-card" data-type="human" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-fire-flame-curved"></i>
                            <h3>Gas Leak</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">Uncontrolled release of gas from a container or pipeline.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Evacuate immediately</li>
                            <li>Don't use electrical devices</li>
                            <li>Open windows if safe</li>
                            <li>Call emergency services</li>
                        </ul>
                    </div>
                </div>

                <!-- Tsunami -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-wave-square"></i>
                            <h3>Tsunami</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">A series of ocean waves with very long wavelengths, usually caused by underwater earthquakes.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Move to higher ground immediately</li>
                            <li>Follow evacuation routes</li>
                            <li>Stay away from coastal areas</li>
                            <li>Listen to tsunami warnings</li>
                        </ul>
                    </div>
                </div>

                <!-- Volcanic Eruption -->
                <div class="disaster-card" data-type="natural" data-severity="high">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-volcano"></i>
                            <h3>Volcanic Eruption</h3>
                        </div>
                        <span class="severity-badge high">HIGH</span>
                    </div>
                    <p class="disaster-description">Eruption of molten rock, ash, and gases from a volcano.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Evacuate immediately if ordered</li>
                            <li>Wear protective masks</li>
                            <li>Stay indoors with windows closed</li>
                            <li>Avoid river valleys</li>
                        </ul>
                    </div>
                </div>

                <!-- Drought -->
                <div class="disaster-card" data-type="natural" data-severity="medium">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-sun"></i>
                            <h3>Drought</h3>
                        </div>
                        <span class="severity-badge medium">MEDIUM</span>
                    </div>
                    <p class="disaster-description">Extended period of below-average precipitation.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Conserve water</li>
                            <li>Store emergency water supply</li>
                            <li>Use water-efficient appliances</li>
                            <li>Follow water restrictions</li>
                        </ul>
                    </div>
                </div>

                <!-- Fog -->
                <div class="disaster-card" data-type="natural" data-severity="low">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-cloud"></i>
                            <h3>Fog</h3>
                        </div>
                        <span class="severity-badge low">LOW</span>
                    </div>
                    <p class="disaster-description">A thick cloud of tiny water droplets suspended in the atmosphere at or near the earth's surface.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Use fog lights when driving</li>
                            <li>Reduce speed and maintain safe distance</li>
                            <li>Use windshield wipers and defrosters</li>
                            <li>Stay alert and focused</li>
                        </ul>
                    </div>
                </div>

                <!-- Minor Power Fluctuation -->
                <div class="disaster-card" data-type="human" data-severity="low">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-plug"></i>
                            <h3>Minor Power Fluctuation</h3>
                        </div>
                        <span class="severity-badge low">LOW</span>
                    </div>
                    <p class="disaster-description">Brief interruption or variation in electrical power supply.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Use surge protectors</li>
                            <li>Unplug sensitive electronics</li>
                            <li>Keep emergency lighting ready</li>
                            <li>Monitor power quality</li>
                        </ul>
                    </div>
                </div>

                <!-- Minor Flooding -->
                <div class="disaster-card" data-type="natural" data-severity="low">
                    <div class="card-header">
                        <div class="disaster-title">
                            <i class="fas fa-water"></i>
                            <h3>Minor Flooding</h3>
                        </div>
                        <span class="severity-badge low">LOW</span>
                    </div>
                    <p class="disaster-description">Shallow accumulation of water in low-lying areas.</p>
                    <div class="remedies-section">
                        <h4>Remedies:</h4>
                        <ul>
                            <li>Avoid walking through standing water</li>
                            <li>Use waterproof footwear</li>
                            <li>Keep important items elevated</li>
                            <li>Monitor water levels</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Initialize the filtering functionality
    initializeSecurityGuide();
}

function initializeSecurityGuide() {
    const disasterTypeSelect = document.getElementById('disasterType');
    const severityLevelSelect = document.getElementById('severityLevel');
    const disasterCards = document.querySelectorAll('.disaster-card');

    function filterDisasters() {
        const selectedType = disasterTypeSelect.value;
        const selectedSeverity = severityLevelSelect.value;

        disasterCards.forEach(card => {
            const cardType = card.dataset.type;
            const cardSeverity = card.dataset.severity;
            const typeMatch = selectedType === 'all' || cardType === selectedType;
            const severityMatch = selectedSeverity === 'all' || cardSeverity === selectedSeverity;

            if (typeMatch && severityMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    disasterTypeSelect.addEventListener('change', filterDisasters);
    severityLevelSelect.addEventListener('change', filterDisasters);
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