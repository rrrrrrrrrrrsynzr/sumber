import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const UNIT_IDS = Array.from({ length: 6 }, (_, index) => `alat-${index + 1}`);

function CoreUnit({ index }) {
  const column = index % 3;
  const row = Math.floor(index / 3);
  const position = [(column - 1) * 2.75, 0, (row - 0.5) * 2.6];
  const statusColor = '#8d9990';

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.34, 1.15]} />
        <meshStandardMaterial color="#253b32" roughness={0.45} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[1.12, 0.16, 0.78]} />
        <meshStandardMaterial color={statusColor} roughness={0.4} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[0.26, 0.05, 0.26]} />
        <meshStandardMaterial color="#f0f3db" emissive={statusColor} emissiveIntensity={0.24} />
      </mesh>
    </group>
  );
}

function Scene({ controlsRef }) {
  return (
    <>
      <color attach="background" args={['#f1f5ee']} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} />
      <directionalLight position={[-5, 4, -4]} intensity={0.8} color="#91ad83" />
      <gridHelper args={[12, 16, '#829385', '#c4cec4']} position={[0, -0.72, 0]} />
      {UNIT_IDS.map((deviceId, index) => <CoreUnit key={deviceId} index={index} />)}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={7}
        maxDistance={15}
        minPolarAngle={0.55}
        maxPolarAngle={1.45}
        target={[0, 0, 0]}
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
      <div className="model-stage model-stage-fallback" role="img" aria-label="Diagram skematis enam Core Unit">
        <div className="model-unit-fallback-grid">
          {UNIT_IDS.map((deviceId, index) => (
            <div className="model-unit-fallback" key={deviceId}>
              <span className="model-unit-indicator" />
              <strong>Core Unit {index + 1}</strong>
              <small>{deviceId}</small>
            </div>
          ))}
        </div>
        <p>Pratinjau 3D tidak tersedia di perangkat ini.</p>
      </div>
    );
  }

  return (
    <div className="model-stage model-stage-3d" role="img" aria-label="Diagram skematis enam Core Unit. Seret untuk memutar, gulir untuk memperbesar atau memperkecil.">
      <Canvas camera={{ position: [9, 8, 12], fov: 36 }} dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true }}>
        <Scene controlsRef={controlsRef} />
      </Canvas>
      <span className="model-3d-hint">SERET UNTUK MEMUTAR · GULIR UNTUK ZOOM</span>
    </div>
  );
}
