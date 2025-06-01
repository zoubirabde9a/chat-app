from typing import Dict, List, Any
import os
from openai import OpenAI
from dotenv import load_dotenv
import httpx

class AIAgent:
    def __init__(self):
        load_dotenv()
        
        # Get configuration from environment variables
        api_key = os.getenv("API_KEY")
        api_base_url = os.getenv("API_BASE_URL")
        model_name = os.getenv("MODEL_NAME")
        
        if not all([api_key, api_base_url, model_name]):
            raise ValueError("Missing required environment variables: API_KEY, API_BASE_URL, or MODEL_NAME")
        
        # Create custom httpx client
        http_client = httpx.Client(
            base_url=api_base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "HTTP-Referer": "http://localhost:5000",  # Required for OpenRouter
                "X-Title": "AI Chat App"  # Optional, but good practice
            }
        )
        
        # Initialize OpenAI client with custom configuration
        self.client = OpenAI(
            api_key=api_key,
            base_url=api_base_url,
            http_client=http_client
        )
        self.model = model_name
        
        self.system_prompt = """You are a helpful AI assistant. You should:
1. Be friendly and professional
2. Provide clear and concise responses
3. Maintain context from the conversation
4. Ask clarifying questions when needed
5. Admit when you don't know something"""

    def process_message(self, user_id: str, conversation_history: List[Dict[str, Any]]) -> str:
        """Process a message and generate a response"""
        try:
            # Prepare messages for the API
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history
            for message in conversation_history:
                messages.append({
                    "role": message["role"],
                    "content": message["content"]
                })

            # Get response from OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=150
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Error processing message: {str(e)}")
            return "I apologize, but I'm having trouble processing your message right now. Please try again later." 