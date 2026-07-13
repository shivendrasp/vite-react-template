import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

import fbxUrl from "./form.fbx?url";
import envUrl from "./hdr.exr?url";

const SPHERE_COUNT = 400;
const SPHERE_RADIUS = 0.08;
const PROXIMITY_RADIUS = 0.2; // in screen (NDC) units
const SPIN_SPEED = 0.45;

// Deterministic PRNG so the sphere layout is stable across re-renders
// and render-phase code stays pure (Math.random is not allowed there)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Environment() {
  // Keep full 32-bit float data — the default half-float conversion clamps
  // this EXR's brightest pixels and spams "Value out of range" warnings
  const texture = useLoader(EXRLoader, envUrl, (loader) =>
    loader.setDataType(THREE.FloatType)
  );

  return (
    <>
      <color attach="background" args={["#000"]} />
      <primitive
        object={texture}
        attach="environment"
        mapping={THREE.EquirectangularReflectionMapping}
      />
    </>
  );
}

function Model() {
  const groupRef = useRef();
  const instancesRef = useRef();
  const fbx = useLoader(FBXLoader, fbxUrl);

  const { points, seeds } = useMemo(() => {
    // Normalize the FBX: fit it into ~2.2 units and center it at the origin
    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.2 / Math.max(size.x, size.y, size.z);
    fbx.scale.setScalar(scale);
    const center = box.getCenter(new THREE.Vector3()).multiplyScalar(scale);
    fbx.position.sub(center);
    fbx.updateMatrixWorld(true);

    const chrome = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.28,
      envMapIntensity: 1.3,
    });

    let sourceMesh = null;
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = chrome;
        const count = child.geometry.attributes.position.count;
        if (!sourceMesh || count > sourceMesh.geometry.attributes.position.count) {
          sourceMesh = child;
        }
      }
    });

    // Scatter points across the model surface; each one hosts an orange sphere
    const random = mulberry32(1337);
    const sampler = new MeshSurfaceSampler(sourceMesh)
      .setRandomGenerator(random)
      .build();
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(sourceMesh.matrixWorld);
    const position = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const points = [];
    const seeds = [];
    for (let i = 0; i < SPHERE_COUNT; i++) {
      sampler.sample(position, normal);
      position.applyMatrix4(sourceMesh.matrixWorld);
      normal.applyMatrix3(normalMatrix).normalize();
      // Lift the sphere slightly off the surface along the normal
      points.push(position.clone().addScaledVector(normal, SPHERE_RADIUS * 0.6));
      seeds.push({
        size: 0.5 + random(),
        phase: random() * Math.PI * 2,
      });
    }
    return { points, seeds };
  }, [fbx]);

  const scalesRef = useRef(new Float32Array(SPHERE_COUNT));
  const scratch = useMemo(
    () => ({
      matrix: new THREE.Matrix4(),
      quaternion: new THREE.Quaternion(),
      vScale: new THREE.Vector3(),
      world: new THREE.Vector3(),
      ndc: new THREE.Vector3(),
    }),
    []
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    const instances = instancesRef.current;
    if (!group || !instances) return;

    group.rotation.y += delta * SPIN_SPEED;
    group.updateMatrixWorld(true);

    const { matrix, quaternion, vScale, world, ndc } = scratch;
    const scales = scalesRef.current;
    const aspect = state.size.width / state.size.height;
    const time = state.clock.elapsedTime;
    const damping = Math.min(1, delta * 8);

    for (let i = 0; i < SPHERE_COUNT; i++) {
      // Proximity is measured in screen space: project each point and
      // compare it against the pointer's NDC position
      world.copy(points[i]).applyMatrix4(instances.matrixWorld);
      ndc.copy(world).project(state.camera);
      const dx = (ndc.x - state.pointer.x) * aspect;
      const dy = ndc.y - state.pointer.y;
      const distance = Math.hypot(dx, dy);

      const closeness =
        1 - THREE.MathUtils.smoothstep(distance, PROXIMITY_RADIUS * 0.25, PROXIMITY_RADIUS);
      const breathe = 1 + 0.2 * Math.sin(time * 3 + seeds[i].phase);
      const target = closeness * seeds[i].size * breathe;

      scales[i] += (target - scales[i]) * damping;

      vScale.setScalar(scales[i]);
      matrix.compose(points[i], quaternion, vScale);
      instances.setMatrixAt(i, matrix);
    }
    instances.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
      <instancedMesh ref={instancesRef} args={[null, null, SPHERE_COUNT]} frustumCulled={false}>
        <sphereGeometry args={[SPHERE_RADIUS, 16, 16]} />
        <meshStandardMaterial
          color="#0000FF"
          emissive="#0000FF"
          emissiveIntensity={0.25}
          roughness={0.8}
          metalness={0}
        />
      </instancedMesh>
    </group>
  );
}

export default function Shape() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0.4, 10], zoom: 220, near: 0.1, far: 100 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment />
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}
