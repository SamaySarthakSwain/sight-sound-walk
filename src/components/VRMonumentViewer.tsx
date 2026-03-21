import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ARModel } from "@/data/arModels";
import { X, Gamepad2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VRMonumentViewerProps {
  model: ARModel;
  onClose: () => void;
}

// Movement speed in meters per second
const MOVE_SPEED = 2.5;
// Deadzone for thumbstick axes (ignore small drift)
const DEADZONE = 0.18;

const VRMonumentViewer = ({ model, onClose }: VRMonumentViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number>(0);
  const vrButtonRef = useRef<HTMLButtonElement | null>(null);
  const sessionRef = useRef<XRSession | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [vrSessionActive, setVrSessionActive] = useState(false);
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [vrError, setVrError] = useState<string>("");

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // ─── Check WebXR Support ────────────────────────────────────────────────
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        setVrSupported(supported);
      }).catch(() => setVrSupported(false));
    } else {
      setVrSupported(false);
    }

    // ─── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ─── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Gradient sky background
    const skyGeo = new THREE.SphereGeometry(80, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x0a0020) },
        bottomColor: { value: new THREE.Color(0x1a0540) },
        offset: { value: 20 },
        exponent: { value: 0.5 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));
    scene.fog = new THREE.FogExp2(0x0a0020, 0.025);

    // ─── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      72,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 1.6, 5); // Eye-level start position
    cameraRef.current = camera;

    // ─── Lighting ───────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x6644aa, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0xff6600, 3, 20);
    pointLight1.position.set(-4, 3, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0099ff, 2, 15);
    pointLight2.position.set(4, 3, 0);
    scene.add(pointLight2);

    // ─── Ground Plane ───────────────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a0540,
      metalness: 0.3,
      roughness: 0.8,
      wireframe: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Glowing grid lines on the ground
    const gridHelper = new THREE.GridHelper(60, 30, 0xff6600, 0x330088);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // ─── Monument Display Stand ─────────────────────────────────────────────
    const standGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.3, 32);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x8844cc,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x330066),
      emissiveIntensity: 0.5,
    });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 0.15, 0);
    stand.castShadow = true;
    scene.add(stand);

    // Monument representation — glowing golden obelisk
    const obeliskGeo = new THREE.CylinderGeometry(0.15, 0.6, 4, 8);
    const obeliskMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color(0xff8800),
      emissiveIntensity: 0.4,
    });
    const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
    obelisk.position.set(0, 2.3, 0);
    obelisk.castShadow = true;
    scene.add(obelisk);

    // Glowing ring around stand
    const ringGeo = new THREE.TorusGeometry(1.8, 0.06, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: new THREE.Color(0xff4400),
      emissiveIntensity: 2,
      metalness: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.32;
    scene.add(ring);

    // Floating particles around obelisk
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.random() * 5;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffaa44,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Info Panel (Floating Billboard) ───────────────────────────────────
    const canvas2d = document.createElement("canvas");
    canvas2d.width = 1024;
    canvas2d.height = 512;
    const ctx = canvas2d.getContext("2d")!;

    // Background
    ctx.fillStyle = "rgba(10,0,32,0.92)";
    roundRect(ctx, 0, 0, 1024, 512, 40);
    ctx.fill();

    // Border glow
    ctx.strokeStyle = "#ff6600";
    ctx.lineWidth = 6;
    roundRect(ctx, 3, 3, 1018, 506, 38);
    ctx.stroke();

    // Title
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 64px Arial";
    ctx.textAlign = "center";
    ctx.fillText(model.name, 512, 100);

    // Location
    ctx.fillStyle = "#ff8844";
    ctx.font = "36px Arial";
    ctx.fillText(`📍 ${model.location}`, 512, 160);

    // Description — word wrap
    ctx.fillStyle = "#ccbbff";
    ctx.font = "28px Arial";
    const words = model.description.split(" ");
    let line = "";
    let y = 230;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > 940 && line !== "") {
        ctx.fillText(line.trim(), 512, y);
        line = word + " ";
        y += 42;
        if (y > 430) break;
      } else {
        line = test;
      }
    }
    if (y <= 430) ctx.fillText(line.trim(), 512, y);

    // Controller hint
    ctx.fillStyle = "#888888";
    ctx.font = "24px Arial";
    ctx.fillText("🕹️ Either stick ↑↓ = Move | ←→ = Turn", 512, 480);

    const infoTexture = new THREE.CanvasTexture(canvas2d);
    const infoPanelGeo = new THREE.PlaneGeometry(5, 2.5);
    const infoPanelMat = new THREE.MeshBasicMaterial({
      map: infoTexture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const infoPanel = new THREE.Mesh(infoPanelGeo, infoPanelMat);
    infoPanel.position.set(0, 5.8, 0);
    scene.add(infoPanel);

    // ─── State pillars for immersive feel ──────────────────────────────────
    const pillarPositions = [
      [-6, 0, -6], [6, 0, -6], [-6, 0, 6], [6, 0, 6],
    ];
    for (const [px, py, pz] of pillarPositions) {
      const pilGeo = new THREE.CylinderGeometry(0.2, 0.25, 5, 12);
      const pilMat = new THREE.MeshStandardMaterial({
        color: 0x4422aa,
        metalness: 0.7,
        roughness: 0.3,
        emissive: new THREE.Color(0x220066),
        emissiveIntensity: 0.6,
      });
      const pillar = new THREE.Mesh(pilGeo, pilMat);
      pillar.position.set(px, py + 2.5, pz);
      scene.add(pillar);

      // Glowing orb on top
      const orbGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: new THREE.Color(0xff6600),
        emissiveIntensity: 3,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(px, 5.3, pz);
      scene.add(orb);
    }

    // ─── XR Controller Visuals ──────────────────────────────────────────────
    const controllerModelFactory = { createControllerModel: () => null }; // lightweight
    const controller0 = renderer.xr.getController(0);
    const controller1 = renderer.xr.getController(1);

    const makeControllerMesh = () => {
      const grip = new THREE.Group();
      const bodyGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.12, 12);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
      grip.add(new THREE.Mesh(bodyGeo, bodyMat));
      const beamGeo = new THREE.CylinderGeometry(0.005, 0.005, 1.5, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.7 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, -0.75, 0);
      grip.add(beam);
      return grip;
    };

    const ctrl0Mesh = makeControllerMesh();
    const ctrl1Mesh = makeControllerMesh();
    controller0.add(ctrl0Mesh);
    controller1.add(ctrl1Mesh);
    scene.add(controller0);
    scene.add(controller1);

    // ─── Animation Loop ─────────────────────────────────────────────────────
    const animate = () => {
      const dt = clockRef.current.getDelta();
      const elapsed = clockRef.current.getElapsedTime();

      // Animate obelisk rotation
      obelisk.rotation.y = elapsed * 0.4;
      ring.rotation.z = elapsed * 0.6;

      // Animate particles orbiting
      particles.rotation.y = elapsed * 0.15;

      // Bob the info panel
      infoPanel.position.y = 5.8 + Math.sin(elapsed * 0.8) * 0.08;

      // Animate pillar lights
      pointLight1.position.x = Math.sin(elapsed * 0.5) * 4;
      pointLight2.position.x = Math.cos(elapsed * 0.5) * 4;

      // ─── Thumbstick Locomotion (Meta Quest 2) ─────────────────────────────
      const xrSession = renderer.xr.getSession();
      if (xrSession) {
        const inputSources = Array.from(xrSession.inputSources);
        for (const source of inputSources) {
          if (!source.gamepad) continue;
          const axes = source.gamepad.axes;
          // Standard mapping: [StickX, StickY] usually at axes[2], [3]
          if (axes.length >= 4) {
            const stickX = axes[2];
            const stickY = axes[3];

            // 1. Move Forward/Backward (using Y axis on either stick)
            if (Math.abs(stickY) > DEADZONE) {
              const dir = new THREE.Vector3();
              camera.getWorldDirection(dir);
              dir.y = 0;
              dir.normalize();
              // Invert stickY because convention is -1 (forward) to 1 (backward)
              camera.position.addScaledVector(dir, -stickY * MOVE_SPEED * dt);
            }

            // 2. Smooth Turning (using X axis on either stick)
            if (Math.abs(stickX) > DEADZONE) {
              // Standard turn speed: 1.5 radians per second
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

    // ─── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      cancelAnimationFrame(frameIdRef.current);
      if (sessionRef.current) {
        sessionRef.current.end().catch(() => {});
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [model]);

  const enterVR = async () => {
    if (!navigator.xr || !rendererRef.current) return;
    try {
      const session = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
      });
      sessionRef.current = session;
      await rendererRef.current.xr.setSession(session);
      setVrSessionActive(true);
      session.addEventListener("end", () => {
        setVrSessionActive(false);
        sessionRef.current = null;
      });
    } catch (err) {
      setVrError("Could not start VR session. Make sure you're using Oculus Browser on Quest 2.");
    }
  };

  const exitVR = async () => {
    if (sessionRef.current) {
      await sessionRef.current.end().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="flex-1 w-full" />

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="text-center pointer-events-none">
          <p className="text-white font-semibold text-lg drop-shadow">{model.name}</p>
          <p className="text-orange-300 text-xs">{model.location}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Enter / Exit VR Button */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 pb-6 bg-gradient-to-t from-black/90 to-transparent pt-10">
        {vrError && (
          <p className="text-red-400 text-sm text-center px-4 mb-1">{vrError}</p>
        )}
        {vrSupported === false && (
          <p className="text-yellow-400 text-sm text-center px-4 mb-1">
            ⚠️ WebXR not supported on this browser. Open in <strong>Oculus Browser</strong> on Quest 2.
          </p>
        )}
        {vrSupported === true && !vrSessionActive && (
          <Button
            onClick={enterVR}
            className="gap-2 px-8 py-5 text-lg font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-full shadow-lg shadow-orange-900/50 border border-orange-400"
          >
            <Gamepad2 className="h-5 w-5" />
            Enter VR (Meta Quest 2)
          </Button>
        )}
        {vrSessionActive && (
          <Button
            onClick={exitVR}
            variant="destructive"
            className="gap-2 px-8 py-5 text-lg font-bold rounded-full"
          >
            Exit VR
          </Button>
        )}

        {/* Locomotion hint for desktop */}
        {!vrSessionActive && (
          <div className="flex items-center gap-6 text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <ChevronUp className="h-3 w-3 text-orange-400" />
              <ChevronDown className="h-3 w-3 text-orange-400" />
              Either Stick ↑↓ = Move Toward/Away
            </span>
            <span>↔ Either Stick = Smooth Turn</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper: rounded rectangle path for canvas2d
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default VRMonumentViewer;
