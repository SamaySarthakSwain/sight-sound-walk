import os
import requests
import hashlib

MODELS_DIR = r"c:\Users\LENOVO\Desktop\Lets Explore\sight-sound-walk-main\public\models"
os.makedirs(MODELS_DIR, exist_ok=True)

downloads = [
    {
        "id": "taj-mahal",
        "filename": "taj-mahal.glb",
        "url": "https://raw.githubusercontent.com/SamkitJain1812/ExhibitX-AR-Based-Museum-Tour/main/my-react-app/public/models/taj_mahal_model.glb"
    },
    {
        "id": "konark-sun-temple",
        "filename": "konark-sun-temple.glb",
        "url": "https://raw.githubusercontent.com/SamkitJain1812/ExhibitX-AR-Based-Museum-Tour/main/my-react-app/public/models/Konark%20Sun%20Temple.glb"
    },
    {
        "id": "red-fort",
        "filename": "red-fort.glb",
        "url": "https://raw.githubusercontent.com/SamkitJain1812/ExhibitX-AR-Based-Museum-Tour/main/my-react-app/public/models/Red%20fort.glb"
    },
    {
        "id": "qutub-minar",
        "filename": "qutub-minar.glb",
        "url": "https://raw.githubusercontent.com/SamkitJain1812/ExhibitX-AR-Based-Museum-Tour/main/my-react-app/public/models/qutub%20minar.glb"
    },
    {
        "id": "south-indian-gopuram",
        "filename": "south-indian-gopuram.glb",
        "url": "https://raw.githubusercontent.com/prajnashetty333/DevAalaya/main/frontend/public/models/south_indian_temple_-_modular_kit.glb"
    },
    {
        "id": "parasurameswara",
        "filename": "parasurameswara.glb",
        "url": "https://raw.githubusercontent.com/prajnashetty333/DevAalaya/main/frontend/public/models/nagara.glb"
    }
]

headers = {'User-Agent': 'Mozilla/5.0'}

for item in downloads:
    target_path = os.path.join(MODELS_DIR, item["filename"])
    if os.path.exists(target_path) and os.path.getsize(target_path) > 100000:
        print(f"Already exists: {item['filename']} ({os.path.getsize(target_path)} bytes)")
        continue
    print(f"Downloading {item['filename']} from {item['url']} ...")
    try:
        r = requests.get(item['url'], headers=headers, stream=True, timeout=30)
        if r.status_code == 200:
            with open(target_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=128*1024):
                    if chunk:
                        f.write(chunk)
            size = os.path.getsize(target_path)
            print(f"Successfully downloaded {item['filename']} ({size} bytes)")
        else:
            print(f"Failed {item['filename']}: HTTP {r.status_code}")
    except Exception as e:
        print(f"Error downloading {item['filename']}: {e}")
