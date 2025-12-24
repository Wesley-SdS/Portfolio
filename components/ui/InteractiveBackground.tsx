'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticlesProps {
  mousePosition: { x: number; y: number }
}

function Particles({ mousePosition }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null!)
  const { invalidate } = useThree()

  // Reduzido para melhor performance
  const particleCount = 800

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    return positions
  }, [])

  const particlesSpeed = useMemo(() => {
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      speeds[i] = Math.random() * 0.02 + 0.001
    }

    return speeds
  }, [])

  useFrame((state) => {
    if (!ref.current) return

    const time = state.clock.getElapsedTime()
    const positions = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      positions[i3] += Math.sin(time * particlesSpeed[i] + i) * 0.001
      positions[i3 + 1] += Math.cos(time * particlesSpeed[i] + i) * 0.001

      if (positions[i3] > 5) positions[i3] = -5
      if (positions[i3] < -5) positions[i3] = 5
      if (positions[i3 + 1] > 5) positions[i3 + 1] = -5
      if (positions[i3 + 1] < -5) positions[i3 + 1] = 5
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    invalidate()
  })

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null!)
  const { invalidate } = useThree()

  const connections = useMemo(() => {
    const positions = []
    const count = 20 // Reduzido

    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 8
      const y1 = (Math.random() - 0.5) * 8
      const z1 = (Math.random() - 0.5) * 2

      const x2 = x1 + (Math.random() - 0.5) * 2
      const y2 = y1 + (Math.random() - 0.5) * 2
      const z2 = z1 + (Math.random() - 0.5) * 0.5

      positions.push(x1, y1, z1, x2, y2, z2)
    }

    return new Float32Array(positions)
  }, [])

  useFrame((state) => {
    if (!ref.current) return

    const time = state.clock.getElapsedTime()
    const positions = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < positions.length; i += 6) {
      positions[i] += Math.sin(time * 0.5 + i) * 0.001
      positions[i + 1] += Math.cos(time * 0.3 + i) * 0.001
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    invalidate()
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[connections, 3]}
          count={connections.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

interface InteractiveBackgroundProps {
  fixed?: boolean
}

export function InteractiveBackground({ fixed = false }: InteractiveBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  // Garantir que só renderiza no cliente
  useEffect(() => {
    setIsMounted(true)

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      id="interactive-bg"
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 overflow-hidden pointer-events-none z-0`}
      style={{
        transform: 'translateZ(0)',
        willChange: 'auto',
        contain: 'layout style paint'
      }}
    >
      {/* Background sólido simples */}
      <div
        className="absolute inset-0"
        style={{ background: '#0A0E1A' }}
      />

      {/* Gradiente suave com GPU acceleration */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* Canvas 3D - renderiza apenas quando visível */}
      {isMounted && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ background: 'transparent' }}
          dpr={1}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            alpha: true
          }}
          frameloop="demand"
          className="absolute inset-0 z-10"
        >
          <ambientLight intensity={0.5} />
          <Particles mousePosition={mousePosition} />
          <ConnectionLines />
        </Canvas>
      )}
    </div>
  )
}

export default InteractiveBackground;
