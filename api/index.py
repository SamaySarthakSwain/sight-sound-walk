from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))

# Load Models
try:
    tfidf_vectorizer = joblib.load(os.path.join(base_dir, 'models', 'tfidf_vectorizer.pkl'))
    tfidf_matrix = joblib.load(os.path.join(base_dir, 'models', 'tfidf_matrix.pkl'))
    df_places = pd.read_csv(os.path.join(base_dir, 'models', 'places_db.csv'))
    fare_estimator = joblib.load(os.path.join(base_dir, 'models', 'fare_estimator.pkl'))
    from sklearn.metrics.pairwise import cosine_similarity
except Exception as e:
    print("Warning: Models not found.", e)

@app.route('/api/recommend', methods=['POST'])
def recommend_places():
    data = request.json
    interests = data.get('interests', '')
    
    if not interests:
        return jsonify({"error": "No interests provided"}), 400
        
    try:
        # Transform query
        query_vec = tfidf_vectorizer.transform([interests])
        
        # Calculate similarities
        from sklearn.metrics.pairwise import cosine_similarity
        sims = cosine_similarity(query_vec, tfidf_matrix).flatten()
        
        # Get top 5
        top_indices = sims.argsort()[-5:][::-1]
        
        recommendations = []
        for idx in top_indices:
            if sims[idx] > 0.01: # Small threshold
                row = df_places.iloc[idx]
                recommendations.append({
                    "name": str(row.get('Place Name', 'Unknown')),
                    "rating": float(row.get('Rating', 0)),
                    "description": str(row.get('About Place', ''))[:200] + "...",
                    "best_time": str(row.get('Best Time To Visit', 'N/A'))
                })
                
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/hotels', methods=['POST'])
def search_hotels():
    data = request.json
    city = data.get('city', '')
    query = data.get('query', '')
    
    try:
        df_hotels = pd.read_csv(os.path.join(base_dir, 'models', 'hotels_db.csv'))
        
        # Filter by city if provided
        if city:
            results = df_hotels[df_hotels['city'].str.contains(city, case=False, na=False)]
        else:
            results = df_hotels
            
        # Search by query in description or name
        if query:
            results = results[
                results['property_name'].str.contains(query, case=False, na=False) |
                results['hotel_description'].str.contains(query, case=False, na=False)
            ]
            
        # Top 10
        hotels = []
        for _, row in results.head(10).iterrows():
            hotels.append({
                "name": str(row['property_name']),
                "city": str(row['city']),
                "description": str(row['hotel_description'])[:200] + "...",
                "amenities": str(row['hotel_facilities'])
            })
            
        return jsonify({"hotels": hotels})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/estimate-fare', methods=['POST'])
def estimate_fare():
    data = request.json
    distance_km = float(data.get('distance_km', 0))
    
    if distance_km <= 0:
        return jsonify({"error": "Invalid distance"}), 400
        
    try:
        # The model was trained on distance_km only in the latest script
        X_pred = pd.DataFrame({'distance_km': [distance_km]})
        estimated_fare_usd = fare_estimator.predict(X_pred)[0]
        
        # Uber dataset is in USD, convert to INR (approx 83)
        estimated_fare_inr = estimated_fare_usd * 83
        
        return jsonify({
            "estimated_fare": round(estimated_fare_inr, 2),
            "currency": "INR",
            "distance": distance_km
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
