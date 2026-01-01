"""
OpenAI client wrapper
"""
import os
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class OpenAIClient:
    """Wrapper for OpenAI API operations"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        self.client = OpenAI(api_key=api_key)
        self.embedding_model = "text-embedding-ada-002"
        self.chat_model = "gpt-4"
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts
        
        Args:
            texts: List of text strings
            
        Returns:
            List of embedding vectors
        """
        try:
            response = self.client.embeddings.create(
                model=self.embedding_model,
                input=texts
            )
            return [item.embedding for item in response.data]
        except Exception as e:
            raise Exception(f"Error generating embeddings: {str(e)}")
    
    def chat_completion(self, messages: List[dict], system_message: str = None) -> str:
        """
        Generate chat completion
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            system_message: Optional system message to prepend
            
        Returns:
            Generated response text
        """
        try:
            message_list = []
            if system_message:
                message_list.append({"role": "system", "content": system_message})
            message_list.extend(messages)
            
            response = self.client.chat.completions.create(
                model=self.chat_model,
                messages=message_list
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error generating chat completion: {str(e)}")

