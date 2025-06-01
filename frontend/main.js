import { ChatRoom } from './ChatRoom.js';

// Initialize chat room when page loads
document.addEventListener('DOMContentLoaded', () => {
    const chatRoom = new ChatRoom();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        chatRoom.cleanup();
    });
}); 