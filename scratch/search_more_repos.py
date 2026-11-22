import requests

headers = {'User-Agent': 'Mozilla/5.0'}

repos = [
    'KeshavGoyal97/3D-Taj-Mahal-Model',
    'Akshat-Jain14/AR-Heritage-Tourism',
    'sanket-sharma/IndiaGate3D',
    'harshraj22/Monument3D',
    'pranjal-singh/3D-Monuments',
    'Ayush-Agrawal-07/AR-Monuments',
    'divyanshu-rawat/Indian-Heritage-AR',
    'KhronosGroup/glTF-Sample-Models',
]

# Let's search github repos via search API with simple single words
keywords = ['indiagate', 'charminar', 'hampi', 'ajanta', 'ellora', 'qutub', 'monument-3d']
found_repos = set(repos)

for kw in keywords:
    try:
        url = f"https://api.github.com/search/repositories?q={kw}&sort=stars&order=desc&per_page=5"
        r = requests.get(url, headers=headers, timeout=5).json()
        for it in r.get('items', []):
            found_repos.add(it['full_name'])
    except Exception:
        pass

print(f"Checking {len(found_repos)} repos...")

for repo in found_repos:
    for branch in ['main', 'master']:
        try:
            url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
            r = requests.get(url, headers=headers, timeout=5)
            if r.status_code == 200:
                for f in r.json().get('tree', []):
                    path = f['path']
                    if any(path.lower().endswith(ext) for ext in ['.glb', '.gltf', '.obj']):
                        print(f"{repo} [{branch}]: {path} ({f.get('size')} bytes)")
                break
        except Exception:
            pass
