from flask import Blueprint, request, jsonify
import json
import os
import requests
from . import text_analysis_bp

from dotenv import load_dotenv

from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import (
    TextAnalyticsClient,
    ExtractKeyPhrasesAction,
    AnalyzeSentimentAction,
    AbstractiveSummaryAction,
    ExtractiveSummaryAction,
)

# Load environment variables
load_dotenv()

# Ruta POST para recibir JSON y procesar audio
@text_analysis_bp.route('', methods=['POST'])
def process_audio():
    try:
        # Obtener el JSON de la solicitud
        data = request.get_json()

        # Extraer la URL del audio del JSON
        audio_url = data.get('audio_url')
        if not audio_url:
            return jsonify({"error": "No se proporcionó una URL de audio"}), 400

        # Llamar a la función para transcribir y analizar el audio
        return text_analysis(audio_url)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def transcribe_audio(speech_endpoint, speech_subscription_key, speech_region, audio_url, locale="en-US", max_speakers=2, profanity_filter="Masked"):
    """
    Transcribe un archivo de audio usando Azure Speech to Text API.
    """
    # Endpoint armado dinámicamente
    endpoint = f"{speech_endpoint}/speechtotext/transcriptions:transcribe?api-version=2024-11-15"

    # Definición de la transcripción
    definition = {
        "locales": [locale],
        "diarization": {
            "maxSpeakers": max_speakers,
            "enabled": True
        },
        "profanityFilterMode": profanity_filter
    }

    # Descargar el archivo de audio desde la URL
    response = requests.get(audio_url)
    if response.status_code != 200:
        raise Exception(f"Error al descargar el archivo de audio: {response.status_code}")

    audio_file_content = response.content

    # Realizar la transcripción (simulando que se sube el archivo a Azure)
    # Nota: Si no se utiliza un archivo local, es necesario adaptar la API para aceptar el contenido de audio en bruto
    headers = {
        "Ocp-Apim-Subscription-Key": speech_subscription_key
    }

    files = {
        "audio": ("audio.wav", audio_file_content, "audio/wav")
    }

    data = {
        "definition": json.dumps(definition)
    }

    response = requests.post(endpoint, headers=headers, files=files, data=data)
    if response.status_code != 200:
        raise Exception(f"Error en la solicitud de transcripción: {response.status_code} - {response.text}")

    result = response.json()

    # Procesar la respuesta y retornar la transcripción
    simple_transcript = [{"text": phrase["text"]} for phrase in result.get("combinedPhrases", [])]
    return simple_transcript

def analyze_text(language_endpoint, language_key, json_data):
    """
    Analiza el texto de la transcripción usando Azure Text Analytics API.
    """
    # Crear cliente de Text Analytics
    text_analytics_client = TextAnalyticsClient(
        endpoint=language_endpoint,
        credential=AzureKeyCredential(language_key)
    )

    combined_text = " ".join([entry["text"] for entry in json_data])
    documents = [combined_text]

    poller = text_analytics_client.begin_analyze_actions(
        documents,
        display_name="Analysis of Transcript",
        actions=[
            ExtractKeyPhrasesAction(),
            AnalyzeSentimentAction(),
            ExtractiveSummaryAction(max_sentence_count=5),
            AbstractiveSummaryAction()
        ]
    )

    document_results = poller.result()
    analysis_results = {}

    for doc, action_results in zip(documents, document_results):
        key_phrases = []
        sentiment = {}
        extractive_summary = []
        abstractive_summary = []

        for result in action_results:
            if result.is_error:
                continue

            if result.kind == "KeyPhraseExtraction":
                key_phrases = result.key_phrases[:10]
            
            elif result.kind == "SentimentAnalysis":
                sentiment = {
                    "sentiment": result.sentiment,
                    "confidence_scores": {
                        "positive": result.confidence_scores.positive,
                        "negative": result.confidence_scores.negative,
                        "neutral": result.confidence_scores.neutral
                    }
                }
            
            elif result.kind == "ExtractiveSummarization":
                for sentence in result.sentences:
                    sentiment_response = text_analytics_client.analyze_sentiment([sentence.text])[0]
                    extractive_summary.append({
                        "text": sentence.text,
                        "sentiment": sentiment_response.sentiment,
                        "confidence_scores": {
                            "positive": sentiment_response.confidence_scores.positive,
                            "neutral": sentiment_response.confidence_scores.neutral,
                            "negative": sentiment_response.confidence_scores.negative
                        }
                    })

            elif result.kind == "AbstractiveSummarization":
                for summary in result.summaries:
                    abstractive_summary.append(summary.text)

        analysis_results = {
            "key_phrases": key_phrases,
            "sentiment": sentiment,
            "extractive_summary": extractive_summary,
            "abstractive_summary": abstractive_summary
        }

    return analysis_results


def format_analysis_results(analysis_results):
    # Aseguramos que ⁠ analysis_results ⁠ sea un diccionario
    if not isinstance(analysis_results, dict):
        print("? Error: Los resultados del analisis no estan en el formato esperado.")
        return None
    
    formatted_results = {
        "aiSuggestions": {
            "recommendedTopics": analysis_results.get("key_phrases", []),
            "sentimentAnalysis": {
                "negative": [],
                "positive": [],
            },
            "summary": " ".join(analysis_results.get("abstractive_summary", []))
        }
    }

    # Agrupar las frases de los resumenes extractivos por tipo de sentimiento
    
    for sentence in analysis_results.get("extractive_summary", []):
        sentiment = sentence.get("sentiment", "")
        text = sentence.get("text", "")

        if sentiment == "negative":
            formatted_results["aiSuggestions"]["sentimentAnalysis"]["negative"].append(text)
        elif sentiment == "positive":
            formatted_results["aiSuggestions"]["sentimentAnalysis"]["positive"].append(text)

    return formatted_results


def text_analysis(audio_url):
    # Get environment variables
    speech_key = os.getenv('AZURE_AI_KEY')
    speech_endpoint = os.getenv('AZURE_SPEECH_ENDPOINT')
    speech_region = speech_endpoint.replace('https://', '').split('.')[0]
    language_endpoint = os.getenv('AZURE_LANGUAGE_ENDPOINT')
    language_key = os.getenv('AZURE_AI_KEY')
    locale = os.getenv('LOCALE', 'en-US')
    
    # Llamar a la función para transcribir el audio desde la URL proporcionada
    audio_transcription = transcribe_audio(
        speech_endpoint=speech_endpoint,
        speech_subscription_key=speech_key,
        speech_region=speech_region,
        audio_url=audio_url,
        locale=locale
    )
    # Llamar a la función para analizar el texto de la transcripción
    analysis_results = analyze_text(
        language_endpoint=language_endpoint,
        language_key=language_key,
        json_data=audio_transcription
    )
    
    result = format_analysis_results(analysis_results)
    
    return jsonify({"message": "Análisis completado exitosamente", "analysis_results": result}), 200

if __name__ == "__main__":
    text_analysis("")