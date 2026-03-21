import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
    { year: 1868, name: "konark-1868.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Konark_Sun_Temple_main_temple_in_ruins_1868.jpg" },
    { year: 1900, name: "konark-1900.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Sun_Temple_of_Konark_1900.jpg" },
    { year: 1950, name: "konark-1950.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Konark_Sun_Temple_in_1955.jpg" },
    { year: 1850, name: "taj-1850.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Taj_Mahal_Agra_1850s.jpg" },
    { year: 1900, name: "taj-1900.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Taj_Mahal_Agra_India_ca_1900.jpg" },
    { year: 1940, name: "taj-1940.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Ariel_view_of_Taj_Mahal_1940.jpg" },
    { year: 1931, name: "indiagate-1931.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/7/77/India_Gate_New_Delhi_1930s.jpg" },
    { year: 1950, name: "indiagate-1950.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/b/b3/New_Delhi_India_Gate_1950.jpg" },
    { year: 1887, name: "charminar-1887.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Charminar_in_1887.jpg" },
    { year: 1920, name: "charminar-1920.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Charminar_Hyderabad_India_1920s.jpg" },
    { year: 1924, name: "gateway-1924.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Gateway_of_India%2C_Mumbai_1924.jpg" },
    { year: 1948, name: "gateway-1948.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/3/39/The_Departure_of_the_British_from_India%2C_1948.jpg" }
];

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Safari/537.36' } }, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 308) {
                downloadImage(response.headers.location.startsWith('http') ? response.headers.location : `https://upload.wikimedia.org${response.headers.location}`, dest).then(resolve).catch(reject);
            } else {
                reject(`Server responded with ${response.statusCode}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
}

async function main() {
    const outDir = path.join(process.cwd(), 'public', 'time-travel');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    for (const img of images) {
        console.log(`Downloading ${img.name}...`);
        try {
            await downloadImage(img.url, path.join(outDir, img.name));
            console.log(`Success: ${img.name}`);
        } catch (err) {
            console.error(`Error processing ${img.name}: ${err}`);
        }
    }
}

main();
