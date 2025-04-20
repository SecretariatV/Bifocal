import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import warnings
warnings.filterwarnings('ignore')

# Load the original messages
messages_df = pd.read_csv('text_messages_to_v.csv')

# Load the trained model and label encoders
pipeline = joblib.load('model/behavior_classifier.joblib')
label_encoders = joblib.load('model/label_encoders.joblib')

def calculate_severity(text):
    text = text.lower()
    severity = 1  # Default low severity
    
    # High severity indicators
    high_severity = ['threat', 'regret', 'warning', 'never', 'always', 'must', 'have to']
    # Medium severity indicators
    medium_severity = ['should', 'need to', 'careful', 'watching', 'following']
    # Low severity indicators
    low_severity = ['hope', 'chat', 'talk', 'checking in', 'movie', 'lunch']
    
    # Calculate severity based on indicators present
    if any(indicator in text for indicator in high_severity):
        severity = 5
    elif any(indicator in text for indicator in medium_severity):
        severity = 3
    elif any(indicator in text for indicator in low_severity):
        severity = 1
        
    return severity

def determine_emotional_state(text, incident_type):
    text = text.lower()
    
    # Emotional state patterns
    patterns = {
        'Neutral': ['checking in', 'movie night', 'lunch', 'chat', 'talk'],
        'Concerned': ['hope you\'re okay', 'worried', 'care about'],
        'Anxious': ['should', 'have to', 'need to', 'careful'],
        'Fearful': ['threat', 'warning', 'regret', 'scared'],
        'Manipulated': ['your fault', 'making me', 'because of you'],
        'Distressed': ['always', 'never', 'every time', 'everyone']
    }
    
    # Count matches for each emotional state
    matches = {state: sum(1 for pattern in patterns[state] if pattern in text)
              for state in patterns}
    
    # Default to Neutral for friendly messages
    if incident_type == 'Friendly':
        return 'Neutral'
    
    # Return the emotional state with the most matches
    return max(matches.items(), key=lambda x: x[1])[0] if any(matches.values()) else 'Neutral'

def classify_message(text):
    # Friendly patterns
    friendly_patterns = ['movie night', 'lunch', 'checking in', 'hope', 'sending love', 
                        'let me know', 'want to talk', 'doing okay', '💛', 'gentle']
    
    # Concerning patterns
    concerning_patterns = {
        'Gaslighting': ['imagining things', 'overreacting', 'making me', 'your fault'],
        'Coercive Control': ['should listen', 'have to', 'lucky I even', 'know what\'s best'],
        'Stalking': ['been outside', 'saw you at', 'noticed you', 'watching'],
        'Verbal Threats': ['regret', 'threat', 'warning', 'no one else']
    }
    
    text = text.lower()
    
    # Check for friendly messages first
    if any(pattern in text for pattern in friendly_patterns):
        return 'Friendly'
    
    # Check for concerning patterns
    matches = {category: sum(1 for pattern in patterns if pattern in text)
              for category, patterns in concerning_patterns.items()}
    
    if any(matches.values()):
        return max(matches.items(), key=lambda x: x[1])[0]
    
    return 'Neutral'

def process_messages(df):
    # Process each message
    results = []
    for _, row in enumerate(df.iterrows()):
        text = row[1]['narrative_entry']
        
        # Classify message type
        incident_type = classify_message(text)
        
        # Set values based on classification
        if incident_type == 'Friendly' or incident_type == 'Neutral':
            severity = 1
            emotional_state = 'Neutral'
            confidence = 90.0 if incident_type == 'Friendly' else 85.0
        else:
            # Calculate custom severity
            severity = calculate_severity(text)
            # Determine emotional state
            emotional_state = determine_emotional_state(text, incident_type)
            # Set confidence based on severity and pattern matches
            confidence = 75.0 + (severity * 5)
        
        results.append({
            'time_stamp': row[1]['time_stamp'],
            'user_name': row[1]['user_name'],
            'narrative_entry': text,
            'incident_type': incident_type,
            'user_emotional_state': emotional_state,
            'severity_score': severity,
            'potential_crime': 'Y' if severity >= 4 else 'N',
            'confidence_score': round(confidence, 2),
            'formatted_timestamp': pd.to_datetime(row[1]['time_stamp']).strftime('%b %d, %I:%M %p')
        })
    
    return pd.DataFrame(results)

# Process the messages
enriched_df = process_messages(messages_df)

# Save the enriched dataset
enriched_df.to_csv('processed_messages_with_analysis.csv', index=False)

print("Messages processed and saved to processed_messages_with_analysis.csv")

# Print some statistics
print("\nAnalysis Summary:")
print("-----------------")
print(f"Total messages processed: {len(enriched_df)}")
print("\nIncident Type Distribution:")
print(enriched_df['incident_type'].value_counts())
print("\nEmotional State Distribution:")
print(enriched_df['user_emotional_state'].value_counts())
print("\nSeverity Score Distribution:")
print(enriched_df['severity_score'].value_counts().sort_index())
print("\nPotential Crime Indicators:")
print(enriched_df['potential_crime'].value_counts()) 