"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ExperienceNode {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  position: { x: number; y: number };
  color: string;
}

const ExperienceTimeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const experiences: ExperienceNode[] = [
    {
      id: 1,
      title: "Líder Técnico Sênior",
      company: "Adalink",
      period: "Jun 2025 - Presente",
      description: "Liderança técnica em projetos de IA e automação",
      position: { x: 200, y: 100 },
      color: "#6366F1"
    },
    {
      id: 2,
      title: "Programador Sênior",
      company: "Adalink",
      period: "Fev 2025 - Jun 2025",
      description: "Desenvolvimento full stack de soluções em IA",
      position: { x: 150, y: 200 },
      color: "#8B5CF6"
    },
    {
      id: 3,
      title: "Desenvolvedor Full Stack",
      company: "Love Startup",
      period: "Dez 2024 - Jan 2025",
      description: "MVP de marketplace multi-vendedor",
      position: { x: 100, y: 300 },
      color: "#EC4899"
    },
    {
      id: 4,
      title: "Desenvolvedor Full Stack",
      company: "Freelancer.com",
      period: "Out 2023 - Dez 2024",
      description: "E-commerce customizado de ponta a ponta",
      position: { x: 50, y: 400 },
      color: "#F59E0B"
    },
    {
      id: 5,
      title: "Programador Sênior",
      company: "Melhor do Grão",
      period: "Out 2015 - Out 2023",
      description: "E-commerce, marketplace e ERP completo",
      position: { x: 0, y: 500 },
      color: "#10B981"
    }
  ];

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

    const updateCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateCanvas();
    window.addEventListener('resize', updateCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw DNA-like helix structure
      const centerY = canvas.height / 2;
      const amplitude = 100;
      const frequency = 0.01;

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 2;

      // First helix strand
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const y = centerY + Math.sin((x + time) * frequency) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Second helix strand
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const y = centerY + Math.cos((x + time) * frequency) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw connecting rungs
      for (let x = 0; x < canvas.width; x += 50) {
        const y1 = centerY + Math.sin((x + time) * frequency) * amplitude;
        const y2 = centerY + Math.cos((x + time) * frequency) * amplitude;
        
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }

      // Draw experience nodes
      experiences.forEach((exp, index) => {
        const x = (canvas.width / experiences.length) * index + (canvas.width / experiences.length) / 2;
        const baseY = centerY + Math.sin((x + time) * frequency) * amplitude;
        const y = baseY + (index % 2 === 0 ? -20 : 20);

        // Node glow effect
        if (hoveredNode === exp.id) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
          gradient.addColorStop(0, exp.color + '60');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.fillStyle = exp.color;
        ctx.beginPath();
        ctx.arc(x, y, hoveredNode === exp.id ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = exp.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, hoveredNode === exp.id ? 12 : 8, 0, Math.PI * 2);
        ctx.stroke();

        // Year label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const year = exp.period.split(' - ')[0];
        ctx.fillText(year, x, y - 20);
      });

      time += 2;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [experiences, hoveredNode, isVisible]);

  return (
    <div className="relative w-full h-96 mb-8">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: hoveredNode ? 'pointer' : 'default' }}
      />
      
      {/* Experience Cards Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto p-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="glassmorphism rounded-lg p-4 hover:glow-effect transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredNode(exp.id)}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: exp.color }}
                />
                <h4 className="font-semibold text-slate-200 text-sm">{exp.title}</h4>
              </div>
              <p className="text-xs text-slate-400 mb-1">{exp.company}</p>
              <p className="text-xs text-slate-500 mb-2">{exp.period}</p>
              <p className="text-xs text-slate-300 line-clamp-2">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;