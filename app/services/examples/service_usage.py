"""
Examples of using the Azure service clients.
"""

# OpenAI Service Example
def openai_example():
    from services.openai.client import OpenAIClient
    from services.openai.models import ChatMessage
    
    client = OpenAIClient()
    
    messages = [
        ChatMessage(role="system", content="You are a helpful assistant."),
        ChatMessage(role="user", content="What can you tell me about Azure AI services?")
    ]
    
    completion = client.chat_completion(messages)
    print(f"OpenAI Response: {completion.content}")


# Document Intelligence Example
def document_intelligence_example(file_path):
    from services.document_intelligence.client import DocumentIntelligenceClient
    
    client = DocumentIntelligenceClient()
    
    with open(file_path, "rb") as document:
        result = client.analyze_document(document)
        
    print(f"Document contains {len(result.pages)} pages")
    for page in result.pages:
        print(f"Page {page.page_number}: {len(page.lines)} lines of text")


# Speech Service Example
def speech_example(text="Hello, this is a test of the Azure Speech service."):
    from services.speech.client import SpeechClient
    
    client = SpeechClient()
    
    # Text to speech
    output_file = "output.wav"
    client.text_to_speech(text, output_file)
    print(f"Text-to-speech output saved to {output_file}")
    
    # Speech to text
    transcription = client.speech_to_text(output_file)
    print(f"Speech-to-text result: {transcription}")


if __name__ == "__main__":
    # Example usage
    print("Running Azure service examples...")
    
    try:
        openai_example()
    except Exception as e:
        print(f"OpenAI example failed: {e}")
    
    try:
        document_intelligence_example("sample_document.pdf")
    except Exception as e:
        print(f"Document Intelligence example failed: {e}")
    
    try:
        speech_example()
    except Exception as e:
        print(f"Speech example failed: {e}")
