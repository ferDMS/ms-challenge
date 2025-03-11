"""
Azure AI Speech service client.
"""

import os
from dataclasses import dataclass
from typing import Optional, BinaryIO, Union

from services import ServiceBase, ServiceConfig


@dataclass
class SpeechServiceConfig(ServiceConfig):
    """Configuration for Azure AI Speech service."""
    region: str
    api_key: str


class SpeechClient(ServiceBase):
    """Client for Azure AI Speech service."""
    
    def __init__(self, config: Optional[SpeechServiceConfig] = None):
        super().__init__(config)
        
        # Import here to avoid dependency issues if not using this service
        self.speech_sdk = None
        try:
            import azure.cognitiveservices.speech as speechsdk
            self.speech_sdk = speechsdk
        except ImportError:
            print("Warning: azure-cognitiveservices-speech package not installed. Install with 'pip install azure-cognitiveservices-speech'")
    
    def _load_config(self) -> SpeechServiceConfig:
        """Load Speech service configuration from environment."""
        return SpeechServiceConfig.from_env(
            prefix="AZURE_SPEECH_",
            region=os.environ.get("AZURE_SPEECH_REGION", ""),
            api_key=os.environ.get("AZURE_SPEECH_KEY", "")
        )
    
    def text_to_speech(self, text: str, output_file: Optional[str] = None) -> Union[str, bytes]:
        """
        Convert text to speech using Azure AI Speech service.
        
        Args:
            text: The text to convert to speech
            output_file: Optional file path to save audio
            
        Returns:
            Path to audio file if output_file is provided, otherwise raw audio bytes
        """
        if not self.is_configured() or not self.speech_sdk:
            raise ValueError("Speech client not configured")
        
        speech_config = self.speech_sdk.SpeechConfig(
            subscription=self.config.api_key,
            region=self.config.region
        )
        
        if output_file:
            audio_config = self.speech_sdk.audio.AudioOutputConfig(filename=output_file)
        else:
            # Use in-memory output if no file specified
            audio_config = self.speech_sdk.audio.AudioOutputConfig(use_default_speaker=True)
            
        synthesizer = self.speech_sdk.SpeechSynthesizer(
            speech_config=speech_config, 
            audio_config=audio_config
        )
        
        result = synthesizer.speak_text_async(text).get()
        
        if result.reason == self.speech_sdk.ResultReason.SynthesizingAudioCompleted:
            if output_file:
                return output_file
            else:
                return result.audio_data
        else:
            raise Exception(f"Speech synthesis failed: {result.reason}")
    
    def speech_to_text(self, audio: Union[str, BinaryIO]) -> str:
        """
        Convert speech to text using Azure AI Speech service.
        
        Args:
            audio: Path to audio file or file-like object
            
        Returns:
            Transcribed text
        """
        if not self.is_configured() or not self.speech_sdk:
            raise ValueError("Speech client not configured")
        
        speech_config = self.speech_sdk.SpeechConfig(
            subscription=self.config.api_key,
            region=self.config.region
        )
        
        if isinstance(audio, str):
            audio_config = self.speech_sdk.audio.AudioConfig(filename=audio)
        else:
            # This is a simplification - handling in-memory audio requires more work
            raise ValueError("Currently only file paths are supported")
            
        speech_recognizer = self.speech_sdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )
        
        result = speech_recognizer.recognize_once_async().get()
        
        if result.reason == self.speech_sdk.ResultReason.RecognizedSpeech:
            return result.text
        else:
            raise Exception(f"Speech recognition failed: {result.reason}")
