"""
Azure OpenAI service client.
"""

import os
from dataclasses import dataclass
from typing import List, Dict, Any, Optional

from services import ServiceBase, ServiceConfig
from .models import ChatMessage, ChatCompletion


@dataclass
class OpenAIServiceConfig(ServiceConfig):
    """Configuration for Azure OpenAI service."""
    endpoint: str
    api_key: str
    api_version: str
    deployment: str


class OpenAIClient(ServiceBase):
    """Client for Azure OpenAI service."""
    
    def __init__(self, config: Optional[OpenAIServiceConfig] = None):
        super().__init__(config)
        
        # Import here to avoid dependency issues if not using this service
        try:
            import openai
            self.openai = openai
            if self.is_configured():
                self.openai.api_type = "azure"
                self.openai.api_base = self.config.endpoint
                self.openai.api_version = self.config.api_version
                self.openai.api_key = self.config.api_key
        except ImportError:
            print("Warning: openai package not installed. Install with 'pip install openai'")
    
    def _load_config(self) -> OpenAIServiceConfig:
        """Load OpenAI configuration from environment."""
        return OpenAIServiceConfig.from_env(
            prefix="AZURE_OPENAI_",
            endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT", ""),
            api_key=os.environ.get("AZURE_OPENAI_KEY", ""),
            api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2023-05-15"),
            deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT", "")
        )
        
    def chat_completion(self, messages: List[ChatMessage], **kwargs) -> ChatCompletion:
        """
        Get a chat completion from Azure OpenAI.
        
        Args:
            messages: List of ChatMessage objects
            **kwargs: Additional parameters to pass to the OpenAI API
            
        Returns:
            ChatCompletion object containing the response
        """
        if not self.is_configured():
            raise ValueError("OpenAI client not configured")
            
        formatted_messages = [msg.to_dict() for msg in messages]
        
        response = self.openai.ChatCompletion.create(
            deployment_id=self.config.deployment,
            messages=formatted_messages,
            **kwargs
        )
        
        return ChatCompletion.from_response(response)
