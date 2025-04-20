import pandas as pd

def analyze_message(text, sender):
    text = str(text).lower()
    
    # Initialize default values
    incident_type = "Normal Communication"
    emotional_state = "Neutral"
    severity_score = 1
    potential_crime = "N"

    # If the sender is Sanya, treat as friendly unless explicitly threatening
    if sender == "Sanya":
        if any(word in text for word in ["kill", "death", "die", "hurt"]):
            return {
                "incident_type": "Death Threat",
                "user_emotional_state": "Fearful",
                "severity_score": 5,
                "potential_crime": "Y"
            }
        else:
            return {
                "incident_type": "Friendly",
                "user_emotional_state": "Neutral",
                "severity_score": 1,
                "potential_crime": "N"
            }

    # For other senders, analyze for concerning patterns
    # Stalking behavior
    if any(phrase in text for phrase in ["outside your place", "been watching", "following you", "saw you at", "make sure you're okay"]):
        return {
            "incident_type": "Stalking",
            "user_emotional_state": "Fearful",
            "severity_score": 4,
            "potential_crime": "Y"
        }

    # Controlling behavior
    if any(phrase in text for phrase in ["shouldn't", "can't handle", "know what's best", "must", "have to", "walk home alone", "shouldn't walk"]):
        return {
            "incident_type": "Coercive Control",
            "user_emotional_state": "Manipulated",
            "severity_score": 3,
            "potential_crime": "N"
        }

    # Death threats or extreme hostility
    if any(word in text for word in ["kill", "death", "die", "hurt", "regret it", "you'll regret"]):
        return {
            "incident_type": "Death Threat",
            "user_emotional_state": "Fearful",
            "severity_score": 5,
            "potential_crime": "Y"
        }

    # Emotional manipulation
    if any(phrase in text for phrase in [
        "your fault", "making me", "because of you", "no one else will", "no one will",
        "if you just", "wouldn't be having", "imagining things", "make me the bad",
        "always make me", "you always", "you're just", "you never"
    ]):
        return {
            "incident_type": "Emotional Manipulation",
            "user_emotional_state": "Manipulated",
            "severity_score": 3,
            "potential_crime": "N"
        }

    # Location monitoring
    if any(phrase in text for phrase in ["where are you", "why aren't you", "when will you", "why did you"]):
        return {
            "incident_type": "Location Monitoring",
            "user_emotional_state": "Concerned",
            "severity_score": 2,
            "potential_crime": "N"
        }

    return {
        "incident_type": incident_type,
        "user_emotional_state": emotional_state,
        "severity_score": severity_score,
        "potential_crime": potential_crime
    }

# Read the existing CSV file
df = pd.read_csv('text_messages_to_v.csv')

# Process each message and add new columns
for index, row in df.iterrows():
    analysis = analyze_message(row['narrative_entry'], row['user_name'])
    df.at[index, 'incident_type'] = analysis['incident_type']
    df.at[index, 'user_emotional_state'] = analysis['user_emotional_state']
    df.at[index, 'severity_score'] = analysis['severity_score']
    df.at[index, 'potential_crime'] = analysis['potential_crime']

# Save the enriched dataset
df.to_csv('text_messages_to_v_analyzed.csv', index=False)
print("Analysis complete. Results saved to text_messages_to_v_analyzed.csv")
print("\nSummary of analysis:")
print("\nIncident Types:")
print(df['incident_type'].value_counts())
print("\nEmotional States:")
print(df['user_emotional_state'].value_counts())
print("\nSeverity Scores:")
print(df['severity_score'].value_counts().sort_index())
print("\nPotential Crimes:")
print(df['potential_crime'].value_counts()) 