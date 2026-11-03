import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';

function DryingRack() {
  return (
    <group>
      {[0, 1, 2].map((level) => (
        <group key={level} position={[0, 1.12 + level * 0.39, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.92, 0.075, 1.12]} />
            <meshStandardMaterial color="#b98a43" roughness={0.72} />
          </mesh>
          {Array.from({ length: 11 }, (_, index) => (
            <mesh key={index} position={[-0.86 + index * 0.172, 0.045, 0]}>
              <boxGeometry args={[0.022, 0.025, 1.02]} />
              <meshStandardMaterial color="#f0d28b" roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function DryerModel() {
  return (
    <group position={[0, -0.26, 0]}>
      {/* Four-legged mobile frame */}
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => (
        <group key={`${x}-${z}`} position={[x * 0.92, 0, z * 0.48]}>
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.105, 1.28, 0.105]} />
            <meshStandardMaterial color="#537b78" metalness={0.42} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.12, 32]} />
            <meshStandardMaterial color="#315258" metalness={0.28} roughness={0.52} />
          </mesh>
          <mesh position={[0, 0.12, 0.066]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.126, 24]} />
            <meshStandardMaterial color="#d9d9c8" metalness={0.2} roughness={0.42} />
          </mesh>
        </group>
      )))}

      {/* Raised drying chamber and visible grain trays */}
      <mesh position={[0, 1.86, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.12, 1.35, 1.2]} />
        <meshStandardMaterial color="#668b84" metalness={0.16} roughness={0.46} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <DryingRack />

      {/* Solid frame rails around the clear chamber */}
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => (
        <mesh key={`rail-${x}-${z}`} position={[x * 1.04, 1.86, z * 0.58]} castShadow>
          <boxGeometry args={[0.075, 1.4, 0.075]} />
          <meshStandardMaterial color="#426b68" metalness={0.34} roughness={0.4} />
        </mesh>
      )))}
      {[-1, 1].map((z) => (
        <mesh key={`crossbar-${z}`} position={[0, 1.2, z * 0.58]} castShadow>
          <boxGeometry args={[2.12, 0.07, 0.07]} />
          <meshStandardMaterial color="#527c76" metalness={0.3} roughness={0.4} />
        </mesh>
      ))}

      {/* Sloped weather cover with translucent front visor */}
      <mesh position={[0, 2.62, 0]} rotation={[0.035, 0, -0.055]} castShadow receiveShadow>
        <boxGeometry args={[2.48, 0.16, 1.48]} />
        <meshStandardMaterial color="#315f67" metalness={0.32} roughness={0.34} />
      </mesh>
      <mesh position={[0, 2.72, 0]} rotation={[0.035, 0, -0.055]} castShadow>
        <boxGeometry args={[2.14, 0.045, 1.16]} />
        <meshStandardMaterial color="#86a9a0" metalness={0.28} roughness={0.38} />
      </mesh>

      {/* Small control panel: a visual detail, not a functional control */}
      <mesh position={[0.78, 1.06, 0.53]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.28, 0.09]} />
        <meshStandardMaterial color="#f5f2e7" roughness={0.42} />
      </mesh>
      <mesh position={[0.78, 1.08, 0.584]}>
        <boxGeometry args={[0.2, 0.09, 0.018]} />
        <meshStandardMaterial color="#78a69a" emissive="#315f55" emissiveIntensity={0.12} />
      </mesh>
      {[-0.06, 0.06].map((x, index) => (
        <mesh key={x} position={[0.78 + x, 0.99, 0.585]}>
          <sphereGeometry args={[0.025, 16, 12]} />
          <meshStandardMaterial color={index === 0 ? '#d6a957' : '#7b9b70'} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ controlsRef }) {
  return (
    <>
      <color attach="background" args={['#f1f5ee']} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[4, 7, 5]} intensity={2.25} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-4, 3, -4]} intensity={0.8} color="#a6c5a5" />
      <gridHelper args={[8, 16, '#b7c8b7', '#dce5d8']} position={[0, -0.02, 0]} />
      <DryerModel />
      <ContactShadows position={[0, -0.015, 0]} opacity={0.28} scale={5.5} blur={2.4} far={2.4} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={4.1}
        maxDistance={8}
        minPolarAngle={0.42}
        maxPolarAngle={1.42}
        target={[0, 1.18, 0]}
      />
    </>
  );
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function DryerModel3D({ controlsRef }) {
  const [webglAvailable] = useState(canUseWebGL);

  if (!webglAvailable) {
    return (
      <div className="model-stage model-stage-fallback" role="img" aria-label="Ilustrasi konsep penjemur padi otomatis">
        <div className="fallback-sun" />
        <div className="fallback-roof" />
        <div className="fallback-chamber"><span /><span /><span /></div>
        <div className="fallback-legs"><i /><i /><i /><i /></div>
        <p>Pratinjau 3D tidak tersedia di perangkat ini.</p>
      </div>
    );
  }

  return (
    <div className="model-stage model-stage-3d" role="img" aria-label="Model konseptual penjemur padi otomatis. Seret untuk memutar, gulir untuk memperbesar atau memperkecil.">
      <Canvas camera={{ position: [4.8, 3.5, 5.2], fov: 34 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: false }}>
        <Scene controlsRef={controlsRef} />
      </Canvas>
      <span className="model-3d-hint">SERET UNTUK MEMUTAR · GULIR UNTUK ZOOM</span>
    </div>
  );
}
