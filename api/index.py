from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

import urllib.request
import json
from werkzeug.exceptions import HTTPException

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


@app.errorhandler(Exception)
def handle_error(e):
    if isinstance(e, HTTPException):
        return jsonify({"error": e.description}), e.code
    print(f"Unhandled error: {e}")
    return jsonify({"error": "Internal server error"}), 500


@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def google_auth():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True) or {}
        credential = data.get('credential')
        
        if not credential:
            return jsonify({"error": "Missing Google credential"}), 400
            
        verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
        req = urllib.request.Request(verify_url)
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                return jsonify({"error": "Invalid Google Token"}), 401
            payload = json.loads(response.read().decode('utf-8'))
            
        user_info = {
            "id": payload.get("sub"),
            "googleId": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "picture": payload.get("picture")
        }
        
        token = f"token_{payload.get('sub')}"
        return jsonify({"token": token, "user": user_info}), 200
    except Exception as e:
        print(f"Google Auth Error: {e}")
        return jsonify({"error": "Failed to authenticate with Google"}), 400



@app.route('/api/recommend', methods=['POST'])
def recommend_places():
    try:
        data = request.get_json(silent=True) or {}
        interests = data.get('interests', '')

        if not interests:
            return jsonify({"error": "No interests provided"}), 400

        query_vec = tfidf_vectorizer.transform([interests])
        from sklearn.metrics.pairwise import cosine_similarity
        sims = cosine_similarity(query_vec, tfidf_matrix).flatten()
        top_indices = sims.argsort()[-5:][::-1]

        recommendations = []
        for idx in top_indices:
            if sims[idx] > 0.01:
                row = df_places.iloc[idx]
                recommendations.append({
                    "name": str(row.get('Place Name', 'Unknown')),
                    "rating": float(row.get('Rating', 0)),
                    "description": str(row.get('About Place', ''))[:200] + "...",
                    "best_time": str(row.get('Best Time To Visit', 'N/A'))
                })

        return jsonify({"recommendations": recommendations})
    except Exception as e:
        print(f"recommend error: {e}")
        return jsonify({"error": "Failed to process request"}), 500


@app.route('/api/hotels', methods=['POST'])
def search_hotels():
    try:
        data = request.get_json(silent=True) or {}
        city = data.get('city', '')
        query = data.get('query', '')

        df_hotels = pd.read_csv(os.path.join(base_dir, 'models', 'hotels_db.csv'))

        if city:
            results = df_hotels[df_hotels['city'].str.contains(city, case=False, na=False)]
        else:
            results = df_hotels

        if query:
            results = results[
                results['property_name'].str.contains(query, case=False, na=False) |
                results['hotel_description'].str.contains(query, case=False, na=False)
            ]

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
        print(f"hotels error: {e}")
        return jsonify({"error": "Failed to process request"}), 500


@app.route('/api/estimate-fare', methods=['POST'])
def estimate_fare():
    try:
        data = request.get_json(silent=True) or {}
        distance_km = float(data.get('distance_km', 0))

        if distance_km <= 0:
            return jsonify({"error": "Invalid distance"}), 400

        X_pred = pd.DataFrame({'distance_km': [distance_km]})
        estimated_fare_usd = fare_estimator.predict(X_pred)[0]
        estimated_fare_inr = estimated_fare_usd * 83

        return jsonify({
            "estimated_fare": round(estimated_fare_inr, 2),
            "currency": "INR",
            "distance": distance_km
        })
    except Exception as e:
        print(f"fare error: {e}")
        return jsonify({"error": "Failed to process request"}), 500


@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Sight-Sound-Walk AI API",
        "version": "1.0.0",
        "endpoints": [
            "/api/recommend",
            "/api/hotels",
            "/api/estimate-fare",
            "/health"
        ]
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
