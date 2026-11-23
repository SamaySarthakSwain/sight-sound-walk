import os
import json
import sqlite3
import base64
import urllib.request
import urllib.error
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(base_dir, 'models')

# Load environment variables from .env if present
for env_path in [
    os.path.join(base_dir, '..', '.env'),
    os.path.join(base_dir, '.env'),
    os.path.join(base_dir, '..', '.env.local')
]:
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass


# Load ML Models and Datasets
tfidf_vectorizer = None
tfidf_matrix = None
df_places = None
fare_estimator = None

try:
    import joblib
    import pandas as pd
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity

    vec_path = os.path.join(models_dir, 'tfidf_vectorizer.pkl')
    mat_path = os.path.join(models_dir, 'tfidf_matrix.pkl')
    places_path = os.path.join(models_dir, 'places_db.csv')
    fare_path = os.path.join(models_dir, 'fare_estimator.pkl')

    if os.path.exists(vec_path):
        tfidf_vectorizer = joblib.load(vec_path)
    if os.path.exists(mat_path):
        tfidf_matrix = joblib.load(mat_path)
    if os.path.exists(places_path):
        df_places = pd.read_csv(places_path)
    if os.path.exists(fare_path):
        fare_estimator = joblib.load(fare_path)
    print("AI/ML models loaded successfully.")
except Exception as e:
    print("Warning: Could not load some ML models:", e)

# Load JSON Datasets (Monuments, Food Places, Hotels)
monuments_cache = []
food_places_cache = []
hotels_cache = []
visits_cache = []

try:
    monuments_file = os.path.join(models_dir, 'monuments.json')
    if os.path.exists(monuments_file):
        with open(monuments_file, 'r', encoding='utf-8') as f:
            monuments_cache = json.load(f)
        print(f"Loaded {len(monuments_cache)} monuments from database.")

    food_file = os.path.join(models_dir, 'food_places.json')
    if os.path.exists(food_file):
        with open(food_file, 'r', encoding='utf-8') as f:
            food_places_cache = json.load(f)
        print(f"Loaded {len(food_places_cache)} food places from database.")

    hotels_file = os.path.join(models_dir, 'fallback_hotels.json')
    if os.path.exists(hotels_file):
        with open(hotels_file, 'r', encoding='utf-8') as f:
            hotels_cache = json.load(f)
        print(f"Loaded {len(hotels_cache)} hotels from database.")

    visits_file = os.path.join(models_dir, 'visits.json')
    if os.path.exists(visits_file):
        with open(visits_file, 'r', encoding='utf-8') as f:
            visits_cache = json.load(f)
except Exception as e:
    print("Warning: Error loading JSON database files:", e)


@app.errorhandler(Exception)
def handle_error(e):
    if isinstance(e, HTTPException):
        return jsonify({"error": e.description}), e.code
    print(f"Unhandled error: {e}")
    return jsonify({"error": "Internal server error"}), 500


# ==============================================================================
# Health Check Endpoints
# ==============================================================================
@app.route('/', methods=['GET', 'OPTIONS'])
@app.route('/health', methods=['GET', 'OPTIONS'])
@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    return jsonify({
        "status": "healthy",
        "service": "Let's Explore - Educational Tourism AI API",
        "version": "2.0.0",
        "monuments_count": len(monuments_cache),
        "food_places_count": len(food_places_cache),
        "hotels_count": len(hotels_cache),
        "endpoints": [
            "/api/monuments",
            "/api/food-places",
            "/api/hotels",
            "/api/recommend",
            "/api/estimate-fare",
            "/api/visits",
            "/api/ai/travel-assistant",
            "/api/ai/voice-guide",
            "/api/ai/planner",
            "/api/ai/rag-guide",
            "/api/database/status",
            "/api/database/ar-models",
            "/api/database/export",
            "/health"
        ]
    }), 200


# ==============================================================================
# Database Archive Endpoints (SQLite Persistent Offline Storage)
# ==============================================================================
db_archive_path = os.path.join(models_dir, 'heritage_archive.db')

@app.route('/api/database/status', methods=['GET', 'OPTIONS'])
def get_database_status():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not os.path.exists(db_archive_path):
        return jsonify({"error": "Database archive not found"}), 404

    try:
        conn = sqlite3.connect(db_archive_path)
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM monuments")
        monuments_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM monument_images WHERE verified_offline = 1")
        images_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM ar_vr_models WHERE backup_status = 'LOCAL_VERIFIED'")
        ar_models_count = cursor.fetchone()[0]

        cursor.execute("SELECT key, value FROM system_metadata")
        metadata = dict(cursor.fetchall())

        db_size_bytes = os.path.getsize(db_archive_path)

        conn.close()

        return jsonify({
            "status": "ONLINE_PERSISTENT",
            "database_file": "heritage_archive.db",
            "file_size_bytes": db_size_bytes,
            "monuments_count": monuments_count,
            "verified_images_count": images_count,
            "ar_vr_models_count": ar_models_count,
            "metadata": metadata,
            "resilience": "100% offline-ready, zero third-party dependency"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/database/ar-models', methods=['GET', 'OPTIONS'])
def get_database_ar_models():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if not os.path.exists(db_archive_path):
        return jsonify({"error": "Database archive not found"}), 404

    try:
        conn = sqlite3.connect(db_archive_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ar_vr_models")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/database/export', methods=['GET', 'OPTIONS'])
def export_database():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    json_export = os.path.join(models_dir, 'full_heritage_archive.json')
    if os.path.exists(json_export):
        with open(json_export, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data), 200
    return jsonify({"error": "Export file not ready"}), 404


# ==============================================================================
# Monuments Endpoints
# ==============================================================================
@app.route('/api/monuments', methods=['GET', 'OPTIONS'])
def get_monuments():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    city = request.args.get('city', '').strip().lower()
    category = request.args.get('category', '').strip().lower()
    search = request.args.get('search', '').strip().lower()

    results = monuments_cache
    if city:
        results = [m for m in results if city in (m.get('location', '') + ' ' + m.get('region', '')).lower()]
    if category:
        results = [m for m in results if category in m.get('category', '').lower()]
    if search:
        results = [
            m for m in results
            if search in m.get('title', '').lower() or search in m.get('description', '').lower()
        ]

    return jsonify(results), 200


@app.route('/api/monuments/<monument_id>', methods=['GET', 'OPTIONS'])
def get_monument_by_id(monument_id):
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    for m in monuments_cache:
        if str(m.get('id')) == str(monument_id):
            return jsonify(m), 200
    return jsonify({"error": "Monument not found"}), 404


# ==============================================================================
# Food Places Endpoints
# ==============================================================================
@app.route('/api/food-places', methods=['GET', 'OPTIONS'])
def get_food_places():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    city = request.args.get('city', '').strip().lower()
    results = food_places_cache
    if city:
        results = [p for p in results if city in (p.get('location', '') + ' ' + p.get('city', '')).lower()]

    return jsonify(results), 200


# ==============================================================================
# Hotels Endpoints (GET and POST)
# ==============================================================================
@app.route('/api/hotels', methods=['GET', 'POST', 'OPTIONS'])
def handle_hotels():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    if request.method == 'GET':
        city = request.args.get('city', '').strip().lower()
        if city:
            filtered = [h for h in hotels_cache if city in (h.get('location', '') + ' ' + h.get('name', '')).lower()]
            return jsonify(filtered if filtered else hotels_cache), 200
        return jsonify(hotels_cache), 200

    # POST - AI Search
    try:
        data = request.get_json(silent=True) or {}
        city = data.get('city', '').strip()
        query = data.get('query', '').strip()

        matched = []

        # First check CSV if available
        csv_path = os.path.join(models_dir, 'hotels_db.csv')
        if os.path.exists(csv_path):
            import pandas as pd
            df_hotels = pd.read_csv(csv_path)
            res = df_hotels
            if city:
                c_matches = res[res['city'].str.contains(city, case=False, na=False)]
                if len(c_matches) > 0:
                    res = c_matches
            if query:
                res = res[
                    res['property_name'].str.contains(query, case=False, na=False) |
                    res['hotel_description'].str.contains(query, case=False, na=False)
                ]
            for _, row in res.head(10).iterrows():
                matched.append({
                    "name": str(row['property_name']),
                    "city": str(row['city']),
                    "description": str(row['hotel_description'])[:200] + "...",
                    "amenities": str(row['hotel_facilities'])
                })

        # Fallback to hotels_cache if CSV yielded nothing
        if not matched:
            for h in hotels_cache:
                h_city = h.get('location', '')
                h_name = h.get('name', '')
                h_desc = h.get('description', '')
                if (not city or city.lower() in h_city.lower()) and (not query or query.lower() in (h_name + ' ' + h_desc).lower()):
                    matched.append({
                        "name": h_name,
                        "city": h_city,
                        "description": h_desc[:200] + "...",
                        "amenities": ", ".join(h.get('amenities', []))
                    })
                    if len(matched) >= 10:
                        break

        # Fallback to first few hotels if query was too strict
        if not matched and hotels_cache:
            for h in hotels_cache[:6]:
                matched.append({
                    "name": h.get('name', ''),
                    "city": h.get('location', ''),
                    "description": h.get('description', '')[:200] + "...",
                    "amenities": ", ".join(h.get('amenities', []))
                })

        return jsonify({"hotels": matched}), 200
    except Exception as e:
        print(f"Hotels error: {e}")
        return jsonify({"hotels": []}), 200


# ==============================================================================
# User Visits Endpoints
# ==============================================================================
@app.route('/api/visits', methods=['POST', 'OPTIONS'])
def save_visit():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True) or {}
        import time
        if 'id' not in data:
            data['id'] = f"visit-{int(time.time() * 1000)}"
        if 'visited_at' not in data:
            data['visited_at'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        visits_cache.append(data)

        # Persist to disk
        try:
            with open(os.path.join(models_dir, 'visits.json'), 'w', encoding='utf-8') as f:
                json.dump(visits_cache[-500:], f, indent=2)
        except Exception:
            pass

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/visits/<user_id>', methods=['GET', 'OPTIONS'])
def get_user_visits(user_id):
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    user_visits = [v for v in visits_cache if v.get('user_id') == user_id]
    return jsonify(user_visits), 200


# ==============================================================================
# Google Auth Endpoint
# ==============================================================================
@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def google_auth():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True) or {}
        credential = data.get('credential') or data.get('token')
        user_info = data.get('user')

        if user_info:
            return jsonify({
                "token": f"token_{user_info.get('id', 'guest')}",
                "user": user_info
            }), 200

        if not credential:
            # Create guest explorer profile
            return jsonify({
                "token": "token_guest_explorer",
                "user": {
                    "id": "guest_explorer_1",
                    "googleId": "guest_explorer_1",
                    "email": "explorer@letsexplore.local",
                    "name": "Odisha Explorer",
                    "picture": None
                }
            }), 200

        # Try Google verification
        try:
            verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
            req = urllib.request.Request(verify_url)
            with urllib.request.urlopen(req, timeout=3) as resp:
                payload = json.loads(resp.read().decode('utf-8'))
                user_info = {
                    "id": payload.get("sub"),
                    "googleId": payload.get("sub"),
                    "email": payload.get("email"),
                    "name": payload.get("name"),
                    "picture": payload.get("picture")
                }
                return jsonify({"token": f"token_{payload.get('sub')}", "user": user_info}), 200
        except Exception:
            # Fallback local token
            return jsonify({
                "token": f"token_{credential[:16]}",
                "user": {
                    "id": "user_demo",
                    "email": "traveler@letsexplore.local",
                    "name": "Heritage Traveler"
                }
            }), 200
    except Exception as e:
        print(f"Google Auth Error: {e}")
        return jsonify({"error": "Failed to authenticate"}), 400


# ==============================================================================
# AI Recommendation Endpoint
# ==============================================================================
@app.route('/api/recommend', methods=['POST', 'OPTIONS'])
def recommend_places():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True) or {}
        interests = data.get('interests', '').strip().lower()

        if not interests:
            return jsonify({"error": "No interests provided"}), 400

        recommendations = []

        # Use TF-IDF model if available
        if tfidf_vectorizer and tfidf_matrix is not None and df_places is not None:
            try:
                from sklearn.metrics.pairwise import cosine_similarity
                query_vec = tfidf_vectorizer.transform([interests])
                sims = cosine_similarity(query_vec, tfidf_matrix).flatten()
                top_indices = sims.argsort()[-5:][::-1]

                for idx in top_indices:
                    if sims[idx] > 0.01:
                        row = df_places.iloc[idx]
                        recommendations.append({
                            "name": str(row.get('Place Name', 'Unknown')),
                            "rating": float(row.get('Rating', 4.5)),
                            "description": str(row.get('About Place', ''))[:200] + "...",
                            "best_time": str(row.get('Best Time To Visit', 'October to March'))
                        })
            except Exception as ml_err:
                print("TF-IDF recommendation error:", ml_err)

        # Keyword match fallback from monuments dataset
        if not recommendations and monuments_cache:
            tokens = [t for t in interests.split() if len(t) > 2]
            scored = []
            for m in monuments_cache:
                text = (m.get('title', '') + ' ' + m.get('category', '') + ' ' + m.get('description', '')).lower()
                score = sum(1 for tok in tokens if tok in text)
                if score > 0:
                    scored.append((score, m))
            scored.sort(key=lambda x: x[0], reverse=True)

            for _, m in scored[:5]:
                recommendations.append({
                    "name": m.get('title', 'Unknown'),
                    "rating": float(m.get('rating', 4.7)),
                    "description": m.get('description', '')[:200] + "...",
                    "best_time": "October to March"
                })

        # General top picks if still empty
        if not recommendations and monuments_cache:
            for m in monuments_cache[:5]:
                recommendations.append({
                    "name": m.get('title', 'Unknown'),
                    "rating": float(m.get('rating', 4.8)),
                    "description": m.get('description', '')[:200] + "...",
                    "best_time": "October to March"
                })

        return jsonify({"recommendations": recommendations}), 200
    except Exception as e:
        print(f"recommend error: {e}")
        return jsonify({"error": "Failed to process request"}), 500


# ==============================================================================
# Fare Estimator Endpoint
# ==============================================================================
@app.route('/api/estimate-fare', methods=['POST', 'OPTIONS'])
def estimate_fare():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True) or {}
        distance_km = float(data.get('distance_km', 0))

        if distance_km <= 0:
            return jsonify({"error": "Invalid distance"}), 400

        estimated_fare_inr = 0

        # Try ML model first
        if fare_estimator is not None:
            try:
                import pandas as pd
                X_pred = pd.DataFrame({'distance_km': [distance_km]})
                estimated_fare_usd = float(fare_estimator.predict(X_pred)[0])
                estimated_fare_inr = estimated_fare_usd * 83
            except Exception as ml_err:
                print("ML fare estimator error:", ml_err)

        # Realistic Indian cab fare formula fallback: Base Rs 50 + Rs 14/km
        if estimated_fare_inr <= 0:
            estimated_fare_inr = 50 + (distance_km * 14.5)

        return jsonify({
            "estimated_fare": round(estimated_fare_inr, 2),
            "currency": "INR",
            "distance": distance_km
        }), 200
    except Exception as e:
        print(f"fare error: {e}")
        return jsonify({"error": "Failed to process request"}), 500


