import os
import re

BASE_DIR = r"c:\Users\LENOVO\Desktop\Lets Explore\sight-sound-walk-main"

# 1. index.html
index_html_path = os.path.join(BASE_DIR, "index.html")
with open(index_html_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("<title>Lets Explore", "<title>Let's Explore")
content = content.replace('content="Lets Explore', 'content="Let\'s Explore')
with open(index_html_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html")

# 2. vite.config.ts
vite_config_path = os.path.join(BASE_DIR, "vite.config.ts")
with open(vite_config_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('name: "Lets Explore', 'name: "Let\'s Explore')
content = content.replace('short_name: "LetsExplore"', 'short_name: "Let\'s Explore"')
with open(vite_config_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated vite.config.ts")

# 3. RouteMeta.tsx
route_meta_path = os.path.join(BASE_DIR, "src", "components", "RouteMeta.tsx")
with open(route_meta_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore", "Let's Explore")
with open(route_meta_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated RouteMeta.tsx")

# 4. Navigation.tsx
nav_path = os.path.join(BASE_DIR, "src", "components", "Navigation.tsx")
with open(nav_path, "r", encoding="utf-8") as f:
    content = f.read()
content = re.sub(
    r'Sight<span className="text-primary font-black">Sound</span>Walk',
    r'Let&apos;s<span className="text-primary font-black"> Explore</span>',
    content
)
content = content.replace("Lets Explore", "Let&apos;s Explore")
with open(nav_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Navigation.tsx")

# 5. Hero.tsx
hero_path = os.path.join(BASE_DIR, "src", "components", "Hero.tsx")
with open(hero_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore", "Let's Explore")
with open(hero_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Hero.tsx")

# 6. Footer.tsx
footer_path = os.path.join(BASE_DIR, "src", "components", "landing", "Footer.tsx")
with open(footer_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore, Inc.", "Let's Explore, Inc.")
with open(footer_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Footer.tsx")

# 7. CTASection.tsx
cta_path = os.path.join(BASE_DIR, "src", "components", "landing", "CTASection.tsx")
with open(cta_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore —", "Let's Explore —")
with open(cta_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated CTASection.tsx")

# 8. BentoFeatures.tsx
bento_path = os.path.join(BASE_DIR, "src", "components", "landing", "BentoFeatures.tsx")
with open(bento_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Sight-Sound-Walk", "Let's Explore")
with open(bento_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated BentoFeatures.tsx")

# 9. MonumentFlashCard.tsx
flashcard_path = os.path.join(BASE_DIR, "src", "components", "MonumentFlashCard.tsx")
with open(flashcard_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Sight-Sound-Walk", "Let's Explore")
with open(flashcard_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated MonumentFlashCard.tsx")

# 10. Auth.tsx
auth_path = os.path.join(BASE_DIR, "src", "pages", "Auth.tsx")
with open(auth_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore", "Let's Explore")
with open(auth_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Auth.tsx")

# 11. Help.tsx
help_path = os.path.join(BASE_DIR, "src", "pages", "Help.tsx")
with open(help_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore", "Let's Explore")
with open(help_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Help.tsx")

# 12. AccessibilityPage.tsx
acc_path = os.path.join(BASE_DIR, "src", "pages", "more", "AccessibilityPage.tsx")
with open(acc_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("Lets Explore", "Let's Explore")
with open(acc_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AccessibilityPage.tsx")

# 13. MCP
mcp_index = os.path.join(BASE_DIR, "src", "lib", "mcp", "index.ts")
if os.path.exists(mcp_index):
    with open(mcp_index, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("Lets Explore", "Let's Explore")
    with open(mcp_index, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated mcp/index.ts")

mcp_tool = os.path.join(BASE_DIR, "src", "lib", "mcp", "tools", "search-monuments.ts")
if os.path.exists(mcp_tool):
    with open(mcp_tool, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("Lets Explore", "Let's Explore")
    with open(mcp_tool, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated search-monuments.ts")

# 14. api/index.py
api_index = os.path.join(BASE_DIR, "api", "index.py")
if os.path.exists(api_index):
    with open(api_index, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("Lets Explore - Educational Tourism AI API", "Let's Explore - Educational Tourism AI API")
    with open(api_index, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated api/index.py")

print("All branding successfully renamed to \"Let's Explore\"!")
