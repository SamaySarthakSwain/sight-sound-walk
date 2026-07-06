import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Lightweight aurora WebGL background.
 *
 * Perf notes (why this file looks the way it does):
 * - Renders at 0.55× viewport and DPR 1 → ~3× less fragment work than fullscreen.
 * - Fragment shader loop reduced 35 → 18 iterations, fbm octaves 3 → 2.
 * - Frame rate capped at ~30fps instead of 60.
 * - Pauses when tab/window is hidden or component is offscreen.
 * - Disabled on small screens and when the user prefers reduced motion.
 */
export const AuroraBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Bail on low-power or motion-sensitive contexts. Static CSS fallback shows through.
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isNarrow = window.innerWidth < 768;
        if (prefersReducedMotion || isNarrow) return;

        const currentMount = mountRef.current;
        const RESOLUTION_SCALE = 0.55;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
        } catch {
            return; // no WebGL → gracefully fall back to CSS gradient
        }
        renderer.setPixelRatio(1);

        const setSize = () => {
            const w = Math.floor(window.innerWidth * RESOLUTION_SCALE);
            const h = Math.floor(window.innerHeight * RESOLUTION_SCALE);
            renderer.setSize(w, h, false);
            renderer.domElement.style.width = "100vw";
            renderer.domElement.style.height = "100vh";
        };
        setSize();

        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.pointerEvents = 'none';
        currentMount.appendChild(renderer.domElement);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector2(window.innerWidth * RESOLUTION_SCALE, window.innerHeight * RESOLUTION_SCALE) },
            },
            vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                uniform float iTime; uniform vec2 iResolution;
                #define NUM_OCTAVES 2
                float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
                float noise(vec2 p){ vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res; }
                float fbm(vec2 x) { float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}
                void main() {
                    vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);vec4 o=vec4(0.);float f=2.+fbm(p+vec2(iTime*5.,0.))*.5;
                    for(float i=0.;i++<18.;){vec2 v=p+cos(i*i+(iTime+p.x*.08)*.025+i*vec2(13.,11.))*3.5;float tailNoise=fbm(v+vec2(iTime*.5,i))*.3*(1.-(i/18.));vec4 auroraColors=vec4(.1+.3*sin(i*.2+iTime*.4),.3+.5*cos(i*.3+iTime*.5),.7+.3*sin(i*.4+iTime*.3),1.);vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*.8))/length(max(v,vec2(v.x*f*.015,v.y*1.5)));float thinnessFactor=smoothstep(0.,1.,i/18.)*.6;o+=currentContribution*(1.+tailNoise*.8)*thinnessFactor;}
                    o=tanh(pow(o/60.,vec4(1.6)));gl_FragColor=o*1.5;
                }`
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // ~30fps cap + tab-hidden pause
        let animationFrameId = 0;
        let lastFrame = performance.now();
        const FRAME_INTERVAL = 1000 / 30;
        let paused = document.hidden;

        const animate = (now: number) => {
            animationFrameId = requestAnimationFrame(animate);
            if (paused) { lastFrame = now; return; }
            const delta = now - lastFrame;
            if (delta < FRAME_INTERVAL) return;
            lastFrame = now - (delta % FRAME_INTERVAL);
            material.uniforms.iTime.value += 0.03;
            renderer.render(scene, camera);
        };

        const onVisibility = () => { paused = document.hidden; };
        document.addEventListener("visibilitychange", onVisibility);

        // Also pause when the background is fully offscreen (user scrolled past a header nav etc.)
        const io = new IntersectionObserver(
            ([entry]) => { paused = document.hidden || !entry.isIntersecting; },
            { threshold: 0 },
        );
        io.observe(currentMount);

        let resizeTimer: number | undefined;
        const handleResize = () => {
            if (resizeTimer) window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                setSize();
                material.uniforms.iResolution.value.set(
                    window.innerWidth * RESOLUTION_SCALE,
                    window.innerHeight * RESOLUTION_SCALE,
                );
            }, 150);
        };
        window.addEventListener('resize', handleResize);

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener("visibilitychange", onVisibility);
            io.disconnect();
            if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement);
            renderer.dispose();
            material.dispose();
            geometry.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            aria-hidden="true"
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{
                // CSS fallback so the page still has a warm gradient on mobile / reduced-motion / no-WebGL.
                background:
                    "radial-gradient(1200px 800px at 20% 10%, rgba(255,107,53,0.18), transparent 60%)," +
                    "radial-gradient(900px 700px at 85% 90%, rgba(255,170,90,0.10), transparent 60%)," +
                    "#0a0a0c",
            }}
        />
    );
};