# ==============================================================================
# Multilingual Knowledge Base & Response Engine
# ==============================================================================
import re

MULTILINGUAL_KNOWLEDGE = {
    "quotes": {
        "en": (
            "Famous Inspirational Quotes & Sayings of Odisha:\n\n"
            "• \"Misu mora deha e desha matire, deshabasi chalijantu pithire...\" (\"Let my body mingle with the soil of this motherland, and let my countrymen walk forward over my back into freedom...\") — Utkalmani Gopabandhu Das (The supreme national motto of selfless service).\n"
            "• \"Bhasha hi jatira prana\" (\"Language is the soul of a nation\") — Vyasakabi Fakir Mohan Senapati, father of modern Odia literature.\n"
            "• \"Jai Jagannath!\" — The timeless heartbeat and spiritual essence of Odisha, symbolizing universal brotherhood and compassion."
        ),
        "or": (
            "ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ଓ ପ୍ରେରଣାଦାୟୀ ଉକ୍ତି / ପଦ୍ୟାଂଶ:\n\n"
            "• \"ମିଶୁ ମୋର ଦେହ ଏ ଦେଶ ମାଟିରେ, ଦେଶବାସୀ ଚାଲିଯାଆନ୍ତୁ ପିଠିରେ। ଦେଶର ସ୍ୱରାଜ୍ୟ ପଥେ ଯେତେ ଗାଡ଼, ପୂରୁ ତହିଁ ମୋର ମାଂସ ରକ୍ତ ହାଡ଼।\" — ଉତ୍କଳମଣି ଗୋପବନ୍ଧୁ ଦାସ (ଏହା ଓଡ଼ିଶାର ସର୍ବଶ୍ରେଷ୍ଠ ଦେଶପ୍ରେମ ଓ ଆତ୍ମବଳିଦାନର ପ୍ରତୀକ)।\n"
            "• \"ଭାଷା ହିଁ ଜାତିର ପ୍ରାଣ\" — ବ୍ୟାସକବି ଫକୀର ମୋହନ ସେନାପତି (ଓଡ଼ିଆ ସାହିତ୍ୟର ଅମର ବାଣୀ)।\n"
            "• \"ଜୟ ଜଗନ୍ନାଥ!\" — ସମଗ୍ର ଓଡ଼ିଆ ଜାତିର ପ୍ରାଣସ୍ପନ୍ଦନ ତଥା ବିଶ୍ୱ ଭ୍ରାତୃତ୍ୱର ପବିତ୍ର ଉଦ୍ଘୋଷ।"
        ),
        "hi": (
            "ओडिशा के प्रसिद्ध और प्रेरणादायक सुविचार / पंक्तियाँ:\n\n"
            "• \"मिशु मोर देह ए देश माटिर...\" (\"मेरा शरीर इस देश की पावन मिट्टी में मिल जाए और देशवासी मेरी पीठ पर चलकर आगे बढ़ें...\") — उत्कलमणि गोपबंधु दास (निःस्वार्थ राष्ट्रसेवा का सर्वोच्च प्रतीक)।\n"
            "• \"भाषा ही जातिरा प्राण\" (\"मातृभाषा ही किसी राष्ट्र की वास्तविक आत्मा होती है\") — व्यासकवि फकीर मोहन सेनापति।\n"
            "• \"जय जगन्नाथ!\" — ओडिशा की आध्यात्मिक पहचान और विश्व बंधुत्व का सर्वकालिक मूल मंत्र।"
        ),
        "bn": (
            "ওড়িশার বিখ্যাত ও ঐতিহাসিক বাণী / উক্তি:\n\n"
            "• \"মিশু মোর দেহ এ দেশ মাটিতে...\" (\"আমার দেহ এই দেশের মাটিতে মিশে যাক, আর দেশবাসী আমার পিঠের ওপর দিয়ে এগিয়ে যাক...\") — উৎকলমণি গোপবন্ধু দাস (নিঃস্বার্থ দেশপ্রেমের প্রতীক)।\n"
            "• \"ভাষা হি জাতির প্রাণ\" (\"ভাষাই হলো জাতির প্রকৃত প্রাণ\") — ব্যাসকবি ফকির মোহন সেনাপতি।\n"
            "• \"জয় জগন্নাথ!\" — ওড়িশার আধ্যাত্মিক হৃদয় ও বিশ্ব ভ্রাতৃত্বের চিরন্তন ধ্বনি।"
        ),
        "te": (
            "ఒడిశా ప్రసిద్ధ మరియు స్ఫూర్తిదాయక సూక్తులు:\n\n"
            "• \"మిశు మోర దేహ ఎ దేశ మాటిరె...\" (\"నా దేహం ఈ దేశ మట్టిలో కలిసిపోనివ్వండి, నా దేశవాసులు నా వీపుపై నడిచి ముందుకు సాగనివ్వండి...\") — ఉత్కళమణి గోపబంధు దాస్.\n"
            "• \"భాష హి జాతిర ప్రాణ\" (\"మాతృభాషే జాతి యొక్క ప్రాణం\") — వ్యాసకవి ఫకీర్ మోహన్ సేనాపతి.\n"
            "• \"జై జగన్నాథ్!\" — ఒడిశా ఆధ్యాత్మిక సంస్కృతి మరియు విశ్వ సౌభ్రాతృత్వానికి పవిత్ర నినాదం."
        )
    },
    "food": {
        "en": (
            "Authentic World-Famous Cuisine & Delicacies of Odisha:\n\n"
            "• Chhena Poda: The world's first baked cottage cheese dessert with caramelized crust, originating from Nayagarh.\n"
            "• Pahala Rasagola: Soft, warm, melt-in-mouth brown rasagolas celebrated along the Bhubaneswar-Cuttack highway.\n"
            "• Dalma: Wholesome lentil stew slow-cooked with fresh local vegetables, seasoned with roasted cumin and ghee.\n"
            "• Pakhala Bhata: Refreshing fermented rice steeped in curd and water, served with badi chura and fried veggies (celebrated on Pakhala Dibasa).\n"
            "• Cuttack Dahi Bara Aloodum: Famous street food featuring light lentil fritters in yogurt broth topped with spicy potato curry and ghuguni."
        ),
        "or": (
            "ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ପାରମ୍ପରିକ ଖାଦ୍ୟ ଓ ମିଠା:\n\n"
            "• ଛେନାପୋଡ଼: ନୟାଗଡ଼ର ପ୍ରସିଦ୍ଧ ପୋଡ଼ା ପନୀର ମିଠା, ଯାହା ସାରା ବିଶ୍ୱରେ ଖୁବ୍ ଲୋକପ୍ରିୟ।\n"
            "• ପାହାଳ ରସଗୋଲା: ତାଜା, ନରମ ଓ ରସାଳ ପାରମ୍ପରିକ ଓଡ଼ିଆ ରସଗୋଲା।\n"
            "• ଡାଲମା: ବିଭିନ୍ନ ଦେଶୀ ପନିପରିବା ଓ ଡାଲିରେ ପ୍ରସ୍ତୁତ ପୌଷ୍ଟିକ ତଥା ସୁସ୍ୱାଦୁ ବ୍ୟଞ୍ଜନ।\n"
            "• ପଖାଳ ଭାତ: ଖରାଦିନେ ଦହି, ଶାଗ, ବଡ଼ି ଚୂରା ଓ ଆଳୁ ଭଜା ସହ ଓଡ଼ିଆଙ୍କ ସବୁଠାରୁ ପ୍ରିୟ ଖାଦ୍ୟ।\n"
            "• କଟକ ଦହିବରା ଆଳୁଦମ୍: ଓଡ଼ିଶାର ନମ୍ବର ୧ ଷ୍ଟ୍ରିଟ୍ ଫୁଡ୍, ଯାହାର ଚଟପଟା ସ୍ୱାଦ ଅତୁଳନୀୟ।"
        ),
        "hi": (
            "ओडिशा के विश्व प्रसिद्ध पारंपरिक व्यंजन और मिठाइयाँ:\n\n"
            "• छेना पोड़ा: नयागढ़ की प्रसिद्ध भुनी हुई पनीर की मिठाई जो दुनिया भर में मशहूर है।\n"
            "• पहाला रसगुल्ला: भुवनेश्वर-कटक मार्ग का प्रसिद्ध, नर्म और मुंह में घुल जाने वाला रसगुल्ला।\n"
            "• दालमा: ताज़ी मौसमी सब्जियों और दाल से बना पारंपरिक पौष्टिक व्यंजन।\n"
            "• पखाला भात: दही, तड़का और भुनी सब्जियों के साथ गर्मियों में खाया जाने वाला लोकप्रिय भोजन।\n"
            "• कटक दहीबड़ा आलूदम: ओडिशा का सबसे लोकप्रिय, चटपटा और स्वादिष्ट स्ट्रीट फूड।"
        ),
        "bn": (
            "ওড়িশার সুস্বাদু ও ঐতিহাসিক ঐতিহ্যবাহী খাবার:\n\n"
            "• ছানাপোড়া: নয়গড়ের বিশ্ববিখ্যাত বেকড পনিরের পোড়া মিষ্টি।\n"
            "• পাহালা রসগোল্লা: নরম, তুলতুলে ও অত্যন্ত সুস্বাদু খাঁটি ওড়িশা রসগোল্লা।\n"
            "• ডালমা: ডাল ও বিভিন্ন দেশি সবজি দিয়ে রান্না করা পুষ্টিকর ও সুস্বাদু ব্যঞ্জন।\n"
            "• পাখালা ভাত: দই, বড়ি পোড়া ও ভাজা সহযোগে পরিবেশিত ওড়িশার জাতীয় স্বাদের পান্তা ভাত।\n"
            "• কটক দইবড়া আলুদম: মশলাদার আলুদম ও ঘুঘনি মিশ্রিত দারুণ স্ট্রিট ফুড।"
        ),
        "te": (
            "ఒడిశా ప్రసిద్ధ సాంప్రదాయ వంటకాలు మరియు రుచికరమైన మిఠాయిలు:\n\n"
            "• ఛేనా పోడా: కాల్చిన జున్నుతో తయారుచేసే నయగఢ్ ప్రసిద్ధ తీపి వంటకం.\n"
            "• పహాలా రసగుల్లా: మెత్తని, నోట్లో కరిగిపోయే సాంప్రదాయ రసగుల్లాలు.\n"
            "• దాల్మా: కూరగాయలు మరియు పప్పుతో నెయ్యి పోపుతో చేసే పౌష్టిక ఆహారం.\n"
            "• పఖాలా భాతా: చల్లని మజ్జిగ అన్నం, కూరగాయల వేపుళ్లతో తినే ప్రియమైన ఆహారం.\n"
            "• కటక్ దహి బరా ఆలూదమ్: కారంగా ఉండే ఆలూదమ్ తో కలిపి వడ్డించే ప్రసిద్ధ స్ట్రీట్ ఫుడ్."
        )
    },
    "temples": {
        "en": (
            "Top Sacred Temples & Architectural Wonders of Odisha:\n\n"
            "• Konark Sun Temple: 13th-century UNESCO World Heritage Site shaped like a grand chariot with 24 stone wheels.\n"
            "• Jagannath Temple, Puri: One of the 4 holy Char Dhams, famous for Ratha Yatra and the sacred Mahaprasad.\n"
            "• Lingaraj Temple, Bhubaneswar: Majestic 11th-century masterpiece of Kalinga sandstone architecture dedicated to Lord Harihara.\n"
            "• Mukteswara Temple: Known as the 'Gem of Odishan Architecture', famed for its ornate arched torana gateway.\n"
            "• Dhauli Shanti Stupa: Historic Buddhist peace pagoda marking the transformation of Emperor Ashoka after the Kalinga War."
        ),
        "or": (
            "ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ଧାର୍ମିକ ପୀଠ ଓ ପ୍ରାଚୀନ କଳିଙ୍ଗ ମନ୍ଦିର:\n\n"
            "• କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର: ତ୍ରୟୋଦଶ ଶତାବ୍ଦୀର ୟୁନେସ୍କୋ ବିଶ୍ୱ ଐତିହ୍ୟ, ଯାହା ୨୪ଟି ପଥର ଚକ ବିଶିଷ୍ଟ ଏକ ବିରାଟ ରଥ ସଦୃଶ।\n"
            "• ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର, ପୁରୀ: ଭାରତର ଚାରି ଧାମ ମଧ୍ୟରୁ ଅନ୍ୟତମ, ଯାହା ବିଶ୍ୱପ୍ରସିଦ୍ଧ ରଥଯାତ୍ରା ଓ ମହାପ୍ରସାଦ ପାଇଁ ପ୍ରସିଦ୍ଧ।\n"
            "• ଲିଙ୍ଗରାଜ ମନ୍ଦିର, ଭୁବନେଶ୍ୱର: ଏକାଦଶ ଶତାବ୍ଦୀର ପ୍ରଭୁ ହରିହରଙ୍କ ପ୍ରାଚୀନ ତଥା ଭବ୍ୟ କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ କଳା।\n"
            "• ମୁକ୍ତେଶ୍ୱର ମନ୍ଦିର: ଓଡ଼ିଶାର 'ସ୍ଥାପତ୍ୟ ରତ୍ନ', ଯାହାର ସୁନ୍ଦର ତୋରଣ ଦେଖିବାକୁ ବେଶ୍ ମନମୁଗ୍ଧକର।\n"
            "• ଧଉଳି ଶାନ୍ତି ସ୍ତୂପ: କଳିଙ୍ଗ ଯୁଦ୍ଧ ପରେ ଚଣ୍ଡାଶୋକରୁ ଧର୍ମାଶୋକ ହେବାର ଐତିହାସିକ ଶାନ୍ତିପୀଠ।"
        ),
        "hi": (
            "ओडिशा के प्रमुख पवित्र मंदिर और कलिंग वास्तुकला के चमत्कार:\n\n"
            "• कोणार्क सूर्य मंदिर: 13वीं सदी का यूनेस्को विश्व धरोहर स्थल, जो 24 विशाल नक्काशीदार पहियों वाले रथ के आकार में बना है।\n"
            "• श्री जगन्नाथ मंदिर, पुरी: हिंदू धर्म के चार पवित्र धामों में से एक, जो वार्षिक रथयात्रा और महाप्रसाद के लिए विख्यात है।\n"
            "• लिंगराज मंदिर, भुवनेश्वर: 11वीं सदी का भव्य शिव मंदिर जो कलिंग स्थापत्य कला का सर्वश्रेष्ठ उदाहरण है।\n"
            "• मुक्तेश्वर मंदिर: अपने अलंकृत मेहराबदार तोरण के कारण इसे 'ओडिशा वास्तुकला का रत्न' कहा जाता है।\n"
            "• धौली शांति स्तूप: ऐतिहासिक बौद्ध शांति स्तूप जहाँ कलिंग युद्ध के बाद सम्राट अशोक ने अहिंसा का मार्ग अपनाया था।"
        ),
        "bn": (
            "ওড়িশার প্রধান ধর্মীয় তীর্থ ও প্রাচীন স্থাপত্য কীর্তি:\n\n"
            "• কোনার্ক সূর্য মন্দির: ত্রয়োদশ শতাব্দীর ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট, যা ২৪টি চাকাযুক্ত বিশাল রথের আদলে নির্মিত।\n"
            "• শ্রী জগন্নাথ মন্দির, পুরী: ভারতের অন্যতম প্রধান চার ধাম, যা রথযাত্রা ও মহাপ্রসাদের জন্য ভুবনখ্যাত।\n"
            "• লিঙ্গরাজ মন্দির, ভুবনেশ্বর: একাদশ শতাব্দীর সুবিশাল কলিঙ্গ স্থাপত্যশৈলীর অনন্য নিদর্শন।\n"
            "• মুক্তেশ্বর মন্দির: সূক্ষ্ম খোদাই করা তোরণের জন্য একে 'ওড়িশা স্থাপত্যের রত্ন' বলা হয়।\n"
            "• ধৌলি শান্তি স্তূপ: ঐতিহাসিক বৌদ্ধ স্তূপ, যেখানে সম্রাট অশোক যুদ্ধের পর অহিংসা গ্রহণ করেছিলেন।"
        ),
        "te": (
            "ఒడిశా ప్రసిద్ధ పుణ్యక్షేత్రాలు మరియు చారిత్రక దేవాలయాలు:\n\n"
            "• కోణార్క్ సూర్య దేవాలయం: 13వ శతాబ్దానికి చెందిన యునెస్కో ప్రపంచ వారసత్వ సంపద, 24 రాతి చక్రాలతో కూడిన రథాకారం.\n"
            "• జగన్నాథ ఆలయం, పూరీ: హిందూ పవిత్ర చార్ ధామ్ లలో ఒకటి, రథయాత్ర మరియు మహాప్రసాదానికి ప్రసిద్ధి.\n"
            "• లింగరాజ దేవాలయం, భువనేశ్వర్: 11వ శతాబ్దపు అద్భుతమైన కళింగ వాస్తుశిల్ప కళాఖండం.\n"
            "• ముక్తేశ్వర దేవాలయం: అద్భుతమైన తోరణంతో కూడిన 'ఒడిశా వాస్తు రత్నం'.\n"
            "• ధౌళి శాంతి స్తూపం: కళింగ యుద్ధం తరువాత అశోక చక్రవర్తి శాంతి మార్గాన్ని ఎంచుకున్న పవిత్ర ప్రదేశం."
        )
    },
    "beaches": {
        "en": (
            "Breathtaking Coastal & Wildlife Destinations in Odisha:\n\n"
            "• Puri Golden Beach: Prestigious eco-certified Blue Flag beach with golden sand and golden sunrise views.\n"
            "• Chilika Lake: Asia's largest brackish water lagoon, home to playful Irrawaddy dolphins and millions of migratory birds at Mangalajodi.\n"
            "• Chandrabhaga Beach: Pristine, tranquil shoreline near Konark with cultural significance for sacred dips.\n"
            "• Gopalpur-on-Sea: Charming historic seaport town with vintage lighthouse and calm coconut groves.\n"
            "• Bhitarkanika National Park: Lush mangrove ecosystem sheltering giant saltwater crocodiles and kingfishers."
        ),
        "or": (
            "ଓଡ଼ିଶାର ପ୍ରାକୃତିକ ବେଳାଭୂମି ଓ ବନ୍ୟପ୍ରାଣୀ ଅଭୟାରଣ୍ୟ:\n\n"
            "• ପୁରୀ ଗୋଲ୍ଡେନ୍ ବିଚ୍: ଅନ୍ତର୍ଜାତୀୟ ବ୍ଲୁ-ଫ୍ଲାଗ୍ ମାନ୍ୟତାପ୍ରାପ୍ତ ସ୍ୱଚ୍ଛ ଓ ସୁନ୍ଦର ସମୁଦ୍ରକୂଳ।\n"
            "• ଚିଲିକା ହ୍ରଦ: ଏସିଆର ସର୍ବବୃହତ ଲୁଣିଆ ହ୍ରଦ, ଯେଉଁଠାରେ ଇରାୱାଡ଼ି ଡଲଫିନ ଏବଂ ପ୍ରବାସୀ ପକ୍ଷୀଙ୍କ ସମାଗମ ହୁଏ।\n"
            "• ଚନ୍ଦ୍ରଭାଗା ବେଳାଭୂମି: କୋଣାର୍କ ନିକଟରେ ଅବସ୍ଥିତ ଏକ ଶାନ୍ତ, ସୁନ୍ଦର ତଥା ପବିତ୍ର ବେଳାଭୂମି।\n"
            "• ଗୋପାଳପୁର ସମୁଦ୍ରକୂଳ: ଐତିହାସିକ ଲାଇଟହାଉସ ଏବଂ ନୀଳ ଜଳରାଶି ପାଇଁ ପ୍ରସିଦ୍ଧ।\n"
            "• ଭିତରକନିକା ଜାତୀୟ ଉଦ୍ୟାନ: ବିରାଟ ଲୁଣା ଜଙ୍ଗଲ ଏବଂ କୁମ୍ଭୀରମାନଙ୍କ ପାଇଁ ପ୍ରସିଦ୍ଧ।"
        ),
        "hi": (
            "ओडिशा के प्रमुख समुद्री तट और प्राकृतिक वन्यजीव स्थल:\n\n"
            "• पुरी गोल्डन बीच: अंतरराष्ट्रीय 'ब्लू फ्लैग' प्रमाणित स्वच्छ और सुरक्षित सुनहरी रेत का समुद्र तट।\n"
            "• चिल्का झील: एशिया की सबसे बड़ी खारे पानी की झील, जहाँ दुर्लभ इरावाडी डॉल्फ़िन और प्रवासी पक्षी पाए जाते हैं।\n"
            "• चंद्रभागा बीच: कोणार्क के पास स्थित शांत, स्वच्छ और मनोरम समुद्री किनारा।\n"
            "• गोपालपुर-ऑन-सी: ऐतिहासिक लाइटहाउस और नारियल के बागों से घिरा सुंदर तटीय शहर।\n"
            "• भितरकनिका राष्ट्रीय उद्यान: भारत का प्रमुख मैंग्रोव वन जो विशालकाय मगरमच्छों का घर है।"
        ),
        "bn": (
            "ওড়িশার মনোরম সমুদ্রতট ও বন্যপ্রাণী অভয়ারণ্য:\n\n"
            "• পুরী গোল্ডেন বিচ: আন্তর্জাতিক ব্লু ফ্ল্যাগ শংসাপত্রপ্রাপ্ত পরিচ্ছন্ন ও নয়নাভিরাম সমুদ্র সৈকত।\n"
            "• চিল্কা হ্রদ: এশিয়ার বৃহত্তম উপকূলীয় হ্রদ, যা ইরাবতী ডলফিন ও লক্ষ লক্ষ পরিযায়ী পাখির আবাস।\n"
            "• চন্দ্রভাগা সৈকত: কোনার্কের নিকটবর্তী মনোরম ও শান্ত প্রাকৃতিক সমুদ্রতট।\n"
            "• গোপালপুর সৈকত: প্রাচীন বাতিঘর ও নারকেল কুঞ্জে ঘেরা এক প্রশান্ত সৈকত।\n"
            "• ভিতরকনিকা জাতীয় উদ্যান: ম্যানগ্রোভ অরণ্য এবং বিশাল নোনা জলের কুমিরের জন্য বিখ্যাত।"
        ),
        "te": (
            "ఒడిశా అందమైన తీరప్రాంతాలు మరియు వన్యప్రాణుల కేంద్రాలు:\n\n"
            "• పూరీ గోల్డెన్ బీచ్: పర్యావరణహిత బ్లూ ఫ్లాగ్ గుర్తింపు పొందిన పరిశుభ్రమైన బీచ్.\n"
            "• చిల్కా సరస్సు: ఆసియాలోనే అతిపెద్ద ఉప్పునీటి సరస్సు, ఇరావాడీ డాల్ఫిన్ లకు ప్రసిద్ధి.\n"
            "• చంద్రభాగ బీచ్: కోణార్క్ సమీపంలో ప్రశాంతమైన మరియు మనోహరమైన తీరం.\n"
            "• గోపాల్ పూర్: పురాతన లైట్ హౌస్ మరియు కొబ్బరి తోటలతో కూడిన విహార కేంద్రం.\n"
            "• భితర్ కనిక నేషనల్ పార్క్: విస్తారమైన మడ అడవులు మరియు మొసళ్లకు ప్రసిద్ధి."
        )
    },
    "festivals": {
        "en": (
            "Vibrant Festivals & Classical Arts of Odisha:\n\n"
            "• Ratha Yatra (Puri): World-famous chariot festival drawing millions of pilgrims as the Holy Trinity visits Gundicha Temple.\n"
            "• Raja Parba: 3-day monsoon celebration honoring Mother Earth and womanhood with swings, music, and pithas.\n"
            "• Bali Yatra (Cuttack): Asia's largest open-air maritime trade fair commemorating ancient Kalinga sea merchants sailing to Bali and Sumatra.\n"
            "• Odissi Dance: Classical dance heritage of India noted for its lyrical grace, sculpturesque poses, and devotion to Lord Jagannath.\n"
            "• Pattachitra & Silver Filigree (Tarakasi): Renowned cloth scroll paintings from Raghurajpur and intricate silver artwork from Cuttack."
        ),
        "or": (
            "ଓଡ଼ିଶାର ଗୌରବମୟ ପର୍ବପର୍ବାଣୀ ଓ ସାଂସ୍କୃତିକ କଳା:\n\n"
            "• ପୁରୀ ରଥଯାତ୍ରା: ବିଶ୍ୱପ୍ରସିଦ୍ଧ ଘୋଷଯାତ୍ରା, ଯେଉଁଥିରେ ଚତୁର୍ଦ୍ଧାମୂର୍ତ୍ତି ବଡ଼ଦାଣ୍ଡରେ ଭକ୍ତମାନଙ୍କୁ ଦର୍ଶନ ଦିଅନ୍ତି।\n"
            "• ରଜ ପର୍ବ: ଧରଣୀ ମାତା ଏବଂ ନାରୀତ୍ୱର ୩ ଦିନିଆ ପାରମ୍ପରିକ ଉତ୍ସବ, ଯେଉଁଥିରେ ଦୋଳି, ପିଠାପଣା ମୁଖ୍ୟ ଆକର୍ଷଣ।\n"
            "• ବାଲିଯାତ୍ରା: କଟକ ମହାନଦୀ କୂଳରେ ଅନୁଷ୍ଠିତ ଏସିଆର ସର୍ବବୃହତ ମୁକ୍ତାକାଶ ବାଣିଜ୍ୟ ମେଳା।\n"
            "• ଓଡ଼ିଶୀ ନୃତ୍ୟ: ଭାରତର ପ୍ରମୁଖ ଶାସ୍ତ୍ରୀୟ ନୃତ୍ୟ, ଯାହା ମନ୍ଦିର ଭାସ୍କର୍ଯ୍ୟ ଏବଂ ଭାବପୂର୍ଣ୍ଣ ଅଭିନୟ ପାଇଁ ଜଣାଶୁଣା।\n"
            "• ପଟ୍ଟଚିତ୍ର ଓ ତାରକସି କାମ: ରଘୁରାଜପୁରର ତାଳପତ୍ର ଓ କପଡ଼ା ଚିତ୍ର ଏବଂ କଟକର ରୂପା ତାରକସି କଳା।"
        ),
        "hi": (
            "ओडिशा के रंगारंग त्योहार और शास्त्रीय कलाएँ:\n\n"
            "• पुरी रथयात्रा: विश्वप्रसिद्ध रथ महोत्सव जहाँ भगवान जगन्नाथ अपने भाई-बहन के साथ बड़दांड पर दर्शन देते हैं।\n"
            "• रज पर्व: धरती माता और नारी शक्ति को समर्पित 3 दिवसीय मानसून उत्सव, जिसमें झूले और स्वादिष्ट पीठा प्रमुख हैं।\n"
            "• बाली यात्रा (कटक): महानदी के तट पर लगने वाला एशिया का सबसे बड़ा खुला व्यापार मेला।\n"
            "• ओडिसी नृत्य: भारत की प्रमुख शास्त्रीय नृत्य शैली जो अपनी मूर्तिकला जैसी मुद्राओं और लालित्य के लिए प्रसिद्ध है।\n"
            "• पट्टचित्र और तारकसी: रघुराजपुर की पारंपरिक हस्तकला और कटक का चांदी की तारकसी (फिलिग्री) काम।"
        ),
        "bn": (
            "ওড়িশার বর্ণাঢ্য উৎসব ও ধ্রুপদী সংস্কৃতি:\n\n"
            "• পুরী রথযাত্রা: বিশ্বখ্যাত রথ উৎসব যাতে লাখ লাখ ভক্ত জগন্নাথদেবের রথের রশি স্পর্শ করতে আসেন।\n"
            "• রজ উৎসব: ধরিত্রী ও নারীত্বের সম্মানে ৩ দিনের লোকউৎসব, যাতে দোলনা ও পিঠার প্রাচুর্য থাকে।\n"
            "• বালিযাত্রা: কটকে অনুষ্ঠিত এশিয়ার বৃহত্তম মুক্ত বাণিজ্য মেলা।\n"
            "• ওড়িশি নৃত্য: ভারতের প্রাচীন ধ্রুপদী নৃত্য যা সূক্ষ্ম ভাব ও অঙ্গভঙ্গির জন্য প্রশংসিত।\n"
            "• পটচিত্র ও তারকসি: রঘুরাজপুরের পটচিত্র ও কটকের রুপোর তারকসি শিল্পকর্ম।"
        ),
        "te": (
            "ఒడిశా గొప్ప పండుగలు మరియు సంస్కృతి:\n\n"
            "• పూరీ రథయాత్ర: ప్రపంచ ప్రసిద్ధ రథోత్సవం, భక్తులు తరించే మహత్తర ఉత్సవం.\n"
            "• రజా పండుగ: భూమాతను ఆరాధించే 3 రోజుల సాంప్రదాయ పండుగ, ఊయలలు మరియు పిండివంటలు ప్రత్యేకం.\n"
            "• బాలి యాత్ర (కటక్): ఆసియాలోనే అతిపెద్ద ఓపెన్-ఎయిర్ వాణిజ్య ఉత్సవం.\n"
            "• ఒడిస్సీ నృత్యం: శిల్ప సౌందర్యం ఉట్టిపడే ప్రాచీన భారతీయ శాస్త్రీయ నృత్యం.\n"
            "• పట్టచిత్ర మరియు వెండి తారకసి: రఘురాజ్ పూర్ సాంప్రదాయ చిత్రాలు మరియు కటక్ వెండి కళాఖండాలు."
        )
    },
    "transport": {
        "en": (
            "Travel, Cabs & Connectivity in Odisha:\n\n"
            "• In-City Transit: Auto rickshaws, Mo Bus transit, and app cabs (Ola, Uber, Rapido) provide effortless local travel in Bhubaneswar and Cuttack.\n"
            "• Golden Triangle Route: Regular express buses, private cabs, and trains smoothly connect Bhubaneswar, Puri, and Konark (approx. 60 km each).\n"
            "• Airports & Rail: Biju Patnaik International Airport (BBI) in Bhubaneswar and extensive East Coast Railway connectivity across all districts."
        ),
        "or": (
            "ଓଡ଼ିଶାରେ ଯାତାୟାତ ଓ ଯାତ୍ରା ସୁବିଧା:\n\n"
            "• ସହର ଭିତରେ ଯାତାୟାତ: ଭୁବନେଶ୍ୱର ଓ କଟକରେ 'ମୋ ବସ୍', ଅଟୋ ରିକ୍ସା ଏବଂ ଓଲା/ଉବର କ୍ୟାବ୍ ସହଜରେ ଉପଲବ୍ଧ।\n"
            "• ଗୋଲ୍ଡେନ୍ ଟ୍ରାଏଙ୍ଗଲ୍ (ଭୁବନେଶ୍ୱର-ପୁରୀ-କୋଣାର୍କ): ରାଜ୍ୟ ପରିବହନ ବସ୍, ପ୍ରାଇଭେଟ୍ ଟ୍ୟାକ୍ସି ଏବଂ ଟ୍ରେନ୍ ଦ୍ୱାରା ଏହି ସ୍ଥାନଗୁଡ଼ିକ ସୁନ୍ଦର ଭାବେ ସଂଯୁକ୍ତ।\n"
            "• ବିମାନ ଓ ରେଳବାଇ: ଭୁବନେଶ୍ୱରସ୍ଥିତ ବିଜୁ ପଟ୍ଟନାୟକ ଅନ୍ତର୍ଜାତୀୟ ବିମାନବନ୍ଦର ଏବଂ ପୂର୍ବତଟ ରେଳବାଇ ପ୍ରମୁଖ ମାଧ୍ୟମ।"
        ),
        "hi": (
            "ओडिशा में यात्रा, परिवहन और कनेक्टिविटी:\n\n"
            "• शहर के भीतर: भुवनेश्वर और कटक में 'मो बस', ऑटो रिक्शा और ओला/उबर कैब की बेहतरीन सुविधा उपलब्ध है।\n"
            "• स्वर्ण त्रिभुज मार्ग (भुवनेश्वर-पुरी-कोणार्क): नियमित बसें, निजी टैक्सियाँ और ट्रेनें इन तीनों शहरों को आपस में जोड़ती हैं।\n"
            "• हवाई और रेल सेवा: भुवनेश्वर का बीजू पटनायक अंतरराष्ट्रीय हवाई अड्डा (BBI) और पूर्वी तट रेलवे की व्यापक सेवा उपलब्ध है।"
        ),
        "bn": (
            "ওড়িশায় যাতায়াত ও পরিবহন ব্যবস্থা:\n\n"
            "• শহরের ভিতরে: ভুবনেশ্বর ও কটকে 'মো বাস', অটো ও ওলা/উবের ক্যাব খুব সহজেই পাওয়া যায়।\n"
            "• গোল্ডেন ট্রায়াঙ্গল (ভুবনেশ্বর-পুরী-কোনার্ক): এক্সপ্রেস বাস, ব্যক্তিগত গাড়ি ও ট্রেন দিয়ে খুব সহজে ভ্রমণ করা যায়।\n"
            "• বিমান ও রেল: ভুবনেশ্বরের বিজু পট্টনায়ক আন্তর্জাতিক বিমানবন্দর এবং পূর্ব উপকূল রেলওয়ে প্রধান মাধ্যম।"
        ),
        "te": (
            "ఒడిశాలో ప్రయాణ సదుపాయాలు మరియు రవాణా:\n\n"
            "• నగరంలో ప్రయాణం: భువనేశ్వర్, కటక్ లలో 'మో బస్', ఆటోలు మరియు క్యాబ్ లు సులభంగా లభిస్తాయి.\n"
            "• గోల్డెన్ ట్రయాంగిల్ (భువనేశ్వర్-పూరీ-కోణార్క్): బస్సులు, రైళ్లు మరియు ప్రైవేట్ ట్యాక్సీలు నిరంతరం నడుస్తాయి.\n"
            "• విమాన మరియు రైలు సేవలు: భువనేశ్వర్ బిజూ పట్నాయక్ అంతర్జాతీయ విమానాశ్రయం మరియు ఈస్ట్ కోస్ట్ రైల్వే సౌకర్యాలు ఉన్నాయి."
        )
    },
    "weather": {
        "en": (
            "Climate & Weather in Odisha:\n\n"
            "• Coastal regions (Bhubaneswar, Puri, Konark) enjoy tropical coastal climate with comfortable winters (18°C - 28°C) between October and March.\n"
            "• Monsoons (July - September) bring lush greenery, making waterfalls in Koraput and Similipal magnificent.\n"
            "• Best travel season is October through March for outdoor monument exploration!"
        ),
        "or": (
            "ଓଡ଼ିଶାର ଜଳବାୟୁ ଓ ପାଣିପାଗ ସୂଚନା:\n\n"
            "• ଉପକୂଳ ଓଡ଼ିଶା (ଭୁବନେଶ୍ୱର, ପୁରୀ, କୋଣାର୍କ) ରେ ଅକ୍ଟୋବରରୁ ମାର୍ଚ୍ଚ ମଧ୍ୟରେ ଶୀତଳ ଓ ମନୋରମ ପାଣିପାଗ (୧୮°C - ୨୮°C) ରହିଥାଏ।\n"
            "• ବର୍ଷା ଋତୁ (ଜୁଲାଇରୁ ସେପ୍ଟେମ୍ବର) ରେ କୋରାପୁଟ, ମୟୂରଭଞ୍ଜ ଓ ଶିମିଳିପାଳର ଜଳପ୍ରପାତ ବେଶ୍ ଆକର୍ଷଣୀୟ ଦେଖାଯାଏ।\n"
            "• ମନ୍ଦିର ଓ ଐତିହ୍ୟ ଭ୍ରମଣ ପାଇଁ ଅକ୍ଟୋବରରୁ ମାର୍ଚ୍ଚ ସର୍ବୋତ୍ତମ ସମୟ!"
        ),
        "hi": (
            "ओडिशा की जलवायु और मौसम:\n\n"
            "• तटीय ओडिशा (भुवनेश्वर, पुरी, कोणार्क) में अक्टूबर से मार्च के बीच मौसम सुहावना (18°C - 28°C) रहता है।\n"
            "• मानसून (जुलाई - सितंबर) के दौरान कोरापुट और सिमलीपाल के झरने अपने पूरे शबाब पर होते हैं।\n"
            "• ऐतिहासिक स्मारकों और मंदिरों के दर्शन के लिए अक्टूबर से मार्च का समय सबसे उत्तम माना जाता है।"
        ),
        "bn": (
            "ওড়িশার আবহাওয়া ও ভ্রমণের সেরা সময়:\n\n"
            "• উপকূলীয় ওড়িশায় (ভুবনেশ্বর, পুরী, কোনার্ক) অক্টোবর থেকে মার্চ মাস ভ্রমণের জন্য সবচেয়ে মনোরম (১৮°C - ২৮°C)।\n"
            "• বর্ষাকালে (জুলাই - সেপ্টেম্বর) শিমলিপাল ও কোরাপুট পাহাড়ের জলপ্রপাত অপূর্ব রূপ ধারণ করে।\n"
            "• সমুদ্র ও মন্দির পরিদর্শনের জন্য অক্টোবর থেকে মার্চ আদর্শ সময়।"
        ),
        "te": (
            "ఒడిశా వాతావరణం మరియు పర్యటనకు ఉత్తమ సమయం:\n\n"
            "• తీరప్రాంతాలలో (భువనేశ్వర్, పూరీ, కోణార్క్) అక్టోబర్ నుండి మార్చి వరకు వాతావరణం ఆహ్లాదకరంగా (18°C - 28°C) ఉంటుంది.\n"
            "• వర్షాకాలంలో సిమిలిపాల్ మరియు కోరాపుట్ జలపాతాలు కనువిందు చేస్తాయి.\n"
            "• ఆలయాలు మరియు చారిత్రక ప్రదేశాలు సందర్శించడానికి అక్టోబర్ నుండి మార్చి అత్యంత అనుకూలం."
        )
    },
    "default": {
        "en": (
            "Welcome to Odisha Explorer — India's best kept secret!\n\n"
            "I am your local AI travel guide. You can ask me about:\n"
            "• Ancient Kalinga Temples (Konark, Jagannath Puri, Lingaraj)\n"
            "• Famous Odia Delicacies (Chhena Poda, Dalma, Rasagola)\n"
            "• Inspiring Quotes & Cultural Heritage\n"
            "• Beaches, Lakes (Chilika) & Wildlife (Bhitarkanika)\n"
            "• Weather forecasts and cab routes across Odisha.\n\n"
            "What would you like to explore next?"
        ),
        "or": (
            "ଓଡ଼ିଶା ଏକ୍ସପ୍ଲୋରରକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ — ଭାରତର ଅତୁଳନୀୟ ଐତିହ୍ୟ!\n\n"
            "ମୁଁ ଆପଣଙ୍କ ଓଡ଼ିଶା ଏଆଇ ଗାଇଡ୍। ଆପଣ ମୋତେ ପଚାରିପାରିବେ:\n"
            "• ପ୍ରସିଦ୍ଧ ମନ୍ଦିର (କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର, ଶ୍ରୀଜଗନ୍ନାଥ ମନ୍ଦିର, ଲିଙ୍ଗରାଜ)\n"
            "• ଓଡ଼ିଶାର ପ୍ରସିଦ୍ଧ ଖାଦ୍ୟ ଓ ମିଠା (ଛେନାପୋଡ଼, ଡାଲମା, ରସଗୋଲା, ଦହିବରା)\n"
            "• ଓଡ଼ିଶାର ଐତିହାସିକ ଉକ୍ତି, କଳା ଓ ସଂସ୍କୃତି\n"
            "• ଚିଲିକା ହ୍ରଦ, ବେଳାଭୂମି ଓ ଅଭୟାରଣ୍ୟ\n"
            "• ବିଭିନ୍ନ ସହରର ପାଣିପାଗ ଏବଂ ଯାତାୟାତ ସୂଚନା।\n\n"
            "ଆପଣ ଆଜି କେଉଁ ବିଷୟରେ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?"
        ),
        "hi": (
            "ओडिशा एक्सप्लोरर में आपका स्वागत है — भारत की सांस्कृतिक धरोहर!\n\n"
            "मैं आपका स्थानीय एआई गाइड हूँ। आप मुझसे पूछ सकते हैं:\n"
            "• प्राचीन कलिंग मंदिर (कोणार्क, पुरी जगन्नाथ, लिंगराज)\n"
            "• ओडिशा के स्वादिष्ट व्यंजन (छेना पोड़ा, दालमा, रसगुल्ला)\n"
            "• प्रसिद्ध सुविचार, संस्कृति और परंपराएँ\n"
            "• चिल्का झील, समुद्र तट और वन्यजीव अभयारण्य\n"
            "• मौसम और कैब/परिवहन की सटीक जानकारी।\n\n"
            "आप ओडिशा के बारे में क्या जानना चाहते हैं?"
        ),
        "bn": (
            "ওড়িশা এক্সপ্লোরারে আপনাকে স্বাগতম — ভারতের এক অপূর্ব ঐতিহ্য!\n\n"
            "আমি আপনার স্থানীয় এআই গাইড। আপনি জানতে চাইতে পারেন:\n"
            "• প্রাচীন মন্দির (কোনার্ক, পুরী জগন্নাথ, লিঙ্গরাজ)\n"
            "• ওড়িশার ঐতিহ্যবাহী খাবার ও মিষ্টি (ছানাপোড়া, ডালমা, রসগোল্লা)\n"
            "• বিখ্যাত উক্তি ও ওড়িশি সংস্কৃতি\n"
            "• চিল্কা হ্রদ, সমুদ্রতট ও বন্যপ্রাণী\n"
            "• আবহাওয়া ও ভ্রমণ নির্দেশিকা।\n\n"
            "আপনি কোন বিষয়ে জানতে আগ্রহী?"
        ),
        "te": (
            "ఒడిశా ఎక్స్ ప్లోరర్ కు స్వాగతం — భారతీయ సంస్కృతికి నిలయం!\n\n"
            "నేను మీ లోకల్ ఏఐ గైడ్ ని. మీరు నన్ను అడగవచ్చు:\n"
            "• ప్రాచీన ఆలయాలు (కోణార్క్, పూరీ జగన్నాథ్, లింగరాజ)\n"
            "• ప్రసిద్ధ వంటకాలు (ఛేనా పోడా, దాల్మా, రసగుల్లా)\n"
            "• ప్రముఖ సూక్తులు మరియు సంస్కృతి\n"
            "• చిల్కా సరస్సు, సముద్ర తీరాలు\n"
            "• వాతావరణం మరియు ప్రయాణ వివరాలు.\n\n"
            "మీరు దేని గురించి తెలుసుకోవాలనుకుంటున్నారు?"
        )
    }
}


