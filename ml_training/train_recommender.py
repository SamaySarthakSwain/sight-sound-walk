import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

# Example paths - these would be the actual paths downloaded by kagglehub
# We will use dummy data generation for the structure if files aren't found yet
# just so the script can run and save a model.

def train_tourism_recommender(data_path=None):
    print("Training Tourism & Hotel Recommendation System...")
    # In a real scenario, we load from kagglehub paths
    # df_places = pd.read_csv("path_to_places.csv")
    
    # Using dummy dataset for structure
    places_data = {
        'id': [1, 2, 3, 4],
        'name': ['Taj Mahal', 'Gateway of India', 'Hawa Mahal', 'Goa Beaches'],
        'city': ['Agra', 'Mumbai', 'Jaipur', 'Goa'],
        'description': ['Historical monument architectural wonder mausoleum',
                       'Historical monument sea view architecture',
                       'Palace architecture historical pink city',
                       'Beach relaxing sea view party sand']
    }
    df_places = pd.DataFrame(places_data)
    
    # Train TF-IDF on descriptions
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df_places['description'])
    
    # Save the model and data
    os.makedirs('models', exist_ok=True)
    joblib.dump(tfidf, 'models/tfidf_vectorizer.pkl')
    joblib.dump(tfidf_matrix, 'models/tfidf_matrix.pkl')
    df_places.to_csv('models/places_db.csv', index=False)
    print("Tourism Recommender Model Saved.")

def train_fare_estimator(data_path=None):
    print("Training Ride Fare Estimator (Ola/Uber/Rapido)...")
    # In a real scenario, we load from kagglehub paths and merge
    # df_ola = pd.read_csv("ola.csv")
    
    # Dummy data
    np.random.seed(42)
    distances = np.random.uniform(1, 50, 1000)
    durations = distances * np.random.uniform(2, 4, 1000)
    # Fare depends on distance, duration + some noise
    fares = (distances * 15) + (durations * 2) + np.random.normal(0, 20, 1000)
    
    X = pd.DataFrame({'distance_km': distances, 'duration_min': durations})
    y = fares
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    print(f"Fare Estimator R^2 Score: {score:.2f}")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/fare_estimator.pkl')
    print("Fare Estimator Model Saved.")

if __name__ == "__main__":
    train_tourism_recommender()
    train_fare_estimator()
    print("All AI Models Trained and Saved Successfully! Ready to be integrated into Sight-Sound-Walk.")
