export const pageTemplates = {
    dashboard: `
        <div class="page-header">
            <div class="icon"><i class="fas fa-newspaper"></i></div>
            <h1 class="page-title">Disaster News & Updates</h1>
        </div>
        <div class="content-card">
            <div id="news-container">
                <!-- News content will be loaded here -->
            </div>
        </div>
    `,
    "lost-found": `
        <div class="page-header">
            <div class="icon"><i class="fas fa-robot"></i></div>
            <h1 class="page-title">Safety Assistant</h1>
        </div>
        <div class="content-card">
            <div class="chatbot-card">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span>Safety Assistant</span>
                    </div>
                    <div class="chatbot-status">
                        <span class="status-dot"></span>
                        <span class="status-text">Online</span>
                    </div>
                </div>
                <div class="chatbot-container">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-icon">
                                <i class="fas fa-robot"></i>
                            </div>
                            
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="user-input" placeholder="Type your question about safety...">
                        <button id="send-message" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    weather: `
        <div class="page-header">
            <div class="icon"><i class="fas fa-cloud"></i></div>
            <h1 class="page-title">Weather & Disaster Alerts</h1>
        </div>
        <div class="content-card">
            <div class="search-section">
                <div class="search-container">
                    <button class="location-btn" id="get-current-location" title="Get Current Location">
                        <i class="fas fa-location-crosshairs"></i>
                    </button>
                    <div class="search-input">
                        <input type="text" id="location-input" placeholder="Enter your location...">
                    </div>
                    <button class="update-btn" id="update-alerts">Update Alerts</button>
                </div>
            </div>

            <div class="weather-overview">
                <div class="weather-card current">
                    <div class="card-header">
                        <i class="fas fa-clock"></i>
                        <h3>Current Weather</h3>
                    </div>
                    <div class="card-content" id="current-weather">
                        <!-- Weather content will be loaded here -->
                    </div>
                </div>

                <div class="weather-card forecast">
                    <div class="card-header">
                        <i class="fas fa-calendar"></i>
                        <h3>Expected Weather</h3>
                    </div>
                    <div class="card-content" id="weather-forecast">
                        <!-- Forecast content will be loaded here -->
                    </div>
                </div>

                <div class="weather-card anomalies">
                    <div class="card-header">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Weather Anomalies</h3>
                    </div>
                    <div class="card-content" id="weather-anomalies">
                        <!-- Anomalies content will be loaded here -->
                    </div>
                </div>
            </div>

            <div class="alerts-grid">
                <!-- Alerts will be loaded here -->
            </div>
        </div>
    `,
    sos: `
        <div class="page-header">
            <div class="icon"><i class="fas fa-phone-alt"></i></div>
            <h1 class="page-title">Emergency SOS</h1>
        </div>
        <div class="content-card">
            <div class="sos-container">
                <div class="sos-header">
                    <h2>Emergency Contacts</h2>
                    <p>Add your emergency contacts to receive SOS alerts</p>
                </div>
                
                <div class="sos-form">
                    <form id="emergency-contact-form">
                        <div class="form-group">
                            <label for="contact-name">Contact Name</label>
                            <input type="text" id="contact-name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-phone">Phone Number</label>
                            <input type="tel" id="contact-phone" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-email">Email Address</label>
                            <input type="email" id="contact-email" required>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Contact
                        </button>
                    </form>
                </div>

                <div class="sos-contacts">
                    <h3>Saved Contacts</h3>
                    <div id="contacts-list" class="contacts-list">
                        <!-- Contacts will be loaded here -->
                    </div>
                </div>

                <div class="sos-button-container">
                    <button id="sos-button" class="sos-button">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>SOS</span>
                    </button>
                </div>
            </div>
        </div>
    `,
    settings: `
        <div class="page-header">
            <div class="icon"><i class="fas fa-gear"></i></div>
            <h1 class="page-title">Alert Settings</h1>
        </div>
        <div class="content-card">
            <div class="settings-section">
                <h3>Notification Preferences</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <div class="setting-label">
                            <i class="fas fa-bell"></i>
                            <span>Emergency Alerts</span>
                        </div>
                        <div class="setting-toggle active">
                            <div class="toggle-switch"></div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-label">
                            <i class="fas fa-location-dot"></i>
                            <span>Location Tracking</span>
                        </div>
                        <div class="setting-toggle active">
                            <div class="toggle-switch"></div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-label">
                            <i class="fas fa-volume-high"></i>
                            <span>Alert Sound</span>
                        </div>
                        <div class="setting-toggle active">
                            <div class="toggle-switch"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    "first-aid": `
        <div class="page-header">
            <div class="icon"><i class="fas fa-first-aid"></i></div>
            <h1 class="page-title">First Aid & Survival Guide</h1>
        </div>
        <div class="content-card">
            <div class="guide-container">
                <!-- First Aid Guide content will be loaded here -->
            </div>
        </div>
    `
}; 