'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useWebGL } from '@/lib/webgl-context'

interface FlightVizProps {
  distance: number
  height: number
  launchAngle: number
}

export function FlightViz({ distance, height, launchAngle }: FlightVizProps) {
  const { renderer } = useWebGL()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const ballRef = useRef<THREE.Mesh | null>(null)
  const pathRef = useRef<THREE.Line | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !renderer) return

    // Initialize scene if not already done
    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene()
      
      // Add camera
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      cameraRef.current.position.set(0, 10, 20)
      cameraRef.current.lookAt(0, 0, 0)

      // Add ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        side: THREE.DoubleSide
      })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      sceneRef.current.add(ground)

      // Add ball
      const ballGeometry = new THREE.SphereGeometry(0.2)
      const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      ballRef.current = new THREE.Mesh(ballGeometry, ballMaterial)
      sceneRef.current.add(ballRef.current)

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      sceneRef.current.add(ambientLight)

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(5, 5, 5)
      sceneRef.current.add(directionalLight)
    }

    // Update ball position and path
    if (ballRef.current && sceneRef.current) {
      // Calculate ball path points
      const points: THREE.Vector3[] = []
      const numPoints = 50
      const maxTime = Math.sqrt((2 * height) / 9.81)
      
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * maxTime
        const x = (distance * t) / maxTime
        const y = height - (4.905 * t * t)
        points.push(new THREE.Vector3(x, y, 0))
      }

      // Update ball position
      ballRef.current.position.copy(points[0])

      // Update or create path line
      if (pathRef.current) {
        sceneRef.current.remove(pathRef.current)
      }
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const pathMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
      pathRef.current = new THREE.Line(pathGeometry, pathMaterial)
      sceneRef.current.add(pathRef.current)
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      if (sceneRef.current && cameraRef.current && renderer) {
        renderer.render(sceneRef.current, cameraRef.current)
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [distance, height, launchAngle, renderer])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: '#1a1a1a' }}
    />
  )
}
