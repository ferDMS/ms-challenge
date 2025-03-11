# RAG chat app with Azure OpenAI and Azure AI Search

This solution creates a ChatGPT-like frontend experience over your own documents using RAG (Retrieval Augmented Generation). It uses Azure OpenAI Service to access GPT models, and Azure AI Search for data indexing and retrieval.

## Features

- Chat interface with Azure OpenAI integration
- Document search with Azure AI Search
- Document intelligence processing
- Optional speech-to-text capabilities
- React frontend with TypeScript

## Getting Started

### Environment Setup

1. Copy `.env.example` to `.env` and customize the variables for your needs:

   ```shell
   cp .env.example .env
   ```

2. Update the environment variables with your Azure service credentials:

   - Azure OpenAI configuration
   - Azure Search configuration
   - Document Intelligence settings (if needed)
   - Speech services settings (if needed)

3. See [Environment Setup Guide](./docs/environment-setup.md) for detailed documentation on all available configuration options.

## Running the Application

This application is designed to run in containers for maximum portability and ease of deployment.

You can also use Docker commands directly:

**Production Mode:**

```shell
# Build and start containers
docker-compose up --build
```

**Development Mode (with hot-reloading):**

```shell
# Build and start development containers
docker-compose -f docker-compose.dev.yml up --build
```

Once running, access the application at http://localhost:3000

### Container Architecture

The application consists of two main containers:

- **Frontend**: Next.js React application serving the UI
- **Backend**: Flask API providing access to Azure services

All dependencies are managed within the containers, eliminating the need for local environment setup beyond Docker itself.

## Core Azure Services

This application integrates with:

- **Azure OpenAI Service**: Provides the AI models for chat completion
- **Azure AI Search**: Indexes and retrieves document content
- **Azure Document Intelligence**: Processes and extracts content from documents
- **Azure Speech Services**: Optional speech-to-text and text-to-speech capabilities

## Resources

- [Environment Setup Guide](./docs/environment-setup.md) - Configuration options
- [Azure OpenAI Service](https://learn.microsoft.com/azure/cognitive-services/openai/overview)
- [Azure AI Search](https://learn.microsoft.com/azure/search/search-what-is-azure-search)
