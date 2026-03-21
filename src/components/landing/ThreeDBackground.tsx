import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeDBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE
    const scene = new THREE.Scene();
    // A dark atmospheric fog
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.03);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 2;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 1. DYNAMIC PARTICLE GLOBE
    const radius = 8;
    const segments = 64;
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    
    // We'll extract vertices from the sphere to create a point cloud
    const positions = geometry.attributes.position.array;
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00a8ff, // Bright sci-fi blue
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const globe = new THREE.Points(particlesGeometry, particlesMaterial);
    
    // Tilt the globe like Earth
    globe.rotation.z = 0.41; 
    scene.add(globe);

    // 2. INNER GLOW SPHERE (To give the earth mass)
    const innerGeo = new THREE.SphereGeometry(radius - 0.1, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x020813, 
      transparent: true,
      opacity: 0.95
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // 3. AMBIENT STARFIELD
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i++) {
        // distribute randomly in a large sphere around the origin
        const r = 30 + Math.random() * 70;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = r * Math.cos(phi);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 4. EQUATORIAL RINGS (Aesthetic data rings)
    const ringGeo1 = new THREE.RingGeometry(radius + 1.5, radius + 1.52, 128);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00a8ff, side: THREE.DoubleSide, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.rotation.y = 0.41; // align with earth tilt
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(radius + 3, radius + 3.01, 128);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = 0.41;
    scene.add(ring2);

    // 5. INTERACTIVITY & ANIMATION
    let mouseX = 0;
    let mouseY = 0;
    
    // Smooth target for camera
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Constant rotation
      globe.rotation.y = elapsedTime * 0.05;
      
      // Floating effect for stars
      stars.rotation.y = elapsedTime * 0.01;
      stars.rotation.x = elapsedTime * 0.005;

      // Spin rings at different speeds
      ring1.rotation.z = -elapsedTime * 0.1;
      ring2.rotation.z = elapsedTime * 0.05;

      // Easing for smooth camera parallax tracking
      targetX = mouseX * 3;
      targetY = mouseY * 2;
      
      camera.position.x += (targetX - camera.position.x) * 0.02;
      // Keep base Y elevation around 2
      camera.position.y += (targetY - camera.position.y + 2) * 0.02;
      
      // Always look at center
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose native resources
      geometry.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 bg-[#0a0a0c] overflow-hidden" />;
};

export default ThreeDBackground;
