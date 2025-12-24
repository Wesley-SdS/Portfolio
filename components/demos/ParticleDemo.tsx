"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const MAX_PARTICLES = 80; // Limite máximo de partículas

interface ParticleDemoProps {
  isVisible: boolean;
}

const ParticleDemo: React.FC<ParticleDemoProps> = React.memo(({ isVisible }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Inicializar partículas
  useEffect(() => {
    if (isVisible) {
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
      setParticles(newParticles);
      particlesRef.current = newParticles;
    }
  }, [isVisible]);

  // Animação usando Canvas (muito mais performático que SVG)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      // Throttle para TARGET_FPS
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      // Update particles
      particlesRef.current = particlesRef.current.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        if (newX <= 0 || newX >= 100) {
          newVx = -newVx * 0.8;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY <= 0 || newY >= 100) {
          newVy = -newVy * 0.8;
          newY = Math.max(0, Math.min(100, newY));
        }

        newVy += 0.08; // Gravidade reduzida

        return { ...particle, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      // Draw
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        const x = (particle.x / 100) * canvas.width;
        const y = (particle.y / 100) * canvas.height;

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      // Cursor indicator
      const cursorX = (mousePos.x / 100) * canvas.width;
      const cursorY = (mousePos.y / 100) * canvas.height;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 15, 0, Math.PI * 2);
      ctx.stroke();

      setParticles([...particlesRef.current]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, mousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  const handleClick = useCallback(() => {
    if (particlesRef.current.length >= MAX_PARTICLES) return;

    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: mousePos.x,
      y: mousePos.y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      size: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    particlesRef.current = [...particlesRef.current, ...newParticles].slice(-MAX_PARTICLES);
  }, [mousePos]);

  return (
    <div
      className="relative h-80 glassmorphism rounded-xl overflow-hidden cursor-crosshair bg-slate-900/50"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-4 left-4 text-sm text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg z-10">
        Particles: {particles.length} | Click to add more
      </div>
    </div>
  );
});

ParticleDemo.displayName = 'ParticleDemo';

export default ParticleDemo;
