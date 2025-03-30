document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const sections = document.querySelectorAll('.guide-section');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const downloadBtn = document.getElementById('downloadPDF');
    const ttsBtn = document.getElementById('textToSpeech');
    let currentSection = null;

    // Initialize text-to-speech
    const speechSynthesis = window.speechSynthesis;
    let speaking = false;

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
                currentSection = section;
            } else {
                currentSection = null;
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

    // Text-to-speech functionality
    ttsBtn.addEventListener('click', () => {
        if (speaking) {
            speechSynthesis.cancel();
            ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
        } else if (currentSection) {
            const title = currentSection.querySelector('h2').textContent;
            const steps = Array.from(currentSection.querySelectorAll('.step p'))
                .map(step => step.textContent)
                .join('. ');

            const text = `${title}. ${steps}`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => {
                speaking = true;
                ttsBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Reading';
            };

            utterance.onend = () => {
                speaking = false;
                ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
            };

            speechSynthesis.speak(utterance);
        }
    });

    // Download PDF functionality
    downloadBtn.addEventListener('click', () => {
        // Create a temporary element to hold the content
        const content = document.createElement('div');
        content.innerHTML = `
            <h1>First Aid & Survival Guide</h1>
            ${Array.from(sections).map(section => `
                <h2>${section.querySelector('h2').textContent}</h2>
                ${Array.from(section.querySelectorAll('.step')).map(step => `
                    <p>${step.querySelector('p').textContent}</p>
                `).join('')}
            `).join('')}
        `;

        // Create a new window for printing
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
    });

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 