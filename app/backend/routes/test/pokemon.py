import logging
import random
import requests
from flask import jsonify
from .. import pokemon_bp

logger = logging.getLogger(__name__)

@pokemon_bp.route('/random', methods=['GET'])
def random_pokemon():
    logger.info("Handling GET request for /api/pokemon/random endpoint")
    try:
        # First generation Pokemon IDs range from 1-151
        pokemon_id = random.randint(1, 151)
        
        # Fetch data from PokeAPI
        response = requests.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}")
        response.raise_for_status()  # Raise exception for HTTP errors
        
        pokemon_data = response.json()
        
        # Extract only basic information
        basic_info = {
            "id": pokemon_data["id"],
            "name": pokemon_data["name"],
            "height": pokemon_data["height"],
            "weight": pokemon_data["weight"],
            "types": [t["type"]["name"] for t in pokemon_data["types"]],
            "sprite": pokemon_data["sprites"]["front_default"],
            "generation": "first"
        }
        
        return jsonify(basic_info)
    
    except requests.RequestException as e:
        logger.error(f"Error fetching Pokemon data: {e}")
        return jsonify({"error": "Failed to fetch Pokemon data"}), 503
    except Exception as e:
        logger.error(f"Unexpected error in random_pokemon: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