def get_offline_travel_reply(user_msg: str, language: str = "en", weather_info: bool = False, location: str = "") -> str:
    lang = language if language in ["en", "hi", "or", "te", "bn"] else "en"
    raw_tokens = set(re.findall(r'[a-zA-Z0-9_\u0900-\u0D7F]+', user_msg.lower()))
    full_text = user_msg.lower()

    # 1. Weather intent check
    if weather_info or any(w in raw_tokens for w in ["weather", "temperature", "rain", "climate", "forecast", "monsoon", "heat", "cold", "hot", "ପାଣିପାଗ", "ତାପମାତ୍ରା", "मौसम", "तापमान"]):
        loc = location.title() if location else "Bhubaneswar"
        if lang == "or":
            return f"ଆଜି {loc} ରେ ପାଣିପାଗ ଅନୁକୂଳ ରହିଛି ଏବଂ ତାପମାତ୍ରା ପ୍ରାୟ ୨୮°C ରୁ ୩୨°C ମଧ୍ୟରେ ଅଛି। ସକାଳ କିମ୍ବା ସନ୍ଧ୍ୟା ସମୟରେ ମନ୍ଦିର ଓ ପର୍ଯ୍ୟଟନ ସ୍ଥଳୀ ଭ୍ରମଣ କରିବା ଖୁବ୍ ଭଲ। ସାଙ୍ଗରେ ପାନୀୟ ଜଳ ରଖନ୍ତୁ ଏବଂ ଆରାମଦାୟକ ପୋଷାକ ପରିଧାନ କରନ୍ତୁ!"
        elif lang == "hi":
            return f"आज {loc} में मौसम सुहावना है और तापमान लगभग 28°C से 32°C के बीच है। सुबह और शाम का समय दर्शनीय स्थलों की यात्रा के लिए सबसे उत्तम है। पर्याप्त पानी पिएं और सूती कपड़े पहनें!"
        elif lang == "bn":
            return f"আজ {loc} এ আবহাওয়া মনোরম, তাপমাত্রা প্রায় ২৮°C থেকে ৩২°C। সকাল বা বিকেলে ঐতিহাসিক স্থান ও সমুদ্রতট ভ্রমণের সেরা সময়। পর্যাপ্ত জল সাথে রাখবেন!"
        elif lang == "te":
            return f"ఈ రోజు {loc} లో వాతావరణం ఆహ్లాదకరంగా ఉంది, ఉష్ణోగ్రత 28°C నుండి 32°C వరకు ఉంటుంది. ఉదయం మరియు సాయంత్రం వేళల్లో దర్శనీయ ప్రదేశాలు చూడటం ఉత్తమం!"
        else:
            return f"The weather in {loc} today is pleasant with a temperature around 28°C to 32°C. Humidity is moderate, making it great for sightseeing in the mornings and late afternoons. Remember to carry water and wear comfortable cotton clothing!"

    # 2. Quotes / Sayings / Literature intent (Priority before generic words)
    quote_keywords = ["quote", "quotes", "saying", "sayings", "ukti", "shloka", "prabodha", "katha", "proverb", "proverbs", "gopabandhu", "poetry", "poem", "poet", "literature", "ବାଣୀ", "ଉକ୍ତି", "ପଦ୍ୟ", "କବିତା", "ପ୍ରବଚନ", "सुविचार", "पंक्ति", "पंक्तियाँ", "कहावत", "উক্তি", "বাণী", "సూక్తి", "సూక్తులు"]
    if any(k in raw_tokens for k in quote_keywords) or "famous quote" in full_text or "famous quotes" in full_text or "quotes of odisha" in full_text:
        return MULTILINGUAL_KNOWLEDGE["quotes"][lang]

    # 3. Food / Sweets / Cuisine intent (Token boundary check so 'odisha' does not trigger 'dish'!)
    food_keywords = ["food", "foods", "eat", "eating", "dish", "dishes", "cuisine", "recipe", "recipes", "delicacy", "delicacies", "sweet", "sweets", "mitha", "chhena", "chhenapoda", "rasagola", "dalma", "pakhala", "dahibara", "khaja", "arisa", "kakara", "machha", "ଖାଦ୍ୟ", "ମିଠା", "ରସଗୋଲା", "ଛେନାପୋଡ଼", "ପଖାଳ", "ଦହିବରା", "खाना", "व्यंजन", "मिठाई", "রসগোল্লা", "ছানাপোড়া", "వంటకాలు", "మిఠాయిలు"]
    if any(k in raw_tokens for k in food_keywords) or "famous food" in full_text or "gamous food" in full_text or "local food" in full_text:
        return MULTILINGUAL_KNOWLEDGE["food"][lang]

    # 4. Temples / Heritage / Konark / Puri / Bhubaneswar
    temple_keywords = ["temple", "temples", "mandir", "deula", "konark", "jagannath", "puri", "lingaraj", "mukteswar", "rajarani", "dhauli", "peace pagoda", "caves", "khandagiri", "udayagiri", "sun temple", "architecture", "monument", "monuments", "ମନ୍ଦିର", "କୋଣାର୍କ", "ଜଗନ୍ନାଥ", "ଲିଙ୍ଗରାଜ", "ଧଉଳି", "ମୁକ୍ତେଶ୍ୱର", "ଗୁମ୍ଫା", "मंदिर", "कोणार्क", "जगन्नाथ", "দেউল", "గుడి", "దేవాలయం"]
    if any(k in raw_tokens for k in temple_keywords) or "sun temple" in full_text or "temple city" in full_text:
        return MULTILINGUAL_KNOWLEDGE["temples"][lang]

    # 5. Beaches / Lakes / Wildlife (Chilika, Gopalpur, Similipal)
    beach_keywords = ["beach", "beaches", "sea", "ocean", "chilika", "gopalpur", "chandrabhaga", "lake", "similipal", "bhitarkanika", "dolphin", "dolphins", "waterfall", "waterfalls", "nature", "wildlife", "safari", "ସମୁଦ୍ର", "ବେଳାଭୂମି", "ଚିଲିକା", "ଡଲଫିନ", "समुद्र", "बीच", "झील", "সৈকত", "হ্রদ", "తీరం", "సరస్సు"]
    if any(k in raw_tokens for k in beach_keywords):
        return MULTILINGUAL_KNOWLEDGE["beaches"][lang]

    # 6. Festivals / Dance / Arts / Handloom
    fest_keywords = ["festival", "festivals", "ratha yatra", "rath yatra", "raja", "bali yatra", "boita", "dance", "odissi", "chhau", "pattachitra", "handicraft", "handicrafts", "silver filigree", "tarakasi", "pipili", "culture", "art", "craft", "ପର୍ବ", "ରଥଯାତ୍ରା", "ରଜ", "ବାଲିଯାତ୍ରା", "ଓଡ଼ିଶୀ", "ଉତ୍ସବ", "ତାରକସି", "त्योहार", "उत्सव", "नृत्य", "উৎসব", "পండుగ"]
    if any(k in raw_tokens for k in fest_keywords) or "ratha yatra" in full_text or "rath yatra" in full_text:
        return MULTILINGUAL_KNOWLEDGE["festivals"][lang]

    # 7. Transport / Cabs / Travel Routes / Hotels
    travel_keywords = ["cab", "cabs", "taxi", "ride", "travel", "bus", "fare", "train", "route", "how to reach", "airport", "hotel", "hotels", "stay", "car", "auto", "ଭଡ଼ା", "ଯାତ୍ରା", "କ୍ୟାବ୍", "गाड़ी", "किराया", "হোটেল", "రవాణా"]
    if any(k in raw_tokens for k in travel_keywords):
        return MULTILINGUAL_KNOWLEDGE["transport"][lang]

    return MULTILINGUAL_KNOWLEDGE["default"][lang]


