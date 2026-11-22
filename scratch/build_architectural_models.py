import os
import numpy as np
import trimesh

OUTPUT_DIR = r"c:\Users\LENOVO\Desktop\Lets Explore\sight-sound-walk-main\public\models"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def color_mesh(mesh, rgba):
    mesh.visual.vertex_colors = [rgba] * len(mesh.vertices)
    return mesh

def make_box(extents, translation, rgba):
    box = trimesh.creation.box(extents=extents)
    box.apply_translation(translation)
    return color_mesh(box, rgba)

def make_cylinder(radius, height, translation, rgba, sections=32):
    cyl = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
    cyl.apply_translation(translation)
    return color_mesh(cyl, rgba)

def make_cone(radius, height, translation, rgba, sections=32):
    cone = trimesh.creation.cone(radius=radius, height=height, sections=sections)
    cone.apply_translation(translation)
    return color_mesh(cone, rgba)

def make_sphere(radius, translation, rgba, subdivisions=2):
    sph = trimesh.creation.icosphere(radius=radius, subdivisions=subdivisions)
    sph.apply_translation(translation)
    return color_mesh(sph, rgba)

# -------------------------------------------------------------
# 1. India Gate (New Delhi)
# Sandstone triumphal arch (42m high), stepped base, central barrel vault, attic pediment, top urn
# -------------------------------------------------------------
def build_india_gate():
    parts = []
    # Palette: Bharatpur pale red & pale yellow sandstone
    c_red_stone = [188, 114, 82, 255]
    c_yellow_stone = [224, 182, 134, 255]
    c_dark_stone = [145, 85, 60, 255]
    c_gold = [218, 165, 32, 255]

    # Stepped plinth base
    parts.append(make_box([22, 1.2, 14], [0, 0.6, 0], c_dark_stone))
    parts.append(make_box([20, 1.0, 12], [0, 1.7, 0], c_yellow_stone))
    parts.append(make_box([18.5, 0.8, 10.5], [0, 2.6, 0], c_red_stone))

    # Main Pylons (Left & Right)
    pylon_w, pylon_d, pylon_h = 5.2, 8.5, 16.0
    # Left Pylon
    parts.append(make_box([pylon_w, pylon_h, pylon_d], [-6.4, 3.0 + pylon_h/2, 0], c_yellow_stone))
    # Right Pylon
    parts.append(make_box([pylon_w, pylon_h, pylon_d], [6.4, 3.0 + pylon_h/2, 0], c_yellow_stone))

    # Pylon decorative horizontal bands & rustication
    for y_band in [6.0, 10.0, 14.0, 18.0]:
        parts.append(make_box([5.4, 0.4, 8.7], [-6.4, y_band, 0], c_red_stone))
        parts.append(make_box([5.4, 0.4, 8.7], [6.4, y_band, 0], c_red_stone))

    # Transverse small arches in pylons
    parts.append(make_box([1.8, 6.0, 8.8], [-6.4, 6.0, 0], c_dark_stone))
    parts.append(make_box([1.8, 6.0, 8.8], [6.4, 6.0, 0], c_dark_stone))

    # Arch Intrados & Vault keystone
    arch_span = 7.6
    parts.append(make_box([arch_span, 1.5, 8.5], [0, 18.2, 0], c_red_stone))
    parts.append(make_box([2.0, 2.2, 8.7], [0, 18.5, 0], c_gold)) # Keystone

    # Entablature and lower cornice
    parts.append(make_box([19.5, 1.4, 9.5], [0, 19.7, 0], c_dark_stone))
    parts.append(make_box([19.0, 0.8, 9.0], [0, 20.8, 0], c_yellow_stone))

    # Upper Attic Storey (inscribed attic)
    parts.append(make_box([16.5, 4.5, 7.8], [0, 23.45, 0], c_red_stone))
    parts.append(make_box([17.0, 0.6, 8.2], [0, 26.0, 0], c_yellow_stone))

    # Crown bowl / shallow dome urn on top
    parts.append(make_cylinder(3.0, 0.8, [0, 26.7, 0], c_dark_stone, sections=36))
    parts.append(make_cylinder(2.4, 0.6, [0, 27.4, 0], c_gold, sections=36))
    parts.append(make_sphere(1.2, [0, 28.2, 0], c_gold))

    # Amar Jawan Jyoti canopy & flame base at center
    parts.append(make_box([2.8, 0.4, 2.8], [0, 3.2, 0], [40, 40, 40, 255]))
    parts.append(make_cylinder(0.4, 1.2, [0, 4.0, 0], [30, 30, 30, 255], sections=16))
    parts.append(make_cone(0.5, 1.0, [0, 4.8, 0], [255, 120, 0, 255], sections=16)) # Flame

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 2. Charminar (Hyderabad)
# 4 Grand Arches, square central mosque structure, 4 monumental 4-tiered fluted minarets (48.7m)
# -------------------------------------------------------------
def build_charminar():
    parts = []
    c_granite = [205, 190, 175, 255]
    c_trim = [170, 150, 135, 255]
    c_dome = [240, 235, 220, 255]
    c_gold = [218, 165, 32, 255]
    c_arch_dark = [90, 80, 75, 255]

    # Base Plinth
    parts.append(make_box([20, 1.2, 20], [0, 0.6, 0], c_trim))

    # Central Square Hall Block (with four 11m arch openings)
    # 4 Corner Piers
    pier_w = 4.2
    for px in [-6.5, 6.5]:
        for pz in [-6.5, 6.5]:
            parts.append(make_box([pier_w, 14.0, pier_w], [px, 8.2, pz], c_granite))

    # Spanned Grand Arches top lintels
    parts.append(make_box([9.0, 3.0, 3.8], [0, 13.7, -6.5], c_granite))
    parts.append(make_box([9.0, 3.0, 3.8], [0, 13.7, 6.5], c_granite))
    parts.append(make_box([3.8, 3.0, 9.0], [-6.5, 13.7, 0], c_granite))
    parts.append(make_box([3.8, 3.0, 9.0], [6.5, 13.7, 0], c_granite))

    # Second Floor Gallery & Balcony (with jali double screens)
    parts.append(make_box([18.5, 2.2, 18.5], [0, 16.3, 0], c_trim))
    parts.append(make_box([17.5, 3.5, 17.5], [0, 19.15, 0], c_granite))
    # Balcony projection
    parts.append(make_box([18.8, 0.8, 18.8], [0, 21.3, 0], c_trim))

    # Third Storey Mosque Arcade & Decorative battlements
    parts.append(make_box([16.0, 3.0, 16.0], [0, 23.2, 0], c_granite))
    parts.append(make_box([16.6, 0.6, 16.6], [0, 25.0, 0], c_gold))

    # 4 Iconic Fluted Minarets at 4 Corners
    for mx in [-7.5, 7.5]:
        for mz in [-7.5, 7.5]:
            # Minaret Tier 1
            parts.append(make_cylinder(1.6, 16.0, [mx, 9.2, mz], c_granite, sections=24))
            # Balcony 1
            parts.append(make_cylinder(2.1, 0.6, [mx, 17.5, mz], c_trim, sections=24))
            # Minaret Tier 2
            parts.append(make_cylinder(1.4, 7.0, [mx, 21.3, mz], c_granite, sections=24))
            # Balcony 2
            parts.append(make_cylinder(1.8, 0.5, [mx, 25.0, mz], c_trim, sections=24))
            # Minaret Tier 3
            parts.append(make_cylinder(1.2, 5.0, [mx, 27.75, mz], c_granite, sections=24))
            # Balcony 3
            parts.append(make_cylinder(1.5, 0.5, [mx, 30.5, mz], c_trim, sections=24))
            # Bulbous Dome Crown
            parts.append(make_sphere(1.3, [mx, 31.8, mz], c_dome))
            # Gold Finial Spire
            parts.append(make_cone(0.4, 1.8, [mx, 33.5, mz], c_gold, sections=16))

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 3. Gateway of India (Mumbai)
# Indo-Saracenic basalt arch (26m high), central arch 15m, 4 corner turrets, jali screens
# -------------------------------------------------------------
def build_gateway_of_india():
    parts = []
    c_basalt = [198, 178, 142, 255] # Yellow basalt
    c_trim = [160, 140, 110, 255]
    c_dome = [210, 190, 155, 255]
    c_dark = [95, 80, 65, 255]
    c_gold = [218, 165, 32, 255]

    # Stepped Foundation on Mumbai Waterfront
    parts.append(make_box([26, 1.0, 16], [0, 0.5, 0], c_trim))
    parts.append(make_box([24, 0.8, 14], [0, 1.4, 0], c_basalt))

    # Main Pylons & Side Wings
    # Left side wing
    parts.append(make_box([6.5, 13.0, 11.0], [-7.5, 8.3, 0], c_basalt))
    # Right side wing
    parts.append(make_box([6.5, 13.0, 11.0], [7.5, 8.3, 0], c_basalt))

    # Side Arches in wings
    parts.append(make_box([2.6, 7.0, 11.2], [-7.5, 6.0, 0], c_dark))
    parts.append(make_box([2.6, 7.0, 11.2], [7.5, 6.0, 0], c_dark))

    # Central Grand Arch Lintel (15m high clearance)
    parts.append(make_box([8.6, 3.2, 11.0], [0, 13.2, 0], c_basalt))
    parts.append(make_box([8.8, 0.8, 11.4], [0, 15.2, 0], c_trim))

    # Upper Gallery & Intricate Jali Screen Balustrade
    parts.append(make_box([23.5, 3.5, 10.5], [0, 17.35, 0], c_basalt))
    parts.append(make_box([24.2, 0.6, 11.0], [0, 19.4, 0], c_trim))

    # Central Octagonal Dome & Chhatri Pavilion
    parts.append(make_cylinder(3.8, 1.8, [0, 20.6, 0], c_basalt, sections=8))
    parts.append(make_sphere(3.7, [0, 22.4, 0], c_dome))
    parts.append(make_cone(0.5, 2.0, [0, 26.5, 0], c_gold, sections=16))

    # 4 Corner Turret Chhatris with domes
    for tx in [-10.8, 10.8]:
        for tz in [-4.5, 4.5]:
            # Turret shaft
            parts.append(make_cylinder(1.0, 4.0, [tx, 20.0, tz], c_basalt, sections=16))
            # Cupola dome
            parts.append(make_sphere(1.2, [tx, 22.4, tz], c_dome))
            # Finial
            parts.append(make_cone(0.25, 1.0, [tx, 24.0, tz], c_gold, sections=12))

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 4. Brihadeeshwara Temple (Thanjavur)
# Great Living Chola Temple with 66m stepped Vimana tower (13 tiers), monolithic octagonal capstone
# -------------------------------------------------------------
def build_brihadeeshwara():
    parts = []
    c_granite = [178, 148, 120, 255]
    c_trim = [148, 118, 92, 255]
    c_gold_kalasam = [228, 180, 45, 255]

    # Grand Temple Sanctum Plinth (Upapitha & Adhisthana)
    parts.append(make_box([24, 1.6, 24], [0, 0.8, 0], c_trim))
    parts.append(make_box([21, 1.4, 21], [0, 2.3, 0], c_granite))

    # Sanctum Garbhagriha walls (2-storey vertical base with niches & pilasters)
    parts.append(make_box([18, 7.0, 18], [0, 6.5, 0], c_granite))
    # Cornice over vertical sanctum
    parts.append(make_box([19.2, 1.0, 19.2], [0, 10.5, 0], c_trim))

    # 13-Tier Stepped Pyramidal Vimana Tower
    base_dim = 16.5
    y_current = 11.5
    tier_height = 1.3
    num_tiers = 13
    for i in range(num_tiers):
        dim = base_dim * (1.0 - (i / (num_tiers + 2)))
        parts.append(make_box([dim, tier_height, dim], [0, y_current + tier_height/2, 0], c_granite if i % 2 == 0 else c_trim))
        y_current += tier_height

    # Griva (Neck)
    parts.append(make_cylinder(4.0, 1.8, [0, y_current + 0.9, 0], c_trim, sections=16))
    y_current += 1.8

    # Monolithic 80-tonne Octagonal Shikhara Dome (Kumbam)
    parts.append(make_sphere(4.2, [0, y_current + 2.0, 0], c_granite))
    y_current += 4.0

    # Solid Gold Stupi / Kalasam Finial
    parts.append(make_cylinder(1.0, 1.2, [0, y_current + 0.6, 0], c_gold_kalasam, sections=16))
    parts.append(make_cone(0.8, 2.2, [0, y_current + 2.3, 0], c_gold_kalasam, sections=16))

    # Nandi Mandapa front entrance pillared porch
    parts.append(make_box([10, 4.5, 12], [0, 3.5, 16], c_granite))
    # Pillars
    for px in [-4, 4]:
        for pz in [12, 16, 20]:
            parts.append(make_cylinder(0.6, 4.5, [px, 3.5, pz], c_trim, sections=16))

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 5. Rani Ki Vav (Patan, Gujarat)
# Inverted underground stepwell with descending stepped galleries, carved pavilion corridors
# -------------------------------------------------------------
def build_rani_ki_vav():
    parts = []
    c_sandstone = [215, 175, 130, 255]
    c_shadow = [140, 105, 75, 255]
    c_water = [60, 130, 170, 220]
    c_ornament = [190, 150, 110, 255]

    # Ground level rim
    parts.append(make_box([32, 1.0, 22], [0, 0.5, 0], c_sandstone))
    # Stepped Terraces descending downward (Inverted Stepwell)
    tiers = 5
    for t in range(tiers):
        depth = (t + 1) * 2.8
        tier_w = 26 - t * 3.8
        tier_l = 16 - t * 2.2
        # Side retention retaining walls with niches
        parts.append(make_box([tier_w, 2.8, 2.0], [0, -depth + 1.4, -(tier_l/2 + 1.0)], c_sandstone))
        parts.append(make_box([tier_w, 2.8, 2.0], [0, -depth + 1.4, (tier_l/2 + 1.0)], c_sandstone))
        parts.append(make_box([2.0, 2.8, tier_l], [-(tier_w/2 + 1.0), -depth + 1.4, 0], c_sandstone))
        parts.append(make_box([2.0, 2.8, tier_l], [(tier_w/2 + 1.0), -depth + 1.4, 0], c_sandstone))

        # Colonnaded Pavilion Pillars on landings
        for px in [-tier_w*0.35, 0, tier_w*0.35]:
            parts.append(make_cylinder(0.45, 2.8, [px, -depth + 1.4, -tier_l*0.3], c_ornament, sections=16))
            parts.append(make_cylinder(0.45, 2.8, [px, -depth + 1.4, tier_l*0.3], c_ornament, sections=16))

        # Steps descending into well
        for s in range(4):
            parts.append(make_box([tier_w * 0.4, 0.7, 0.6], [0, -depth + 0.35 + s*0.7, -tier_l*0.4 + s*0.6], c_shadow))

    # Bottom Well Shaft & Sacred Reservoir Pool
    parts.append(make_cylinder(3.5, 2.5, [0, -tiers*2.8 - 1.25, 0], c_shadow, sections=24))
    parts.append(make_cylinder(3.2, 0.4, [0, -tiers*2.8 - 0.2, 0], c_water, sections=24)) # Water surface

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 6. Ajanta Cave 01 (Aurangabad, Maharashtra)
# Rock-cut Buddhist chaitya facade with colonnade, chaitya arch, sculpted sanctuary
# -------------------------------------------------------------
def build_ajanta_cave():
    parts = []
    c_basalt_rock = [120, 110, 100, 255]
    c_verandah_trim = [160, 145, 130, 255]
    c_interior = [40, 35, 30, 255]
    c_buddha_gold = [218, 175, 55, 255]

    # Mountain Cliff Face Framing
    parts.append(make_box([30, 18, 5], [0, 9, -6], c_basalt_rock))
    parts.append(make_box([32, 4, 18], [0, 18, 2], c_basalt_rock))
    parts.append(make_box([6, 18, 18], [-13, 9, 2], c_basalt_rock))
    parts.append(make_box([6, 18, 18], [13, 9, 2], c_basalt_rock))

    # Cave Courtyard Platform
    parts.append(make_box([22, 1.2, 14], [0, 0.6, 2], c_verandah_trim))

    # Colonnade of Carved Octagonal Pillars (Front Verandah)
    num_pillars = 6
    x_positions = np.linspace(-8, 8, num_pillars)
    for px in x_positions:
        # Plinth
        parts.append(make_box([1.4, 0.8, 1.4], [px, 1.6, 5], c_verandah_trim))
        # Octagonal shaft
        parts.append(make_cylinder(0.55, 6.0, [px, 5.0, 5], c_verandah_trim, sections=8))
        # Bracket Capital
        parts.append(make_box([1.6, 0.9, 1.6], [px, 8.45, 5], c_verandah_trim))

    # Entablature and Chaitya horseshoe frieze band
    parts.append(make_box([20, 2.0, 3], [0, 9.9, 5], c_basalt_rock))

    # Inner Hall Sanctuary Cave
    parts.append(make_box([18, 8.0, 8], [0, 5.2, -1], c_interior))

    # Seated Buddha Statue in Sanctum
    parts.append(make_cylinder(1.5, 0.8, [0, 1.6, -3], c_verandah_trim, sections=16)) # Lotus pedestal
    parts.append(make_box([1.8, 1.8, 1.2], [0, 2.9, -3], c_buddha_gold)) # Torso
    parts.append(make_sphere(0.65, [0, 4.3, -3], c_buddha_gold)) # Head
    parts.append(make_sphere(0.9, [0, 4.3, -3.5], c_buddha_gold)) # Halo Prabhamandala

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 7. Hampi Stone Chariot (Vittala Temple, Karnataka)
# Monolithic granite chariot, four spoked stone wheels, elephant sentinels, stepped vimana roof
# -------------------------------------------------------------
def build_hampi_chariot():
    parts = []
    c_granite = [185, 175, 160, 255]
    c_trim = [150, 140, 125, 255]
    c_gold = [218, 175, 60, 255]

    # Paved Temple Courtyard Base
    parts.append(make_box([16, 0.8, 18], [0, 0.4, 0], c_trim))

    # Chariot Main Body Plinth (with ornate friezes of soldiers, dancers & horses)
    parts.append(make_box([7.2, 1.8, 9.5], [0, 1.7, 0], c_granite))
    parts.append(make_box([7.6, 0.6, 10.0], [0, 2.9, 0], c_trim))

    # 4 Carved Granite Spoked Wheels
    wheel_radius = 1.6
    wheel_thick = 0.55
    wheel_y = 1.7
    wheel_positions = [
        (-4.0, wheel_y, -3.0),
        (-4.0, wheel_y, 3.0),
        (4.0, wheel_y, -3.0),
        (4.0, wheel_y, 3.0)
    ]
    for wx, wy, wz in wheel_positions:
        # Wheel rim (Cylinder oriented sideways along X)
        wheel = trimesh.creation.cylinder(radius=wheel_radius, height=wheel_thick, sections=24)
        wheel.apply_transform(trimesh.transformations.rotation_matrix(np.pi/2, [0, 0, 1]))
        wheel.apply_translation([wx, wy, wz])
        parts.append(color_mesh(wheel, c_trim))
        # Central Hub
        hub = trimesh.creation.cylinder(radius=0.5, height=wheel_thick + 0.3, sections=16)
        hub.apply_transform(trimesh.transformations.rotation_matrix(np.pi/2, [0, 0, 1]))
        hub.apply_translation([wx, wy, wz])
        parts.append(color_mesh(hub, c_gold))

    # Garuda Shrine Superstructure (Central Sanctum of Chariot)
    parts.append(make_box([5.4, 4.2, 6.8], [0, 5.3, -0.5], c_granite))
    # 4 Pillars around shrine
    for px in [-2.4, 2.4]:
        for pz in [-3.2, 2.4]:
            parts.append(make_cylinder(0.35, 4.2, [px, 5.3, pz], c_trim, sections=16))

    # Stepped Dravidian Vimana Roof on Chariot
    parts.append(make_box([6.0, 1.0, 7.4], [0, 7.9, -0.5], c_trim))
    parts.append(make_box([4.8, 1.2, 6.0], [0, 9.0, -0.5], c_granite))
    parts.append(make_box([3.6, 1.0, 4.6], [0, 10.1, -0.5], c_trim))
    # Kalasam Finial
    parts.append(make_sphere(1.0, [0, 11.2, -0.5], c_gold))
    parts.append(make_cone(0.4, 1.2, [0, 12.3, -0.5], c_gold, sections=16))

    # Two Guardian Elephants in Front of Chariot
    for ex in [-1.8, 1.8]:
        parts.append(make_box([1.4, 2.0, 2.6], [ex, 1.8, 5.8], c_trim)) # Elephant body
        parts.append(make_cylinder(0.45, 1.6, [ex, 2.0, 7.3], c_trim, sections=16)) # Trunk/head

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 8. Amaravati Buddhist Relief (Amaravati, Andhra Pradesh)
# Stupa carved relief stela, Great Stupa medallions, Dharma Wheel, Lotus rosette band
# -------------------------------------------------------------
def build_amaravati_relief():
    parts = []
    c_limestone = [230, 222, 210, 255] # Palnad limestone
    c_carving = [180, 170, 160, 255]
    c_gold = [218, 165, 32, 255]

    # Pedestal display base
    parts.append(make_box([8.0, 1.2, 4.0], [0, 0.6, 0], [60, 50, 45, 255]))

    # Double-Sided Relief Slab (Stele)
    parts.append(make_box([6.5, 9.5, 0.8], [0, 5.95, 0], c_limestone))

    # Stupa Relief Medallions (Circular carved panels)
    # Lower Medallion
    parts.append(make_cylinder(1.8, 0.25, [0, 3.8, 0.45], c_carving, sections=36))
    # Center Lotus Rosette
    parts.append(make_sphere(0.5, [0, 3.8, 0.58], c_gold))

    # Middle Frieze Band (Jataka scenes)
    parts.append(make_box([5.8, 1.4, 0.2], [0, 6.2, 0.45], c_carving))

    # Upper Medallion (Dharmachakra Wheel of Law)
    parts.append(make_cylinder(1.6, 0.25, [0, 8.4, 0.45], c_carving, sections=36))
    parts.append(make_cone(0.4, 0.6, [0, 8.4, 0.6], c_gold, sections=16))

    # Ornate Border Mouldings
    parts.append(make_box([0.5, 9.5, 0.25], [-3.1, 5.95, 0.45], c_carving))
    parts.append(make_box([0.5, 9.5, 0.25], [3.1, 5.95, 0.45], c_carving))
    parts.append(make_box([6.7, 0.6, 0.25], [0, 10.7, 0.45], c_carving))

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 9. Ancient Rajmahal Palace (Rajasthan)
# Fortified royal palace with sandstone battlements, fluted projecting jharokha balconies, domed chhatris
# -------------------------------------------------------------
def build_ancient_rajmahal():
    parts = []
    c_sandstone = [225, 170, 115, 255]
    c_trim = [190, 135, 85, 255]
    c_white_marble = [245, 240, 235, 255]
    c_gold = [225, 180, 40, 255]

    # Elevated Palace Plinth / Courtyard
    parts.append(make_box([24, 1.8, 18], [0, 0.9, 0], c_trim))

    # Ground Level Fortified Palace Façade
    parts.append(make_box([20, 6.0, 14], [0, 4.8, 0], c_sandstone))
    # Grand Arched Gateway
    parts.append(make_box([4.2, 4.5, 2.0], [0, 4.0, 7.1], [50, 40, 30, 255]))

    # First Floor Palace Living Quarters
    parts.append(make_box([18, 5.0, 12], [0, 10.3, 0], c_sandstone))

    # Projecting Jharokha Balconies (Ornate screened balconies with brackets)
    for bx in [-6.0, 0.0, 6.0]:
        # Balcony bracket
        parts.append(make_box([2.4, 0.8, 1.8], [bx, 8.4, 6.8], c_trim))
        # Balcony screened body
        parts.append(make_box([2.2, 2.2, 1.6], [bx, 9.9, 6.8], c_white_marble))
        # Bangaldar curved roof over jharokha
        parts.append(make_box([2.6, 0.6, 2.0], [bx, 11.3, 6.8], c_trim))

    # Second Storey Pavilion & Terrace
    parts.append(make_box([14, 3.8, 9], [0, 14.7, 0], c_sandstone))

    # Corner and Center Rajput Chhatri Pavilions (Domed pavilions)
    chhatri_positions = [
        (-8.0, 13.0, -5.5),
        (-8.0, 13.0, 5.5),
        (8.0, 13.0, -5.5),
        (8.0, 13.0, 5.5),
        (0.0, 16.8, 0.0) # Central royal baradari chhatri
    ]
    for cx, cy, cz in chhatri_positions:
        # 4 slender pillars
        for dx in [-0.9, 0.9]:
            for dz in [-0.9, 0.9]:
                parts.append(make_cylinder(0.18, 2.5, [cx+dx, cy+1.25, cz+dz], c_white_marble, sections=12))
        # Dome cupola
        parts.append(make_sphere(1.4, [cx, cy+2.9, cz], c_white_marble))
        # Gold kalasam
        parts.append(make_cone(0.25, 1.0, [cx, cy+4.4, cz], c_gold, sections=12))

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 10. Mahabodhi Temple (Bodh Gaya, Bihar)
# 55m Stepped pyramidal Shikhara tower, four corner sub-towers, Amalaka finial, Bodhi sanctuary
# -------------------------------------------------------------
def build_mahabodhi_temple():
    parts = []
    c_brick_stucco = [200, 175, 140, 255]
    c_gold = [228, 185, 45, 255]
    c_trim = [160, 135, 105, 255]

    # Platform Base (Vajrasana terrace)
    parts.append(make_box([22, 1.6, 22], [0, 0.8, 0], c_trim))
    parts.append(make_box([18, 2.0, 18], [0, 2.6, 0], c_brick_stucco))

    # Main Sanctum Lower Storey
    parts.append(make_box([15, 6.0, 15], [0, 6.6, 0], c_brick_stucco))
    # Niche arcade mouldings
    parts.append(make_box([15.8, 0.8, 15.8], [0, 9.8, 0], c_trim))

    # Grand Central Pyramidal Shikhara (Stepped soaring tower)
    base_w = 12.0
    y_pos = 10.2
    steps = 14
    for s in range(steps):
        w = base_w * (1.0 - (s / (steps + 3)))
        h = 1.3
        parts.append(make_box([w, h, w], [0, y_pos + h/2, 0], c_brick_stucco if s % 2 == 0 else c_trim))
        y_pos += h

    # Amalaka (Ribbed stone disc crown)
    parts.append(make_cylinder(2.6, 1.2, [0, y_pos + 0.6, 0], c_trim, sections=24))
    y_pos += 1.2

    # Golden Stupa & Chhatravali Finial
    parts.append(make_sphere(2.0, [0, y_pos + 1.6, 0], c_gold))
    y_pos += 3.2
    parts.append(make_cone(0.8, 2.4, [0, y_pos + 1.2, 0], c_gold, sections=16))

    # Four Corner Sub-Towers (Corner Shikharas)
    for cx in [-5.8, 5.8]:
        for cz in [-5.8, 5.8]:
            # Mini tower tiers
            cy = 10.0
            for ms in range(6):
                mw = 3.2 * (1.0 - (ms / 9.0))
                parts.append(make_box([mw, 1.1, mw], [cx, cy + 0.55, cz], c_brick_stucco))
                cy += 1.1
            # Mini amalaka & spire
            parts.append(make_cylinder(1.0, 0.5, [cx, cy + 0.25, cz], c_gold, sections=16))
            parts.append(make_cone(0.4, 1.2, [cx, cy + 1.1, cz], c_gold, sections=16))

    return trimesh.Scene(parts)

