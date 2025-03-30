import { pageTemplates } from './templates.js';
import { loadNewsContent } from './news.js';
import { initializeChatbot } from './chatbot.js';
import { initializeSOS } from './sos.js';
import { initializeWeatherAlerts } from './weather.js';
import { renderInsurancePage } from './insurance.js';
import { renderShopPage } from './shop.js';
import { renderSecurityGuide } from './security.js';
import { renderFirstAidGuide } from './first-aid.js';

export function loadPage(pageId) {
    console.log('Loading page:', pageId); // Debug log
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-menu li').forEach(item => {
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update content
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('Content area not found');
        return;
    }
    
    contentArea.innerHTML = pageTemplates[pageId] || pageTemplates.dashboard;
    
    // Load specific content based on page
    switch(pageId) {
        case 'dashboard':
            console.log('Initializing dashboard...'); // Debug log
            contentArea.innerHTML = `
                <div class="container" id="mainContent">
                    <div class="page-header">
                        <h1><i class="fas fa-exclamation-triangle"></i> Emergency News & Updates</h1>
                        <p class="subtitle">Stay informed with trusted emergency-related news</p>
                    </div>

                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-newspaper"></i>
                            </div>
                            <div class="stat-content">
                                <h3>Latest Updates</h3>
                                <p>Real-time disaster news</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="stat-content">
                                <h3>Trusted Sources</h3>
                                <p>Verified information</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-globe"></i>
                            </div>
                            <div class="stat-content">
                                <h3>Global Coverage</h3>
                                <p>Worldwide incidents</p>
                            </div>
                        </div>
                    </div>

                    <div class="news-controls">
                        <button id="getDisasterNews" class="refresh-btn">
                            <i class="fas fa-newspaper"></i>
                            Get Disaster News
                            <span class="btn-shine"></span>
                        </button>
                    </div>

                    <div class="news-grid" id="newsGrid">
                        <!-- News cards will be dynamically inserted here -->
                    </div>
                </div>
            `;
            // Add click event listener for the get disaster news button
            const getDisasterNewsBtn = document.getElementById('getDisasterNews');
            if (getDisasterNewsBtn) {
                getDisasterNewsBtn.addEventListener('click', () => {
                    window.location.href = 'http://localhost:3001';
                });
            }
            break;
        case 'weather':
            console.log('Initializing weather alerts...'); // Debug log
            initializeWeatherAlerts();
            break;
        case 'lost-found':
            console.log('Initializing chatbot...'); // Debug log
            initializeChatbot();
            break;
        case 'sos':
            console.log('Initializing SOS...'); // Debug log
            initializeSOS();
            break;
        case 'first-aid':
            console.log('Initializing first aid guide...'); // Debug log
            renderFirstAidGuide();
            break;
        case 'security-guide':
            console.log('Initializing security guide...'); // Debug log
            renderSecurityGuide();
            break;
        case 'news':
            console.log('Loading News...'); // Debug log
            loadNewsContent();
            break;
        case 'insurance':
            console.log('Initializing insurance page...'); // Debug log
            renderInsurancePage();
            break;
        case 'shop':
            console.log('Initializing shop page...'); // Debug log
            renderShopPage();
            break;
        default:
            console.log('No specific initialization for page:', pageId); // Debug log
    }
    
    // Update URL hash
    window.location.hash = pageId;
}

export function initializeNavigation() {
    console.log('Initializing navigation...'); // Debug log
    
    // Get all menu items
    const menuItems = document.querySelectorAll('.nav-menu li');
    
    // Add click event listener to each menu item
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                console.log('Menu item clicked:', pageId); // Debug log
                loadPage(pageId);
            }
        });
    });

    // Set dashboard as active by default
    const dashboardItem = document.querySelector('[data-page="dashboard"]');
    if (dashboardItem) {
        dashboardItem.classList.add('active');
    }

    // Initialize mobile menu
    initMobileMenu();

    // Load dashboard content by default
    loadPage('dashboard');
}

