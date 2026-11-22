import re

AR_MODELS_PATH = r"c:\Users\LENOVO\Desktop\Lets Explore\sight-sound-walk-main\src\data\arModels.ts"

with open(AR_MODELS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# For each model, insert glbUrl: "/models/{id}.glb" if not already present
def add_glb_url(match):
    block = match.group(0)
    id_match = re.search(r'id:\s*"([^"]+)"', block)
    if id_match:
        m_id = id_match.group(1)
        if 'glbUrl:' not in block:
            # Insert after description
            insert_str = f'\n    glbUrl: "/models/{m_id}.glb",'
            block = re.sub(r'(description:\s*"[^"]*",?)', r'\1' + insert_str, block)
    return block

# Match each object in arModels array
pattern = r'\{\s*id:\s*"[^"]+"[\s\S]*?credit:\s*\{[^}]+\},?\s*\}'
new_content = re.sub(pattern, add_glb_url, content)

with open(AR_MODELS_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated arModels.ts with local glbUrls.")
