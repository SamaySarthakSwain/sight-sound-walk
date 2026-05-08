import pandas as pd
import numpy as np
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics.pairwise import cosine_similarity

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(os.path.dirname(BASE_DIR), "datasets")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_recommender():
    print("Training Recommender...")
    # Load tourism data
    india_places_path = os.path.join(DATASETS_DIR, "places-to-explore", "india.csv")
    if os.path.exists(india_places_path):
        df_places = pd.read_csv(india_places_path)
    else:
        print("Warning: india.csv not found, using dummy data for recommender.")
        df_places = pd.DataFrame({
            'Place Name': ['Delhi', 'Mumbai', 'Goa', 'Agra'],
            'About Place': ['Capital city', 'Financial hub', 'Beaches', 'Taj Mahal'],
            'Rating': [4.2, 4.2, 4.5, 4.2]
        })

    # Load Goibibo data for extra context if available
    goibibo_path = os.path.join(DATASETS_DIR, "hotels-on-goibibo", "goibibo_com-travel_sample.csv")
    if os.path.exists(goibibo_path):
        try:
            # Fix column names based on actual file headers
            df_hotels = pd.read_csv(goibibo_path, usecols=['property_name', 'city', 'hotel_description', 'hotel_facilities']).head(1000)
            # Add hotels to places as mini-spots
            hotel_data = pd.DataFrame({
                'Place Name': df_hotels['property_name'],
                'About Place': df_hotels['hotel_description'].fillna('') + " " + df_hotels['hotel_facilities'].fillna(''),
                'Rating': 4.0 # Default rating for hotels
            })
            df_places = pd.concat([df_places, hotel_data], ignore_index=True)
            df_hotels.to_csv(os.path.join(MODELS_DIR, 'hotels_db.csv'), index=False)
            print(f"Added {len(hotel_data)} hotels from Goibibo to the recommender database.")
        except Exception as e:
            print("Error loading goibibo data:", e)

    # Process descriptions
    df_places['About Place'] = df_places['About Place'].fillna('')
    
    # Train TF-IDF
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df_places['About Place'])
    
    # Save
    joblib.dump(tfidf, os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl'))
    joblib.dump(tfidf_matrix, os.path.join(MODELS_DIR, 'tfidf_matrix.pkl'))
    df_places.to_csv(os.path.join(MODELS_DIR, 'places_db.csv'), index=False)
    print("Recommender trained successfully.")

def train_fare_estimator():
    print("Training Fare Estimator...")
    uber_path = os.path.join(DATASETS_DIR, "uber-fares-dataset", "uber.csv")
    
    if os.path.exists(uber_path):
        # Load a manageable chunk for speed (e.g., 50k rows)
        df_uber = pd.read_csv(uber_path, nrows=50000)
        
        # Simple distance calculation (Haversine approx)
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371 # Earth radius
            dlat = np.radians(lat2 - lat1)
            dlon = np.radians(lon2 - lon1)
            a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
            c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
            return R * c

        df_uber['distance_km'] = haversine(
            df_uber['pickup_latitude'], df_uber['pickup_longitude'],
            df_uber['dropoff_latitude'], df_uber['dropoff_longitude']
        )
        
        # Filter outliers
        df_uber = df_uber[(df_uber['distance_km'] > 0) & (df_uber['distance_km'] < 100)]
        df_uber = df_uber[(df_uber['fare_amount'] > 2) & (df_uber['fare_amount'] < 500)]
        
        # Train model
        X = df_uber[['distance_km']]
        y = df_uber['fare_amount']
        
        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X, y)
        
        joblib.dump(model, os.path.join(MODELS_DIR, 'fare_estimator.pkl'))
        print("Fare Estimator trained successfully using Uber data.")
    else:
        print("Warning: uber.csv not found, using dummy model.")
        # Dummy model
        X = np.array([[1], [5], [10], [20]])
        y = np.array([50, 150, 250, 450])
        model = RandomForestRegressor(n_estimators=10)
        model.fit(X, y)
        joblib.dump(model, os.path.join(MODELS_DIR, 'fare_estimator.pkl'))

if __name__ == "__main__":
    train_recommender()
    train_fare_estimator()