# -------------------------------------------------------------
# 11. Mahabaleshwar Temple Walls (Maharashtra)
# Intricately carved stone relief temple wall section with elephant frieze bands and pilasters
# -------------------------------------------------------------
def build_temple_walls():
    parts = []
    c_stone = [165, 150, 135, 255]
    c_relief = [140, 125, 110, 255]
    c_dark = [105, 95, 85, 255]

    # Plinth Base (Adhisthana)
    parts.append(make_box([18, 1.2, 4.0], [0, 0.6, 0], c_dark))
    parts.append(make_box([17.5, 0.8, 3.6], [0, 1.6, 0], c_stone))

    # Elephant Frieze Band (Gajathara)
    parts.append(make_box([17.2, 1.4, 3.4], [0, 2.7, 0], c_relief))
    # Carved Elephant silhouettes along the plinth
    for ex in np.linspace(-7.0, 7.0, 8):
        parts.append(make_box([1.4, 1.1, 0.6], [ex, 2.7, 1.8], c_stone))

    # Horse & Warrior Frieze (Ashwathara)
    parts.append(make_box([17.0, 1.0, 3.2], [0, 3.9, 0], c_dark))

    # Main Wall Section (Jangha) with sculptured niches & pilasters
    parts.append(make_box([16.5, 6.5, 2.8], [0, 7.65, 0], c_stone))

    # 5 Sculptural Niches (Devakoshthas) with flanking carved pilasters
    for nx in [-6.0, -3.0, 0.0, 3.0, 6.0]:
        # Recessed Niche
        parts.append(make_box([1.8, 4.2, 0.5], [nx, 7.6, 1.4], c_dark))
        # Sculpted figure in niche
        parts.append(make_cylinder(0.45, 3.0, [nx, 7.2, 1.5], c_relief, sections=16))
        parts.append(make_sphere(0.45, [nx, 9.0, 1.5], c_relief))
        # Left and Right Pilasters
        parts.append(make_cylinder(0.25, 4.8, [nx - 1.1, 7.6, 1.5], c_relief, sections=12))
        parts.append(make_cylinder(0.25, 4.8, [nx + 1.1, 7.6, 1.5], c_relief, sections=12))
        # Pediment canopy
        parts.append(make_cone(1.1, 1.2, [nx, 10.4, 1.5], c_stone, sections=8))

    # Overhanging Cornice (Kapota) & Lotus Band
    parts.append(make_box([17.8, 1.2, 3.8], [0, 11.5, 0], c_relief))
    parts.append(make_box([17.2, 0.8, 3.2], [0, 12.5, 0], c_stone))

    return trimesh.Scene(parts)


# -------------------------------------------------------------
# Execute Building & Exporting All Models
# -------------------------------------------------------------
builders = [
    ("india-gate", build_india_gate),
    ("charminar", build_charminar),
    ("gateway-of-india", build_gateway_of_india),
    ("brihadeeshwara", build_brihadeeshwara),
    ("rani-ki-vav", build_rani_ki_vav),
    ("ajanta-cave-01", build_ajanta_cave),
    ("hampi-chariot", build_hampi_chariot),
    ("amaravati-relief", build_amaravati_relief),
    ("ancient-rajmahal", build_ancient_rajmahal),
    ("mahabodhi-temple", build_mahabodhi_temple),
    ("indian-temple-walls", build_temple_walls),
]

for model_id, builder_fn in builders:
    out_file = os.path.join(OUTPUT_DIR, f"{model_id}.glb")
    print(f"Building {model_id} ...")
    try:
        scene = builder_fn()
        glb_data = scene.export(file_type="glb")
        with open(out_file, "wb") as f:
            f.write(glb_data)
        print(f"  -> Successfully generated {model_id}.glb ({len(glb_data)} bytes)")
    except Exception as e:
        print(f"  -> Error generating {model_id}: {e}")
