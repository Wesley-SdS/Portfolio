"use client";

import React, { useRef, useEffect } from "react";

const TARGET_FPS = 24; // Matrix pode rodar mais lento
const FRAME_INTERVAL = 1000 / TARGET_FPS;

interface MatrixRainDemoProps {
  isVisible: boolean;
}

const MatrixRainDemo: React.FC<MatrixRainDemoProps> = React.memo(({ isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth || 600;
      canvas.height = canvas.offsetHeight || 320;

      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      dropsRef.current = Array.from({ length: columns }, () => Math.random() * -20);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;

    const draw = (currentTime: number) => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      // Throttle
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      dropsRef.current.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drop * fontSize;

        // Variação de cor para efeito mais interessante
        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = '#FFF'; // Cabeça mais brilhante
        } else {
          ctx.fillStyle = `rgb(0, ${Math.floor(200 + brightness * 55)}, 0)`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i] += 0.5;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-sm text-green-400 bg-black/60 px-3 py-1 rounded z-10">
        Matrix Rain Active
      </div>
    </div>
  );
});

MatrixRainDemo.displayName = 'MatrixRainDemo';

export default MatrixRainDemo;
