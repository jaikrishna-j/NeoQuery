"""
LLM client wrapper - Uses Bytez API key for all operations (chat and embeddings)
"""
import os
from pathlib import Path
from typing import List
from openai import OpenAI
from bytez import Bytez
from dotenv import load_dotenv

# Load .env file from backend directory
backend_dir = Path(__file__).parent.parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)


class OpenAIClient:
    """Wrapper for LLM API operations (using Bytez API key for all operations)"""
    
    def __init__(self):
        # Bytez API key for all operations
        bytez_api_key = os.getenv("BYTEZ_API_KEY")
        if not bytez_api_key:
            raise ValueError("BYTEZ_API_KEY environment variable is required")
        
        # Initialize Bytez SDK for chat completions
        self.bytez_sdk = Bytez(bytez_api_key)
        self.chat_model = self.bytez_sdk.model("openai/gpt-4o")
        
        # Initialize OpenAI client with Bytez API key for embeddings
        # Bytez may provide OpenAI-compatible API or act as a proxy
        self.client = OpenAI(api_key=bytez_api_key)
        
        # Model names
        self.embedding_model = "text-embedding-3-small"
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using OpenAI API with Bytez key
        
        Args:
            texts: List of text strings
            
        Returns:
            List of embedding vectors
        """
        try:
            # Use OpenAI embeddings API with Bytez API key
            # OpenAI embeddings API supports batch processing
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
                    "Bytez API quota exceeded or rate limit reached. Please check your Bytez account usage limits."
                )
            elif "401" in error_msg or "403" in error_msg or "invalid" in error_msg.lower() or "api key" in error_msg.lower():
                raise Exception(
                    "Invalid Bytez API key. Please check your BYTEZ_API_KEY in the .env file."
                )
            else:
                raise Exception(f"Error generating embeddings: {error_msg}")
    
    def chat_completion(self, messages: List[dict], system_message: str = None) -> str:
        """
        Generate chat completion using Bytez SDK with GPT-4o
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            system_message: Optional system message to prepend
            
        Returns:
            Generated response text
        """
        try:
            # Prepare messages for Bytez API
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
                
                # Bytez supports 'system', 'user', and 'assistant' roles
                if role in ['system', 'user', 'assistant']:
                    api_messages.append({
                        "role": role,
                        "content": content
                    })
            
            # Generate response using Bytez SDK
            output, error = self.chat_model.run(api_messages)
            
            # Check for errors
            if error:
                error_msg = str(error)
                if "quota" in error_msg.lower() or "429" in error_msg or "rate_limit" in error_msg.lower():
                    raise Exception(
                        "Bytez API quota exceeded or rate limit reached. Please check your Bytez account usage limits."
                    )
                elif "401" in error_msg or "403" in error_msg or "invalid" in error_msg.lower() or "api key" in error_msg.lower():
                    raise Exception(
                        "Invalid Bytez API key. Please check your BYTEZ_API_KEY in the .env file."
                    )
                else:
                    raise Exception(f"Error from Bytez API: {error_msg}")
            
            # Extract text from output
            if output:
                # Bytez returns the response directly as a string
                if isinstance(output, str):
                    return output
                # If it's a dict, try to extract the content
                elif isinstance(output, dict):
                    if "content" in output:
                        return output["content"]
                    elif "message" in output:
                        return output["message"]
                    elif "text" in output:
                        return output["text"]
                    else:
                        # Try to get the first value if it's a single key dict
                        return str(list(output.values())[0]) if output else ""
                else:
                    return str(output)
            else:
                raise Exception("Empty response from Bytez API")
                
        except Exception as e:
            # Handle Bytez API errors with better messages
            error_msg = str(e)
            if "quota" in error_msg.lower() or "429" in error_msg or "rate_limit" in error_msg.lower():
                raise Exception(
                    "Bytez API quota exceeded or rate limit reached. Please check your Bytez account usage limits."
                )
            elif "401" in error_msg or "403" in error_msg or "invalid" in error_msg.lower() or "api key" in error_msg.lower():
                raise Exception(
                    "Invalid Bytez API key. Please check your BYTEZ_API_KEY in the .env file."
                )
            else:
                raise Exception(f"Error generating chat completion: {error_msg}")
