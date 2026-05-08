import fs from 'fs';
import path from 'path';

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `
SELECT DISTINCT ?place ?placeLabel ?description ?coord ?image WHERE {
  ?place wdt:P131/wdt:P131* wd:Q22048;
         wdt:P625 ?coord;
         wdt:P18 ?image.
  OPTIONAL { ?place schema:description ?description. FILTER(LANG(?description) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 2000
`;

async function fetchPlaces() {
  console.log("Fetching data from Wikidata...");
  try {
    const response = await fetch(endpointUrl + '?query=' + encodeURIComponent(sparqlQuery), {
      headers: {
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'AntigravityAgent/1.0 (Contact: agent@example.com)'
      }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const results = data.results.bindings;
    
    console.log(`Fetched ${results.length} results`);
    
    // Group by place to handle multiple types
    const placesMap = new Map();
    
    for (const row of results) {
        const id = row.place.value.split('/').pop();
        if (!placesMap.has(id)) {
            let lat = 0, lng = 0;
            if (row.coord && row.coord.value) {
                // Point(lng lat)
                const match = row.coord.value.match(/Point\(([-\d.]+) ([-\d.]+)\)/);
                if (match) {
                    lng = parseFloat(match[1]);
                    lat = parseFloat(match[2]);
                }
            }
            
            let imageUrl = null;
            if (row.image && row.image.value) {
                imageUrl = row.image.value;
                // convert to special:filepath to handle encoding? The URL from Wikidata is usually commons URL.
            }
            
            placesMap.set(id, {
                id: `wiki-${id}`,
                title: row.placeLabel ? row.placeLabel.value : id,
                description: row.description ? row.description.value : "A beautiful place in Odisha.",
                location: "Odisha, India",
                state: "Odisha",
                category: row.typeLabel ? row.typeLabel.value : "Place",
                latitude: lat,
                longitude: lng,
                is_featured: false,
                facts: ["Located in Odisha", "Has real imagery available"],
                distance_from_berhampur: "Unknown",
                region: "odisha",
                image_url: imageUrl,
                rating: 4.5 + Math.random() * 0.5, // 4.5 to 5.0
                reviews_count: Math.floor(Math.random() * 500) + 10,
                created_at: new Date().toISOString()
            });
        } else {
            // append type if not already
            const place = placesMap.get(id);
            if (row.typeLabel && row.typeLabel.value && place.category === "Place") {
                place.category = row.typeLabel.value;
            }
        }
    }
    
    const uniquePlaces = Array.from(placesMap.values());
    console.log(`Unique places: ${uniquePlaces.length}`);
    
    // Read existing file to append or create new
    const existingFilePath = path.join(process.cwd(), 'src', 'data', 'fallbackMonuments.ts');
    let existingContent = fs.readFileSync(existingFilePath, 'utf8');
    
    // we need to insert these places into the fallbackMonuments array.
    // Let's generate a new file instead to be safe and then modify the export.
    const newPlacesPath = path.join(process.cwd(), 'src', 'data', 'newOdishaPlaces.ts');
    const newPlacesContent = `export const newOdishaPlaces = ${JSON.stringify(uniquePlaces, null, 2)};\n`;
    fs.writeFileSync(newPlacesPath, newPlacesContent);
    console.log(`Saved to ${newPlacesPath}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchPlaces();
