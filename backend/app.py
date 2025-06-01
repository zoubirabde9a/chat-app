from flask import Flask, request, jsonify
from flask_cors import CORS
from conversation_manager import ConversationManager
from ai_agent import AIAgent
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize conversation manager and AI agent
conversation_manager = ConversationManager()
ai_agent = AIAgent()

@app.route('/api/send-message', methods=['POST'])
def send_message():
    """Handle incoming messages and return AI response"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data or 'user_id' not in data:
            return jsonify({
                "status": "error",
                "message": "message and user_id are required"
            }), 400
            
        user_id = data['user_id']
        message = data['message']
        
        # Add user message to conversation history
        conversation_manager.add_message(user_id, "user", message)
        
        # Get conversation history
        history = conversation_manager.get_conversation_history(user_id)
        
        # Process message with AI agent
        response = ai_agent.process_message(user_id, history)
        
        # Add AI response to conversation history
        conversation_manager.add_message(user_id, "assistant", response)
        
        return jsonify({
            "status": "success",
            "response": response
        })
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/conversation-history/<user_id>', methods=['GET'])
def get_conversation_history(user_id):
    """Get conversation history for a specific user"""
    try:
        history = conversation_manager.get_conversation_history(user_id)
        return jsonify({
            "status": "success",
            "history": history
        })
    except Exception as e:
        logger.error(f"Error getting conversation history: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/start-conversation', methods=['POST'])
def start_conversation():
    """Start a new conversation with initial AI message"""
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({
                "status": "error",
                "message": "user_id is required"
            }), 400
            
        user_id = data['user_id']
        
        # Get initial message from AI agent
        initial_message = ai_agent.process_message(user_id, {})
        
        # Add initial message to conversation history
        conversation_manager.add_message(user_id, "assistant", initial_message)
        
        return jsonify({
            "status": "success",
            "response": initial_message
        })
        
    except Exception as e:
        logger.error(f"Error starting conversation: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 