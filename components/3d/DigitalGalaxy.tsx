"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TechPlanet {
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  initialAngle: number;
}

const DigitalGalaxy: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isVisible, setIsVisible] = useState(false);

  const technologies: TechPlanet[] = [
    { name: 'React', color: '#61DAFB', size: 0.8, orbitRadius: 120, orbitSpeed: 0.5, initialAngle: 0 },
    { name: 'Next.js', color: '#000000', size: 0.7, orbitRadius: 160, orbitSpeed: 0.3, initialAngle: 45 },
    { name: 'TypeScript', color: '#3178C6', size: 0.6, orbitRadius: 200, orbitSpeed: 0.2, initialAngle: 90 },
    { name: 'Node.js', color: '#339933', size: 0.7, orbitRadius: 140, orbitSpeed: 0.4, initialAngle: 180 },
    { name: 'Python', color: '#3776AB', size: 0.7, orbitRadius: 180, orbitSpeed: 0.25, initialAngle: 270 },
    { name: 'PostgreSQL', color: '#336791', size: 0.5, orbitRadius: 220, orbitSpeed: 0.15, initialAngle: 135 },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let animationId: number;
    let time = 0;

    // Background stars
    const starsCount = dimensions.width > 768 ? 80 : 40;
    const stars: Array<{ x: number; y: number; size: number; brightness: number }> = [];
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2,
        brightness: Math.random()
      });
    }

    const animate = () => {
      ctx.fillStyle = '#0A0E1A';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // Draw orbit paths
      technologies.forEach(tech => {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, tech.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw center core
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
      gradient.addColorStop(0, '#6366F1');
      gradient.addColorStop(0.5, '#8B5CF6');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw tech planets
      technologies.forEach((tech, index) => {
        const angle = (time * tech.orbitSpeed + tech.initialAngle) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * tech.orbitRadius;
        const y = centerY + Math.sin(angle) * tech.orbitRadius;

        // Planet glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, tech.size * 20);
        glowGradient.addColorStop(0, tech.color + '40');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, tech.size * 20, 0, Math.PI * 2);
        ctx.fill();

        // Planet
        ctx.fillStyle = tech.color;
        ctx.beginPath();
        ctx.arc(x, y, tech.size * 10, 0, Math.PI * 2);
        ctx.fill();

        // Tech label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tech.name, x, y + tech.size * 10 + 15);
      });

      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions, technologies, isVisible]);

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