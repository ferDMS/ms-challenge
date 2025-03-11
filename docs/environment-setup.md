# Environment Setup Guide

This document provides instructions for configuring your environment variables for the project. These settings control the behavior of the application and its connections to various Azure services.

## Getting Started

1. Copy the `.env.example` file to a new file named `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and update the values as needed for your environment.

3. Make sure not to commit your `.env` file to version control as it may contain sensitive information.

## Core Configuration

- `NODE_ENV`: The environment in which the application is running (development, staging, production)
- `PORT`: The port number the application will listen on

## Azure OpenAI Configuration

- `AZURE_OPENAI_API_ENDPOINT`: The endpoint URL for your Azure OpenAI service
- `AZURE_OPENAI_API_KEY`: Your API key for Azure OpenAI
- `AZURE_OPENAI_CHAT_DEPLOYMENT_NAME`: The deployment name for your chat model (e.g., gpt-35-turbo)
- `AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME`: The deployment name for your embeddings model (e.g., text-embedding-ada-002)
- `AZURE_OPENAI_API_VERSION`: The API version to use with Azure OpenAI

## Azure Search Configuration

- `AZURE_SEARCH_ENDPOINT`: The endpoint URL for your Azure Cognitive Search service
- `AZURE_SEARCH_KEY`: Your API key for Azure Cognitive Search
- `AZURE_SEARCH_INDEX`: The name of your search index

## Azure Document Intelligence Configuration

- `AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT`: The endpoint URL for your Document Intelligence service
- `AZURE_DOCUMENT_INTELLIGENCE_KEY`: Your API key for Document Intelligence

## Azure Speech Services Configuration

- `AZURE_SPEECH_ENDPOINT`: The endpoint URL for your Azure Speech service
- `AZURE_SPEECH_KEY`: Your API key for Azure Speech
- `AZURE_SPEECH_REGION`: The region where your Azure Speech service is deployed

## Optional: Azure Blob Storage Configuration

- `AZURE_STORAGE_ACCOUNT_CONNECTION_STRING`: The connection string for your Azure Storage account
- `AZURE_STORAGE_CONTAINER`: The name of the container in your storage account

## Security Configuration

- `AUTH_ENABLED`: Whether authentication is enabled for the application
- `AUTH_CLIENT_ID`: The client ID for authentication
- `AUTH_CLIENT_SECRET`: The client secret for authentication
- `AUTH_TENANT_ID`: The tenant ID for authentication

## Application Features

- `ENABLE_CHAT_HISTORY`: Enable or disable storing chat history
- `ENABLE_DOCUMENT_UPLOAD`: Enable or disable document upload functionality
- `ENABLE_SPEECH_TO_TEXT`: Enable or disable speech-to-text functionality

## Adding New Azure Services

To integrate additional Azure services:

1. Add the necessary environment variables to your `.env` file
2. Create a new service module in the `app/services` directory
3. Import and initialize the service in your application

## Troubleshooting

If you encounter errors related to environment variables:

- Ensure all required variables for the features you're using are defined
- Check for typos in variable names
- Verify that API keys and endpoints are correct
- Make sure your Azure resources are properly provisioned and accessible
