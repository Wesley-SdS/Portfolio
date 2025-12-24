"use client";
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { debounce } from '@/lib/utils/debounce';

interface TechPlanet {
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  initialAngle: number;
}

// Configurações de performance
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const DigitalGalaxy: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isVisible, setIsVisible] = useState(false);

  // Memoizar tecnologias para evitar recriação
  const technologies: TechPlanet[] = useMemo(() => [
    { name: 'React', color: '#61DAFB', size: 0.8, orbitRadius: 120, orbitSpeed: 0.5, initialAngle: 0 },
    { name: 'Next.js', color: '#000000', size: 0.7, orbitRadius: 160, orbitSpeed: 0.3, initialAngle: 45 },
    { name: 'TypeScript', color: '#3178C6', size: 0.6, orbitRadius: 200, orbitSpeed: 0.2, initialAngle: 90 },
    { name: 'Node.js', color: '#339933', size: 0.7, orbitRadius: 140, orbitSpeed: 0.4, initialAngle: 180 },
    { name: 'Python', color: '#3776AB', size: 0.7, orbitRadius: 180, orbitSpeed: 0.25, initialAngle: 270 },
    { name: 'PostgreSQL', color: '#336791', size: 0.5, orbitRadius: 220, orbitSpeed: 0.15, initialAngle: 135 },
  ], []);

  const debouncedResize = useMemo(
    () => debounce(() => {
      if (canvasRef.current?.parentElement) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    }, 250),
    []
  );

  useEffect(() => {
    // Initial resize
    if (canvasRef.current?.parentElement) {
      const { clientWidth, clientHeight } = canvasRef.current.parentElement;
      setDimensions({ width: clientWidth, height: clientHeight });
    }

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [debouncedResize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Memoizar estrelas para evitar recriação a cada frame
  const stars = useMemo(() => {
    const starsCount = dimensions.width > 768 ? 50 : 25; // Reduzido de 80/40
    return Array.from({ length: starsCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 2,
      brightness: Math.random()
    }));
  }, [dimensions.width, dimensions.height]);

  // Cache do gradiente central
  const coreGradientRef = useRef<CanvasGradient | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Cache do gradiente central (criado apenas uma vez)
    coreGradientRef.current = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    coreGradientRef.current.addColorStop(0, '#6366F1');
    coreGradientRef.current.addColorStop(0.5, '#8B5CF6');
    coreGradientRef.current.addColorStop(1, 'rgba(139, 92, 246, 0)');

    const animate = (currentTime: number) => {
      // Parar animação se não estiver visível
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

      // Clear com fillRect (mais rápido que clearRect para canvas opaco)
      ctx.fillStyle = '#0A0E1A';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw stars (batch drawing)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw orbit paths (uma única cor, batch)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      technologies.forEach(tech => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, tech.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw center core (usando gradiente cacheado)
      if (coreGradientRef.current) {
        ctx.fillStyle = coreGradientRef.current;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw tech planets
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      technologies.forEach((tech) => {
        const angle = (timeRef.current * tech.orbitSpeed + tech.initialAngle) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * tech.orbitRadius;
        const y = centerY + Math.sin(angle) * tech.orbitRadius;

        // Planet (sem glow para performance - simplificado)
        ctx.fillStyle = tech.color;
        ctx.beginPath();
        ctx.arc(x, y, tech.size * 10, 0, Math.PI * 2);
        ctx.fill();

        // Tech label
        ctx.fillStyle = '#ffffff';
        ctx.fillText(tech.name, x, y + tech.size * 10 + 15);
      });

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animação apenas se visível
    if (isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [dimensions, technologies, isVisible, stars]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default DigitalGalaxy;