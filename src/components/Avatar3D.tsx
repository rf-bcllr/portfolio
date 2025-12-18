import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarModelProps {
  modelPath: string;
}

function AvatarModel({ modelPath }: AvatarModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Mouse position state
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Calculate target rotation based on mouse position
    // Limit rotation: ~25° horizontal (0.44 rad), ~15° vertical (0.26 rad)
    targetRotation.current.y = mousePosition.current.x * 0.44;
    targetRotation.current.x = mousePosition.current.y * 0.26;
    
    // Smooth interpolation (lerp factor 0.08)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.08
    );
  });
  
  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={2.5}
        position={[0, -1.8, 0]}
      />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#888" opacity={0.3} transparent />
    </mesh>
  );
}

interface Avatar3DProps {
  fallbackImage: string;
  className?: string;
}

export function Avatar3D({ fallbackImage, className }: Avatar3DProps) {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);
  
  // Fallback to static image if WebGL not supported
  if (!webGLSupported) {
    return (
      <img 
        src={fallbackImage} 
        alt="Retrato de Rafael Bacellar, Product Designer" 
        className={`rounded-full border-2 border-border object-cover ${className}`}
        style={{ boxShadow: "var(--shadow-elegant)" }}
      />
    );
  }
  
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '1/1' }}>
      {/* Loading skeleton */}
      {!modelLoaded && (
        <div className="absolute inset-0 rounded-full border-2 border-border bg-muted/50 animate-pulse" />
      )}
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        style={{ 
          background: 'transparent',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}
        onCreated={() => setModelLoaded(true)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        <directionalLight position={[-3, 2, 4]} intensity={0.4} />
        
        <Suspense fallback={<LoadingFallback />}>
          <AvatarModel modelPath="/models/avatar-bust.glb" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/avatar-bust.glb');
