import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
    { year: 1868, name: "konark-1868.jpg", title: "File:Konark_Sun_Temple_main_temple_in_ruins_1868.jpg" },
    { year: 1900, name: "konark-1900.jpg", title: "File:Sun_Temple_of_Konark_1900.jpg" },
    { year: 1950, name: "konark-1950.jpg", title: "File:Konark_Sun_Temple_in_1955.jpg" },
    { year: 1850, name: "taj-1850.jpg", title: "File:Taj_Mahal_Agra_1850s.jpg" },
    { year: 1900, name: "taj-1900.jpg", title: "File:Taj_Mahal_Agra_India_ca_1900.jpg" },
    { year: 1940, name: "taj-1940.jpg", title: "File:Ariel_view_of_Taj_Mahal_1940.jpg" },
    { year: 1931, name: "indiagate-1931.jpg", title: "File:India_Gate_New_Delhi_1930s.jpg" },
    { year: 1950, name: "indiagate-1950.jpg", title: "File:New_Delhi_India_Gate_1950.jpg" },
    { year: 1887, name: "charminar-1887.jpg", title: "File:Charminar_in_1887.jpg" },
    { year: 1920, name: "charminar-1920.jpg", title: "File:Charminar_Hyderabad_India_1920s.jpg" },
    { year: 1924, name: "gateway-1924.jpg", title: "File:Gateway_of_India,_Mumbai_1924.jpg" },
    { year: 1948, name: "gateway-1948.jpg", title: "File:The_Departure_of_the_British_from_India,_1948.jpg" }
];

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
}

async function getImageUrl(title) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                const pages = json.query?.pages;
                if (!pages) return resolve(null);
                const pageId = Object.keys(pages)[0];
                const imageinfo = pages[pageId]?.imageinfo;
                if (imageinfo && imageinfo.length > 0) {
                    resolve(imageinfo[0].url);
                } else {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    const outDir = path.join(process.cwd(), 'public', 'time-travel');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    for (const img of images) {
        console.log(`Fetching URL for ${img.title}...`);
        try {
            const url = await getImageUrl(img.title);
            if (url) {
                console.log(`Found URL: ${url}. Downloading to ${img.name}...`);
                await downloadImage(url, path.join(outDir, img.name));
                console.log(`Success: ${img.name}`);
            } else {
                console.log(`URL not found for ${img.title}`);
            }
        } catch (err) {
            console.error(`Error processing ${img.name}: ${err}`);
        }
    }
}

main();
