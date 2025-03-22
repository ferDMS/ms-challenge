# Environment Setup Guide

This document provides instructions for configuring your environment variables for the project. These settings control the behavior of the application and its connections to various Azure services.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables Reference](#environment-variables-reference)
  - [Azure Container Registry and Instance Services](#azure-container-registry-and-instance-services)
  - [Azure Cosmos DB](#azure-cosmos-db)
  - [Azure AI Services](#azure-ai-services)
  - [Azure AI Search](#azure-ai-search)
  - [Azure OpenAI](#azure-openai)
  - [Language Configuration](#language-configuration)
  - [Input/Output Configuration](#inputoutput-configuration)
- [Validating Your Configuration](#validating-your-configuration)
- [Troubleshooting](#troubleshooting)

## Getting Started

1. Copy the `.env.example` file to a new file named `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and update the values as needed for your environment.

3. Make sure not to commit your `.env` file to version control as it may contain sensitive information.

## Environment Variables Reference

Below is a reference for all environment variables used in this project. All variables should be considered required unless explicitly marked as optional.

### Azure Container Registry and Instance Services

- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID

  - Example: `123e4567-e89b-12d3-a456-426614174000`
  - Required for all Azure resource operations

- `AZURE_RESOURCE_GROUP`: Azure resource group name

  - Example: `my-project-resources`
  - The resource group containing your project resources

- `AZURE_LOCATION`: Azure region/location

  - Example: `eastus`
  - Determines where your Azure resources are deployed

- `REGISTRY_LOGIN_SERVER`: Azure Container Registry login server

  - Example: `myregistry.azurecr.io`
  - The URL used to access your container registry

- `REGISTRY_USERNAME`: Azure Container Registry username

  - Example: `myregistryuser`
  - Used for authenticating with the container registry

- `REGISTRY_PASSWORD`: Azure Container Registry password

  - Example: `password123`
  - Never commit this value to source control

- `RESOURCE_GROUP`: Resource group (if different from AZURE_RESOURCE_GROUP)
  - Example: `my-secondary-resources`
  - Optional - only specify if using a different resource group

### Azure Cosmos DB

- `COSMOS_KEY`: Primary or secondary key for your Cosmos DB account

  - Example: `a1b2c3d4e5f6g7h8i9j0...`
  - Found in the Azure Portal under your Cosmos DB account's "Keys" section

- `COSMOS_ENDPOINT`: The endpoint URL for your Cosmos DB account
  - Example: `https://my-cosmos-account.documents.azure.com:443/`
  - The URI used to connect to your database

### Azure AI Services

- `AZURE_AI_KEY`: API key for Azure AI Services

  - Example: `a1b2c3d4e5f6g7h8i9j0...`
  - Found in the Azure Portal under your AI service's "Keys and Endpoint" section

- `AZURE_SPEECH_ENDPOINT`: The endpoint URL for your Azure Speech service

  - Example: `https://westus2.api.cognitive.microsoft.com/`
  - Region-specific endpoint for Speech services

- `AZURE_LANGUAGE_ENDPOINT`: The endpoint URL for your Language service
  - Example: `https://westus2.api.cognitive.microsoft.com/`
  - Region-specific endpoint for Language services

### Azure AI Search

- `AZURE_SEARCH_ENDPOINT`: The endpoint URL for your Azure AI Search service

  - Example: `https://my-search-service.search.windows.net`
  - The base URL for search API calls

- `AZURE_SEARCH_KEY`: Admin or query key for your Azure AI Search service

  - Example: `a1b2c3d4e5f6g7h8i9j0...`
  - Used to authenticate search requests

- `AZURE_SEARCH_INDEX`: Name of the search index to use

  - Example: `my-search-index`
  - The specific index where your data is stored

- `AZURE_SEARCH_SEMANTIC_CONFIG`: Name of the semantic configuration to use
  - Example: `my-semantic-config`
  - Required for semantic search capabilities

### Azure OpenAI

- `AZURE_OPEN_AI_KEY_CHAT`: API key for Azure OpenAI chat completions

  - Example: `a1b2c3d4e5f6g7h8i9j0...`
  - Used for authentication with the chat completions API

- `AZURE_OPEN_AI_ENDPOINT_CHAT`: Endpoint URL for Azure OpenAI chat service

  - Example: `https://my-openai.openai.azure.com/`
  - The base URL for chat completion API calls

- `AZURE_OPEN_AI_KEY_EMBEDDINGS`: API key for Azure OpenAI embeddings

  - Example: `a1b2c3d4e5f6g7h8i9j0...`
  - Used for authentication with the embeddings API

- `AZURE_OPEN_AI_ENDPOINT_EMBEDDINGS`: Endpoint URL for Azure OpenAI embeddings service
  - Example: `https://my-openai-embed.openai.azure.com/`
  - The base URL for embeddings API calls

### Language Configuration

- `LANGUAGE`: Language for sentiment analysis and conversation analysis (ISO 639-1 code)

  - Example: `en` for English, `es` for Spanish
  - Default: `en`
  - See [supported languages](https://docs.microsoft.com/azure/cognitive-services/language-service/language-support)

- `LOCALE`: Locale for batch transcription of audio
  - Example: `en-US` for US English, `es-ES` for Spanish (Spain)
  - Default: `en-US`
  - Format: language-COUNTRY (ISO 639-1 code + ISO 3166-1 country code)

### Input/Output Configuration

- `INPUT_URL`: Input audio URL or path

  - Example: `https://mysite.com/audio/recording.wav` or `./data/recording.wav`
  - Supports both local file paths and web URLs

- `OUTPUT_FILE`: Output file for phrase list and conversation summary

  - Example: `./output/results.json`
  - Default: `evals/output.txt`

- `USE_STEREO`: Use stereo audio format (true/false)
  - Example: `true`
  - Default: `false`
  - Set to true for multi-channel audio with different speakers on different channels

## Troubleshooting

If you encounter errors related to environment variables:

- Ensure all required variables for the features you're using are defined
- Check for typos in variable names
- Verify that API keys and endpoints are correct
- Make sure your Azure resources are properly provisioned and accessible
- Check Azure portal for resource status and valid credentials
- For permission errors, ensure your account has appropriate IAM roles assigned
- For Cosmos DB connection issues, verify that your firewall settings allow access
- For OpenAI service issues, check that your deployment models are correctly configured
