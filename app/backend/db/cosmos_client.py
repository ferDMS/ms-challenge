import os
from azure.cosmos import CosmosClient, PartitionKey

# Load environment variables from .env file

def get_cosmos_client():
    """
    Initialize and return an Azure Cosmos DB client
    """
    # os.environ will now include values from .env file
    cosmos_endpoint = os.environ.get("COSMOS_ENDPOINT")
    cosmos_key = os.environ.get("COSMOS_KEY")
    
    if not cosmos_endpoint or not cosmos_key:
        raise ValueError("Azure Cosmos DB connection details not found in environment variables")
    
    return CosmosClient(url=cosmos_endpoint, credential=cosmos_key)

def get_database(client, database_name="ms-challenge"):
    """
    Get or create a database
    """
    return client.create_database_if_not_exists(id=database_name)

def get_container(database, container_name, partition_key_path):
    """
    Get or create a container in the database
    """
    return database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path=partition_key_path),
        offer_throughput=400
    )