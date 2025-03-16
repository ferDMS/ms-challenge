# Environment Setup Guide

This document provides instructions for configuring your environment variables for the project. These settings control the behavior of the application and its connections to various Azure services.

## Getting Started

1. Copy the `.env.example` file to a new file named `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and update the values as needed for your environment.

3. Make sure not to commit your `.env` file to version control as it may contain sensitive information.

## Environment Variables Reference

Below is a reference for all environment variables used in this project:

### Azure Container Registry and Instance Services

- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID
- `AZURE_RESOURCE_GROUP`: Azure resource group name
- `AZURE_LOCATION`: Azure region/location
- `REGISTRY_LOGIN_SERVER`: Azure Container Registry login server
- `REGISTRY_USERNAME`: Azure Container Registry username
- `REGISTRY_PASSWORD`: Azure Container Registry password
- `RESOURCE_GROUP`: Resource group (if different from above)

### Azure AI Services

- `AZURE_AI_KEY`: API key for Azure AI Services
- `AZURE_SPEECH_ENDPOINT`: The endpoint URL for your Azure Speech service
- `AZURE_LANGUAGE_ENDPOINT`: The endpoint URL for your Language service

### Language Configuration

- `LANGUAGE`: Language for sentiment analysis and conversation analysis (ISO 639-1 code)
- `LOCALE`: Locale for batch transcription of audio

### Input/Output Configuration

- `INPUT_URL`: Input audio URL or path
- `OUTPUT_FILE`: Output file for phrase list and conversation summary
- `USE_STEREO`: Use stereo audio format (true/false)

## Troubleshooting

If you encounter errors related to environment variables:

- Ensure all required variables for the features you're using are defined
- Check for typos in variable names
- Verify that API keys and endpoints are correct
- Make sure your Azure resources are properly provisioned and accessible
