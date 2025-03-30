export function renderFirstAidGuide() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="guide-container">
            <div class="guide-header">
                <h1>First Aid & Survival Guide</h1>
                <div class="subtitle">Essential emergency procedures and survival tips</div>
            </div>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search for emergency procedures...">
                <button id="searchBtn"><i class="fas fa-search"></i></button>
            </div>
            <div class="guide-sections">
                <div class="guide-section" data-category="earthquake">
                    <div class="section-header">
                        <i class="fas fa-mountain"></i>
                        <h2>Earthquake</h2>
                        <button class="toggle-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="section-content">
                        <div class="steps">
                            <div class="step">
                                <span class="step-number">1</span>
                                <p>Drop, Cover, and Hold On: Get under a sturdy table or desk and hold on.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <p>Stay indoors until the shaking stops and it's safe to exit.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span>
                                <p>Check for injuries and provide first aid if necessary.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">4</span>
                                <p>Be prepared for aftershocks.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="guide-section" data-category="flood">
                    <div class="section-header">
                        <i class="fas fa-water"></i>
                        <h2>Flood</h2>
                        <button class="toggle-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="section-content">
                        <div class="steps">
                            <div class="step">
                                <span class="step-number">1</span>
                                <p>Move to higher ground immediately.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <p>Do not walk through moving water.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span>
                                <p>Turn off utilities if instructed to do so.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">4</span>
                                <p>Stay tuned to emergency broadcasts.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="guide-section" data-category="fire">
                    <div class="section-header">
                        <i class="fas fa-fire"></i>
                        <h2>Fire</h2>
                        <button class="toggle-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="section-content">
                        <div class="steps">
                            <div class="step">
                                <span class="step-number">1</span>
                                <p>Get out, stay out, and call emergency services.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <p>Stay low to avoid smoke inhalation.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span>
                                <p>Use stairs, not elevators.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">4</span>
                                <p>Stop, drop, and roll if clothes catch fire.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="guide-section" data-category="medical">
                    <div class="section-header">
                        <i class="fas fa-heartbeat"></i>
                        <h2>Medical Emergency</h2>
                        <button class="toggle-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="section-content">
                        <div class="steps">
                            <div class="step">
                                <span class="step-number">1</span>
                                <p>Check if the person is conscious and breathing.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <p>Call emergency services immediately.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span>
                                <p>Begin CPR if necessary and trained to do so.</p>
                            </div>
                            <div class="step">
                                <span class="step-number">4</span>
                                <p>Stay with the person until help arrives.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="guide-footer">
                <button class="download-btn" onclick="downloadFirstAidGuide()">
                    <i class="fas fa-download"></i> Download Guide
                </button>
                <button class="tts-btn" onclick="readFirstAidGuide()">
                    <i class="fas fa-volume-up"></i> Read Aloud
                </button>
            </div>
        </div>
    `;

    // Initialize the guide functionality
    initializeFirstAidGuide();
}

function initializeFirstAidGuide() {
    const sections = document.querySelectorAll('.guide-section');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Toggle section content
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        const toggleBtn = section.querySelector('.toggle-btn');

        header.addEventListener('click', () => {
            const isActive = content.classList.contains('active');
            
            // Close all sections
            sections.forEach(s => {
                const c = s.querySelector('.section-content');
                const t = s.querySelector('.toggle-btn');
                c.classList.remove('active');
                t.style.transform = 'rotate(0deg)';
            });

            // Open clicked section if it was closed
            if (!isActive) {
                content.classList.add('active');
                toggleBtn.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Search functionality
    function searchContent(query) {
        const searchTerm = query.toLowerCase();
        sections.forEach(section => {
            const title = section.querySelector('h2').textContent.toLowerCase();
            const steps = section.querySelectorAll('.step p');
            let hasMatch = false;

            // Check title
            if (title.includes(searchTerm)) {
                hasMatch = true;
            }

            // Check steps
            steps.forEach(step => {
                if (step.textContent.toLowerCase().includes(searchTerm)) {
                    hasMatch = true;
                }
            });

            // Show/hide section based on match
            section.style.display = hasMatch ? 'block' : 'none';
        });
    }

    searchBtn.addEventListener('click', () => {
        searchContent(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchContent(searchInput.value);
        }
    });
}

// Make functions available globally
window.downloadFirstAidGuide = function() {
    const content = document.createElement('div');
    content.innerHTML = `
        <h1>First Aid & Survival Guide</h1>
        ${Array.from(document.querySelectorAll('.guide-section')).map(section => `
            <h2>${section.querySelector('h2').textContent}</h2>
            ${Array.from(section.querySelectorAll('.step')).map(step => `
                <p>${step.querySelector('p').textContent}</p>
            `).join('')}
        `).join('')}
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>First Aid & Survival Guide</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #ff4444; }
                    h2 { color: #4CAF50; margin-top: 20px; }
                </style>
            </head>
            <body>
                ${content.innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

window.readFirstAidGuide = function() {
    if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported in your browser.');
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const activeSection = document.querySelector('.section-content.active');
    if (!activeSection) {
        alert('Please open a section to read its content.');
        return;
    }

    const title = activeSection.closest('.guide-section').querySelector('h2').textContent;
    const steps = Array.from(activeSection.querySelectorAll('.step p'))
        .map(step => step.textContent)
        .join('. ');

    const text = `${title}. ${steps}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}; 