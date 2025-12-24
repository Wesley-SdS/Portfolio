"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

interface CubeDemoProps {
  isVisible: boolean;
}

const CubeDemo: React.FC<CubeDemoProps> = React.memo(({ isVisible }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      // Throttle
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      rotationRef.current = {
        x: (rotationRef.current.x + 1) % 360,
        y: (rotationRef.current.y + 2) % 360
      };

      setRotation({ ...rotationRef.current });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div className="relative h-80 glassmorphism rounded-xl flex items-center justify-center bg-slate-900/50">
      <div
        className="relative w-40 h-40"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-purple-400/50 rounded-lg backdrop-blur-sm"
          style={{ transform: 'translateZ(80px)' }}
        />
        {/* Back face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 border border-blue-400/50 rounded-lg backdrop-blur-sm"
          style={{ transform: 'translateZ(-80px) rotateY(180deg)' }}
        />
        {/* Right face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-500/40 to-teal-500/40 border border-green-400/50 rounded-lg backdrop-blur-sm"
          style={{ transform: 'rotateY(90deg) translateZ(80px)' }}
        />
        {/* Left face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/40 to-red-500/40 border border-orange-400/50 rounded-lg backdrop-blur-sm"
          style={{ transform: 'rotateY(-90deg) translateZ(80px)' }}
        />
        {/* Top face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-yellow-500/40 to-amber-500/40 border border-yellow-400/50 rounded-lg backdrop-blur-sm"
          style={{ transform: 'rotateX(90deg) translateZ(80px)' }}
        />
        {/* Bottom face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border border-indigo-400/50 rounded-lg backdrop-blur-sm"
          style={{ transform: 'rotateX(-90deg) translateZ(80px)' }}
        />
      </div>
      <div className="absolute bottom-4 text-sm text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg">
        Rotation: X:{rotation.x}° Y:{rotation.y}°
      </div>
    </div>
  );
});

CubeDemo.displayName = 'CubeDemo';

export default CubeDemo;