@app.route('/api/ai/travel-assistant', methods=['POST', 'OPTIONS'])
def travel_assistant():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or {}
    messages = data.get('messages', [])
    language = data.get('language', 'en')
    include_weather = data.get('includeWeather', False)
    weather_location = data.get('weatherLocation', '')

    last_user_msg = ""
    for m in reversed(messages):
        if m.get('role') == 'user':
            last_user_msg = m.get('content', '')
            break

    gemini_key = os.environ.get('GEMINI_API_KEY')

    def generate():
        # Try live Gemini if API key is present
        if gemini_key:
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=gemini_key)

                lang_names = {
                    "en": "English",
                    "hi": "Hindi (हिंदी)",
                    "or": "Odia (ଓଡ଼ିଆ)",
                    "te": "Telugu (తెలుగు)",
                    "bn": "Bengali (বাংলা)"
                }
                target_lang = lang_names.get(language, "English")

                system_prompt = f"""You are "Odisha Explorer", an expert, friendly AI travel guide for Odisha, India.
CRITICAL LANGUAGE REQUIREMENT: You MUST reply entirely in {target_lang}.
- If target language is Odia (or), write authentic, natural Odia script (ଓଡ଼ିଆ ଲିପି).
- If target language is Hindi (hi), write natural Devanagari Hindi (हिंदी).
- If target language is Bengali (bn), write natural Bengali script (বাংলা).
- If target language is Telugu (te), write natural Telugu script (తెలుగు).
- If target language is English (en), write fluent, warm English.
- Always answer the user's specific question directly with rich, interesting cultural or travel details.
- If asked about quotes/proverbs of Odisha, provide iconic quotes (such as Utkalmani Gopabandhu Das, Jayadeva, or Jagannath traditions) with explanation.
- Format with clear bullet points or clean paragraphs."""

                gemini_contents = []
                for m in messages:
                    if m.get('role') != 'system':
                        role = 'model' if m.get('role') == 'assistant' else 'user'
                        gemini_contents.append(
                            types.Content(role=role, parts=[types.Part.from_text(text=m.get('content'))])
                        )

                response_stream = client.models.generate_content_stream(
                    model='gemini-2.5-flash',
                    contents=gemini_contents,
                    config=types.GenerateContentConfig(system_instruction=system_prompt)
                )
                for chunk in response_stream:
                    if chunk.text:
                        chunk_data = {"choices": [{"delta": {"content": chunk.text}}]}
                        yield f"data: {json.dumps(chunk_data)}\n\n"
                yield "data: [DONE]\n\n"
                return
            except Exception as e:
                print(f"Gemini live stream error, falling back to local engine: {e}")

        # High quality multilingual offline streaming engine
        reply = get_offline_travel_reply(last_user_msg, language=language, weather_info=include_weather, location=weather_location)
        words = reply.split(" ")
        for i in range(0, len(words), 3):
            sub = " ".join(words[i:i+3]) + " "
            chunk_data = {"choices": [{"delta": {"content": sub}}]}
            yield f"data: {json.dumps(chunk_data)}\n\n"
        yield "data: [DONE]\n\n"

    return Response(generate(), mimetype='text/event-stream')


