"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  activation: number;
  layer: number;
  connections: number[];
}

const TARGET_FPS = 20; // Rede neural pode ser mais lenta
const FRAME_INTERVAL = 1000 / TARGET_FPS;

interface NeuralNetworkDemoProps {
  isVisible: boolean;
}

const NeuralNetworkDemo: React.FC<NeuralNetworkDemoProps> = React.memo(({ isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Criar rede neural uma vez
  const network = useMemo(() => {
    const nodes: NeuralNode[] = [];
    const layers = [4, 6, 4, 2];
    let nodeId = 0;

    layers.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        const connections: number[] = [];
        // Conectar com a próxima camada
        if (layer < layers.length - 1) {
          const nextLayerStart = layers.slice(0, layer + 1).reduce((a, b) => a + b, 0);
          for (let j = 0; j < layers[layer + 1]; j++) {
            connections.push(nextLayerStart + j);
          }
        }

        nodes.push({
          id: nodeId++,
          x: (layer / (layers.length - 1)) * 80 + 10, // 10% padding
          y: ((i + 1) / (count + 1)) * 100,
          activation: Math.random(),
          layer,
          connections
        });
      }
    });

    return nodes;
  }, []);

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

      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 0.05;

      // Draw connections first
      ctx.lineWidth = 1;
      network.forEach(node => {
        const activation = Math.sin(timeRef.current + node.id * 0.5) * 0.5 + 0.5;
        const x1 = (node.x / 100) * canvas.width;
        const y1 = (node.y / 100) * canvas.height;

        node.connections.forEach(targetId => {
          const target = network[targetId];
          if (!target) return;

          const x2 = (target.x / 100) * canvas.width;
          const y2 = (target.y / 100) * canvas.height;

          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, `rgba(139, 92, 246, ${activation * 0.6})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, ${activation * 0.6})`);

          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      });

      // Draw nodes
      network.forEach(node => {
        const activation = Math.sin(timeRef.current + node.id * 0.5) * 0.5 + 0.5;
        const x = (node.x / 100) * canvas.width;
        const y = (node.y / 100) * canvas.height;

        // Outer glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(59, 130, 246, ${activation})`;

        // Node fill
        ctx.fillStyle = `rgba(59, 130, 246, ${activation})`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(139, 92, 246, ${activation * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
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
  }, [isVisible, network]);

  return (
    <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-slate-900/50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-4 left-4 text-sm text-blue-400 bg-slate-900/80 px-3 py-1 rounded z-10">
        Neural Network - 4 Layers
      </div>
    </div>
  );
});

NeuralNetworkDemo.displayName = 'NeuralNetworkDemo';

export default NeuralNetworkDemo;
