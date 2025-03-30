export function initializeChatbot() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    
    // Add welcome message
    if (!document.querySelector('.welcome-message')) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <h3>Welcome to Safety Assistant</h3>
            <p>I'm here to help you with emergency-related information and guidance. How can I assist you today?</p>
        `;
        chatMessages.appendChild(welcomeMessage);
    }

    // Quick reply buttons
    const quickReplies = [
        'Emergency Contacts',
        'Safety Tips',
        'Weather Alerts',
        'Lost & Found'
    ];

    function addQuickReplies() {
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';
        
        quickReplies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.addEventListener('click', () => {
                chatInput.value = reply;
                sendMessage();
            });
            quickRepliesContainer.appendChild(button);
        });
        
        chatMessages.appendChild(quickRepliesContainer);
    }

    // Add typing indicator
    function showTypingIndicator() {
        const typingMessage = document.createElement('div');
        typingMessage.className = 'message bot-typing';
        typingMessage.innerHTML = `
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
        chatMessages.appendChild(typingMessage);
        return typingMessage;
    }

    // Remove typing indicator
    function removeTypingIndicator(typingMessage) {
        typingMessage.remove();
    }

    // Add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'system-message'}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <div class="message-timestamp">
                    <i class="far fa-clock"></i>
                    ${timestamp}
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Process user message
    async function processUserMessage(message) {
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Remove typing indicator
        removeTypingIndicator(typingIndicator);
        
        // Process message and generate response
        let response = '';
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('emergency') || lowerMessage.includes('contact')) {
            response = `Here are some important emergency contacts:
                <ul>
                    <li>Police: 100</li>
                    <li>Fire: 101</li>
                    <li>Ambulance: 108</li>
                    <li>Women Helpline: 1091</li>
                </ul>
                Would you like more specific emergency contacts?`;
        } else if (lowerMessage.includes('safety') || lowerMessage.includes('tip')) {
            response = `Here are some important safety tips:
                <ul>
                    <li>Always keep emergency numbers handy</li>
                    <li>Have a first aid kit ready</li>
                    <li>Know your emergency exit routes</li>
                    <li>Keep important documents in a safe place</li>
                </ul>
                Would you like more specific safety tips?`;
        } else if (lowerMessage.includes('weather') || lowerMessage.includes('alert')) {
            response = `You can check weather alerts in the Weather Alerts section. Would you like me to help you navigate there?`;
        } else if (lowerMessage.includes('lost') || lowerMessage.includes('found')) {
            response = `You can report or search for lost items in the Lost & Found section. Would you like me to help you navigate there?`;
        } else {
            response = `I'm here to help with emergency-related information. You can ask me about:
                <ul>
                    <li>Emergency contacts</li>
                    <li>Safety tips</li>
                    <li>Weather alerts</li>
                    <li>Lost & found items</li>
                </ul>
                What would you like to know?`;
        }
        
        addMessage(response);
        addQuickReplies();
    }

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            processUserMessage(message);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initialize quick replies
    addQuickReplies();
} 