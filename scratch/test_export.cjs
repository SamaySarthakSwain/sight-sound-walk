const fs = require('fs');
const path = require('path');

// Mock browser globals if needed for GLTFExporter in Node
if (typeof global.self === 'undefined') global.self = global;
if (typeof global.window === 'undefined') global.window = global;

async function testExport() {
  const THREE = await import('three');
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.3 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (gltf) => {
      const buffer = Buffer.from(gltf);
      const outPath = path.resolve('sight-sound-walk-main/public/models/test_cube.glb');
      fs.writeFileSync(outPath, buffer);
      console.log('Successfully wrote test_cube.glb, size:', buffer.length);
    },
    (error) => {
      console.error('Error during export:', error);
    },
    { binary: true }
  );
}

testExport().catch(console.error);
