import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Data paths
DATA_PATH = os.getenv('DATA_PATH')

# Preprocessing parameters
MIN_DF = 5  # Minimum document frequency for TF-IDF
MAX_DF = 0.95  # Maximum document frequency for TF-IDF
NGRAM_RANGE = (1, 2)  # Use unigrams and bigrams

# Model parameters
TEST_SIZE = 0.2
RANDOM_STATE = 42

# Ensure required environment variables are set
if not DATA_PATH:
    raise ValueError("DATA_PATH environment variable is not set")

# API Keys
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Model parameters
MODEL_PARAMS = {
    'random_forest': {
        'n_estimators': 100,
        'max_depth': None,
        'min_samples_split': 2,
        'min_samples_leaf': 1
    }
}

# Text processing settings
TEXT_PROCESSING = {
    'min_df': MIN_DF,
    'max_df': MAX_DF,
    'ngram_range': NGRAM_RANGE
}

# Classification settings
CLASSIFICATION = {
    'test_size': TEST_SIZE,
    'random_state': RANDOM_STATE
} 