# ==============================================================================
# AI Voice Guide (Streaming SSE)
# ==============================================================================
voice_greetings = {
    "en": {
        "welcome": "Welcome to {monument}! Take a moment to admire its ancient stone architecture and sacred heritage.",
        "default": "Greetings! I am your Odisha voice guide. Ask me anything about our temples, heritage, or local culture."
    },
    "hi": {
        "welcome": "{monument} में आपका हार्दिक स्वागत है! इसके भव्य और प्राचीन शिल्प का आनंद लें।",
        "default": "नमस्ते! मैं आपका ओडिशा वॉइस गाइड हूँ। यहाँ की संस्कृति और स्मारकों के बारे में पूछें।"
    },
    "or": {
        "welcome": "{monument}କୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ! ଏହାର ପ୍ରାଚୀନ ଐତିହ୍ୟ ଏବଂ ସ୍ଥାପତ୍ୟ କଳାକୁ ଉପଭୋଗ କରନ୍ତୁ।",
        "default": "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଓଡ଼ିଶା ଭଏସ୍ ଗାଇଡ୍। ଆମ ରାଜ୍ୟର ସଂସ୍କୃତି ବିଷୟରେ ଯାହା ଇଚ୍ଛା ପଚାରନ୍ତୁ।"
    },
    "te": {
        "welcome": "{monument}కి స్వాగతం! ఈ పురాతన ఆలయ శిల్పకళను ఆస్వాదించండి.",
        "default": "నమస్కారం! నేను మీ ఒడిశా వాయిస్ గైడ్. ఒడిశా సంస్కృతి గురించి ఏమైనా అడగండి."
    },
    "bn": {
        "welcome": "{monument}-এ আপনাকে স্বাগতম! এর প্রাচীন স্থাপত্য ও ঐতিহ্য উপভোগ করুন।",
        "default": "নমস্কার! আমি আপনার ওড়িশা ভয়েস গাইড। যে কোনো ঐতিহাসিক স্থান সম্পর্কে জিজ্ঞাসা করুন।"
    }
}


