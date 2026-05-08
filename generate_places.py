import json
import random
from datetime import datetime

prefixes = [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", 
    "Bhadrak", "Baripada", "Jharsuguda", "Bargarh", "Rayagada", "Bhawanipatna", "Dhenkanal", 
    "Barbil", "Kendujhar", "Sunabeda", "Paradip", "Jeypore", "Brajarajnagar", "Rajagangapur", 
    "Parlakhemundi", "Boudh", "Angul", "Kendrapara", "Jajpur", "Malkangiri", "Nabarangpur", 
    "Nuapada", "Subarnapur", "Nayagarh", "Phulbani", "Chatrapur", "Koraput", "Rairangpur", 
    "Khordha", "Vyasanagar", "Belpahar", "Talcher", "Sundargarh", "Kalahandi", "Ganjam",
    "Gajapati", "Kandhamal", "Deogarh", "Jagatsinghpur", "Mayurbhanj", "Bolangir"
]

adjectives = [
    "", "", "", "", "Ancient", "Sacred", "Golden", "Royal", "Hidden", "Mystic", "Grand", 
    "Historical", "Serene", "Divine", "Lush", "Majestic", "Tranquil", "Pristine", "Echoing"
]

suffixes = [
    "Temple", "Beach", "Museum", "Lake", "Park", "Hill Station", "Sanctuary", "Fort", 
    "Caves", "Waterfalls", "Palace", "Gardens", "Viewpoint", "Heritage Village", 
    "Riverfront", "Safari", "Zoo", "National Park", "Eco Retreat", "Hot Springs", 
    "Bird Sanctuary", "Valley", "Gorge", "Reservoir", "Botanical Garden", "Monastery",
    "Stupa", "Wildlife Reserve", "Forest", "Cultural Center", "Planetarium"
]

places_out = []
generated_names = set()

# Generate combinations
for pref in prefixes:
    for suff in suffixes:
        for adj in adjectives:
            name = f"{adj} {pref} {suff}".strip()
            if name not in generated_names:
                generated_names.add(name)
                
                # Determine category
                if "Temple" in suff or "Monastery" in suff or "Stupa" in suff or "Sacred" in name:
                    cat = "Temple"
                    image_cat = random.choice(["temple", "shrine", "monument", "heritage", "india,temple", "architecture"])
                elif "Beach" in suff:
                    cat = "Beach"
                    image_cat = random.choice(["beach", "ocean", "sea", "sand", "coast", "india,beach"])
                elif "Waterfall" in suff or "Lake" in suff or "Riverfront" in suff or "Reservoir" in suff or "Hot Springs" in suff:
                    cat = "Water"
                    image_cat = random.choice(["waterfall", "lake", "river", "water", "nature", "landscape"])
                elif "Sanctuary" in suff or "Park" in suff or "Safari" in suff or "Zoo" in suff or "Forest" in suff:
                    cat = "Nature"
                    image_cat = random.choice(["forest", "wildlife", "nature", "animals", "jungle", "india,nature"])
                elif "Museum" in suff or "Fort" in suff or "Palace" in suff or "Cultural" in suff:
                    cat = "History"
                    image_cat = random.choice(["museum", "fort", "palace", "history", "ancient", "monument"])
                else:
                    cat = "Place"
                    image_cat = random.choice(["landscape", "city", "village", "view", "mountain"])
                    
                # Use lorempixel/unsplash/loremflickr for real images
                image_url = f"https://loremflickr.com/800/600/odisha,{image_cat}?lock={len(places_out)}"
                
                place = {
                    "id": f"gen-place-{len(places_out)}",
                    "title": name,
                    "description": f"The {name} is a magnificent {cat.lower()} located in Odisha. It is known for its incredible beauty and offers visitors a unique experience of the rich culture and natural heritage of the region.",
                    "location": f"{pref}, Odisha, India",
                    "state": "Odisha",
                    "category": cat,
                    "latitude": 20.0 + random.uniform(-2.0, 2.0),
                    "longitude": 85.0 + random.uniform(-2.0, 2.0),
                    "is_featured": random.random() > 0.95,
                    "facts": ["A beautiful destination in Odisha", "Popular among tourists and locals alike", "Showcases the best of the region"],
                    "distance_from_berhampur": f"{random.randint(5, 500)} km",
                    "region": "odisha",
                    "image_url": image_url,
                    "rating": round(random.uniform(4.0, 5.0), 1),
                    "reviews_count": random.randint(10, 2000),
                    "created_at": datetime.now().isoformat() + "Z"
                }
                places_out.append(place)
                
                if len(places_out) >= 1050:
                    break
        if len(places_out) >= 1050:
            break
    if len(places_out) >= 1050:
        break

print(f"Generated {len(places_out)} places.")

with open('src/data/newOdishaPlaces.ts', 'w', encoding='utf-8') as f:
    f.write('export const newOdishaPlaces = ')
    f.write(json.dumps(places_out[:1050], indent=2))
    f.write(';\n')
    
print("Saved to src/data/newOdishaPlaces.ts")
