"use client";

import React, { useRef, useEffect, useState } from "react";

const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

interface SpaceGameDemoProps {
  isVisible: boolean;
}

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
}

const SpaceGameDemo: React.FC<SpaceGameDemoProps> = React.memo(({ isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const shipXRef = useRef<number>(300);
  const starsRef = useRef<Star[]>([]);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth || 600;
      canvas.height = canvas.offsetHeight || 320;
      shipXRef.current = canvas.width / 2;

      // Criar estrelas uma vez
      starsRef.current = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 2 + 0.5
      }));
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const shipY = canvas.height - 50;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      shipXRef.current = e.clientX - rect.left;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let frameCount = 0;

    const gameLoop = (currentTime: number) => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      // Throttle
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + star.speed / 4})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ship
      ctx.fillStyle = '#0FF';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0FF';
      ctx.beginPath();
      ctx.moveTo(shipXRef.current, shipY);
      ctx.lineTo(shipXRef.current - 12, shipY + 24);
      ctx.lineTo(shipXRef.current + 12, shipY + 24);
      ctx.closePath();
      ctx.fill();

      // Engine glow
      ctx.fillStyle = '#F80';
      ctx.shadowColor = '#F80';
      ctx.beginPath();
      ctx.moveTo(shipXRef.current - 5, shipY + 24);
      ctx.lineTo(shipXRef.current, shipY + 32 + Math.random() * 5);
      ctx.lineTo(shipXRef.current + 5, shipY + 24);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;

      // Shoot laser every 15 frames
      if (frameCount % 15 === 0) {
        ctx.fillStyle = '#FF0';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#FF0';
        ctx.fillRect(shipXRef.current - 2, shipY - 20, 4, 15);
        ctx.shadowBlur = 0;

        scoreRef.current += 1;
        if (scoreRef.current % 5 === 0) {
          setScore(scoreRef.current);
        }
      }

      frameCount++;
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  // Reset score quando fica visível
  useEffect(() => {
    if (isVisible) {
      scoreRef.current = 0;
      setScore(0);
    }
  }, [isVisible]);

  return (
    <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-black">
      <canvas ref={canvasRef} className="w-full h-full cursor-none" />
      <div className="absolute top-4 right-4 text-2xl font-bold text-white bg-black/80 px-4 py-2 rounded-lg border-2 border-cyan-500 z-10">
        Score: {score}
      </div>
      <div className="absolute bottom-4 left-4 text-sm text-cyan-400 bg-black/60 px-3 py-1 rounded z-10">
        Move mouse to control
      </div>
    </div>
  );
});

SpaceGameDemo.displayName = 'SpaceGameDemo';

export default SpaceGameDemo;