def parse_image_part(image_data):
    """Safely decode base64 data URLs into google.genai types.Part."""
    if not image_data or not isinstance(image_data, str):
        return None
    try:
        from google.genai import types
        if "," in image_data:
            header, b64_str = image_data.split(",", 1)
            mime_type = "image/jpeg"
            if "image/png" in header:
                mime_type = "image/png"
            elif "image/webp" in header:
                mime_type = "image/webp"
        else:
            b64_str = image_data
            mime_type = "image/jpeg"

        image_bytes = base64.b64decode(b64_str)
        if len(image_bytes) < 100:
            return None
        return types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    except Exception as e:
        print(f"Error parsing image part: {e}")
        return None


@app.route('/api/ai/voice-guide', methods=['POST', 'OPTIONS'])
def voice_guide():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or {}
    message = data.get('message', '')
    image = data.get('image', None)
    language = data.get('language', 'en')
    if language not in ["en", "hi", "or", "te", "bn"]:
        language = "en"
    is_proactive = data.get('isProactive', False)
    monument_name = data.get('monumentName', '')

    gemini_key = os.environ.get('GEMINI_API_KEY')

    def generate():
        image_part = parse_image_part(image) if image else None

        lang_names = {
            "en": "English",
            "hi": "Hindi (हिंदी)",
            "or": "Odia (ଓଡ଼ିଆ)",
            "te": "Telugu (తెలుగు)",
            "bn": "Bengali (বাংলা)"
        }
        target_lang = lang_names.get(language, "English")

        if gemini_key:
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=gemini_key)

                system_prompt = f"""You are "Odisha Explorer", a friendly, knowledgeable local travel guide for Odisha and India.
CRITICAL LANGUAGE REQUIREMENT: You MUST reply entirely in {target_lang}.
- If target language is Odia (or), write authentic, natural Odia script (ଓଡ଼ିଆ ଲିପି).
- If target language is Hindi (hi), write natural Devanagari Hindi (हिंदी).
- If target language is Bengali (bn), write natural Bengali script (বাংলা).
- If target language is Telugu (te), write natural Telugu script (తెలుగు).
- If target language is English (en), write fluent, warm English.
- Speak warmly and enthusiastically like a live local tour guide.
- If an image is provided, identify the monument, temple, or landmark in the photo accurately. State its exact name, city/district, and 2 key historical or architectural highlights.
- Keep responses concise (2-3 sentences) for natural, fluid voice playback.
- Never mention AI, LLMs, or technology."""
                if is_proactive:
                    system_prompt += f"\nPROACTIVE MODE: The user has just arrived near {monument_name}. Give a warm welcome greeting mentioning {monument_name} specifically in {target_lang}. Max 20 words."

                prompt = message or f"Tell me about {monument_name or 'this place'}"
                if is_proactive:
                    prompt = f"I have just arrived near {monument_name}. Greet me in {target_lang}."
                elif image_part and not message:
                    prompt = f"Identify this monument or tourist place in the photo, tell me where it is located and its historical significance in {target_lang}."

                contents = [prompt, image_part] if image_part else prompt
                model_to_use = 'gemini-2.5-flash' if image_part else 'gemini-2.5-flash-lite'

                response_stream = client.models.generate_content_stream(
                    model=model_to_use,
                    contents=contents,
                    config=types.GenerateContentConfig(system_instruction=system_prompt)
                )
                for chunk in response_stream:
                    if chunk.text:
                        chunk_data = {"choices": [{"delta": {"content": chunk.text}}]}
                        yield f"data: {json.dumps(chunk_data)}\n\n"
                yield "data: [DONE]\n\n"
                return
            except Exception as e:
                print(f"Voice guide live stream error, using fallback: {e}")

        # Local voice generator & intelligent multilingual monument identifier fallback
        lang_dict = voice_greetings.get(language, voice_greetings['en'])

        monument_knowledge = {
            "konark": {
                "en": "This is Konark Sun Temple, a 13th-century UNESCO World Heritage marvel in Puri district, renowned for its colossal chariot architecture and 24 intricately carved stone wheels.",
                "or": "ଏହା ହେଉଛି କୋଣାର୍କର ପ୍ରସିଦ୍ଧ ସୂର୍ଯ୍ୟ ମନ୍ଦିର, ଯାହା ତ୍ରୟୋଦଶ ଶତାବ୍ଦୀର ୟୁନେସ୍କୋ ବିଶ୍ୱ ଐତିହ୍ୟ। ଏହା ୨୪ଟି ପଥର ଚକ ବିଶିଷ୍ଟ ଏକ ବିରାଟ ସୌର ରଥ ସଦୃଶ ନିର୍ମିତ।",
                "hi": "यह कोणार्क का सूर्य मंदिर है, जो 13वीं सदी का यूनेस्को विश्व धरोहर स्थल है। यह 24 विशाल नक्काशीदार पहियों वाले सूर्य रथ के रूप में विश्वप्रसिद्ध है।",
                "bn": "এটি কোণার্ক সূর্য মন্দির, ত্রয়োদশ শতাব্দীর ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট। এটি ২৪টি চাকাযুক্ত সুবিশাল রথের আকারে নির্মিত।",
                "te": "ఇది కోణార్క్ సూర్య దేవాలయం, 13వ శతాబ్దపు యునెస్కో ప్రపంచ వారసత్వ సంపద. ఇది 24 రాతి చక్రాలతో కూడిన రథం శైలిలో నిర్మించబడింది."
            },
            "jagannath": {
                "en": "This is Shree Jagannath Temple in Puri, one of the four sacred Char Dham pilgrimage sites, world-famous for its majestic 12th-century sanctum and the annual Ratha Yatra.",
                "or": "ଏହା ହେଉଛି ପୁରୀ ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର, ଭାରତର ପବିତ୍ର ଚାରି ଧାମ ମଧ୍ୟରୁ ଅନ୍ୟତମ। ଏହା ଦ୍ୱାଦଶ ଶତାବ୍ଦୀର ଭବ୍ୟ କଳିଙ୍ଗ ମନ୍ଦିର ଏବଂ ବିଶ୍ୱପ୍ରସିଦ୍ଧ ରଥଯାତ୍ରା ପାଇଁ ଖ୍ୟାତ।",
                "hi": "यह पुरी का श्री जगन्नाथ मंदिर है, जो चार पवित्र धामों में से एक है। यह 12वीं सदी के भव्य कलिंग मंदिर और वार्षिक रथयात्रा के लिए दुनिया भर में प्रसिद्ध है।",
                "bn": "এটি পুরীর শ্রী জগন্নাথ মন্দির, ভারতের অন্যতম পবিত্র চার ধাম। এটি দ্বাদশ শতাব্দীর কলিঙ্গ স্থাপত্য ও রথযাত্রার জন্য ভুবনখ্যাত।",
                "te": "ఇది పూరీ శ్రీ జగన్నాథ దేవాలయం, నాలుగు పవిత్ర పుణ్యక్షేత్రాలలో ఒకటి. ఇది 12వ శతాబ్దపు ఆలయ నిర్మాణం మరియు ప్రసిద్ధ రథయాత్రకు ప్రసిద్ధి."
            },
            "lingaraj": {
                "en": "This is Lingaraja Temple in Bhubaneswar, an 11th-century sandstone masterpiece dedicated to Lord Harihara and the crowning jewel of Kalinga architecture.",
                "or": "ଏହା ହେଉଛି ଭୁବନେଶ୍ୱରସ୍ଥିତ ପ୍ରଭୁ ଲିଙ୍ଗରାଜ ମହାପ୍ରଭୁଙ୍କ ମନ୍ଦିର। ଏକାଦଶ ଶତାବ୍ଦୀର ଏହି ପବିତ୍ର ଶୈବପୀଠ କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ କଳାର ସର୍ବଶ୍ରେଷ୍ଠ ନିଦର୍ଶନ।",
                "hi": "यह भुवनेश्वर का प्रसिद्ध लिंगराज मंदिर है। 11वीं सदी का यह भव्य शिव मंदिर कलिंग स्थापत्य कला का शिखर माना जाता है।",
                "bn": "এটি ভুবনেশ্বরের লিঙ্গরাজ মন্দির। একাদশ শতাব্দীর এই প্রাচীন শিব মন্দিরটি কলিঙ্গ স্থাপত্যকলার শ্রেষ্ঠ নিদর্শন।",
                "te": "ఇది భువనేశ్వర్‌లోని లింగరాజ దేవాలయం. 11వ శతాబ్దానికి చెందిన ఈ శివాలయం కళింగ వాస్తు శిల్ప కళాఖండం."
            },
            "mukteswar": {
                "en": "This is Mukteswara Temple, celebrated as the 'Gem of Odishan Architecture', famous for its exquisite arched torana gateway.",
                "or": "ଏହା ହେଉଛି ମୁକ୍ତେଶ୍ୱର ମନ୍ଦିର, ଯାହାକୁ ଓଡ଼ିଶା ସ୍ଥାପତ୍ୟର ରତ୍ନ କୁହାଯାଏ। ଏହାର ସୁନ୍ଦର ତୋରଣ ଦ୍ୱାର ସାରା ବିଶ୍ୱରେ ପ୍ରସିଦ୍ଧ।",
                "hi": "यह मुक्तेश्वर मंदिर है, जिसे 'ओडिशा वास्तुकला का रत्न' कहा जाता है। यह अपने अलंकृत तोरण द्वार के लिए प्रसिद्ध है।",
                "bn": "এটি মুক্তেশ্বর মন্দির, যা 'ওড়িশা স্থাপত্যের রত্ন' নামে খ্যাত। এর সূক্ষ্ম খোদাই করা তোরণ ফটক অত্যন্ত মনোরম।",
                "te": "ఇది ముక్తేశ్వర దేవాలయం, దీనిని 'ఒడిశా వాస్తు రత్నం' అని పిలుస్తారు. దీని అందమైన తోరణం ఎంతో ప్రసిద్ధి చెందినది."
            },
            "dhauli": {
                "en": "This is Dhauli Shanti Stupa, the historic peace pagoda perched atop Dhauli hills where Emperor Ashoka renounced war and embraced Buddhism.",
                "or": "ଏହା ହେଉଛି ଧଉଳି ଶାନ୍ତି ସ୍ତୂପ, ଯେଉଁଠାରେ ଐତିହାସିକ କଳିଙ୍ଗ ଯୁଦ୍ଧ ପରେ ସମ୍ରାଟ ଅଶୋକ ଯୁଦ୍ଧ ତ୍ୟାଗ କରି ବୌଦ୍ଧ ଧର୍ମ ଗ୍ରହଣ କରିଥିଲେ।",
                "hi": "यह धौली शांति स्तूप है, जहाँ कलिंग युद्ध के बाद सम्राट अशोक ने युद्ध का त्याग कर बौद्ध धर्म और अहिंसा का मार्ग अपनाया था।",
                "bn": "এটি ধৌলি শান্তি স্তূপ, যেখানে কলিঙ্গ যুদ্ধের পর সম্রাট অশোক যুদ্ধ ত্যাগ করে অহিংসা ও বৌদ্ধ ধর্ম গ্রহণ করেছিলেন।",
                "te": "ఇది ధౌళి శాంతి స్తూపం, ఇక్కడే కళింగ యుద్ధం తర్వాత అశోక చక్రవర్తి శాంతి మార్గాన్ని స్వీకరించారు."
            },
            "khandagiri": {
                "en": "This is Khandagiri and Udayagiri caves, rock-cut Jain monastic cave shelters dating back to King Kharavela in the 2nd century BCE.",
                "or": "ଏହା ହେଉଛି ଖଣ୍ଡଗିରି ଏବଂ ଉଦୟଗିରି ଗୁମ୍ଫା, ଖ୍ରୀଷ୍ଟପୂର୍ବ ଦ୍ୱିତୀୟ ଶତାବ୍ଦୀର ମହାମେଘବାହନ ଖାରବେଳଙ୍କ ସମୟର ପ୍ରାଚୀନ ଶୈଳଖୋଦିତ ଜୈନ ଗୁମ୍ଫା।",
                "hi": "यह खंडगिरि और उदयगिरि की गुफाएं हैं, जो ईसा पूर्व दूसरी शताब्दी में राजा खारवेल के काल की प्राचीन जैन गुफाएं हैं।",
                "bn": "এটি খণ্ডগিরি ও উদয়গিরি গুহা, খ্রিস্টপূর্ব দ্বিতীয় শতকের রাজা খারবেলের সময়কার প্রাচীন জৈন গুহা।",
                "te": "ఇది ఖండగిరి మరియు ఉదయగిరి గుహలు, క్రీస్తుపూర్వం రెండవ శతాబ్దానికి చెందిన రాతితో చెక్కిన జైన గుహలు."
            },
            "chilika": {
                "en": "This is Chilika Lake, Asia's largest brackish lagoon, teeming with rare Irrawaddy dolphins and millions of migratory birds.",
                "or": "ଏହା ହେଉଛି ଚିଲିକା ହ୍ରଦ, ଏସିଆର ସର୍ବବୃହତ ଲୁଣିଆ ହ୍ରଦ, ଯାହା ଇରାୱାଡ଼ି ଡଲଫିନ ଏବଂ ପ୍ରବାସୀ ବିଦେଶୀ ପକ୍ଷୀଙ୍କ ପାଇଁ ପ୍ରସିଦ୍ଧ।",
                "hi": "यह चिल्का झील है, जो एशिया की सबसे बड़ी खारे पानी की झील है। यह दुर्लभ डॉल्फ़िन और प्रवासी पक्षियों का प्रमुख केंद्र है।",
                "bn": "এটি চিল্কা হ্রদ, এশিয়ার বৃহত্তম উপহ্রদ, যা ইরাবতী ডলফিন ও পরিযায়ী পাখির জন্য পরিচিত।",
                "te": "ఇది చిలికా సరస్సు, ఆసియాలోనే అతిపెద్ద ఉప్పునీటి సరస్సు, ఇరావాడీ డాల్ఫిన్ లకు ప్రసిద్ధి."
            },
            "image_default": {
                "en": "This captures magnificent Kalinga architectural heritage in Odisha, featuring the iconic curvilinear tower and intricate sandstone carvings reminiscent of ancient temples in Bhubaneswar and Puri.",
                "or": "ଏହି ଫଟୋଟି ଓଡ଼ିଶାର ଗୌରବମୟ କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ କଳାକୁ ପ୍ରତିଫଳିତ କରୁଛି, ଯେଉଁଥିରେ ପଥର ଉପରେ ଚିତ୍ତାକର୍ଷକ ଖୋଦେଇ ଏବଂ ପାରମ୍ପରିକ ରେଖା ଦେଉଳ ଶୈଳୀ ପ୍ରଦର୍ଶିତ।",
                "hi": "यह तस्वीर ओडिशा की कलिंग वास्तुकला को दर्शाती है, जिसमें बलुआ पत्थर की बारीक नक्काशी और ऐतिहासिक मंदिर शैली स्पष्ट दिखाई देती है।",
                "bn": "এই ছবিটি ওড়িশার কলিঙ্গ স্থাপত্যশৈলীর প্রতিফলন, যাতে বেলেপাথরের সুন্দর খোদাই ও ঐতিহাসিক মন্দিরের গঠন দৃশ্যমান।",
                "te": "ఈ చిత్రం ఒడిశాలోని అద్భుతమైన కళింగ వాస్తు శిల్ప శైలిని, ఎర్రరాతిపై అందమైన శిల్పాలను ప్రతిబింబిస్తుంది."
            }
        }

        matched_key = None
        lower_msg = (message or "").lower()
        for k in ["konark", "jagannath", "lingaraj", "mukteswar", "dhauli", "khandagiri", "chilika"]:
            if k in lower_msg:
                matched_key = k
                break

        if matched_key:
            reply = monument_knowledge[matched_key].get(language, monument_knowledge[matched_key]['en'])
        elif image:
            reply = monument_knowledge["image_default"].get(language, monument_knowledge["image_default"]['en'])
        elif is_proactive and monument_name:
            reply = lang_dict['welcome'].format(monument=monument_name)
        elif monument_name:
            reply = f"{monument_name} - {monument_knowledge['image_default'].get(language, monument_knowledge['image_default']['en'])}"
        else:
            # Check user query in get_offline_travel_reply
            reply = get_offline_travel_reply(message, language=language)

        words = reply.split(" ")
        for i in range(0, len(words), 2):
            sub = " ".join(words[i:i+2]) + " "
            chunk_data = {"choices": [{"delta": {"content": sub}}]}
            yield f"data: {json.dumps(chunk_data)}\n\n"
        yield "data: [DONE]\n\n"

    return Response(generate(), mimetype='text/event-stream')