export function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

export function handleNavigation(page) {
    switch (page) {
        // ... existing cases ...
        
        case 'insurance':
            renderInsurancePage();
            break;
            
        // ... existing code ...
    }
}

// Security Guide Functions
function initializeSecurityGuide() {
    // Add click event listeners to toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const section = this.closest('.guide-section');
            const content = section.querySelector('.section-content');
            const icon = this.querySelector('i');
            
            // Toggle active class
            content.classList.toggle('active');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
            
            // Close other sections
            const otherSections = document.querySelectorAll('.guide-section');
            otherSections.forEach(otherSection => {
                if (otherSection !== section) {
                    const otherContent = otherSection.querySelector('.section-content');
                    const otherIcon = otherSection.querySelector('.toggle-btn i');
                    otherContent.classList.remove('active');
                    otherIcon.classList.remove('fa-chevron-up');
                    otherIcon.classList.add('fa-chevron-down');
                }
            });
        });
    });
}

function downloadSecurityGuide() {
    const doc = new jsPDF();
    const content = document.querySelector('.guide-container');
    
    // Set title
    doc.setFontSize(20);
    doc.text('Security Guide', 20, 20);
    
    let yPos = 40;
    
    // Add sections
    document.querySelectorAll('.guide-section').forEach(section => {
        const title = section.querySelector('.section-header h3').textContent;
        const steps = section.querySelectorAll('.step');
        const tips = section.querySelectorAll('.safety-guide li');
        
        // Add section title
        doc.setFontSize(16);
        doc.text(title, 20, yPos);
        yPos += 10;
        
        // Add steps
        doc.setFontSize(12);
        steps.forEach(step => {
            const stepTitle = step.querySelector('h4').textContent;
            const stepContent = step.querySelector('p').textContent;
            
            doc.text(`• ${stepTitle}`, 25, yPos);
            yPos += 7;
            doc.setFontSize(10);
            const splitContent = doc.splitTextToSize(stepContent, 170);
            doc.text(splitContent, 30, yPos);
            yPos += (splitContent.length * 7);
            doc.setFontSize(12);
        });
        
        // Add safety tips
        if (tips.length > 0) {
            yPos += 5;
            doc.text('Safety Tips:', 25, yPos);
            yPos += 7;
            doc.setFontSize(10);
            tips.forEach(tip => {
                const splitTip = doc.splitTextToSize(`• ${tip.textContent}`, 165);
                doc.text(splitTip, 30, yPos);
                yPos += (splitTip.length * 7);
            });
        }
        
        yPos += 10;
        
        // Add new page if needed
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });
    
    // Save the PDF
    doc.save('security-guide.pdf');
}

function readSecurityGuide() {
    if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported in your browser.');
        return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const sections = document.querySelectorAll('.guide-section');
    let textToRead = 'Security Guide. ';
    
    sections.forEach(section => {
        const title = section.querySelector('.section-header h3').textContent;
        textToRead += `${title}. `;
        
        const steps = section.querySelectorAll('.step');
        steps.forEach(step => {
            const stepTitle = step.querySelector('h4').textContent;
            const stepContent = step.querySelector('p').textContent;
            textToRead += `${stepTitle}. ${stepContent}. `;
        });
        
        const tips = section.querySelectorAll('.safety-guide li');
        if (tips.length > 0) {
            textToRead += 'Safety Tips: ';
            tips.forEach(tip => {
                textToRead += `${tip.textContent}. `;
            });
        }
    });
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Add mobile menu toggle functionality
function initMobileMenu() {
    // Remove existing mobile menu toggle if it exists
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }

    // Create mobile menu toggle button
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileMenuToggle);

    // Remove existing overlay if it exists
    const existingOverlay = document.querySelector('.sidebar-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    // Add event listeners
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking a navigation link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Close menu on window resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    // ... existing initialization code ...
}); 