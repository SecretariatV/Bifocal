import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from config import (
    DATA_PATH, 
    MIN_DF, 
    MAX_DF, 
    NGRAM_RANGE,
    TEST_SIZE,
    RANDOM_STATE
)

def load_data():
    """
    Load the dataset from the specified path.
    
    Returns:
        pd.DataFrame: The loaded dataset
    """
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Successfully loaded {len(df)} records from {DATA_PATH}")
        return df
    except Exception as e:
        raise Exception(f"Error loading data: {str(e)}")

def preprocess_text(df, text_column='message'):
    """
    Preprocess text data using TF-IDF vectorization.
    
    Args:
        df (pd.DataFrame): Input dataframe
        text_column (str): Name of the column containing text data
        
    Returns:
        tuple: (X_vectorized, vectorizer)
    """
    vectorizer = TfidfVectorizer(
        min_df=MIN_DF,
        max_df=MAX_DF,
        ngram_range=NGRAM_RANGE,
        strip_accents='unicode',
        lowercase=True
    )
    
    X = vectorizer.fit_transform(df[text_column])
    print(f"Vectorized {X.shape[0]} messages with {X.shape[1]} features")
    return X, vectorizer

def split_dataset(X, y):
    """
    Split dataset into training and testing sets.
    
    Args:
        X: Feature matrix
        y: Target vector
        
    Returns:
        tuple: (X_train, X_test, y_train, y_test)
    """
    return train_test_split(
        X, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )

def main():
    """
    Main preprocessing pipeline.
    
    Returns:
        tuple: (X_train, X_test, y_train, y_test, vectorizer)
    """
    # Load data
    df = load_data()
    
    # Preprocess text
    X, vectorizer = preprocess_text(df)
    y = df['label'].values
    
    # Split dataset
    X_train, X_test, y_train, y_test = split_dataset(X, y)
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Testing set size: {X_test.shape[0]}")
    
    return X_train, X_test, y_train, y_test, vectorizer

if __name__ == '__main__':
    main() 