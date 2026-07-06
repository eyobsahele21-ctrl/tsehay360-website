import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SunOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Global Group for interactive rotation
    const globalGroup = new THREE.Group();
    scene.add(globalGroup);

    // 2. The Core Quantum Nexus (Premium Morphing Sphere)
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 5); // Smooth mesh
    const coreMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: new THREE.Color("#F9B03C") }, // Brand Orange
        u_color2: { value: new THREE.Color("#3268BA") }, // Brand Blue
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float u_time;

        // Elegant 3D Simplex-like noise approximation
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + .1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
          );
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Gentle morphing waves
          float displacement = noise(position * 1.8 + u_time * 0.9) * 0.22;
          vec3 newPos = position + normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float u_time;
        uniform vec3 u_color1;
        uniform vec3 u_color2;

        void main() {
          // Elegant rim Fresnel glow
          float viewAngle = dot(vNormal, vec3(0.0, 0.0, 1.0));
          float rimGlow = pow(1.0 - max(viewAngle, 0.0), 3.0) * 1.8;
          
          // Dynamic swirling plasma color mix
          float flow = sin(vPosition.x * 2.0 + u_time * 1.2) * cos(vPosition.y * 2.0 + u_time * 1.0);
          vec3 colorMix = mix(u_color1, u_color2, flow * 0.5 + 0.5);
          
          // Smooth inner highlight
          float pulse = sin(u_time * 2.0) * 0.1 + 0.9;
          vec3 finalColor = colorMix + (u_color1 * rimGlow * pulse);
          
          gl_FragColor = vec4(finalColor, 0.85);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
    });

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globalGroup.add(coreMesh);

    // 3. Subtle Quantum Core Wireframe Overlay (Delivers technical premium feel)
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xF9B03C,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const wireframeMesh = new THREE.Mesh(coreGeometry, wireframeMat);
    wireframeMesh.scale.setScalar(1.01);
    globalGroup.add(wireframeMesh);

    // 4. Double Helix Satellite Light Trails (360° Reach Dynamics)
    const particleCount = 260;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const orbitsY = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    const brandOrange = new THREE.Color("#F9B03C");
    const brandBlue = new THREE.Color("#3268BA");
    const silverGrey = new THREE.Color("#B0B9C6");

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.5 + Math.random() * 1.5;
      radii[i] = 2.1 + Math.random() * 1.5;
      orbitsY[i] = (Math.random() - 0.5) * 1.8; // Vertical spread for beautiful spherical dispersion

      positions[i * 3] = radii[i] * Math.cos(angles[i]);
      positions[i * 3 + 1] = orbitsY[i];
      positions[i * 3 + 2] = radii[i] * Math.sin(angles[i]);

      // Distribute brand colors
      const r = Math.random();
      const pColor = r < 0.4 ? brandOrange : r < 0.8 ? brandBlue : silverGrey;
      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    globalGroup.add(particleSystem);

    // 5. Elite HUD Precision Vectors & Rings
    const createRing = (radius: number, color: number, opacity: number, tiltX: number, tiltY: number) => {
      const ringGeom = new THREE.RingGeometry(radius, radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = tiltX;
      ringMesh.rotation.y = tiltY;
      return ringMesh;
    };

    // Orbit Ring 1: Translucent Blue Equator Ring
    const hudRing1 = createRing(2.6, 0x3268BA, 0.45, Math.PI / 2.2, 0.2);
    globalGroup.add(hudRing1);

    // Orbit Ring 2: Diagonal Orange Precision Ring
    const hudRing2 = createRing(3.0, 0xF9B03C, 0.4, -Math.PI / 3.1, -0.4);
    globalGroup.add(hudRing2);

    // Orbit Ring 3: Delicate outer white compass ring
    const hudRing3 = createRing(3.5, 0xB0B9C6, 0.2, Math.PI / 4, Math.PI / 6);
    globalGroup.add(hudRing3);

    // 6. Constellation Connectors (Connected Data Nodes representing world-class campaign network)
    const nodesCount = 12;
    const nodesGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const nodeMaterialOrange = new THREE.MeshBasicMaterial({ color: 0xF9B03C, blending: THREE.AdditiveBlending });
    const nodeMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x3268BA, blending: THREE.AdditiveBlending });
    
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 2.4; // Fixed radius shell
      
      const pos = new THREE.Vector3(
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.sin(phi) * Math.sin(theta),
        dist * Math.cos(phi)
      );

      nodePositions.push(pos);

      const nodeMesh = new THREE.Mesh(
        nodeGeometry,
        i % 2 === 0 ? nodeMaterialOrange : nodeMaterialBlue
      );
      nodeMesh.position.copy(pos);
      nodesGroup.add(nodeMesh);
    }
    globalGroup.add(nodesGroup);

    // Setup lines to connect nearby constellation nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3268BA,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    const linesGeometry = new THREE.BufferGeometry();
    const linePoints: number[] = [];

    // Connect node pairs if they are close enough
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 1; j < nodesCount; j++) {
        const d = nodePositions[i].distanceTo(nodePositions[j]);
        if (d < 2.5) {
          linePoints.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePoints.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }

    linesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));
    const constellationLines = new THREE.LineSegments(linesGeometry, lineMaterial);
    globalGroup.add(constellationLines);

    camera.position.z = 5.0;

    // 7. Render Loop & Continuous Motion
    let animationFrameId: number;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const t = time * 0.001;
      
      // Pass time to main core shader
      coreMaterial.uniforms.u_time.value = t;

      // Spin Core & Wireframe smoothly
      coreMesh.rotation.y = t * 0.15;
      coreMesh.rotation.x = t * 0.08;
      wireframeMesh.rotation.y = t * 0.15;
      wireframeMesh.rotation.x = t * 0.08;

      // Spin Precision HUD Orbit Rings
      hudRing1.rotation.z = -t * 0.25;
      hudRing2.rotation.z = t * 0.35;
      hudRing3.rotation.z = t * 0.12;

      // Gentle interactive floating orbit of particles
      const posArray = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += speeds[i] * 0.0035;
        const radius = radii[i];
        
        posArray[i * 3] = radius * Math.cos(angles[i]);
        posArray[i * 3 + 1] = orbitsY[i] + Math.sin(t * 1.5 + angles[i]) * 0.15; // Fluid breathing waves
        posArray[i * 3 + 2] = radius * Math.sin(angles[i]);
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Constellation node dynamic drift
      nodesGroup.rotation.y = -t * 0.12;
      nodesGroup.rotation.x = t * 0.05;
      constellationLines.rotation.y = -t * 0.12;
      constellationLines.rotation.x = t * 0.05;

      // Pulse core mesh scale
      const pulseScale = 1.0 + Math.sin(t * 1.8) * 0.045;
      coreMesh.scale.setScalar(pulseScale);
      wireframeMesh.scale.setScalar(pulseScale * 1.015);

      // Micro camera swing for deep parallex/3D view depth
      globalGroup.rotation.y = Math.sin(t * 0.25) * 0.15;
      globalGroup.rotation.x = Math.cos(t * 0.2) * 0.12;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 8. Responsive Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        camera.aspect = entryWidth / entryHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(entryWidth, entryHeight);
      }
    });

    resizeObserver.observe(container);

    // Cleanup Resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      nodeGeometry.dispose();
      nodeMaterialOrange.dispose();
      nodeMaterialBlue.dispose();
      linesGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[350px] relative"
      id="threejs-container-ANIMATION_3"
    >
      {/* Premium HUD Center Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        <div className="border border-[#3268BA]/40 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full font-mono text-[10px] text-[#B0B9C6] tracking-widest uppercase flex items-center gap-2 translate-y-36">
          <span className="w-1.5 h-1.5 rounded-full bg-solar-orange animate-pulse" />
          <span>TSEHAY 360° ENGINE</span>
        </div>
      </div>
    </div>
  );
}
