"""
Models for Azure OpenAI service.
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional


@dataclass
class ChatMessage:
    """A message in a chat completion."""
    role: str
    content: str
    
    def to_dict(self) -> Dict[str, str]:
        """Convert to dictionary format expected by OpenAI."""
        return {
            "role": self.role,
            "content": self.content
        }


@dataclass
class ChatChoice:
    """A choice returned by the chat completion API."""
    index: int
    message: ChatMessage
    finish_reason: str


@dataclass
class ChatCompletion:
    """A completion returned by the chat completion API."""
    id: str
    choices: List[ChatChoice]
    usage: Dict[str, int]
    
    @classmethod
    def from_response(cls, response: Dict[str, Any]) -> 'ChatCompletion':
        """Create a ChatCompletion from an API response."""
        choices = [
            ChatChoice(
                index=choice.get("index", 0),
                message=ChatMessage(
                    role=choice.get("message", {}).get("role", ""),
                    content=choice.get("message", {}).get("content", "")
                ),
                finish_reason=choice.get("finish_reason", "")
            )
            for choice in response.get("choices", [])
        ]
        
        return cls(
            id=response.get("id", ""),
            choices=choices,
            usage=response.get("usage", {})
        )
    
    @property
    def content(self) -> str:
        """Get the content of the first choice."""
        if not self.choices:
            return ""
        return self.choices[0].message.content
