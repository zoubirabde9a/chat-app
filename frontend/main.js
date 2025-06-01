import BackgroundAnimationA from './backgroundAnimationA.js';
import BackgroundAnimationC from './backgroundAnimationC.js';
import { createChatBoxStyles as createChatBoxStylesA } from './chatBoxA.js';
import { createChatBoxStyles as createChatBoxStylesB } from './chatBoxB.js';

// Theme configuration
const themes = {
    white: {
        backgroundAnimation: BackgroundAnimationA,
        chatBoxStyles: createChatBoxStylesA,
        name: 'WhiteTheme'
    },
    dark: {
        backgroundAnimation: BackgroundAnimationC,
        chatBoxStyles: createChatBoxStylesB,
        name: 'DarkTheme'
    }
};

let currentTheme = 'dark'; // Default theme

// Theme switching function
function switchTheme(themeName) {
    if (!themes[themeName]) return;
    
    currentTheme = themeName;
    const theme = themes[themeName];
    
    // Update styles
    styleSheet.textContent = theme.chatBoxStyles();
    
    // Update background animation
    if (backgroundAnimation) {
        backgroundAnimation.cleanup();
    }
    
    try {
        backgroundAnimation = new theme.backgroundAnimation(animationContainer);
    } catch (error) {
        console.error(`Failed to initialize ${theme.name} background animation:`, error);
    }
}

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = themes[currentTheme].chatBoxStyles();
document.head.appendChild(styleSheet);

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const startButton = document.getElementById('start-button');
const animationContainer = document.getElementById('animation-container');

// Create button container
const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';
const inputContainer = document.querySelector('.input-container');
inputContainer.appendChild(buttonContainer);
buttonContainer.appendChild(sendButton);
buttonContainer.appendChild(startButton);

// Create theme switcher button
const themeButton = document.createElement('button');
themeButton.id = 'theme-button';
themeButton.textContent = 'Switch Theme';
themeButton.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'white' : 'dark';
    switchTheme(newTheme);
});
buttonContainer.appendChild(themeButton);

// Initialize background animation
let backgroundAnimation = null;
try {
    backgroundAnimation = new themes[currentTheme].backgroundAnimation(animationContainer);
} catch (error) {
    console.error('Failed to initialize background animation:', error);
    // The animation will fall back to a gradient background
}

// User ID - In a real application, this would come from authentication
const userId = 'user_' + Math.random().toString(36).substr(2, 9);

// Initialize chat
async function initializeChat() {
    try {
        const response = await fetch(`${API_BASE_URL}/start-conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        });

        const data = await response.json();
        if (data.status === 'success') {
            addMessageToChat('assistant', data.response);
            loadConversationHistory();
        } else {
            console.error('Failed to start conversation:', data.message);
        }
    } catch (error) {
        console.error('Error starting conversation:', error);
    }
}

// Load conversation history
async function loadConversationHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/conversation-history/${userId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear existing messages
            chatContainer.innerHTML = '';
            
            // Add all messages to chat
            data.history.forEach(message => {
                addMessageToChat(message.role, message.content);
            });
        } else {
            console.error('Failed to load conversation history:', data.message);
        }
    } catch (error) {
        console.error('Error loading conversation history:', error);
    }
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Disable input and button while typing
    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.style.opacity = '0.5';
    sendButton.style.opacity = '0.5';

    addMessageToChat('user', message);
    messageInput.value = '';

    // Show typing indicator and set typing flag
    showTypingIndicator();
    if (backgroundAnimation) {
        backgroundAnimation.setTyping(true);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                message: message
            })
        });

        const data = await response.json();
        if (backgroundAnimation) {
            backgroundAnimation.setTyping(false);
        }
        removeTypingIndicator();
        if (data.status === 'success') {
            addMessageToChat('assistant', data.response);
        } else {
            addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        if (backgroundAnimation) {
            backgroundAnimation.setTyping(false);
        }
        removeTypingIndicator();
        addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
        // Re-enable input and button
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.style.opacity = '1';
        sendButton.style.opacity = '1';
        messageInput.focus();
    }
}

// Add message to chat UI
function addMessageToChat(role, content) {
    // Remove typing indicator if present
    removeTypingIndicator();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing indicator
function showTypingIndicator() {
    removeTypingIndicator();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    
    const typingText = document.createElement('span');
    typingText.textContent = 'Assistant is typing';
    
    const typingDots = document.createElement('div');
    typingDots.className = 'typing-dots';
    
    // Create three dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDots.appendChild(dot);
    }
    
    typingContent.appendChild(typingText);
    typingContent.appendChild(typingDots);
    typingDiv.appendChild(typingContent);
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
startButton.addEventListener('click', initializeChat);

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', initializeChat);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (backgroundAnimation) {
        backgroundAnimation.cleanup();
    }
}); 