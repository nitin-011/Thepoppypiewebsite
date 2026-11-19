import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ECOSYSTEM_NODES, EcosystemNode } from '../config/siteConfig';

export type EcosystemScopeId = 'poppy-pie' | 'business-orbit' | 'atior' | 'from-scratch';

interface EcosystemCanvas3DProps {
  focusedScopeId: EcosystemScopeId;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onWebGLFallback: () => void;
  resetTrigger: number;
}

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

interface NodeTargetLayout {
  position: THREE.Vector3;
  scale: number;
  visibleInLabels: boolean;
  dimmed: boolean;
}

function computeLayoutTargets(
  scope: EcosystemScopeId,
  isMobile: boolean,
): Record<string, NodeTargetLayout> {
  const targets: Record<string, NodeTargetLayout> = {};
  const allIds = Object.keys(ECOSYSTEM_NODES);

  // Default hidden / backgrounded position
  allIds.forEach((id) => {
    targets[id] = {
      position: new THREE.Vector3(0, -1.5, -7),
      scale: 0.25,
      visibleInLabels: false,
      dimmed: true,
    };
  });

  const spreadScale = isMobile ? 0.8 : 1;

  if (scope === 'poppy-pie') {
    targets['poppy-pie'] = {
      position: new THREE.Vector3(0, 0.25, 0),
      scale: 1.32,
      visibleInLabels: true,
      dimmed: false,
    };

    const venturePositions: Record<string, [number, number, number]> = {
      'business-orbit': [-3.65 * spreadScale, 0.65, 1.35],
      atior: [3.65 * spreadScale, 0.4, 1.25],
      'from-scratch': [0, -1.75, 2.3],
    };

    Object.entries(venturePositions).forEach(([vid, [vx, vy, vz]]) => {
      targets[vid] = {
        position: new THREE.Vector3(vx, vy, vz),
        scale: 0.94,
        visibleInLabels: true,
        dimmed: false,
      };

      const children = ECOSYSTEM_NODES[vid].childrenIds;
      children.forEach((cid, idx) => {
        const angle = (idx / Math.max(children.length, 1)) * Math.PI * 2 + 0.4;
        const r = 1.25 * spreadScale;
        targets[cid] = {
          position: new THREE.Vector3(
            vx + Math.cos(angle) * r,
            vy + Math.sin(angle) * 0.55 - 0.3,
            vz + Math.sin(angle) * r * 0.5 - 0.5,
          ),
          scale: 0.34,
          visibleInLabels: false,
          dimmed: true,
        };
      });
    });

    return targets;
  }

  // Focused Venture Scope (Level 1)
  targets[scope] = {
    position: new THREE.Vector3(0, 0.2, 0),
    scale: 1.22,
    visibleInLabels: true,
    dimmed: false,
  };

  // Parent node gently steps up-back so user sees hierarchy and can click back
  targets['poppy-pie'] = {
    position: new THREE.Vector3(-3.8 * spreadScale, 2.55, -3.4),
    scale: 0.72,
    visibleInLabels: true,
    dimmed: true,
  };

  // Sibling ventures step into background orbit
  const siblings = ['business-orbit', 'atior', 'from-scratch'].filter((id) => id !== scope);
  siblings.forEach((sid, idx) => {
    const xSide = idx === 0 ? 4.2 : -4.4;
    targets[sid] = {
      position: new THREE.Vector3(xSide * spreadScale, 2.1 - idx * 0.4, -4.4),
      scale: 0.52,
      visibleInLabels: true,
      dimmed: true,
    };
  });

  const activeChildren = ECOSYSTEM_NODES[scope].childrenIds;
  const count = activeChildren.length;

  activeChildren.forEach((cid, idx) => {
    if (count === 2) {
      // Atior: two crisp balanced divisions
      const x = idx === 0 ? -3.1 * spreadScale : 3.1 * spreadScale;
      targets[cid] = {
        position: new THREE.Vector3(x, -0.35 + idx * 0.2, 1.45),
        scale: 0.88,
        visibleInLabels: true,
        dimmed: false,
      };
    } else if (count === 3) {
      // From Scratch: three conceptual content pillars in a balanced triad
      const angles = [-Math.PI * 0.82, -Math.PI * 0.18, Math.PI * 0.5];
      const a = angles[idx] ?? 0;
      const r = 3.25 * spreadScale;
      targets[cid] = {
        position: new THREE.Vector3(
          Math.cos(a) * r,
          -0.25 + (idx === 2 ? -0.65 : 0.35),
          Math.sin(a) * 1.45 + 0.8,
        ),
        scale: 0.8,
        visibleInLabels: true,
        dimmed: false,
      };
    } else {
      // Business Orbit: 5 platforms arranged in an organic 3D orbital arc
      const angle = (idx / count) * Math.PI * 2 - Math.PI * 0.5;
      const rx = 3.85 * spreadScale;
      const rz = 2.15;
      targets[cid] = {
        position: new THREE.Vector3(
          Math.cos(angle) * rx,
          Math.sin(angle * 2) * 0.65 - 0.25,
          Math.sin(angle) * rz + 0.6,
        ),
        scale: 0.78,
        visibleInLabels: true,
        dimmed: false,
      };
    }
  });

  return targets;
}

