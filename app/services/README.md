# Services Module

This directory contains modular service integrations with different Azure AI services. Each service is encapsulated in its own module with a consistent interface pattern to make them easily pluggable into your application.

## Available Services

- `openai`: Azure OpenAI service integration
- `search`: Azure Cognitive Search integration
- `document_intelligence`: Azure Document Intelligence (Form Recognizer) service
- `speech`: Azure AI Speech service

## Adding a New Service

To add a new Azure service:

1. Create a new directory under `/services` with your service name
2. Implement the service client following the pattern in existing services
3. Create a clear interface with well-documented methods
4. Add any service-specific types or models in a `models.py` file
5. Add configuration loading from environment variables
6. Create example usage in the `examples` directory

## Usage Pattern

Each service follows a similar usage pattern:

```python
from services.your_service import YourServiceClient

# Initialize the service with configs
service = YourServiceClient()

# Use the service
result = service.your_method(parameters)
```
