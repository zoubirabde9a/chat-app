from typing import Dict, List, Any
import json
import os
from datetime import datetime

class ConversationManager:
    def __init__(self):
        self.conversations: Dict[str, List[Dict[str, Any]]] = {}
        self.history_file = "conversation_history.json"
        self.load_history()

    def load_history(self):
        """Load conversation history from file if it exists"""
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r') as f:
                    self.conversations = json.load(f)
            except Exception as e:
                print(f"Error loading conversation history: {str(e)}")
                self.conversations = {}

    def save_history(self):
        """Save conversation history to file"""
        try:
            with open(self.history_file, 'w') as f:
                json.dump(self.conversations, f)
        except Exception as e:
            print(f"Error saving conversation history: {str(e)}")

    def add_message(self, user_id: str, role: str, content: str):
        """Add a message to the conversation history"""
        if user_id not in self.conversations:
            self.conversations[user_id] = []

        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        
        self.conversations[user_id].append(message)
        self.save_history()

    def get_conversation_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get conversation history for a specific user"""
        return self.conversations.get(user_id, [])

    def clear_conversation(self, user_id: str):
        """Clear conversation history for a specific user"""
        if user_id in self.conversations:
            del self.conversations[user_id]
            self.save_history() 