import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRobotStore, type Emotion } from '@/stores/robotStore';

const EMOTION_COLORS: Record<Emotion, string> = {
  neutral: '#06b6d4',
  happy: '#22c55e',
  sad: '#3b82f6',
  angry: '#ef4444',
  surprised: '#eab308',
  curious: '#a855f7',
  tired: '#6b7280',
};

function RobotBody() {
  const { servos, emotion } = useRobotStore();
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  const color = useMemo(() => new THREE.Color(EMOTION_COLORS[emotion]), [emotion]);

  useFrame((_, delta) => {
    if (headRef.current) {
      const targetY = ((servos.head - 90) / 90) * 0.5;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, delta * 3);
    }
    if (leftArmRef.current) {
      const target = ((servos.leftArm - 90) / 90) * Math.PI * 0.5;
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, target, delta * 3);
    }
    if (rightArmRef.current) {
      const target = -((servos.rightArm - 90) / 90) * Math.PI * 0.5;
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, target, delta * 3);
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
      bodyRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.05;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Torso */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Chest glow */}
      <mesh position={[0, 0.1, 0.41]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.7, 0.7]} />
          <meshStandardMaterial color="#16213e" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.2, 0.05, 0.36]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.2, 0.05, 0.36]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#333" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.85, 0.2, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.85, 0.2, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -1.1, 0]}>
        <boxGeometry args={[0.35, 0.8, 0.35]} />
        <meshStandardMaterial color="#0f0f23" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.3, -1.1, 0]}>
        <boxGeometry args={[0.35, 0.8, 0.35]} />
        <meshStandardMaterial color="#0f0f23" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ground glow */}
      <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

const Robot3D = () => {
  return (
    <div className="panel h-full relative">
      <div className="panel-header absolute top-0 left-0 right-0 z-10 bg-card/80 backdrop-blur-sm">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
        <span>Visualisation 3D</span>
      </div>
      <Canvas
        camera={{ position: [3, 2, 4], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-3, 3, -3]} intensity={0.4} color="#06b6d4" />
        <RobotBody />
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Environment preset="night" />
        {/* Grid */}
        <gridHelper args={[10, 20, '#1a3a4a', '#0a1a20']} position={[0, -1.55, 0]} />
      </Canvas>
    </div>
  );
};

export default Robot3D;
