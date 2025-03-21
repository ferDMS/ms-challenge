# Manual Azure Setup Guide for Hackathon

This guide helps you manually set up the required Azure resources instead of using complex infrastructure-as-code for your hackathon project.

## Required Resources

1. **Azure OpenAI Service**

   - Create in the Azure Portal
   - Deploy a model (like GPT-4 or GPT-3.5-Turbo)
   - Deploy text-embedding-ada-002 model for embeddings
   - Copy endpoint and key

2. **Azure Cognitive Search**

   - Create a service (Basic tier is sufficient for development)
   - Create an index when ready to add documents
   - Enable semantic search (free tier)
   - Copy service name and admin key

3. **Azure Storage Account** (for document storage)

   - Create a storage account (Standard_LRS is sufficient)
   - Create a container for your documents (e.g., "test-1")
   - Create a container for audio files if needed (e.g., "audio-files")
   - Enable CORS if needed for web app access
   - Copy connection string

4. **Azure Cosmos DB** (for application data)
   - Create a Cosmos DB account with SQL API
   - Create a database (e.g., "ms-challenge")
   - Create containers with appropriate partition keys:
     - sessions (partition key: /id)
     - participants (partition key: /id)
     - jobs (partition key: /id)
     - job_matches (partition key: /participantId)
   - Copy connection string and key

## Optional Resources

4. **Azure Document Intelligence** (if processing documents)

   - Create a Document Intelligence resource
   - Copy endpoint and key

5. **Azure AI Speech Service** (for voice capabilities)

   - Create a Speech service
   - Copy key and region

6. **Azure Container Registry** (for containerized apps)

   - Create a container registry (Basic tier is sufficient)
   - Enable admin user if needed
   - Copy registry login server, username, and password

7. **Azure Container Instances** (for hosting services)

   - Create container instances for frontend and backend when ready
   - Configure environment variables (e.g., API URLs, ports)
   - Note the public IP and DNS name

8. **Azure Key Vault** (for secrets management)

   - Create a Key Vault
   - Store service keys and connection strings
   - Configure access policies for your applications

9. **Azure Machine Learning** (for AI model training/deployment)
   - Create workspace resources if needed for model development
   - Configure connections to other AI services

## Configuration

After creating these resources:

1. Copy values to your `.env` file or application configuration:

   ```
   # OpenAI Configuration
   AZURE_OPENAI_API_KEY=your_openai_key
   AZURE_OPENAI_ENDPOINT=https://your-openai-service.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
   AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=your_embedding_deployment_name

   # Cognitive Search
   AZURE_SEARCH_SERVICE=your_search_service_name
   AZURE_SEARCH_KEY=your_search_admin_key
   AZURE_SEARCH_INDEX=your_index_name

   # Storage Account
   AZURE_STORAGE_CONNECTION_STRING=your_storage_connection_string
   AZURE_STORAGE_CONTAINER=your_container_name

   # Cosmos DB
   AZURE_COSMOSDB_ENDPOINT=https://your-cosmosdb.documents.azure.com:443/
   AZURE_COSMOSDB_KEY=your_cosmosdb_key
   AZURE_COSMOSDB_DATABASE=ms-challenge
   ```

2. If using containers, ensure environment variables are properly configured in your container instances:

   - For backend: Set FLASK_APP, FLASK_DEBUG and service connection variables
   - For frontend: Set NEXT_PUBLIC_API_URL pointing to your backend service

3. Make sure your application has appropriate permissions to access these services

4. For local development, you may need to add your IP address to firewall rules for some services

This approach lets you get started quickly while avoiding infrastructure complexity. Once your project evolves, you can consider migrating to infrastructure-as-code using ARM templates like those in this repository.
