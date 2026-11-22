import requests
import json

headers = {'User-Agent': 'LetsExplorePlatform/1.0'}
queries = [
    'india gate glb',
    'charminar 3d',
    'hampi glb',
    'gateway of india 3d',
    'brihadeeshwara glb',
    'khajuraho glb',
    'golden temple glb',
    'indian temple 3d model',
    'heritage 3d model glb'
]

repos = []
for q in queries:
    url = f"https://api.github.com/search/repositories?q={requests.utils.quote(q)}&per_page=5"
    try:
        r = requests.get(url, headers=headers, timeout=8).json()
        for item in r.get('items', []):
            repo = item['full_name']
            if repo not in repos:
                repos.append(repo)
    except Exception as e:
        pass

print(f"Total candidate repos found: {len(repos)}")

# Check trees of candidate repos for .glb or .gltf
for repo in repos:
    try:
        tree_url = f"https://api.github.com/repos/{repo}/git/trees/main?recursive=1"
        res = requests.get(tree_url, headers=headers, timeout=8)
        if res.status_code == 404:
            tree_url = f"https://api.github.com/repos/{repo}/git/trees/master?recursive=1"
            res = requests.get(tree_url, headers=headers, timeout=8)
        if res.status_code == 200:
            tree = res.json().get('tree', [])
            for node in tree:
                path = node.get('path', '')
                if path.lower().endswith('.glb') or path.lower().endswith('.gltf'):
                    size = node.get('size', 0)
                    print(f"MATCH: {repo} | {path} ({size} bytes)")
    except Exception as e:
        continue
