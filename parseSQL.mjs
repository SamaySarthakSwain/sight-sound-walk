import fs from 'fs';
import path from 'path';

const sqlFilePath = path.join(process.cwd(), 'supabase/migrations/20260312053356_fe93a44b-43f4-4205-88eb-3a8552d5762f.sql');
const outputPath = path.join(process.cwd(), 'src/data/fallbackMonuments.ts');

const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

const monuments = [];
let idCounter = 1;

// Find the start of the VALUES section
const valuesStart = sqlContent.indexOf('VALUES');
if (valuesStart === -1) {
    console.error("Could not find VALUES in SQL file");
    process.exit(1);
}

let remaining = sqlContent.substring(valuesStart + 6).trim();

// Function to parse a SQL string (handling doubled single quotes)
function parseSqlString(str) {
    if (!str.startsWith("'") || !str.endsWith("'")) return str;
    return str.substring(1, str.length - 1).replace(/''/g, "'");
}

// Function to parse a SQL array ARRAY['a', 'b']
function parseSqlArray(str) {
    if (!str.startsWith("ARRAY[")) return [];
    const inner = str.substring(6, str.length - 1);
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < inner.length; i++) {
        const char = inner[i];
        if (char === "'" && inner[i+1] !== "'") {
            inQuotes = !inQuotes;
            current += char;
        } else if (char === "'" && inner[i+1] === "'") {
            current += "''";
            i++;
        } else if (char === ',' && !inQuotes) {
            result.push(parseSqlString(current.trim()));
            current = "";
        } else {
            current += char;
        }
    }
    if (current.trim()) result.push(parseSqlString(current.trim()));
    return result;
}

// Split by tuples roughly, but carefully
// Format is ('...', '...', ..., true, ARRAY[...], '...', '...')
const tupleRegex = /\(\s*('[^]*?'|true|false|[\d.]+)\s*,\s*('[^]*?'|true|false|[\d.]+)\s*,\s*('[^]*?'|true|false|[\d.]+)\s*,\s*('[^]*?'|true|false|[\d.]+)\s*,\s*('[^]*?'|true|false|[\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*(true|false)\s*,\s*(ARRAY\[[^]*?\])\s*,\s*('[^]*?'|true|false|[\d.]+)\s*,\s*('[^]*?'|true|false|[\d.]+)\s*\)/g;

let match;
while ((match = tupleRegex.exec(remaining)) !== null) {
    monuments.push({
        id: `fallback-${idCounter++}-${Date.now()}`,
        title: parseSqlString(match[1]),
        description: parseSqlString(match[2]),
        location: parseSqlString(match[3]),
        state: parseSqlString(match[4]),
        category: parseSqlString(match[5]),
        latitude: parseFloat(match[6]),
        longitude: parseFloat(match[7]),
        is_featured: match[8] === 'true',
        facts: parseSqlArray(match[9]),
        distance_from_berhampur: parseSqlString(match[10]),
        region: parseSqlString(match[11]),
        image_url: null,
        rating: 4.8,
        reviews_count: 120,
        created_at: new Date().toISOString()
    });
}

const tsContent = `// Auto-generated fallback monuments data from SQL migration
export const fallbackMonuments = ${JSON.stringify(monuments, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent);
console.log(`Successfully generated ${monuments.length} fallback monuments to src/data/fallbackMonuments.ts!`);
