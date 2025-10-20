"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode, FaRocket, FaLayerGroup, FaTerminal, FaCube, FaWaveSquare } from "react-icons/fa";

interface InteractiveDemo {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const InteractiveInterface: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>("particles");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [waveForm, setWaveForm] = useState<number[]>([]);

  const demos: InteractiveDemo[] = [
    { id: "particles", title: "Particle System", icon: <FaCube />, color: "from-purple-500 to-pink-500" },
    { id: "terminal", title: "Live Terminal", icon: <FaTerminal />, color: "from-green-500 to-teal-500" },
    { id: "cube", title: "3D Cube", icon: <FaCube />, color: "from-blue-500 to-cyan-500" },
    { id: "wave", title: "Wave Form", icon: <FaWaveSquare />, color: "from-orange-500 to-red-500" }
  ];

  const codeSnippets = [
    "const portfolio = {",
    "  developer: 'Wesley Santos',",
    "  stack: ['Next.js', 'React', 'TypeScript'],",
    "  experience: '9+ years',",
    "  passion: 'Clean Architecture'",
    "};"
  ];

  useEffect(() => {
    if (activeDemo === "particles") {
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1
      }));
      setParticles(newParticles);
    }
  }, [activeDemo]);

  useEffect(() => {
    if (activeDemo === "particles") {
      const interval = setInterval(() => {
        setParticles(prev => prev.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          if (newX <= 0 || newX >= 100) newVx = -newVx;
          if (newY <= 0 || newY >= 100) newVy = -newVy;

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [activeDemo]);

  useEffect(() => {
    if (activeDemo === "terminal" && !isTyping) {
      setIsTyping(true);
      setCodeLines([]);
      
      codeSnippets.forEach((line, index) => {
        setTimeout(() => {
          setCodeLines(prev => [...prev, line]);
          if (index === codeSnippets.length - 1) {
            setTimeout(() => {
              setIsTyping(false);
            }, 1000);
          }
        }, index * 300);
      });
    }
  }, [activeDemo, isTyping]);

  useEffect(() => {
    if (activeDemo === "cube") {
      const interval = setInterval(() => {
        setCubeRotation(prev => ({
          x: (prev.x + 1) % 360,
          y: (prev.y + 2) % 360
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [activeDemo]);

  useEffect(() => {
    if (activeDemo === "wave") {
      const interval = setInterval(() => {
        setWaveForm(prev => {
          const newWave = Array.from({ length: 20 }, (_, i) => 
            Math.sin((i + Date.now() / 200) * 0.5) * 30 + 50
          );
          return newWave;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [activeDemo]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDemo === "particles") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  };

  const renderInteractiveDemo = () => {
    switch (activeDemo) {
      case "particles":
        return (
          <div 
            className="relative h-64 glassmorphism rounded-xl overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
          >
            <svg className="absolute inset-0 w-full h-full">
              {particles.map(particle => (
                <motion.circle
                  key={particle.id}
                  cx={`${particle.x}%`}
                  cy={`${particle.y}%`}
                  r={particle.size}
                  fill="#8b5cf6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
              <motion.circle
                cx={`${mousePos.x}%`}
                cy={`${mousePos.y}%`}
                r="8"
                fill="#ec4899"
                opacity={0.6}
              />
            </svg>
            <div className="absolute bottom-4 left-4 text-sm text-slate-300">
              Particles: {particles.length} | Mouse: ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})
            </div>
          </div>
        );

      case "terminal":
        return (
          <div className="h-64 glassmorphism rounded-xl p-4 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400 ml-2">portfolio.js</span>
            </div>
            <div className="space-y-1">
              <AnimatePresence>
                {codeLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-400"
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-green-400"
                >
                  ▊
                </motion.span>
              )}
            </div>
          </div>
        );

      case "cube":
        return (
          <div className="h-64 glassmorphism rounded-xl flex items-center justify-center">
            <motion.div
              className="relative w-32 h-32"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-400/50 rounded-lg" />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-lg"
                style={{ transform: 'translateZ(20px)' }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-teal-500/30 border border-green-400/50 rounded-lg"
                style={{ transform: 'rotateY(90deg) translateZ(20px)' }}
              />
            </motion.div>
            <div className="absolute bottom-4 text-sm text-slate-300">
              Rotation: X:{cubeRotation.x}° Y:{cubeRotation.y}°
            </div>
          </div>
        );

      case "wave":
        return (
          <div className="h-64 glassmorphism rounded-xl p-4">
            <svg className="w-full h-full">
              <polyline
                points={waveForm.map((y, i) => `${(i / waveForm.length) * 100},${y}`).join(' ')}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
              />
              <polyline
                points={waveForm.map((y, i) => `${(i / waveForm.length) * 100},${100 - y}`).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute bottom-4 left-4 text-sm text-slate-300">
              Frequency: 0.5Hz | Amplitude: 30px
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="interface" className="py-20 deep-space-gradient">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading mb-6">
            <span className="text-purple">Interactive</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experiências interativas em tempo real demonstrando capacidades 
            técnicas e criatividade no desenvolvimento de interfaces dinâmicas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {demos.map((demo, index) => (
            <motion.button
              key={demo.id}
              className={`glassmorphism rounded-xl p-4 transition-all duration-300 ${
                activeDemo === demo.id ? 'ring-2 ring-purple-500 glow-effect' : 'hover:scale-105'
              }`}
              onClick={() => setActiveDemo(demo.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: activeDemo !== demo.id ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${demo.color} text-white mb-3`}>
                {demo.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-200">{demo.title}</h3>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="glassmorphism rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <FaRocket className="text-xl text-purple-400" />
              <h2 className="text-xl font-bold text-slate-200">
                {demos.find(d => d.id === activeDemo)?.title}
              </h2>
            </div>
            <p className="text-slate-400 mt-2">
              {activeDemo === "particles" && "Sistema de partículas interativas que reagem ao movimento do mouse"}
              {activeDemo === "terminal" && "Terminal animado com digitação dinâmica de código"}
              {activeDemo === "cube" && "Cubo 3D com rotação contínua e transformações CSS"}
              {activeDemo === "wave" && "Visualização de ondas senoidais em tempo real"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderInteractiveDemo()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-center">
            <motion.button
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
              onClick={() => {
                if (activeDemo === "terminal") {
                  setIsTyping(false);
                } else if (activeDemo === "particles") {
                  setParticles(prev => [...prev, 
                    ...Array.from({ length: 10 }, (_, i) => ({
                      id: Date.now() + i,
                      x: 50,
                      y: 50,
                      vx: (Math.random() - 0.5) * 2,
                      vy: (Math.random() - 0.5) * 2,
                      size: Math.random() * 3 + 1
                    }))
                  ]);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeDemo === "terminal" && "Re-run Code"}
              {activeDemo === "particles" && "Add Particles"}
              {activeDemo === "cube" && "Reset Rotation"}
              {activeDemo === "wave" && "Change Frequency"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveInterface;