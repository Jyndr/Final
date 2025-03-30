document.addEventListener('DOMContentLoaded', () => {
    initializeSecurityGuide();
    setupDownloadButton();
    setupTextToSpeech();
    setupIntersectionObserver();
});

function initializeSecurityGuide() {
    const sections = document.querySelectorAll('.guide-section');
    
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        const toggleBtn = section.querySelector('.toggle-btn i');
        
        header.addEventListener('click', () => {
            // Toggle active class
            content.classList.toggle('active');
            
            // Rotate chevron icon
            toggleBtn.style.transform = content.classList.contains('active') 
                ? 'rotate(180deg)' 
                : 'rotate(0)';
            
            // Close other sections
            sections.forEach(otherSection => {
                if (otherSection !== section) {
                    const otherContent = otherSection.querySelector('.section-content');
                    const otherToggleBtn = otherSection.querySelector('.toggle-btn i');
                    
                    otherContent.classList.remove('active');
                    otherToggleBtn.style.transform = 'rotate(0)';
                }
            });
        });
    });
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.guide-section').forEach(section => {
        observer.observe(section);
    });
}

function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadGuide');
    
    downloadBtn.addEventListener('click', () => {
        let content = '';
        
        // Gather content from all sections
        document.querySelectorAll('.guide-section').forEach(section => {
            const title = section.querySelector('.section-header h3').textContent;
            content += `\n${title}\n${'='.repeat(title.length)}\n\n`;
            
            // Add steps
            section.querySelectorAll('.step').forEach(step => {
                const stepTitle = step.querySelector('h4').textContent;
                const stepContent = step.querySelector('p').textContent;
                content += `${stepTitle}\n${stepContent}\n\n`;
            });
            
            // Add safety tips
            const safetyGuide = section.querySelector('.safety-guide');
            if (safetyGuide) {
                const safetyTitle = safetyGuide.querySelector('h3').textContent;
                content += `\n${safetyTitle}:\n`;
                
                safetyGuide.querySelectorAll('li').forEach(li => {
                    content += `- ${li.textContent}\n`;
                });
                content += '\n';
            }
        });
        
        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'security-guide.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

function setupTextToSpeech() {
    const readBtn = document.getElementById('readGuide');
    let isReading = false;
    let utterance = null;
    
    readBtn.addEventListener('click', () => {
        if (!isReading) {
            // Start reading
            const activeSection = document.querySelector('.section-content.active');
            if (!activeSection) {
                alert('Please open a section to read its content.');
                return;
            }
            
            const textToRead = getReadableText(activeSection);
            utterance = new SpeechSynthesisUtterance(textToRead);
            
            utterance.onend = () => {
                isReading = false;
                readBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
            };
            
            speechSynthesis.speak(utterance);
            isReading = true;
            readBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Reading';
        } else {
            // Stop reading
            speechSynthesis.cancel();
            isReading = false;
            readBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Aloud';
        }
    });
}

function getReadableText(section) {
    let text = '';
    
    // Read steps
    section.querySelectorAll('.step').forEach(step => {
        const stepTitle = step.querySelector('h4').textContent;
        const stepContent = step.querySelector('p').textContent;
        text += `${stepTitle}. ${stepContent} `;
    });
    
    // Read safety tips
    const safetyGuide = section.querySelector('.safety-guide');
    if (safetyGuide) {
        text += `${safetyGuide.querySelector('h3').textContent}. `;
        safetyGuide.querySelectorAll('li').forEach(li => {
            text += `${li.textContent}. `;
        });
    }
    
    return text;
} 