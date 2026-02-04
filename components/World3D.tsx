import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, RoundedBox, Float, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { Cell, CharacterDef, Player, ThemeMode } from '../types';
import { CHARACTERS } from '../data/gameConfig';

// Add missing type definitions for React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      capsuleGeometry: any;
      sphereGeometry: any;
      fog: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}

// --- VISUAL COMPONENTS ---

const Tile: React.FC<{ cell: Cell, isVisited: boolean, isActive: boolean, theme: ThemeMode }> = ({ cell, isVisited, isActive, theme }) => {
  const isDark = theme === 'dark';
  
  let baseColor = isDark ? "#1e293b" : "#e0e7ff"; 
  if (cell.isStart) baseColor = "#059669"; 
  if (cell.isEnd) baseColor = "#d97706"; 
  if (isVisited && !cell.isStart && !cell.isEnd) baseColor = isDark ? "#334155" : "#c7d2fe";
  if (isActive) baseColor = "#4f46e5"; 

  return (
    <group position={cell.position}>
      <RoundedBox args={[2.2, 0.3, 2.2]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={baseColor} metalness={0.2} roughness={0.8} />
      </RoundedBox>
      <Text 
        position={[0, 0.25, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={0.4} 
        color={isVisited ? (isDark ? "#94a3b8" : "#6366f1") : (isDark ? "white" : "#1e1b4b")}
        anchorX="center"
        anchorY="middle"
      >
        {cell.content}
      </Text>
      <Text position={[0.9, 0.25, 0.9]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.15} color={isDark ? "#64748b" : "#94a3b8"}>
        {cell.pathIndex}
      </Text>
    </group>
  );
};

const PlayerModel: React.FC<{ position: [number, number, number], charDef: CharacterDef, isActive: boolean }> = ({ position, charDef, isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = new THREE.Vector3(...position);

  // SLOW and HIGH Jump Logic
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos.x, delta * 2);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos.z, delta * 2);

      const dist = new THREE.Vector3(groupRef.current.position.x, 0, groupRef.current.position.z).distanceTo(new THREE.Vector3(targetPos.x, 0, targetPos.z));
      
      if (dist > 0.1) {
        // High Arc
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 4 + 0.5;
        groupRef.current.rotation.y += delta * 5;
      } else {
        // Landed
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, delta * 5);
        if (isActive) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2; 
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.75, 0]}>
         <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
         <meshStandardMaterial color={charDef.color} />
      </mesh>
      <mesh position={[0.12, 1.2, 0.2]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.12, 1.2, 0.2]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};

interface World3DProps {
  snakePath: Cell[];
  players: Player[];
  activePlayerIndex: number;
  theme: ThemeMode;
}

export const World3D: React.FC<World3DProps> = ({ snakePath, players, activePlayerIndex, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-full absolute inset-0 z-0 ${isDark ? 'bg-slate-900' : 'bg-indigo-50'}`}>
      <Canvas shadows camera={{ position: [0, 20, 15], fov: 40 }}>
        <fog attach="fog" args={[isDark ? '#0f172a' : '#eef2ff', 15, 50]} />
        <ambientLight intensity={isDark ? 0.4 : 0.8} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2} 
          castShadow 
        />
        
        {isDark && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
        {!isDark && <Cloud opacity={0.5} speed={0.4} bounds={[10, 2, 10]} segments={20} position={[0, 10, -10]} />}

        <group position={[0, -2, 0]}>
            {snakePath.map((cell) => {
              const isVisited = players.some(p => p.history.some(h => h.pathIndex === cell.pathIndex));
              const isActive = players[activePlayerIndex].currentPathIndex === cell.pathIndex;
              
              return (
                <Tile 
                    key={cell.id} 
                    cell={cell} 
                    isVisited={isVisited}
                    isActive={isActive}
                    theme={theme}
                />
              );
            })}

            {players.map((p, idx) => {
                const charDef = CHARACTERS.find(c => c.id === p.characterId)!;
                const targetCell = snakePath[p.currentPathIndex];
                
                if (!targetCell) return null;

                const isActive = idx === activePlayerIndex;

                // --- COLLISION LOGIC: Prevent Overlap ---
                const playersOnTile = players.filter(pl => pl.currentPathIndex === p.currentPathIndex);
                
                // Clone position to apply offset without mutating original cell data
                const displayPos: [number, number, number] = [
                    targetCell.position[0],
                    targetCell.position[1],
                    targetCell.position[2]
                ];

                if (playersOnTile.length > 1) {
                    // Sort by ID to ensure deterministic positioning (Player 1 always Left, Player 2 always Right)
                    const sorted = [...playersOnTile].sort((a, b) => a.id - b.id);
                    const myRank = sorted.findIndex(pl => pl.id === p.id);
                    
                    // Logic: Distribute players around the center X
                    // Tile width is ~2.2. Spacing of 1.0 unit keeps them comfortably on the tile.
                    // 2 players: -0.5 and +0.5
                    const offset = (myRank - (playersOnTile.length - 1) / 2) * 1.0;
                    
                    displayPos[0] += offset;
                    // Add slight Z offset so they aren't in a perfect straight line (looks more natural)
                    displayPos[2] += (myRank % 2 === 0 ? 0.2 : -0.2);
                }
                // ----------------------------------------

                return (
                    <PlayerModel 
                        key={p.id} 
                        position={displayPos} 
                        charDef={charDef} 
                        isActive={isActive}
                    />
                );
            })}
        </group>

        <OrbitControls 
            enablePan={true}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={40}
        />
      </Canvas>
    </div>
  );
};