export function EcosystemCanvas3D({
  focusedScopeId,
  selectedNodeId,
  onSelectNode,
  onWebGLFallback,
  resetTrigger,
}: EcosystemCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Refs for latest React props inside stable Three.js animation loop
  const scopeRef = useRef<EcosystemScopeId>(focusedScopeId);
  const selectedRef = useRef<string>(selectedNodeId);
  const onSelectRef = useRef(onSelectNode);
  const fallbackRef = useRef(onWebGLFallback);
  const hoveredRef = useRef<string | null>(null);
  const cameraResetGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(0, 1.6, 10.8),
    target: new THREE.Vector3(0, 0, 0),
  });

  useEffect(() => {
    scopeRef.current = focusedScopeId;
    const isMobile = window.innerWidth < 768;
    const camZ = focusedScopeId === 'poppy-pie' ? (isMobile ? 12.6 : 10.4) : isMobile ? 11.4 : 9.4;
    const camY = focusedScopeId === 'poppy-pie' ? 1.55 : 1.35;
    cameraResetGoalRef.current = {
      active: true,
      pos: new THREE.Vector3(0, camY, camZ),
      target: new THREE.Vector3(0, 0, 0),
    };
  }, [focusedScopeId, resetTrigger]);

  useEffect(() => {
    selectedRef.current = selectedNodeId;
  }, [selectedNodeId]);

  useEffect(() => {
    onSelectRef.current = onSelectNode;
  }, [onSelectNode]);

  useEffect(() => {
    fallbackRef.current = onWebGLFallback;
  }, [onWebGLFallback]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      fallbackRef.current();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 640;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
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
    camera.position.set(0, 1.55, isMobile ? 12.6 : 10.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 17;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0, 0);

    // Cancel camera tween if user actively orbits
    const handleControlsStart = () => {
      cameraResetGoalRef.current.active = false;
    };
    controls.addEventListener('start', handleControlsStart);

    // 3-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0xf8f9f4, 0x789575, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf5, 1.85);
    keyLight.position.set(7, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x789575, 1.1);
    rimLight.position.set(-7, -4, -6);
    scene.add(rimLight);

    // Subtle spatial reference grid ring on floor plane
    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];

    const floorRingGeo1 = new THREE.RingGeometry(4.15, 4.18, 96);
    const floorRingGeo2 = new THREE.RingGeometry(2.35, 2.37, 72);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0x536b50,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    disposableGeos.push(floorRingGeo1, floorRingGeo2);
    disposableMats.push(floorRingMat);

    const floorRing1 = new THREE.Mesh(floorRingGeo1, floorRingMat);
    floorRing1.rotation.x = -Math.PI / 2;
    floorRing1.position.y = -2.35;
    const floorRing2 = new THREE.Mesh(floorRingGeo2, floorRingMat);
    floorRing2.rotation.x = -Math.PI / 2;
    floorRing2.position.y = -2.35;
    scene.add(floorRing1, floorRing2);

    // Build Composite 3D Nodes for all Ecosystem Nodes
    interface NodeRig {
      id: string;
      group: THREE.Group;
      coreMat: THREE.MeshStandardMaterial;
      collarMesh: THREE.Mesh;
      selectionHalo: THREE.Mesh;
      hitMesh: THREE.Mesh;
      currentScale: number;
    }

    const nodeRigs: Record<string, NodeRig> = {};
    const hitMeshes: THREE.Object3D[] = [];

    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8f9f4,
      roughness: 0.16,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.65,
      transparent: true,
      opacity: isSoftwareGl ? 0.3 : 0.88,
      ior: 1.44,
      thickness: 0.6,
      clearcoat: 0.85,
      depthWrite: false,
    });
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x252b27,
      roughness: 0.3,
      metalness: 0.78,
    });
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x252b27,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposableMats.push(shellMat, collarMat, haloMat, hitMat);

    const initialLayout = computeLayoutTargets(scopeRef.current, isMobile);

    (Object.values(ECOSYSTEM_NODES) as EcosystemNode[]).forEach((node) => {
      const group = new THREE.Group();
      const target = initialLayout[node.id];
      group.position.copy(target.position);
      group.scale.setScalar(target.scale);

      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.accentHex),
        roughness: node.kind === 'parent' ? 0.32 : 0.44,
        metalness: node.kind === 'parent' ? 0.35 : 0.18,
      });
      disposableMats.push(coreMat);

      // Geometry distinct per node role (Parent / Venture / Platform or Division / Pillar)
      const coreGeo =
        node.kind === 'pillar'
          ? new THREE.OctahedronGeometry(0.46, 0)
          : new THREE.SphereGeometry(0.46, 28, 28);
      const shellGeo =
        node.kind === 'pillar'
          ? new THREE.OctahedronGeometry(0.68, 1)
          : new THREE.SphereGeometry(0.66, 28, 28);
      const collarGeo = new THREE.TorusGeometry(0.84, 0.024, 12, 48);
      const haloGeo = new THREE.RingGeometry(0.95, 1.03, 48);
      const hitGeo = new THREE.SphereGeometry(0.98, 12, 12);
      disposableGeos.push(coreGeo, shellGeo, collarGeo, haloGeo, hitGeo);

      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      shellMesh.renderOrder = 2;

      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.rotation.x = Math.PI * 0.38;

      const selectionHalo = new THREE.Mesh(haloGeo, haloMat);
      selectionHalo.visible = false;

      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.layers.set(1);
      hitMesh.userData.nodeId = node.id;
      hitMeshes.push(hitMesh);

      group.add(coreMesh, shellMesh, collarMesh, selectionHalo, hitMesh);

      // Add secondary precision ring for parent node
      if (node.kind === 'parent') {
        const secondRingGeo = new THREE.TorusGeometry(1.02, 0.015, 10, 56);
        disposableGeos.push(secondRingGeo);
        const secondRing = new THREE.Mesh(secondRingGeo, collarMat);
        secondRing.rotation.y = Math.PI * 0.35;
        group.add(secondRing);
      }

      scene.add(group);
      nodeRigs[node.id] = {
        id: node.id,
        group,
        coreMat,
        collarMesh,
        selectionHalo,
        hitMesh,
        currentScale: target.scale,
      };
    });

    // Build Dynamic Curved Connections & Signal Pulses
    interface ConnectionEdge {
      fromId: string;
      toId: string;
      line: THREE.Line;
      lineGeo: THREE.BufferGeometry;
      lineMat: THREE.LineBasicMaterial;
      pulseMesh: THREE.Mesh;
      curve: THREE.QuadraticBezierCurve3;
      phaseOffset: number;
    }

    const edges: ConnectionEdge[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x252b27 });
    disposableGeos.push(pulseGeo);
    disposableMats.push(pulseMat);

    (Object.values(ECOSYSTEM_NODES) as EcosystemNode[]).forEach((node, idx) => {
      if (!node.parentId) return;
      const lineGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 24; i++) {
        points.push(new THREE.Vector3());
      }
      lineGeo.setFromPoints(points);
      disposableGeos.push(lineGeo);

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x536b50,
        transparent: true,
        opacity: 0.45,
      });
      disposableMats.push(lineMat);

      const line = new THREE.Line(lineGeo, lineMat);
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(line, pulseMesh);

      edges.push({
        fromId: node.parentId,
        toId: node.id,
        line,
        lineGeo,
        lineMat,
        pulseMesh,
        curve: new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ),
        phaseOffset: idx * 0.23,
      });
    });

    // Raycasting for hover & click
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 8) return; // Ignore orbit drags

      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.nodeId as string | undefined;
        if (hitId) {
          onSelectRef.current(hitId);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 40) return;
      lastHoverCheck = now;

      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      const hitId = hits.length > 0 ? (hits[0].object.userData.nodeId as string) : null;
      if (hoveredRef.current !== hitId) {
        hoveredRef.current = hitId;
        setHoveredNodeId(hitId);
        renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // Pre-allocated math helpers for zero-GC animation loop
    const _mid = new THREE.Vector3();
    const _pt = new THREE.Vector3();
    const _proj = new THREE.Vector3();
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

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

    const tick = () => {
      if (isDisposed) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const activeScope = scopeRef.current;
      const activeSelected = selectedRef.current;
      const activeHover = hoveredRef.current;
      const targets = computeLayoutTargets(activeScope, window.innerWidth < 768);

      // Smooth camera transition toward scope framing
      if (cameraResetGoalRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          cameraResetGoalRef.current.pos.x,
          4.2,
          delta,
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          cameraResetGoalRef.current.pos.y,
          4.2,
          delta,
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          cameraResetGoalRef.current.pos.z,
          4.2,
          delta,
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          cameraResetGoalRef.current.target.x,
          4.2,
          delta,
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          cameraResetGoalRef.current.target.y,
          4.2,
          delta,
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          cameraResetGoalRef.current.target.z,
          4.2,
          delta,
        );

        if (camera.position.distanceTo(cameraResetGoalRef.current.pos) < 0.04) {
          cameraResetGoalRef.current.active = false;
        }
      }

      controls.update();

      const canvasWidth = container.clientWidth || width;
      const canvasHeight = container.clientHeight || height;

      // Update nodes smoothly
      Object.values(nodeRigs).forEach((rig, idx) => {
        const tgt = targets[rig.id];
        const floatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.9 + idx * 0.85) * 0.07;

        rig.group.position.x = THREE.MathUtils.damp(rig.group.position.x, tgt.position.x, 5.2, delta);
        rig.group.position.y = THREE.MathUtils.damp(
          rig.group.position.y,
          tgt.position.y + floatY,
          5.2,
          delta,
        );
        rig.group.position.z = THREE.MathUtils.damp(rig.group.position.z, tgt.position.z, 5.2, delta);

        const isSelected = activeSelected === rig.id;
        const isHovered = activeHover === rig.id;
        const goalScale = tgt.scale * (isSelected ? 1.16 : isHovered ? 1.09 : 1);

        rig.currentScale = THREE.MathUtils.damp(rig.currentScale, goalScale, 7, delta);
        rig.group.scale.setScalar(rig.currentScale);

        if (!prefersReducedMotion) {
          rig.collarMesh.rotation.z = elapsed * (isSelected ? 0.55 : 0.22) + idx;
          rig.group.rotation.y = Math.sin(elapsed * 0.35 + idx) * 0.14;
        }

        rig.selectionHalo.visible = isSelected;
        if (isSelected) {
          rig.selectionHalo.lookAt(camera.position);
        }

        // Update projected DOM label position without React re-renders
        const labelEl = labelRefs.current[rig.id];
        if (labelEl) {
          if (!tgt.visibleInLabels) {
            labelEl.style.opacity = '0';
            labelEl.style.pointerEvents = 'none';
          } else {
            _proj.copy(rig.group.position);
            _proj.y -= rig.currentScale * 0.92;
            _proj.project(camera);

            if (_proj.z > 1) {
              labelEl.style.opacity = '0';
              labelEl.style.pointerEvents = 'none';
            } else {
              const sx = ((_proj.x + 1) / 2) * canvasWidth;
              const sy = ((-_proj.y + 1) / 2) * canvasHeight;
              labelEl.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, 0)`;
              labelEl.style.opacity = tgt.dimmed ? '0.68' : '1';
              labelEl.style.pointerEvents = 'auto';
            }
          }
        }
      });

      // Update curved edges & traveling pulses
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const fromRig = nodeRigs[edge.fromId];
        const toRig = nodeRigs[edge.toId];
        if (!fromRig || !toRig) continue;

        const isScopeActive =
          activeScope === 'poppy-pie'
            ? edge.fromId === 'poppy-pie'
            : edge.fromId === activeScope || (edge.fromId === 'poppy-pie' && edge.toId === activeScope);

        edge.lineMat.opacity = isScopeActive ? 0.52 : 0.12;
        edge.pulseMesh.visible = isScopeActive && !prefersReducedMotion;

        _mid.addVectors(fromRig.group.position, toRig.group.position).multiplyScalar(0.5);
        _mid.y += 0.45;
        edge.curve.v0.copy(fromRig.group.position);
        edge.curve.v1.copy(_mid);
        edge.curve.v2.copy(toRig.group.position);

        const attr = edge.lineGeo.attributes.position as THREE.BufferAttribute;
        for (let s = 0; s <= 24; s++) {
          edge.curve.getPoint(s / 24, _pt);
          attr.setXYZ(s, _pt.x, _pt.y, _pt.z);
        }
        attr.needsUpdate = true;

        if (edge.pulseMesh.visible) {
          const t = (elapsed * 0.34 + edge.phaseOffset) % 1;
          edge.curve.getPoint(t, _pt);
          edge.pulseMesh.position.copy(_pt);
        }
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 640;
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
      if (!prefersReducedMotion) tick();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('start', handleControlsStart);
      controls.dispose();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      disposableGeos.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const allNodes = Object.values(ECOSYSTEM_NODES);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dedicated Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Projected Semantic DOM Node Labels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {allNodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isFocusCenter = focusedScopeId === node.id;
          return (
            <button
              key={node.id}
              ref={(el) => {
                labelRefs.current[node.id] = el;
              }}
              type="button"
              onClick={() => onSelectNode(node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              style={{ opacity: 0, left: 0, top: 0 }}
              className={`absolute px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer border shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575] ${
                isSelected || isFocusCenter
                  ? 'bg-[#252B27] text-[#F8F9F4] border-[#252B27]'
                  : isHovered
                    ? 'bg-[#F8F9F4] text-[#252B27] border-[#789575]'
                    : 'bg-[#F8F9F4]/95 text-[#252B27] border-[#252B27]/15 hover:border-[#789575]'
              }`}
            >
              {node.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