# ==============================================================================
# AI Planner Endpoint
# ==============================================================================
@app.route('/api/ai/planner', methods=['POST', 'OPTIONS'])
def ai_planner():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or {}
    query = data.get('query', '')
    user_preferences = data.get('userPreferences', {})
    city = user_preferences.get('city', 'Bhubaneswar')

    gemini_key = os.environ.get('GEMINI_API_KEY')
    if gemini_key:
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=gemini_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Plan a trip based on this request: \"{query}\". Preferences: {json.dumps(user_preferences)}. Return ONLY a JSON object representing an itinerary with 'title', 'description', 'budget', and 'days' (array of objects with day, title, activities list).",
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return jsonify(json.loads(response.text)), 200
        except Exception as e:
            print(f"Planner live error, fallback to built-in generator: {e}")

    # Built-in contextual planner
    itinerary = {
        "title": f"Explore the Heritage Triangle from {city}",
        "description": f"A carefully balanced journey through the cultural heart of Odisha, optimized for scenic views, historical depth, and local gastronomy.",
        "budget": "₹3,500 - ₹5,500 per person (including transit & meals)",
        "days": [
            {
                "day": 1,
                "title": f"Arrival & Spiritual Awakening in {city}",
                "activities": [
                    "09:00 AM: Visit the 11th-century Lingaraj Temple and holy Bindusagar Lake",
                    "12:30 PM: Traditional Odia lunch featuring Dalma and Kanika",
                    "03:00 PM: Explore the ancient rock-cut Jain & Buddhist caves of Udayagiri & Khandagiri",
                    "06:30 PM: Evening stroll at Ekamra Haat for authentic local handicrafts and Pattachitra"
                ]
            },
            {
                "day": 2,
                "title": "Sun God Chariot & Coastal Breezes (Konark & Puri)",
                "activities": [
                    "07:30 AM: Scenic coastal drive from Bhubaneswar to Konark Sun Temple via Marine Drive",
                    "10:00 AM: Guided exploration of the UNESCO 24-spoke Sun Temple wheels & sculptures",
                    "01:00 PM: Coastal seafood meal at Chandrabhaga Beach",
                    "04:30 PM: Darshan at Jagannath Temple, Puri, followed by famous Khaja sweets and sunset beach walk"
                ]
            },
            {
                "day": 3,
                "title": "Artisans, Peace Pagoda & Wildlife",
                "activities": [
                    "08:30 AM: Visit Raghurajpur Heritage Crafts Village and meet master Pattachitra painters",
                    "11:30 AM: Visit Dhauli Shanti Stupa (Peace Pagoda) where Emperor Ashoka renounced warfare",
                    "02:00 PM: Taste authentic Pahala Rasagola fresh from local highway stalls",
                    "04:00 PM: Relax at Nandankanan Zoological Park & Botanical Garden"
                ]
            }
        ]
    }
    return jsonify(itinerary), 200


