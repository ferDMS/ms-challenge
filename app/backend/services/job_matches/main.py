import json
import os
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient

# Cargar variables de entorno desde .env
load_dotenv("config.env")

# ----------------------------
# 1. Función para procesar el perfil de usuario
# ----------------------------
def process_user_profile(profile_json):
    """
    Procesa un perfil de usuario completo y extrae los campos relevantes para la búsqueda de empleo.
    
    Args:
        profile_json (dict): Perfil de usuario completo en formato JSON
        
    Returns:
        tuple: (perfil_procesado, consulta_construida)
    """
    # Extraer campos relevantes con valores predeterminados si no existen
    processed_profile = {
        "primaryLanguage": profile_json.get("primaryLanguage", ""),
        "disabilityType": profile_json.get("disabilityType", ""),
        "accommodationsNeeded": profile_json.get("accommodationsNeeded", []),
        "transportationStatus": profile_json.get("transportationStatus", ""),
        "employmentGoal": profile_json.get("employmentGoal", ""),
        "skills": profile_json.get("skills", {
            "technical": [],
            "soft": []
        }),
        "workHistory": profile_json.get("workHistory", []),
        "preferredLocations": profile_json.get("preferredLocations", []),
        "preferredIndustries": profile_json.get("preferredIndustries", [])
    }
    
    # Construir la consulta siguiendo la misma lógica del código original
    consulta = " ".join([
        processed_profile.get("employmentGoal", ""),
        processed_profile.get("primaryLanguage", ""),
        processed_profile.get("transportationStatus", ""),
        " ".join(processed_profile.get("preferredIndustries", [])),
        " ".join(processed_profile.get("preferredLocations", [])),
        " ".join(processed_profile.get("skills", {}).get("soft", [])),
        " ".join(processed_profile.get("skills", {}).get("technical", [])),
        " ".join(processed_profile.get("accommodationsNeeded", []))
    ])
    
    return processed_profile, consulta

# Azure Search client initialization (done once outside the function)
admin_key = os.environ.get("AZURE_SEARCH_API_KEY")
index_name = os.environ.get("AZURE_SEARCH_INDEX")
endpoint = os.environ.get("AZURE_SEARCH_ENDPOINT")

search_client = SearchClient(
    endpoint=endpoint, 
    index_name=index_name, 
    credential=AzureKeyCredential(admin_key)
)

def run(user_profile, save_to_file=False, output_filename="job_matches.json"):
    """
    Procesa un perfil de usuario y encuentra trabajos coincidentes.
    
    Args:
        user_profile (dict): Perfil de usuario completo en formato JSON
        save_to_file (bool): Si es True, guarda los resultados en un archivo
        output_filename (str): Nombre del archivo de salida si save_to_file es True
        
    Returns:
        dict: Resultados de los trabajos coincidentes
    """
    # Procesar el perfil usando la función existente
    perfil_usuario, consulta = process_user_profile(user_profile)
    
    # Ejecutar la búsqueda semántica en Azure
    resultados = search_client.search(
        search_text=consulta,
        top=3,
        query_type="semantic",
        semantic_configuration_name="semantic-config"
    )
    
    # Crear una lista para almacenar los resultados
    resultados_lista = []
    for resultado in resultados:
        resultados_lista.append({
            "id": resultado.get("id", "N/A"),
            "title": resultado.get("title", "N/A"),
            "employer": resultado.get("employer", "N/A"),
            "description": resultado.get("description", "N/A"),
            "employmentType": resultado.get("employmentType", "N/A"),
            "location": resultado.get("location", "N/A"),
            "azure_score": resultado.get("@search.score", 0)
        })
    
    # Ordenar resultados por azure_score de mayor a menor
    resultados_lista = sorted(resultados_lista, key=lambda x: x["azure_score"], reverse=True)
    
    # Crear una lista de trabajos coincidentes detallados
    detailed_matches = []
    for i, job in enumerate(resultados_lista):
        job_match = {
            "job_id": i + 1,
            "match_score": job["azure_score"],
            "job_details": {
                "id": job["id"],
                "title": job["title"],
                "employer": job["employer"],
                "description": job["description"],
                "employmentType": job["employmentType"],
                "location": job["location"]
            }
        }
        detailed_matches.append(job_match)
    
    # Crear estructura JSON final con todos los matches
    final_matches = {
        "total_matches": len(resultados_lista),
        "matches": detailed_matches
    }
    
    # Opcionalmente guardar en archivo
    if save_to_file:
        with open(output_filename, "w") as f:
            json.dump(final_matches, f, indent=2)
        print(f"\nCreated comprehensive job matches file: {output_filename}")
    
    return final_matches

# Ejemplo de cómo se llamaría desde una API
if __name__ == "__main__":
    # Ejemplo de perfil de usuario
    perfil_usuario_ejemplo = {
        "employmentGoal": "Customer service position in retail",
        "preferredIndustries": ["Retail", "Customer Service"],
        "preferredLocations": ["Downtown Commercial District"],
        "skills": {
            "soft": ["Friendly customer service", "Following instructions"],
            "technical": ["Basic cash handling", "Inventory arrangement"]
        },
        "accommodationsNeeded": ["Clear written instructions", "Regular breaks"],
        "primaryLanguage": "Spanish",
        "disabilityType": "Learning disability",
        "transportationStatus": "Public transportation",
        "workHistory": []
    }
    
    # Ejecutar el proceso y guardar en archivo (como estaba originalmente)
    results = run(perfil_usuario_ejemplo, save_to_file=True)
    print(f"Found {results['total_matches']} job matches")