'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

/**
 * Modelo geométrico procedural distinto según la categoría del repuesto.
 * Así cada producto tiene una representación 3D reconocible sin necesidad
 * de subir archivos .glb.
 */
function ModeloCategoria({ categoria, color }: { categoria?: string; color: string }) {
  const cat = (categoria || '').toLowerCase();

  // BATERÍAS → bloque tipo pack con dos bornes arriba
  if (cat.includes('bater')) {
    return (
      <group>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.9, 1]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[-0.4, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 32]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.4, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 32]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
    );
  }

  // MOTORES → cubo/hub cilíndrico con eje central
  if (cat.includes('motor')) {
    return (
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.9, 48]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.4, 32]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.15} metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <torusGeometry args={[0.75, 0.06, 16, 48]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>
    );
  }

  // CONTROLADORES → módulo plano tipo caja electrónica
  if (cat.includes('control')) {
    return (
      <group>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.5, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.2, 0.15, 0.8]} />
          <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
    );
  }

  // CHASIS Y ESTRUCTURA → nudo estructural metálico
  if (cat.includes('chas') || cat.includes('estruct') || cat.includes('amortig')) {
    return (
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.85, 0.28, 128, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.85} />
      </mesh>
    );
  }

  // POR DEFECTO → esfera premium
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1.1, 64, 64]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

interface Visor3dProps {
  categoria?: string;
  color?: string;
}

export default function Visor3d({ categoria, color = '#2563eb' }: Visor3dProps) {
  return (
    <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }}>
        {/* Stage configura automáticamente luces suaves y sombras premium de estudio */}
        <Stage environment="city" intensity={0.6} shadows={{ type: 'contact', opacity: 0.5, blur: 2 }}>
          <ModeloCategoria categoria={categoria} color={color} />
        </Stage>

        {/* Permite rotar, hacer zoom y mover el objeto con el mouse/dedo */}
        <OrbitControls
          enableZoom={true}
          makeDefault
          maxPolarAngle={Math.PI / 2}
          minDistance={2.5}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
