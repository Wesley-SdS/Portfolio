"use client";

import React, { useState, useEffect, useRef } from "react";

const TARGET_FPS = 10; // Chart pode atualizar bem mais lento
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const DATA_UPDATE_INTERVAL = 200; // ms

interface ChartDemoProps {
  isVisible: boolean;
}

const ChartDemo: React.FC<ChartDemoProps> = React.memo(({ isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const dataRef = useRef<number[]>(Array.from({ length: 20 }, () => Math.random() * 80 + 20));
  const lastDataUpdateRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth || 600;
      canvas.height = canvas.offsetHeight || 320;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const padding = 40;

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      // Throttle rendering
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

      // Update data periodically
      if (currentTime - lastDataUpdateRef.current > DATA_UPDATE_INTERVAL) {
        dataRef.current = [...dataRef.current.slice(1), Math.random() * 80 + 20];
        lastDataUpdateRef.current = currentTime;
      }

      const data = dataRef.current;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;

      // Clear
      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = 1;

      // Horizontal grid
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();

        // Y axis labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${100 - i * 25}`, padding - 8, y + 4);
      }

      // Draw bars with gradient
      const barWidth = (chartWidth / data.length) - 4;

      data.forEach((value, index) => {
        const x = padding + (chartWidth / data.length) * index + 2;
        const barHeight = (value / 100) * chartHeight;
        const y = padding + chartHeight - barHeight;

        // Gradient for each bar
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#f97316');

        ctx.fillStyle = gradient;

        // Rounded top corners
        const radius = 4;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.lineTo(x, y + barHeight);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();

        // Highlight effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y, barWidth / 3, barHeight);
      });

      // Draw line graph overlay
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((value, index) => {
        const x = padding + (chartWidth / data.length) * index + barWidth / 2;
        const y = padding + chartHeight - (value / 100) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points on line
      data.forEach((value, index) => {
        const x = padding + (chartWidth / data.length) * index + barWidth / 2;
        const y = padding + chartHeight - (value / 100) * chartHeight;

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-slate-900/50">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-sm text-amber-400 bg-slate-900/80 px-3 py-1 rounded z-10">
        Live Data Feed
      </div>
    </div>
  );
});

ChartDemo.displayName = 'ChartDemo';

export default ChartDemo;
