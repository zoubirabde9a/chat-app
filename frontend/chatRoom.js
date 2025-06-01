import BackgroundAnimationA from './backgroundAnimationA.js';
import BackgroundAnimationC from './backgroundAnimationC.js';
import './chatBoxA.css';
import './chatBoxB.css';

// Theme configuration
const themes = {
    white: {
        backgroundAnimation: BackgroundAnimationA,
        styleSheet: 'chatBoxA.css',
        name: 'WhiteTheme'
    },
    dark: {
        backgroundAnimation: BackgroundAnimationC,
        styleSheet: 'chatBoxB.css',
        name: 'DarkTheme'
    }
};

export class ChatRoom {
    constructor() {
        this.currentTheme = 'dark';
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.backgroundAnimation = null;
        this.API_BASE_URL = 'http://localhost:5000/api';
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeTheme();
        this.initializeChat();
    }

    initializeElements() {
        this.chatContainer = document.getElementById('chat-container');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.animationContainer = document.getElementById('animation-container');
        
        // Create and setup theme button
        this.themeButton = document.createElement('button');
        this.themeButton.id = 'theme-button';
        this.themeButton.textContent = 'Switch Theme';
        this.themeButton.addEventListener('click', () => this.switchTheme(this.currentTheme === 'dark' ? 'white' : 'dark'));
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        const inputContainer = document.querySelector('.input-container');
        inputContainer.appendChild(buttonContainer);
        buttonContainer.appendChild(this.sendButton);
        buttonContainer.appendChild(this.themeButton);
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    initializeTheme() {
        // Remove any existing theme stylesheets
        const existingStyles = document.querySelectorAll('link[href*="chatBox"]');
        existingStyles.forEach(style => style.remove());
        
        // Add the current theme's stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = themes[this.currentTheme].styleSheet;
        document.head.appendChild(link);
        
        try {
            this.backgroundAnimation = new themes[this.currentTheme].backgroundAnimation(this.animationContainer);
        } catch (error) {
            console.error('Failed to initialize background animation:', error);
        }
    }

    switchTheme(themeName) {
        if (!themes[themeName]) return;
        
        this.currentTheme = themeName;
        const theme = themes[themeName];
        
        // Remove any existing theme stylesheets
        const existingStyles = document.querySelectorAll('link[href*="chatBox"]');
        existingStyles.forEach(style => style.remove());
        
        // Add the new theme's stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = theme.styleSheet;
        document.head.appendChild(link);
        
        if (this.backgroundAnimation) {
            this.backgroundAnimation.cleanup();
        }
        
        try {
            this.backgroundAnimation = new theme.backgroundAnimation(this.animationContainer);
        } catch (error) {
            console.error(`Failed to initialize ${theme.name} background animation:`, error);
        }
    }

    async initializeChat() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/start-conversation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: this.userId })
            });

            const data = await response.json();
            if (data.status === 'success') {
                this.addMessageToChat('assistant', data.response);
                this.loadConversationHistory();
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    }

    async loadConversationHistory() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/conversation-history/${this.userId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.chatContainer.innerHTML = '';
                data.history.forEach(message => {
                    this.addMessageToChat(message.role, message.content);
                });
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.setInputState(true);
        this.addMessageToChat('user', message);
        this.messageInput.value = '';
        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.API_BASE_URL}/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.userId,
                    message: message
                })
            });

            const data = await response.json();
            this.removeTypingIndicator();
            
            if (data.status === 'success') {
                this.addMessageToChat('assistant', data.response);
            } else {
                this.addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
        } finally {
            this.setInputState(false);
        }
    }

    setInputState(disabled) {
        this.messageInput.disabled = disabled;
        this.sendButton.disabled = disabled;
        this.messageInput.style.opacity = disabled ? '0.5' : '1';
        this.sendButton.style.opacity = disabled ? '0.5' : '1';
        if (!disabled) this.messageInput.focus();
    }

    addMessageToChat(role, content) {
        this.removeTypingIndicator();
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    showTypingIndicator() {
        this.removeTypingIndicator();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        
        const typingText = document.createElement('span');
        typingText.textContent = 'Assistant is typing';
        
        const typingDots = document.createElement('div');
        typingDots.className = 'typing-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDots.appendChild(dot);
        }
        
        typingContent.appendChild(typingText);
        typingContent.appendChild(typingDots);
        typingDiv.appendChild(typingContent);
        this.chatContainer.appendChild(typingDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    cleanup() {
        if (this.backgroundAnimation) {
            this.backgroundAnimation.cleanup();
        }
    }
}