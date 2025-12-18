import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarModelProps {
  modelPath: string;
  onError: () => void;
}

function AvatarModel({ modelPath, onError }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  
  let scene: THREE.Group;
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch (e) {
    onError();
    return null;
  }
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    targetRotation.current.y = mousePosition.current.x * 0.44;
    targetRotation.current.x = mousePosition.current.y * 0.26;
    
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
  const [modelExists, setModelExists] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);
  
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
  
  // Check if model file exists
  useEffect(() => {
    fetch('/models/avatar-bust.glb', { method: 'HEAD' })
      .then(res => {
        // Check if response is actually a GLB file (not HTML fallback)
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && !contentType.includes('text/html')) {
          setModelExists(true);
        } else {
          setModelExists(false);
        }
      })
      .catch(() => setModelExists(false));
  }, []);
  
  // Show fallback image if WebGL not supported, model doesn't exist, or error occurred
  if (!webGLSupported || modelExists === false || hasError) {
    return (
      <img 
        src={fallbackImage} 
        alt="Retrato de Rafael Bacellar, Product Designer" 
        className={`rounded-full border-2 border-border object-cover aspect-square ${className}`}
        style={{ boxShadow: "var(--shadow-elegant)" }}
      />
    );
  }
  
  // Show loading state while checking model
  if (modelExists === null) {
    return (
      <div className={`rounded-full border-2 border-border bg-muted/50 animate-pulse aspect-square ${className}`} />
    );
  }
  
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '1/1' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        style={{ 
          background: 'transparent',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        <directionalLight position={[-3, 2, 4]} intensity={0.4} />
        
        <Suspense fallback={<LoadingFallback />}>
          <AvatarModel 
            modelPath="/models/avatar-bust.glb" 
            onError={() => setHasError(true)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
