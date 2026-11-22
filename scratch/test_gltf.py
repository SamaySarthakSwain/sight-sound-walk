import numpy as np
import struct
from pygltflib import GLTF2, Scene, Node, Mesh, Primitive, Buffer, BufferView, Accessor, Material, PbrMetallicRoughness

print("Testing pygltflib...")
gltf = GLTF2()
print("GLTF2 initialized successfully")
