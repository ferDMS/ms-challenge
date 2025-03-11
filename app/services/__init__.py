"""
Services package for Azure AI service integrations.
Provides modular interfaces to different Azure services.
"""

from typing import Dict, Any, Optional
import os
from dataclasses import dataclass


@dataclass
class ServiceConfig:
    """Base configuration for Azure services."""
    service_name: str
    
    @classmethod
    def from_env(cls, prefix: str, **kwargs) -> 'ServiceConfig':
        """
        Create configuration from environment variables.
        Uses the provided prefix to find relevant variables.
        """
        config_dict = {}
        for key, value in os.environ.items():
            if key.startswith(prefix):
                config_key = key[len(prefix):].lower()
                config_dict[config_key] = value
        
        return cls(service_name=prefix.strip('_').lower(), **{**config_dict, **kwargs})


class ServiceBase:
    """Base class for all service clients."""
    
    def __init__(self, config: Optional[ServiceConfig] = None):
        """
        Initialize service with optional configuration.
        If no configuration provided, will attempt to load from environment.
        """
        self.config = config or self._load_config()
    
    def _load_config(self) -> ServiceConfig:
        """Load configuration from environment variables."""
        raise NotImplementedError("Subclasses must implement _load_config")
    
    def is_configured(self) -> bool:
        """Check if the service is properly configured."""
        return self.config is not None
