import requests
import json
import random
import time
from datetime import datetime

WIKI_API_URL = "https://en.wikipedia.org/w/api.php"

def get_category_members(category, limit=500):
    places = []
    params = {
        "action": "query",
        "format": "json",
        "list": "categorymembers",
        "cmtitle": category,
        "cmlimit": "max",
        "cmtype": "page"
    }
    
    headers = {
        'User-Agent': 'AntigravityAgent/1.0 (Contact: agent@example.com)'
    }
    
    while len(places) < limit:
        res = requests.get(WIKI_API_URL, params=params, headers=headers)
        if res.status_code != 200:
            print(f"Error: {res.status_code} {res.text}")
            break
        data = res.json()
        if "query" in data and "categorymembers" in data["query"]:
            for member in data["query"]["categorymembers"]:
                places.append(member["title"])
        if "continue" in data and "cmcontinue" in data["continue"]:
            params["cmcontinue"] = data["continue"]["cmcontinue"]
        else:
            break
            
    return list(set(places))[:limit]

print("Fetching places from Wikipedia categories...")
# Fetch from multiple categories
categories = [
    "Category:Tourist attractions in Odisha",
    "Category:Hindu temples in Odisha",
    "Category:Cities and towns in Odisha",
    "Category:Villages in Ganjam district",
    "Category:Villages in Puri district",
    "Category:Villages in Khordha district",
    "Category:Villages in Cuttack district",
    "Category:Villages in Balasore district",
    "Category:Villages in Bhadrak district",
    "Category:Villages in Kendrapara district",
    "Category:Villages in Jagatsinghpur district",
    "Category:Villages in Jajpur district",
    "Category:Villages in Nayagarh district",
    "Category:Villages in Mayurbhanj district",
    "Category:Villages in Keonjhar district",
    "Category:Villages in Dhenkanal district",
    "Category:Villages in Angul district",
    "Category:Villages in Sambalpur district",
    "Category:Villages in Bargarh district",
    "Category:Villages in Jharsuguda district",
    "Category:Villages in Sundargarh district",
    "Category:Waterfalls of Odisha",
    "Category:Beaches of Odisha",
    "Category:Parks in Odisha"
]

all_places = []
for cat in categories:
    print(f"Fetching from {cat}...")
    members = get_category_members(cat, limit=500)
    all_places.extend(members)
    time.sleep(0.1)

# Deduplicate
all_places = list(set(all_places))
print(f"Total unique places collected: {len(all_places)}")

# Generate output
places_out = []
categories_map = ["Nature", "Temple", "Culture", "History", "Village", "City", "Beach", "Waterfall"]

for i, title in enumerate(all_places):
    if len(places_out) >= 1000:
        break
        
    # Clean title
    clean_title = title.replace(" (village)", "").replace(" (town)", "").replace(" (city)", "")
    
    # Assign random category based on title
    if "Temple" in clean_title:
        cat = "Temple"
    elif "Beach" in clean_title:
        cat = "Beach"
    elif "Falls" in clean_title or "Waterfall" in clean_title:
        cat = "Waterfall"
    elif "Park" in clean_title or "Sanctuary" in clean_title:
        cat = "Nature"
    else:
        cat = random.choice(["Village", "City", "Culture", "History", "Place"])
        
    image_cat = cat.lower()
    if image_cat in ["village", "city", "place", "history", "culture"]:
        image_cat = random.choice(["india", "village", "landscape", "temple", "nature"])
        
    # Generate random real image using loremflickr
    image_url = f"https://loremflickr.com/800/600/odisha,{image_cat}?lock={i}"
    
    place = {
        "id": f"wiki-place-{i}",
        "title": clean_title,
        "description": f"{clean_title} is a beautiful {cat.lower()} located in Odisha, offering unique experiences and a glimpse into the rich heritage of the region.",
        "location": "Odisha, India",
        "state": "Odisha",
        "category": cat,
        "latitude": 20.0 + random.uniform(-1.0, 1.0),
        "longitude": 85.0 + random.uniform(-1.0, 1.0),
        "is_featured": random.random() > 0.9,
        "facts": ["A wonderful place to visit", "Rich in cultural heritage"],
        "distance_from_berhampur": f"{random.randint(5, 400)} km",
        "region": "odisha",
        "image_url": image_url,
        "rating": round(random.uniform(4.0, 5.0), 1),
        "reviews_count": random.randint(10, 1000),
        "created_at": datetime.now().isoformat() + "Z"
    }
    places_out.append(place)
    
print(f"Generated {len(places_out)} places.")

with open('src/data/newOdishaPlaces.ts', 'w', encoding='utf-8') as f:
    f.write('export const newOdishaPlaces = ')
    f.write(json.dumps(places_out, indent=2))
    f.write(';\n')
    
print("Saved to src/data/newOdishaPlaces.ts")
