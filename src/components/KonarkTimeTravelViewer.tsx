import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ARModel } from "@/data/arModels";
import { X, Gamepad2, ChevronUp, ChevronDown, Sparkles, Volume2, Headset, Cuboid } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Slider } from "@/components/ui/slider";

interface KonarkTimeTravelViewerProps {
  model: ARModel;
  onClose: () => void;
}

const MOVE_SPEED = 2.5;
const DEADZONE = 0.18;

// Simulated narration audio URL (placeholder)
const NARRATION_URL = "https://actions.google.com/sounds/v1/water/rain_on_roof_and_thunder.ogg";

const KonarkTimeTravelViewer = ({ model, onClose }: KonarkTimeTravelViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number>(0);
  const sessionRef = useRef<XRSession | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  
  const [vrSessionActive, setVrSessionActive] = useState(false);
  const [arSessionActive, setArSessionActive] = useState(false);
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Mode: year (1250 to 2024)
  const [year, setYear] = useState<number>(1250);
  const yearRef = useRef<number>(1250);

  // References to animated groups
  const floatingGroupRef = useRef<THREE.Group | null>(null);
  const solidGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const audioRef = useRef<THREE.PositionalAudio | null>(null);

  // References to specific architectural parts that change over time
  const towerRef = useRef<THREE.Mesh | null>(null);
  const idolRef = useRef<THREE.Mesh | null>(null);
  
  useEffect(() => {
    // Mode sync
    yearRef.current = year;
    
    // Background and audio setup (VR mode is inherently present if year < 2000)
    const isVRPhase = year < 2000;
    
    if (floatingGroupRef.current) floatingGroupRef.current.visible = !isVRPhase;
    if (solidGroupRef.current) solidGroupRef.current.visible = true; // Always visible, internal parts toggle
    
    if (sceneRef.current) {
      sceneRef.current.background = isVRPhase ? new THREE.Color(0x87CEEB) : null; 
      sceneRef.current.fog = isVRPhase ? new THREE.FogExp2(0x87CEEB, 0.01) : null;
    }
    
    if (audioRef.current) {
      if (isVRPhase && (vrSessionActive || !arSessionActive)) {
        if (!audioRef.current.isPlaying) audioRef.current.play();
      } else {
        if (audioRef.current.isPlaying) audioRef.current.stop();
      }
    }
  }, [year, vrSessionActive, arSessionActive]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Check capabilities
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then(setVrSupported).catch(() => setVrSupported(false));
      navigator.xr.isSessionSupported("immersive-ar").then(setArSupported).catch(() => setArSupported(false));
    } else {
      setVrSupported(false);
      setArSupported(false);
    }

    // ─── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha true for AR
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ─── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ─── Camera & Audio Listener ────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(72, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 1.6, 5);
    cameraRef.current = camera;
    
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // ─── Lighting ───────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // ─── Konark Elements (Floating AR vs Solid VR) ──────────────────────────
    const floatingGroup = new THREE.Group();
    const solidGroup = new THREE.Group();
    solidGroup.visible = false; // Hidden initially
    scene.add(floatingGroup);
    scene.add(solidGroup);
    floatingGroupRef.current = floatingGroup;
    solidGroupRef.current = solidGroup;

    // Material for ancient stone
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.9,
      metalness: 0.1,
    });

    const goldenMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xffaa00,
      emissiveIntensity: 0.2
    });

    // 1. AR Mode: Floating Pieces
    const pieceGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    for (let i = 0; i < 60; i++) {
      const piece = new THREE.Mesh(pieceGeo, stoneMat);
      // Random position
      piece.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 5 + 1,
        (Math.random() - 0.5) * 10
      );
      // Random rotation
      piece.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      // Store original arbitrary position for animation
      piece.userData = {
        baseY: piece.position.y,
        speed: Math.random() * 0.5 + 0.1,
        offset: Math.random() * Math.PI * 2
      };
      floatingGroup.add(piece);
    }

    // AR Mode: Massive Chariot Wheels
    const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 24);
    const wheels = [];
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeo, stoneMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(i < 2 ? -4 : 4, 1.5, i % 2 === 0 ? -3 : 3);
      floatingGroup.add(wheel);
      wheels.push(wheel);
    }
    wheelsRef.current = wheels;

    // Center focal point for AR (hologram of temple)
    const holoGeo = new THREE.CylinderGeometry(0, 1.5, 3, 4);
    const holoMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
      emissive: 0x0088ff
    });
    const hologram = new THREE.Mesh(holoGeo, holoMat);
    hologram.position.set(0, 1.5, 0);
    floatingGroup.add(hologram);

    // 2. VR Mode: Solid 13th Century Temple
    // Ground
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x556b2f, roughness: 1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    solidGroup.add(ground);

    // Platform
    const platformGeo = new THREE.BoxGeometry(30, 1, 40);
    const platform = new THREE.Mesh(platformGeo, stoneMat);
    platform.position.y = 0.5;
    solidGroup.add(platform);

    // Main Vimana (Tower)
    const towerGeo = new THREE.CylinderGeometry(2, 8, 25, 4);
    const tower = new THREE.Mesh(towerGeo, stoneMat);
    tower.position.set(0, 13, -10);
    tower.rotation.y = Math.PI / 4;
    solidGroup.add(tower);
    towerRef.current = tower;

    // Jagamohana (Porch)
    const porchGeo = new THREE.CylinderGeometry(3, 7, 12, 4);
    const porch = new THREE.Mesh(porchGeo, stoneMat);
    porch.position.set(0, 6.5, 5);
    porch.rotation.y = Math.PI / 4;
    solidGroup.add(porch);

    // VR: Wheels on the platform
    for (let i = 0; i < 12; i++) {
      const wL = new THREE.Mesh(wheelGeo, stoneMat);
      wL.rotation.z = Math.PI / 2;
      wL.position.set(-15, 1.5, -15 + i * 3);
      solidGroup.add(wL);

      const wR = new THREE.Mesh(wheelGeo, stoneMat);
      wR.rotation.z = Math.PI / 2;
      wR.position.set(15, 1.5, -15 + i * 3);
      solidGroup.add(wR);
    }

    // Inner Sanctum (Golden Idol)
    const idolGeo = new THREE.BoxGeometry(1, 2, 1);
    const idol = new THREE.Mesh(idolGeo, goldenMat);
    idol.position.set(0, 2, -10);
    solidGroup.add(idol);
    idolRef.current = idol;

    // Add Positional Audio (Narration) attached to idol
    const positionalAudio = new THREE.PositionalAudio(audioListener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(NARRATION_URL, (buffer) => {
      positionalAudio.setBuffer(buffer);
      positionalAudio.setRefDistance(5);
      positionalAudio.setLoop(true);
      positionalAudio.setVolume(1.0);
    });
    idol.add(positionalAudio);
    audioRef.current = positionalAudio;

    // ─── Animation Loop ─────────────────────────────────────────────────────
    const animate = () => {
      const dt = clockRef.current.getDelta();
      const elapsed = clockRef.current.getElapsedTime();

      // Historical rendering logic based on year
      const currentYear = yearRef.current;
      
      if (towerRef.current) {
        // Tower collapsed around 1628. Let's animate collapse between 1600 and 1650
        if (currentYear < 1600) {
          towerRef.current.visible = true;
          towerRef.current.position.y = 13;
        } else if (currentYear <= 1650) {
          towerRef.current.visible = true;
          const collapseRatio = (currentYear - 1600) / 50;
          towerRef.current.position.y = 13 - (collapseRatio * 15); // Sink it
        } else {
          towerRef.current.visible = false;
        }
      }

      if (idolRef.current) {
        // Idol removed in 16th century to Jagannath Puri
        idolRef.current.visible = currentYear < 1550;
      }

      // Animate AR floating parts only in modern era
      if (currentYear >= 2000 && floatingGroupRef.current) {
        floatingGroupRef.current.children.forEach((child) => {
          if (child.userData.speed) {
            // Float up and down gently, rotating
            child.position.y = child.userData.baseY + Math.sin(elapsed * child.userData.speed + child.userData.offset) * 0.5;
            child.rotation.x += dt * 0.2;
            child.rotation.y += dt * 0.3;
          }
        });
        // Rotate chariot wheels
        wheelsRef.current.forEach(wheel => {
          wheel.rotation.x -= dt * 0.5; // Rolling forward
        });
        hologram.rotation.y += dt * 0.5;
      }

      // ─── Locomotion (Meta Quest 2 / Controllers) ─────────────────────────────
      const xrSession = renderer.xr.getSession();
      if (xrSession) {
        const inputSources = Array.from(xrSession.inputSources);
        for (const source of inputSources) {
          if (!source.gamepad) continue;
          const axes = source.gamepad.axes;
          if (axes.length >= 4) {
            const stickX = axes[2];
            const stickY = axes[3];

            // Forward/Back
            if (Math.abs(stickY) > DEADZONE) {
              const dir = new THREE.Vector3();
              camera.getWorldDirection(dir);
              dir.y = 0;
              dir.normalize();
              camera.position.addScaledVector(dir, -stickY * MOVE_SPEED * dt);
            }

            // Smooth Turn
            if (Math.abs(stickX) > DEADZONE) {
              camera.rotation.y -= stickX * 1.5 * dt;
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // ─── Resize Handler ─────────────────────────────────────────────────────
    const onResize = () => {
      if (!mountRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      if (sessionRef.current) sessionRef.current.end().catch(() => {});
      if (audioRef.current?.isPlaying) audioRef.current.stop();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const startSession = async (mode: 'immersive-ar' | 'immersive-vr') => {
    if (!navigator.xr || !rendererRef.current) return;
    try {
      const session = await navigator.xr.requestSession(mode, {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
        requiredFeatures: mode === 'immersive-ar' ? ["hit-test"] : []
      });
      sessionRef.current = session;
      await rendererRef.current.xr.setSession(session);
      
      if (mode === 'immersive-ar') setArSessionActive(true);
      else setVrSessionActive(true);

      session.addEventListener("end", () => {
        setArSessionActive(false);
        setVrSessionActive(false);
        sessionRef.current = null;
      });

      // Give audio context permission
      const audioCtx = THREE.AudioContext.getContext() as any;
      if (audioCtx && typeof audioCtx.resume === 'function') {
        audioCtx.resume();
      }

    } catch (err) {
      setErrorMsg(`Could not start ${mode} session. Check browser permissions and device capabilities.`);
    }
  };

  const exitSession = async () => {
    if (sessionRef.current) await sessionRef.current.end().catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans">
      <div ref={mountRef} className="flex-1 w-full" />

      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="text-center pointer-events-none">
          <p className="text-white font-bold text-xl drop-shadow flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            {model.name} — Year {year}
          </p>
          <p className="text-yellow-300 text-sm font-medium">
            {year < 1550 ? "Original Glory" : year < 1650 ? "Era of Decline" : year < 2000 ? "Ruins & Conservation" : "Modern Digital Reconstruction"}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Year Timeline Slider */}
      {(!arSessionActive && !vrSessionActive) && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] max-w-2xl bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-2xl pointer-events-auto">
          <div className="flex justify-between text-xs font-semibold text-orange-200 mb-3 px-1">
            <span>1250</span>
            <span>1600</span>
            <span>1900</span>
            <span>2024</span>
          </div>
          <Slider 
            defaultValue={[1250]} 
            min={1250} 
            max={2024} 
            step={1}
            value={[year]}
            onValueChange={(vals) => setYear(vals[0])}
            className="w-full cursor-pointer"
          />
        </div>
      )}

      {/* Bottom Footer UI */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-6 bg-gradient-to-t from-black/90 to-transparent pt-12">
        {errorMsg && <p className="text-red-400 text-sm text-center px-4 mb-2">{errorMsg}</p>}
        
        <div className="flex gap-4">
          {!arSessionActive && !vrSessionActive ? (
            <>
              {arSupported && year >= 2000 && (
                <Button onClick={() => startSession('immersive-ar')} className="px-8 py-6 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg shadow-indigo-900/50">
                  <Cuboid className="h-5 w-5 mr-2" /> Enter AR Mode
                </Button>
              )}
              {vrSupported && year < 2000 && (
                <Button onClick={() => startSession('immersive-vr')} className="px-8 py-6 text-lg font-bold bg-orange-600 hover:bg-orange-500 rounded-full shadow-lg shadow-orange-900/50">
                  <Headset className="h-5 w-5 mr-2" /> Enter VR Era
                </Button>
              )}
            </>
          ) : (
            <Button onClick={exitSession} variant="destructive" className="px-8 py-6 text-lg font-bold rounded-full">
              Exit {arSessionActive ? 'AR' : 'VR'} Session
            </Button>
          )}
        </div>

        {/* Fallback hints */}
        {(!arSessionActive && !vrSessionActive) && (
          <div className="flex flex-col items-center text-xs text-gray-400 mt-2 gap-1">
            <p>You can still preview in 3D locally.</p>
            <span className="flex items-center gap-1">
              Either Stick ↑↓ = Move | ←→ = Turn
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KonarkTimeTravelViewer;
