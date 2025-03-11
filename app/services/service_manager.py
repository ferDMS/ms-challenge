"""
Service manager for handling Azure service dependencies.
"""

from typing import Dict, Any, Optional, Type, TypeVar
from services import ServiceBase

T = TypeVar('T', bound=ServiceBase)


class ServiceManager:
    """
    Manager for Azure services with dependency injection pattern.
    Allows centralized configuration and access to service clients.
    """
    
    def __init__(self):
        self._services: Dict[str, ServiceBase] = {}
    
    def register(self, service_name: str, service: ServiceBase) -> None:
        """
        Register a service with the manager.
        
        Args:
            service_name: Name to register the service under
            service: Service client instance
        """
        self._services[service_name] = service
    
    def get_service(self, service_name: str) -> Optional[ServiceBase]:
        """
        Get a service by name.
        
        Args:
            service_name: Name of the registered service
            
        Returns:
            Service client or None if not found
        """
        return self._services.get(service_name)
    
    def get_typed_service(self, service_name: str, service_type: Type[T]) -> T:
        """
        Get a service by name with type checking.
        
        Args:
            service_name: Name of the registered service
            service_type: Expected service type
            
        Returns:
            Service client cast to the expected type
            
        Raises:
            ValueError: If service not found or not of expected type
        """
        service = self.get_service(service_name)
        if not service:
            raise ValueError(f"Service '{service_name}' not registered")
        
        if not isinstance(service, service_type):
            raise ValueError(f"Service '{service_name}' is not of type {service_type.__name__}")
        
        return service
    
    @classmethod
    def create_default(cls) -> 'ServiceManager':
        """
        Create a service manager with default services.
        
        Returns:
            ServiceManager with commonly used services
        """
        manager = cls()
        
        # Import and initialize services
        try:
            from services.openai.client import OpenAIClient
            manager.register("openai", OpenAIClient())
        except Exception:
            pass
            
        try:
            from services.document_intelligence.client import DocumentIntelligenceClient
            manager.register("document_intelligence", DocumentIntelligenceClient())
        except Exception:
            pass
            
        try:
            from services.speech.client import SpeechClient
            manager.register("speech", SpeechClient())
        except Exception:
            pass
        
        return manager
