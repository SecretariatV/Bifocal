import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib
import os

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

# Load and process the training data
data = pd.read_csv('/Users/vanishaswabhanam/Downloads/processed_dataset.csv')

# Define message categories and their characteristics
FRIENDLY_PATTERNS = [
    'movie night', 'lunch', 'checking in', 'hope', 'sending love', 'let me know',
    'want to talk', 'doing okay', '💛', 'gentle', 'talk', 'chat'
]

CONCERNING_PATTERNS = {
    'Gaslighting': [
        'imagining things', 'overreacting', 'too sensitive', 'making things up',
        'always make me', 'your fault', 'being dramatic'
    ],
    'Coercive Control': [
        'should listen', 'have to', 'must', 'need to', 'make you', 'your own good',
        'know what\'s best', 'can\'t handle', 'lucky I even'
    ],
    'Stalking': [
        'been outside', 'watching you', 'following', 'saw you at', 'noticed you',
        'been around', 'where are you', 'who were you with'
    ],
    'Verbal Threats': [
        'regret', 'threat', 'warning', 'careful', 'sorry if', 'what happens',
        'no one else', 'won\'t believe'
    ]
}

EMOTIONAL_STATES = {
    'Neutral': ['checking in', 'movie night', 'lunch', 'chat', 'talk'],
    'Concerned': ['hope you\'re okay', 'worried', 'care about'],
    'Anxious': ['should', 'have to', 'need to', 'careful'],
    'Fearful': ['threat', 'warning', 'regret', 'scared'],
    'Manipulated': ['your fault', 'making me', 'because of you'],
    'Distressed': ['always', 'never', 'every time', 'everyone']
}

def extract_features(text):
    text = text.lower()
    features = []
    
    # Check for friendly patterns
    friendly_score = sum(1 for pattern in FRIENDLY_PATTERNS if pattern in text)
    features.append(friendly_score)
    
    # Check for concerning patterns
    for category, patterns in CONCERNING_PATTERNS.items():
        category_score = sum(1 for pattern in patterns if pattern in text)
        features.append(category_score)
    
    # Check emotional indicators
    for emotion, patterns in EMOTIONAL_STATES.items():
        emotion_score = sum(1 for pattern in patterns if pattern in text)
        features.append(emotion_score)
    
    return features

# Add feature columns to the dataset
feature_names = ['friendly_score']
feature_names.extend(CONCERNING_PATTERNS.keys())
feature_names.extend(EMOTIONAL_STATES.keys())

# Calculate severity score based on message content
def calculate_severity(text):
    text = text.lower()
    severity = 1  # Default low severity
    
    # High severity indicators
    high_severity = ['threat', 'regret', 'warning', 'never', 'always', 'must', 'have to']
    # Medium severity indicators
    medium_severity = ['should', 'need to', 'careful', 'watching', 'following']
    # Low severity indicators
    low_severity = ['hope', 'chat', 'talk', 'checking in', 'movie', 'lunch']
    
    if any(indicator in text for indicator in high_severity):
        severity = 5
    elif any(indicator in text for indicator in medium_severity):
        severity = 3
    elif any(indicator in text for indicator in low_severity):
        severity = 1
    
    return severity

# Prepare features and targets
X = data['narrative_entry']
y_columns = ['incident_type', 'user_emotional_state', 'severity_score', 'potential_crime']

# Create and train the pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 3),
        stop_words='english'
    )),
    ('classifier', MultiOutputClassifier(
        RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            class_weight='balanced'
        )
    ))
])

# Initialize and fit label encoders
label_encoders = {}
y_encoded = np.zeros((len(data), len(y_columns)))

for i, column in enumerate(y_columns):
    if column != 'severity_score':
        le = LabelEncoder()
        y_encoded[:, i] = le.fit_transform(data[column])
        label_encoders[column] = le
    else:
        y_encoded[:, i] = data[column]

# Train the model
pipeline.fit(X, y_encoded)

# Save the model and components
joblib.dump(pipeline, 'model/behavior_classifier.joblib')
joblib.dump(label_encoders, 'model/label_encoders.joblib')

print("Model and components exported successfully to 'model' directory") 