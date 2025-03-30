// Chatbot Feature
export class ChatbotFeature {
    constructor() {
        this.chatMessages = null;
        this.userInput = null;
        this.sendButton = null;
    }

    initialize() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-message');

        // Event listeners
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSend();
            }
        });
    }

    // Function to add a message to the chat
    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                ${!isUser ? '<div class="message-timestamp">' + new Date().toLocaleTimeString() + '</div>' : ''}
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Function to add system messages
    addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message bot-typing';
        typingDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return typingDiv;
    }

    // Function to get OpenAI response
    async getOpenAIResponse(message) {
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDM5cZpO8D-J7P1UeA5aKnN3yY-r_0Joh8', { //https://api.openai.com/v1/chat/completions
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer AIzaSyDM5cZpO8D-J7P1UeA5aKnN3yY-r_0Joh8' // Replace with your API key
                },
                body: JSON.stringify({
                    model: "gemini-pro",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful safety assistant that provides information about disaster preparedness, emergency response, and safety guidelines. Keep responses focused on safety and disaster-related topics only. Provide specific, actionable advice when possible."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from OpenAI');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error getting OpenAI response:', error);
            return "I apologize, but I'm having trouble accessing my knowledge base right now. Please try again later.";
        }
    }

    // Handle send button click
    async handleSend() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        this.userInput.value = '';

        // Show typing indicator
        const typingIndicator = this.showTypingIndicator();

        try {
            // Get OpenAI response
            const aiResponse = await this.getOpenAIResponse(message);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response
            this.addMessage(aiResponse);

            // Check for additional data based on message content
            await this.handleAdditionalData(message);

        } catch (error) {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Show error message
            this.addSystemMessage('Sorry, I encountered an error while processing your request. Please try again.');
            console.error('Error in handleSend:', error);
        }
    }

    // Handle additional data based on message content
    async handleAdditionalData(message) {
        const lowerMessage = message.toLowerCase();

        // Weather-related queries
        if (lowerMessage.includes('weather') || 
            lowerMessage.includes('temperature') || 
            lowerMessage.includes('rain') ||
            lowerMessage.includes('storm')) {
            await this.handleWeatherQuery(message);
        }

        // Emergency-related queries
        if (lowerMessage.includes('emergency') || 
            lowerMessage.includes('rescue') || 
            lowerMessage.includes('help') ||
            lowerMessage.includes('danger')) {
            await this.handleEmergencyQuery(message);
        }

        // Safety-related queries
        if (lowerMessage.includes('safety') || 
            lowerMessage.includes('prepared') || 
            lowerMessage.includes('guide') ||
            lowerMessage.includes('prevent')) {
            await this.handleSafetyQuery(message);
        }
    }

    // Handle weather-related queries
    async handleWeatherQuery(message) {
        const weatherTypingIndicator = this.showTypingIndicator();
        try {
            const weatherData = await this.getWeatherData(message);
            weatherTypingIndicator.remove();
            this.addMessage(this.formatDataResponse({ weather: weatherData }));
        } catch (error) {
            weatherTypingIndicator.remove();
            console.error('Error getting weather data:', error);
        }
    }

    // Handle emergency-related queries
    async handleEmergencyQuery(message) {
        const emergencyTypingIndicator = this.showTypingIndicator();
        try {
            const emergencyData = await this.getEmergencyData(message);
            emergencyTypingIndicator.remove();
            this.addMessage(this.formatDataResponse({ emergency: emergencyData }));
        } catch (error) {
            emergencyTypingIndicator.remove();
            console.error('Error getting emergency data:', error);
        }
    }

    // Handle safety-related queries
    async handleSafetyQuery(message) {
        const safetyTypingIndicator = this.showTypingIndicator();
        try {
            const safetyData = await this.getSafetyGuidelines(message);
            safetyTypingIndicator.remove();
            this.addMessage(this.formatDataResponse({ safety: safetyData }));
        } catch (error) {
            safetyTypingIndicator.remove();
            console.error('Error getting safety guidelines:', error);
        }
    }

    // Helper function to get weather data
    async getWeatherData(message) {
        const location = this.extractLocation(message) || 'default location';
        return {
            temperature: 25,
            conditions: 'Partly Cloudy',
            windSpeed: 12
        };
    }

    // Helper function to get emergency data
    async getEmergencyData(message) {
        return {
            type: 'Weather Emergency',
            location: 'Your Area',
            status: 'Active'
        };
    }

    // Helper function to get safety guidelines
    async getSafetyGuidelines(message) {
        return {
            guidelines: [
                'Stay indoors and away from windows',
                'Keep emergency supplies ready',
                'Follow local authorities\' instructions'
            ]
        };
    }

    // Helper function to extract location from message
    extractLocation(message) {
        return null;
    }

    // Helper function to format data responses
    formatDataResponse(data) {
        let formattedMessage = '';
        
        if (data.weather) {
            formattedMessage = `
                <div class="data-response">
                    <h4>Weather Information</h4>
                    <p>Temperature: ${data.weather.temperature}°C</p>
                    <p>Conditions: ${data.weather.conditions}</p>
                    <p>Wind Speed: ${data.weather.windSpeed} km/h</p>
                </div>
            `;
        } else if (data.emergency) {
            formattedMessage = `
                <div class="data-response">
                    <h4>Emergency Information</h4>
                    <p>Type: ${data.emergency.type}</p>
                    <p>Location: ${data.emergency.location}</p>
                    <p>Status: ${data.emergency.status}</p>
                </div>
            `;
        } else if (data.safety) {
            formattedMessage = `
                <div class="data-response">
                    <h4>Safety Guidelines</h4>
                    <ul>
                        ${data.safety.guidelines.map(guideline => `<li>${guideline}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        return formattedMessage || 'Here is the information you requested:';
    }
} 