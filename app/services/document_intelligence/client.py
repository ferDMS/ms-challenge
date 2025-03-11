"""
Azure Document Intelligence service client.
"""

import os
from dataclasses import dataclass
from typing import List, Dict, Any, Optional, BinaryIO

from services import ServiceBase, ServiceConfig
from .models import AnalyzeResult


@dataclass
class DocumentIntelligenceConfig(ServiceConfig):
    """Configuration for Azure Document Intelligence service."""
    endpoint: str
    api_key: str


class DocumentIntelligenceClient(ServiceBase):
    """Client for Azure Document Intelligence (Form Recognizer) service."""
    
    def __init__(self, config: Optional[DocumentIntelligenceConfig] = None):
        super().__init__(config)
        
        # Import here to avoid dependency issues if not using this service
        self.client = None
        try:
            from azure.ai.formrecognizer import DocumentAnalysisClient
            from azure.core.credentials import AzureKeyCredential
            
            if self.is_configured():
                self.client = DocumentAnalysisClient(
                    endpoint=self.config.endpoint,
                    credential=AzureKeyCredential(self.config.api_key)
                )
        except ImportError:
            print("Warning: azure-ai-formrecognizer package not installed. Install with 'pip install azure-ai-formrecognizer'")
    
    def _load_config(self) -> DocumentIntelligenceConfig:
        """Load Document Intelligence configuration from environment."""
        return DocumentIntelligenceConfig.from_env(
            prefix="AZURE_DOCUMENT_INTELLIGENCE_",
            endpoint=os.environ.get("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT", ""),
            api_key=os.environ.get("AZURE_DOCUMENT_INTELLIGENCE_KEY", "")
        )
        
    def analyze_document(self, document: BinaryIO) -> AnalyzeResult:
        """
        Analyze a document using the Document Intelligence service.
        
        Args:
            document: A file-like object containing the document to analyze
            
        Returns:
            AnalyzeResult object containing the extracted information
        """
        if not self.is_configured() or not self.client:
            raise ValueError("Document Intelligence client not configured")
            
        poller = self.client.begin_analyze_document("prebuilt-document", document)
        result = poller.result()
        
        return AnalyzeResult.from_response(result)
