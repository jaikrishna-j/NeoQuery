"""
LLM client wrapper - Uses OpenRouter API for all operations (chat and embeddings)
"""
import os
from pathlib import Path
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file from backend directory
backend_dir = Path(__file__).parent.parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)


class OpenRouterClient:
    """Wrapper for LLM API operations (using OpenRouter API for all operations)"""
    
    def __init__(self):
        # OpenRouter API key for all operations
        openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")
        
        # Initialize OpenAI client with OpenRouter API
        # OpenRouter provides OpenAI-compatible API
        self.client = OpenAI(
            api_key=openrouter_api_key,
            base_url="https://openrouter.ai/api/v1"
        )
        
        # Model names - using OpenRouter models
        # For chat: configurable via env, defaults to Trinity large free model
        self.chat_model = os.getenv("OPENROUTER_CHAT_MODEL", "arcee-ai/trinity-large-preview:free")
        # For embeddings: OpenRouter supports OpenAI-compatible embedding models
        self.embedding_model = os.getenv("OPENROUTER_EMBEDDING_MODEL", "text-embedding-3-small")
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using OpenRouter API
        
        Args:
            texts: List of text strings
            
        Returns:
            List of embedding vectors
        """
        try:
            # Use OpenAI embeddings API through OpenRouter
            # OpenRouter supports OpenAI-compatible embeddings API
            response = self.client.embeddings.create(
                model=self.embedding_model,
                input=texts
            )
            
            # Extract embeddings from response
            embeddings = [item.embedding for item in response.data]
            return embeddings
        except Exception as e:
            # Handle API errors with better messages
            error_msg = str(e)
            if "quota" in error_msg.lower() or "429" in error_msg or "rate_limit" in error_msg.lower():
                raise Exception(
                    "OpenRouter API quota exceeded or rate limit reached. Please check your OpenRouter account usage limits."
                )
            elif "401" in error_msg or "403" in error_msg or "invalid" in error_msg.lower() or "api key" in error_msg.lower():
                raise Exception(
                    "Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in the .env file."
                )
            else:
                raise Exception(f"Error generating embeddings: {error_msg}")
    
    def chat_completion(self, messages: List[dict], system_message: str = None) -> str:
        """
        Generate chat completion using OpenRouter API
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            system_message: Optional system message to prepend
            
        Returns:
            Generated response text
        """
        try:
            # Prepare messages for OpenRouter API
            api_messages = []
            
            # Add system message if provided
            if system_message:
                api_messages.append({
                    "role": "system",
                    "content": system_message
                })
            
            # Add conversation messages
            for msg in messages:
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                
                # OpenRouter supports 'system', 'user', and 'assistant' roles
                if role in ['system', 'user', 'assistant']:
                    api_messages.append({
                        "role": role,
                        "content": content
                    })
            
            # Generate response using OpenRouter API
            response = self.client.chat.completions.create(
                model=self.chat_model,
                messages=api_messages
            )
            
            # Extract text from response
            if response and response.choices and len(response.choices) > 0:
                return response.choices[0].message.content
            else:
                raise Exception("Empty response from OpenRouter API")
                
        except Exception as e:
            # Handle OpenRouter API errors with better messages
            error_msg = str(e)
            if "quota" in error_msg.lower() or "429" in error_msg or "rate_limit" in error_msg.lower():
                raise Exception(
                    "OpenRouter API quota exceeded or rate limit reached. Please check your OpenRouter account usage limits."
                )
            elif "401" in error_msg or "403" in error_msg or "invalid" in error_msg.lower() or "api key" in error_msg.lower():
                raise Exception(
                    "Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in the .env file."
                )
            else:
                raise Exception(f"Error generating chat completion: {error_msg}")