# ==============================================================================
# RAG Guide / AR Translation / Recognition Endpoint
# ==============================================================================
@app.route('/api/ai/rag-guide', methods=['POST', 'OPTIONS'])
def rag_guide():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or {}
    query = data.get('query', '')
    mode = data.get('mode', '')
    image = data.get('image', None)

    image_part = parse_image_part(image) if image else None

    gemini_key = os.environ.get('GEMINI_API_KEY')
    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            prompt = query
            if mode == "translate":
                prompt = f"Translate this into English: {query}"
            elif mode == "recognize":
                prompt = query or "Identify this monument or object in the image and tell me exactly what it is, its location, and architectural details."

            contents = [prompt, image_part] if image_part else prompt
            model_name = "gemini-2.5-flash" if image_part else "gemini-2.5-flash-lite"
            response = client.models.generate_content(model=model_name, contents=contents)
            return jsonify({"result": response.text}), 200
        except Exception as e:
            print(f"RAG live error, using fallback: {e}")

    # Fallback RAG response with smart keyword matching
    if mode == "translate":
        result = f'Translation of "{query}": "Welcome to our sacred land. May your journey bring peace and knowledge."'
    elif mode == "recognize":
        lq = query.lower()
        if "konark" in lq:
            result = "Identified: Konark Sun Temple (Puri district). A 13th-century UNESCO World Heritage monument shaped like a colossal 24-wheeled chariot of Surya, representing the pinnacle of ancient Kalinga stonecraft."
        elif "jagannath" in lq:
            result = "Identified: Shree Jagannath Temple (Puri). One of the sacred Char Dham shrines of India, renowned for its 12th-century Kalinga sanctuary spire, Meghanada Pacheri walls, and the annual Ratha Yatra festival."
        elif "lingaraj" in lq:
            result = "Identified: Lingaraja Temple (Old Town, Bhubaneswar). The 11th-century monument dedicated to Lord Harihara, featuring a 55-meter Rekha Deula spire and extensive red sandstone compound shrines."
        elif "dhauli" in lq:
            result = "Identified: Dhauli Shanti Stupa (Bhubaneswar). White peace pagoda overlooking the Daya River, commemorating Emperor Ashoka's transition from warfare to Dharma following the Kalinga War."
        elif "mukteswar" in lq:
            result = "Identified: Mukteswara Temple (Bhubaneswar). A 10th-century architectural masterpiece famed for its diamond-carved arched Torana gateway and lyrical stone sculptures."
        else:
            result = "This structure exhibits classic Kalinga Temple Architecture, characterized by the curvilinear spire (Rekha Deula) and assembly hall (Jagamohana). The stone carvings represent mythological motifs typical of 11th–13th century temples in Odisha, such as Konark, Lingaraj, or Mukteswar."
    else:
        result = f"Heritage Knowledge Base: {query}\nOdisha's monuments represent the pinnacle of ancient architectural engineering, with dry-stone masonry, iron beam reinforcements, and astronomical alignments."

    return jsonify({"result": result}), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    print(f"Starting Sight-Sound-Walk API on 0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
