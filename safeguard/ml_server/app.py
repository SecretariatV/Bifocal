from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from transformers import pipeline
import torch

app = Flask(__name__)
CORS(app)

# Load your trained model here
# model = joblib.load('your_model.pkl')

# Initialize the sentiment analysis pipeline
sentiment_analyzer = pipeline('sentiment-analysis')

def analyze_text(text):
    # This is where you'll integrate your actual ML model
    # For now, using a simple rule-based system combined with sentiment analysis
    
    # Analyze sentiment
    sentiment = sentiment_analyzer(text)[0]
    sentiment_score = sentiment['score']
    
    # Define keywords for different behaviors
    threatening_words = ['kill', 'hurt', 'harm', 'die', 'death']
    stalking_words = ['following', 'watching', 'where are you', 'saw you', 'found you']
    obsessive_words = ['always', 'never', 'every time', 'constantly', 'forever']
    
    # Check for presence of concerning behaviors
    has_threats = any(word in text.lower() for word in threatening_words)
    has_stalking = any(word in text.lower() for word in stalking_words)
    has_obsession = any(word in text.lower() for word in obsessive_words)
    
    # Calculate severity score (1-5)
    severity = 1
    if has_threats:
        severity += 2
    if has_stalking:
        severity += 1
    if has_obsession:
        severity += 1
    if sentiment['label'] == 'NEGATIVE' and sentiment_score > 0.8:
        severity += 1
    
    # Determine receiver emotion
    if has_threats:
        emotion = 'Fear'
    elif has_stalking:
        emotion = 'Anxiety'
    elif has_obsession:
        emotion = 'Discomfort'
    elif sentiment['label'] == 'NEGATIVE':
        emotion = 'Distress'
    else:
        emotion = 'Neutral'
    
    # Determine perpetrator behavior
    if has_threats:
        behavior = 'Threatening'
    elif has_stalking:
        behavior = 'Stalking'
    elif has_obsession:
        behavior = 'Obsessive'
    elif sentiment['label'] == 'NEGATIVE':
        behavior = 'Hostile'
    else:
        behavior = 'Normal'
    
    return {
        'isCrime': has_threats or (has_stalking and severity >= 3),
        'severityScore': min(severity, 5),
        'receiverEmotion': emotion,
        'perpetratorBehavior': behavior
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400
    
    text = data['message']
    result = analyze_text(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True) 