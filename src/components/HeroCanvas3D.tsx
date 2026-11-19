import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function HeroCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, isMobile ? 11.5 : 9.4);

    // 3-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0xf8f9f4, 0x789575, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf2, 1.8);
    keyLight.position.set(6, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x789575, 1.15);
    rimLight.position.set(-6, -3, -5);
    scene.add(rimLight);

    // Root cluster offset slightly right on desktop to preserve hero typography legibility
    const rootCluster = new THREE.Group();
    rootCluster.position.set(isMobile ? 0 : 2.15, isMobile ? 1.45 : -0.05, 0);
    scene.add(rootCluster);

    // Shared materials (varied roughness & metalness across sub-parts)
    const sageCoreMat = new THREE.MeshStandardMaterial({
      color: 0x789575,
      roughness: 0.42,
      metalness: 0.15,
    });

    const outerGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8f9f4,
      roughness: 0.14,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.72,
      transparent: true,
      opacity: isSoftwareGl ? 0.32 : 0.9,
      ior: 1.45,
      thickness: 0.8,
      clearcoat: 0.9,
      depthWrite: false,
    });

    const charcoalRingMat = new THREE.MeshStandardMaterial({
      color: 0x252b27,
      roughness: 0.28,
      metalness: 0.82,
    });

    const deepSageMat = new THREE.MeshStandardMaterial({
      color: 0x536b50,
      roughness: 0.35,
      metalness: 0.45,
    });

    const orbitLineMat = new THREE.LineBasicMaterial({
      color: 0x536b50,
      transparent: true,
      opacity: 0.28,
    });

    const segCount = isMobile ? 28 : 48;

    // 1. Central Parent Assembly (composite 5-part sculpture)
    const centralGroup = new THREE.Group();
    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.92, segCount, segCount), sageCoreMat);
    const glassShell = new THREE.Mesh(new THREE.SphereGeometry(1.24, segCount, segCount), outerGlassMat);
    glassShell.renderOrder = 2;

    const eqRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.48, 0.025, 16, segCount * 2),
      charcoalRingMat,
    );
    eqRing.rotation.x = Math.PI * 0.42;

    const meridianRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.66, 0.016, 12, segCount * 2),
      deepSageMat,
    );
    meridianRing.rotation.y = Math.PI * 0.3;
    meridianRing.rotation.x = -Math.PI * 0.18;

    const crownNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), charcoalRingMat);
    crownNode.position.set(0, 1.48, 0);

    centralGroup.add(coreMesh, glassShell, eqRing, meridianRing, crownNode);
    rootCluster.add(centralGroup);

    // 2. Three Interconnected Venture Satellites (Business Orbit, Atior, From Scratch)
    interface OrbitNode {
      group: THREE.Group;
      ringRadiusX: number;
      ringRadiusZ: number;
      tiltX: number;
      tiltZ: number;
      speed: number;
      phase: number;
      connectorGeo: THREE.BufferGeometry;
    }

    const orbitConfigs = [
      { radiusX: 3.0, radiusZ: 2.35, tiltX: 0.32, tiltZ: -0.22, speed: 0.24, phase: 0.3, scale: 0.56 },
      { radiusX: 3.45, radiusZ: 2.75, tiltX: -0.38, tiltZ: 0.28, speed: 0.19, phase: 2.4, scale: 0.5 },
      { radiusX: 2.65, radiusZ: 2.15, tiltX: 0.18, tiltZ: 0.44, speed: 0.28, phase: 4.5, scale: 0.46 },
    ];

    const orbitNodes: OrbitNode[] = [];
    const disposableGeos: THREE.BufferGeometry[] = [
      coreMesh.geometry,
      glassShell.geometry,
      eqRing.geometry,
      meridianRing.geometry,
      crownNode.geometry,
    ];

    orbitConfigs.forEach((cfg, idx) => {
      // Orbital ellipse ring
      const curvePoints: THREE.Vector3[] = [];
      const steps = 96;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const p = new THREE.Vector3(
          Math.cos(theta) * cfg.radiusX,
          0,
          Math.sin(theta) * cfg.radiusZ,
        );
        p.applyEuler(new THREE.Euler(cfg.tiltX, 0, cfg.tiltZ));
        curvePoints.push(p);
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      disposableGeos.push(orbitGeo);
      const orbitLine = new THREE.Line(orbitGeo, orbitLineMat);
      rootCluster.add(orbitLine);

      // Composite satellite node (3 parts: inner sphere + frosted envelope + collar ring)
      const nodeGroup = new THREE.Group();
      const satCoreGeo = new THREE.SphereGeometry(cfg.scale * 0.68, 24, 24);
      const satShellGeo = new THREE.SphereGeometry(cfg.scale, 24, 24);
      const satCollarGeo = new THREE.TorusGeometry(cfg.scale * 1.26, 0.018, 12, 48);
      disposableGeos.push(satCoreGeo, satShellGeo, satCollarGeo);

      const satCore = new THREE.Mesh(satCoreGeo, idx === 0 ? deepSageMat : sageCoreMat);
      const satShell = new THREE.Mesh(satShellGeo, outerGlassMat);
      satShell.renderOrder = 2;
      const satCollar = new THREE.Mesh(satCollarGeo, charcoalRingMat);
      satCollar.rotation.x = Math.PI * 0.35;

      nodeGroup.add(satCore, satShell, satCollar);
      rootCluster.add(nodeGroup);

      // Fine connecting radial line from center to satellite
      const connectorGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
      ]);
      disposableGeos.push(connectorGeo);
      const connectorLine = new THREE.Line(connectorGeo, orbitLineMat);
      rootCluster.add(connectorLine);

      orbitNodes.push({
        group: nodeGroup,
        ringRadiusX: cfg.radiusX,
        ringRadiusZ: cfg.radiusZ,
        tiltX: cfg.tiltX,
        tiltZ: cfg.tiltZ,
        speed: cfg.speed,
        phase: cfg.phase,
        connectorGeo,
      });
    });

    // Subtle pointer parallax
    const targetParallax = { x: 0, y: 0 };
    const currentParallax = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile || prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetParallax.x = nx * 0.35;
      targetParallax.y = -ny * 0.25;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const _pos = new THREE.Vector3();
    const _euler = new THREE.Euler();
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    const updateScene = (elapsed: number, delta: number) => {
      currentParallax.x = THREE.MathUtils.damp(currentParallax.x, targetParallax.x, 3.2, delta);
      currentParallax.y = THREE.MathUtils.damp(currentParallax.y, targetParallax.y, 3.2, delta);

      const baseX = isMobile ? 0 : 2.15;
      const baseY = isMobile ? 1.45 : -0.05;
      rootCluster.position.x = baseX + currentParallax.x;
      rootCluster.position.y = baseY + Math.sin(elapsed * 0.7) * 0.1 + currentParallax.y;

      centralGroup.rotation.y = elapsed * 0.12;
      eqRing.rotation.z = elapsed * 0.18;
      meridianRing.rotation.x = -Math.PI * 0.18 + Math.sin(elapsed * 0.35) * 0.08;

      for (let i = 0; i < orbitNodes.length; i++) {
        const node = orbitNodes[i];
        const angle = node.phase + elapsed * node.speed;
        _pos.set(
          Math.cos(angle) * node.ringRadiusX,
          0,
          Math.sin(angle) * node.ringRadiusZ,
        );
        _euler.set(node.tiltX, 0, node.tiltZ);
        _pos.applyEuler(_euler);
        node.group.position.copy(_pos);
        node.group.rotation.y = elapsed * 0.3 + i;

        const positions = node.connectorGeo.attributes.position as THREE.BufferAttribute;
        positions.setXYZ(0, 0, 0, 0);
        positions.setXYZ(1, _pos.x, _pos.y, _pos.z);
        positions.needsUpdate = true;
      }
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const renderOnce = () => {
      updateScene(0.5, 0.016);
      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      renderOnce();
    } else {
      const tick = () => {
        if (isDisposed) return;
        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();
        updateScene(elapsed, delta);
        renderer.render(scene, camera);
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };
      tick();
    }

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    const handleContextRestored = () => {
      if (!prefersReducedMotion) {
        renderOnce();
      }
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      disposableGeos.forEach((g) => g.dispose());
      sageCoreMat.dispose();
      outerGlassMat.dispose();
      charcoalRingMat.dispose();
      deepSageMat.dispose();
      orbitLineMat.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglUnavailable) {
    return (
      <div
        aria-hidden="true"
        className="w-full h-full flex items-center justify-center lg:justify-end pr-0 lg:pr-16 pointer-events-none"
      >
        <svg viewBox="0 0 360 360" className="w-72 h-72 sm:w-96 sm:h-96 opacity-50">
          <circle cx="180" cy="180" r="140" stroke="#789575" strokeWidth="1" fill="none" />
          <circle cx="180" cy="180" r="95" stroke="#536B50" strokeWidth="1" strokeDasharray="4 4" fill="none" />
          <circle cx="180" cy="180" r="38" fill="#789575" fillOpacity="0.35" stroke="#252B27" strokeWidth="1.5" />
          <circle cx="180" cy="40" r="14" fill="#536B50" fillOpacity="0.6" />
          <circle cx="301" cy="250" r="14" fill="#536B50" fillOpacity="0.6" />
          <circle cx="59" cy="250" r="14" fill="#536B50" fillOpacity="0.6" />
        </svg>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full pointer-events-none" aria-hidden="true" />;
}
