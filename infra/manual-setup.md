# Manual Azure Setup Guide for Hackathon

This guide helps you manually set up the required Azure resources instead of using complex infrastructure-as-code for your hackathon project.

## Required Resources

1. **Azure OpenAI Service**

   - Create in the Azure Portal
   - Deploy a model (like GPT-4 or GPT-3.5-Turbo)
   - Copy endpoint and key

2. **Azure Cognitive Search**

   - Create a service (Basic tier is sufficient for development)
   - Create an index when ready to add documents
   - Copy service name and admin key

3. **Azure Storage Account** (for document storage)
   - Create a storage account
   - Create a container for your documents
   - Enable CORS if needed
   - Copy connection string

## Optional Resources

4. **Azure Document Intelligence** (if processing documents)

   - Create a Document Intelligence resource
   - Copy endpoint and key

5. **Azure AI Speech Service** (for voice capabilities)
   - Create a Speech service
   - Copy key and region

## Configuration

After creating these resources:

1. Copy values to your `.env` file
2. Update application configuration as needed
3. Make sure your application has appropriate permissions to access these services

This approach lets you get started quickly while avoiding infrastructure complexity.
