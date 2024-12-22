'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Line, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useGesture } from '@use-gesture/react'
import { useWebGL } from '@/lib/webgl-context'
import { useTheme } from '@/lib/theme-context'

interface FlightPoint {
  position: THREE.Vector3
  time: number
}

function BallTrail({ points }: { points: FlightPoint[] }) {
  const { theme } = useTheme()
  const linePoints = points.map(p => [p.position.x, p.position.y, p.position.z]).flat()
  
  return (
    <Line
      points={linePoints}
      color={theme === 'dark' ? "#10B981" : "#059669"}
      lineWidth={2}
      dashed={false}
    />
  )
}

function GolfBall({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.02, 32, 32]} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
    </mesh>
  )
}

function Ground() {
  const { theme } = useTheme()
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color={theme === 'dark' ? "#1F2937" : "#E5E7EB"} />
    </mesh>
  )
}

function Scene({ 
  distance, 
  height, 
  spin,
  launchAngle 
}: { 
  distance: number
  height: number
  spin: number
  launchAngle: number
}) {
  const { camera } = useThree()
  const points = useRef<FlightPoint[]>([])
  const ballRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const timeRef = useRef(0)

  useEffect(() => {
    // Calculate flight path points
    points.current = []
    const numPoints = 100
    const maxTime = Math.sqrt((2 * height) / 9.81)

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints
      
      // Basic trajectory calculation
      const x = distance * t
      const y = height * Math.sin(Math.PI * t)
      
      // Add spin effect
      const spinEffect = (spin / 2500) * 30 * Math.pow(t, 3)
      const z = spinEffect * (1 - Math.pow(1 - t, 2))

      points.current.push({
        position: new THREE.Vector3(x, y, z),
        time: t * maxTime
      })
    }

    // Set initial camera position
    camera.position.set(distance/2, height * 1.5, distance/2)
    camera.lookAt(distance/2, height/2, 0)
  }, [distance, height, spin, launchAngle, camera])

  useFrame(({ clock }) => {
    // Animate ball along path
    const time = (clock.getElapsedTime() % 3) / 3
    const point = points.current[Math.floor(time * points.current.length)]
    if (point) {
      ballRef.current = point.position
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <BallTrail points={points.current} />
      <GolfBall position={ballRef.current} />
      <Ground />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={new THREE.Vector3(distance/2, height/2, 0)}
      />
    </>
  )
}

export default function Flight3DVisualization({
  distance,
  height,
  spin,
  launchAngle
}: {
  distance: number
  height: number
  spin: number
  launchAngle: number
}) {
  const { initRenderer } = useWebGL()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      initRenderer(canvasRef.current)
    }
  }, [initRenderer])

  const bind = useGesture({
    onPinch: ({ offset: [scale] }) => {
      // Trigger haptic feedback on pinch
      if ('vibrate' in navigator) {
        navigator.vibrate(20)
      }
    }
  })

  return (
    <div {...bind()} className="w-full h-full relative">
      <Canvas
        ref={canvasRef}
        camera={{ position: [5, 5, 5], fov: 75 }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault position={[0, 20, 20]} />
        <Scene
          distance={distance}
          height={height}
          spin={spin}
          launchAngle={launchAngle}
        />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
