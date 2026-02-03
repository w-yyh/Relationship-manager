import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Line, Stars } from '@react-three/drei';
import { useContacts } from '../context/ContactsContext';
import { CATEGORIES } from '../utils/logic';
import { getTagById } from '../utils/tags';
import * as THREE from 'three';

function Axis({ start, end, label, color = "white" }) {
    // start and end are in world coordinates (-5 to 5)
    // We want to label them 0 to 10
    // World -5 -> Data 0
    // World 0 -> Data 5
    // World 5 -> Data 10
    
    return (
        <group>
            <Line points={[start, end]} color={color} lineWidth={1} />
            <Text position={end} fontSize={0.5} color={color} anchorX="center" anchorY="middle">
                {label}
            </Text>
            {[0, 2, 4, 6, 8, 10].map(v => {
                // Map data value v (0-10) to world lerp factor
                // Data 0 is at start (t=0), Data 10 is at end (t=1)? 
                // Wait, start is -5, end is 5.
                // If we pass start=[-5,..] and end=[5,..], then t=0 is -5(Data 0), t=1 is 5(Data 10).
                const t = v / 10;
                const pos = new THREE.Vector3().lerpVectors(new THREE.Vector3(...start), new THREE.Vector3(...end), t);
                
                // Skip label at origin (5) to avoid clutter if needed, or keep it.
                // Center is 5.
                return (
                    <Text key={v} position={pos} fontSize={0.2} color="gray">
                        {v}
                    </Text>
                )
            })}
        </group>
    );
}

function GridBox() {
    return (
        <group>
            {/* Axes spanning from -5 to 5 (Data 0 to 10) */}
            <Axis start={[-5, 0, 0]} end={[5, 0, 0]} label="Value (X)" color="#ef4444" />
            <Axis start={[0, -5, 0]} end={[0, 5, 0]} label="Energy (Y)" color="#eab308" />
            <Axis start={[0, 0, -5]} end={[0, 0, 5]} label="Access (Z)" color="#3b82f6" />

            {/* Bounding Box centered at 0,0,0 */}
            <lineSegments position={[0, 0, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(10, 10, 10)]} />
                <lineBasicMaterial color="#333" transparent opacity={0.3} />
            </lineSegments>
            
            {/* Optional: Add a subtle grid plane at the center for reference */}
             <gridHelper args={[10, 10, 0x444444, 0x222222]} position={[0, -5, 0]} />
        </group>
    );
}

function DataPoint({ contact, onClick }) {
    const [hovered, setHovered] = useState(false);
    const color = CATEGORIES[contact.category]?.color || 'white';
    
    // Shift position: Data(0..10) -> World(-5..5)
    const position = [Number(contact.x) - 5, Number(contact.y) - 5, Number(contact.z) - 5];

    useFrame(() => {
        if (hovered) {
            document.body.style.cursor = 'pointer';
        }
    });

    return (
        <group position={position}>
            <Sphere
                args={[0.2, 32, 32]}
                onClick={(e) => { e.stopPropagation(); onClick(contact); }}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
            >
                <meshStandardMaterial
                    color={hovered ? 'white' : color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>

            {hovered && (
                <group>
                    {/* Lines drop to the central planes (X=0, Y=0, Z=0 which is Data=5) */}
                    {/* The point is at 'position' relative to world 0,0,0 */}
                    {/* Inside this group, local 0,0,0 is the point. */}
                    {/* We want to draw line to [0, y, z] (projected to YZ plane, i.e. X=0) */}
                    {/* Vector from Point(x,y,z) to Proj(0,y,z) is (-x, 0, 0). */}
                    {/* So points=[[0,0,0], [-position[0], 0, 0]] works perfectly to project to center planes. */}
                    
                    <Line points={[[0, 0, 0], [-position[0], 0, 0]]} color="gray" dashed opacity={0.5} />
                    <Line points={[[0, 0, 0], [0, -position[1], 0]]} color="gray" dashed opacity={0.5} />
                    <Line points={[[0, 0, 0], [0, 0, -position[2]]]} color="gray" dashed opacity={0.5} />
                </group>
            )}

            {hovered && (
                <Html distanceFactor={15} zIndexRange={[100, 0]}>
                    <div className="bg-zinc-900/95 border border-zinc-700 p-4 rounded-lg shadow-xl backdrop-blur-md w-72 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]">
                        <h4 className="font-bold text-white text-lg">{contact.name}</h4>
                        <p className="text-xs text-zinc-400 font-mono mb-2">
                            [{contact.x}, {contact.y}, {contact.z}]
                        </p>
                        <div className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-600 inline-block text-zinc-300 mb-2">
                            {CATEGORIES[contact.category]?.label}
                        </div>
                        
                        {contact.tags && contact.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {contact.tags.map(tagId => {
                                    const tag = getTagById(tagId);
                                    if (!tag) return null;
                                    return (
                                        <span 
                                            key={tagId} 
                                            className="text-[10px] px-1.5 py-0.5 rounded border"
                                            style={{ 
                                                borderColor: tag.color, 
                                                color: tag.color,
                                                backgroundColor: `${tag.color}11`
                                            }}
                                        >
                                            {tag.label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {(contact.value_provide || contact.value_receive) && (
                            <div className="space-y-1 mb-2 border-t border-zinc-800 pt-2">
                                {contact.value_provide && (
                                    <div className="text-xs">
                                        <span className="text-green-400 font-semibold">Provide:</span> <span className="text-zinc-300">{contact.value_provide}</span>
                                    </div>
                                )}
                                {contact.value_receive && (
                                    <div className="text-xs">
                                        <span className="text-blue-400 font-semibold">Receive:</span> <span className="text-zinc-300">{contact.value_receive}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {contact.note && (
                            <div className="mt-2 pt-2 border-t border-zinc-800">
                                <p className="text-xs text-zinc-400 italic whitespace-pre-wrap break-words">{contact.note}</p>
                            </div>
                        )}
                    </div>
                </Html>
            )}
        </group>
    );
}

export function ThreeScene() {
    const { contacts } = useContacts();

    return (
        <div className="w-full h-full bg-black relative">
            <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
                <OrbitControls makeDefault minDistance={5} maxDistance={30} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#000', 10, 50]} />

                <GridBox />

                {contacts.map(contact => (
                    <DataPoint key={contact.id} contact={contact} onClick={() => { }} />
                ))}
            </Canvas>

            <div className="absolute bottom-4 right-4 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 backdrop-blur text-xs text-zinc-400 max-w-xs pointer-events-none">
                <p className="font-bold text-zinc-200 mb-2">Legend</p>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Value (X)</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Energy (Y)</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Access (Z)</div>
                </div>
            </div>
        </div>
    );
}
