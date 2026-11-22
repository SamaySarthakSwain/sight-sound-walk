import requests
import json

headers = {'User-Agent': 'LetsExplorePlatform/1.0'}
search_terms = [
    'charminar',
    'gateway-of-india',
    'gateway of india',
    'india gate',
    'indiagate',
    'hampi',
    'ajanta',
    'rani ki vav',
    'brihadeeshwara',
    'ellora',
    'khajuraho',
    'qutub minar',
    'red fort',
    'delhi monument',
    'indian monument 3d'
]

repos = set()
for term in search_terms:
    url = f"https://api.github.com/search/repositories?q={requests.utils.quote(term)}+in:name,description,readme&per_page=10"
    try:
        r = requests.get(url, headers=headers, timeout=8).json()
        for item in r.get('items', []):
            repos.add(item['full_name'])
    except Exception as e:
        pass

print(f"Total candidate repos to check: {len(repos)}")

matches = []
for repo in repos:
    for branch in ['main', 'master']:
        try:
            tree_url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
            res = requests.get(tree_url, headers=headers, timeout=8)
            if res.status_code == 200:
                tree = res.json().get('tree', [])
                for node in tree:
                    p = node.get('path', '').lower()
                    if p.endswith('.glb') or p.endswith('.gltf'):
                        matches.append((repo, branch, node['path'], node.get('size', 0)))
                break
        except Exception:
            pass

print(f"Total 3D model files found: {len(matches)}")
for m in matches:
    print(f"{m[0]} ({m[1]}) -> {m[2]} [{m[3]} bytes]")
