import { initializeNavigation, toggleMobileMenu } from './modules/navigation.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();

    // Add event listener for mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);

    // Add event listener for logout button
    document.querySelector('.logout-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Add event listener for end shift button
    document.querySelector('.end-shift-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to end your shift?')) {
            window.location.href = 'index.html';
        }
    });
});

