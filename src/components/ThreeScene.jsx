import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Line, Stars } from '@react-three/drei';
import { useContacts } from '../context/ContactsContext';
import { CATEGORIES } from '../utils/logic';
import * as THREE from 'three';

function Axis({ start, end, label, color = "white" }) {
    return (
        <group>
            <Line points={[start, end]} color={color} lineWidth={1} />
            <Text position={end} fontSize={0.5} color={color} anchorX="center" anchorY="middle">
                {label}
            </Text>
            {[2, 4, 6, 8, 10].map(v => {
                const pos = new THREE.Vector3().lerpVectors(new THREE.Vector3(...start), new THREE.Vector3(...end), v / 10);
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
            <Axis start={[0, 0, 0]} end={[11, 0, 0]} label="Value (X)" color="#ef4444" />
            <Axis start={[0, 0, 0]} end={[0, 11, 0]} label="Energy (Y)" color="#eab308" />
            <Axis start={[0, 0, 0]} end={[0, 0, 11]} label="Access (Z)" color="#3b82f6" />

            <lineSegments position={[5, 5, 5]}>
                <edgesGeometry args={[new THREE.BoxGeometry(10, 10, 10)]} />
                <lineBasicMaterial color="#333" transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
}

function DataPoint({ contact, onClick }) {
    const [hovered, setHovered] = useState(false);
    const color = CATEGORIES[contact.category]?.color || 'white';
    const position = [Number(contact.x), Number(contact.y), Number(contact.z)];

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
                    <Line points={[[0, 0, 0], [-position[0], 0, 0]]} color="gray" dashed opacity={0.5} />
                    <Line points={[[0, 0, 0], [0, -position[1], 0]]} color="gray" dashed opacity={0.5} />
                    <Line points={[[0, 0, 0], [0, 0, -position[2]]]} color="gray" dashed opacity={0.5} />
                </group>
            )}

            {hovered && (
                <Html distanceFactor={15} zIndexRange={[100, 0]}>
                    <div className="bg-zinc-900/90 border border-zinc-700 p-3 rounded-lg shadow-xl backdrop-blur-md w-48 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]">
                        <h4 className="font-bold text-white text-lg">{contact.name}</h4>
                        <p className="text-xs text-zinc-400 font-mono mb-2">
                            [{contact.x}, {contact.y}, {contact.z}]
                        </p>
                        <div className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-600 inline-block text-zinc-300">
                            {CATEGORIES[contact.category]?.label}
                        </div>
                        {contact.note && <p className="mt-2 text-xs text-zinc-500 italic truncate">{contact.note}</p>}
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
