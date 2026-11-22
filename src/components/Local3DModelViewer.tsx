import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCw, ShieldCheck, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Local3DModelViewerProps {
  glbUrl: string;
  name: string;
  className?: string;
}

export const Local3DModelViewer = ({ glbUrl, name, className = "" }: Local3DModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1117);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      1000
    );
    camera.position.set(0, 5, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't allow flipping under ground
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5ea, 2.0);
    dirLight1.position.set(10, 20, 15);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4e4ff, 1.0);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0xff8800, 0x334466);
    grid.position.y = -0.01;
    scene.add(grid);

    // Load GLB
    const loader = new GLTFLoader();
    let loadedModel: THREE.Group | null = null;

    loader.load(
      glbUrl,
      (gltf) => {
        if (!isMounted) return;
        loadedModel = gltf.scene;

        // Auto-center and normalize scale
        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 6.0;
        const scale = targetSize / (maxDim || 1);
        loadedModel.scale.setScalar(scale);

        const center = new THREE.Vector3();
        box.getCenter(center);
        loadedModel.position.x = -center.x * scale;
        loadedModel.position.y = -box.min.y * scale;
        loadedModel.position.z = -center.z * scale;

        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(loadedModel);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load GLB from ${glbUrl}:`, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    );

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.autoRotate = autoRotate;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / (container.clientHeight || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [glbUrl, autoRotate]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-slate-950 ${className}`}>
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-3" />
          <span className="text-xs text-amber-300 font-mono tracking-wide">
            Loading Local 3D Model…
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-4 text-center z-20">
          <Box className="h-10 w-10 text-amber-500/60 mb-2" />
          <p className="text-sm font-medium text-slate-200">Local 3D Preview</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Model archived in database. Switch to Cloud View or VR mode.
          </p>
        </div>
      )}

      {/* Offline Database Badge */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
        <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 gap-1 backdrop-blur-md shadow-lg">
          <ShieldCheck className="h-3 w-3" />
          Database Archived (Offline Safe)
        </Badge>
      </div>

      {/* Auto Rotate Control Button */}
      <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg border text-xs backdrop-blur-md transition-all shadow-md ${
            autoRotate
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-slate-900/70 text-slate-400 border-slate-700 hover:text-slate-200"
          }`}
          title={autoRotate ? "Pause Auto Rotation" : "Resume Auto Rotation"}
        >
          <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
        </button>
      </div>
    </div>
  );
};

export default Local3DModelViewer;
