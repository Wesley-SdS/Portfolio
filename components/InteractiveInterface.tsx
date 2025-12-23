"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaCode, FaRocket, FaLayerGroup, FaTerminal, FaCube, FaWaveSquare, FaBrain, FaGamepad, FaChartLine } from "react-icons/fa";

interface InteractiveDemo {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  activation: number;
  connections: number[];
}

const InteractiveInterface: React.FC = React.memo(() => {
  const [activeDemo, setActiveDemo] = useState<string>("particles");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [waveForm, setWaveForm] = useState<number[]>([]);
  const [neuralNetwork, setNeuralNetwork] = useState<NeuralNode[]>([]);
  const [gameScore, setGameScore] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  const demos: InteractiveDemo[] = [
    { 
      id: "particles", 
      title: "Particle Physics", 
      icon: <FaCube />, 
      color: "from-purple-500 to-pink-500",
      description: "Simulação de física de partículas com gravidade e colisões"
    },
    { 
      id: "matrix", 
      title: "Matrix Rain", 
      icon: <FaTerminal />, 
      color: "from-green-500 to-teal-500",
      description: "Efeito Matrix com caracteres caindo"
    },
    { 
      id: "neural", 
      title: "Neural Network", 
      icon: <FaBrain />, 
      color: "from-blue-500 to-cyan-500",
      description: "Visualização de rede neural com ativação dinâmica"
    },
    { 
      id: "cube", 
      title: "3D Cube", 
      icon: <FaCube />, 
      color: "from-orange-500 to-red-500",
      description: "Cubo 3D interativo com múltiplas faces animadas"
    },
    { 
      id: "game", 
      title: "Space Shooter", 
      icon: <FaGamepad />, 
      color: "from-indigo-500 to-purple-500",
      description: "Mini jogo de nave espacial"
    },
    { 
      id: "chart", 
      title: "Live Charts", 
      icon: <FaChartLine />, 
      color: "from-yellow-500 to-orange-500",
      description: "Gráficos dinâmicos com dados em tempo real"
    }
  ];

  const codeSnippets = [
    "class InteractiveExperience {",
    "  constructor() {",
    "    this.particles = [];",
    "    this.physics = new PhysicsEngine();",
    "    this.renderer = new WebGLRenderer();",
    "  }",
    "  render() {",
    "    this.particles.forEach(p => {",
    "      p.update(this.physics.gravity);",
    "      this.renderer.draw(p);",
    "    });",
    "  }",
    "}"
  ];

  const colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  useEffect(() => {
    if (activeDemo === "particles") {
      const newParticles: Particle[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
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

          if (newX <= 0 || newX >= 100) {
            newVx = -newVx * 0.8;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy * 0.8;
            newY = Math.max(0, Math.min(100, newY));
          }

          newVy += 0.1;

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [activeDemo]);

  useEffect(() => {
    if (activeDemo === "matrix" && matrixCanvasRef.current) {
      const canvas = matrixCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 320;

      const chars = '01';
      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array.from({ length: columns }, () => Math.random() * -20);

      let animationId: number;

      const draw = () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((drop, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drop * fontSize;

          ctx.fillText(char, x, y);

          if (y > canvas.height) {
            drops[i] = 0;
          }
          drops[i] += 0.5;
        });

        animationId = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [activeDemo]);

  useEffect(() => {
    if (activeDemo === "game" && gameCanvasRef.current) {
      const canvas = gameCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 320;

      let shipX = canvas.width / 2;
      let shipY = canvas.height - 50;
      let frameCount = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        shipX = e.clientX - rect.left;
      };

      canvas.addEventListener('mousemove', handleMouseMove);

      let animationId: number;

      const gameLoop = () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = 'white';
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            1, 1
          );
        }

        ctx.fillStyle = '#0FF';
        ctx.beginPath();
        ctx.moveTo(shipX, shipY);
        ctx.lineTo(shipX - 10, shipY + 20);
        ctx.lineTo(shipX + 10, shipY + 20);
        ctx.closePath();
        ctx.fill();

        if (frameCount % 10 === 0) {
          ctx.fillStyle = 'yellow';
          ctx.fillRect(shipX - 2, shipY - 10, 4, 10);
          setGameScore(prev => prev + 1);
        }

        frameCount++;
        animationId = requestAnimationFrame(gameLoop);
      };

      gameLoop();

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
      };
    }
  }, [activeDemo]);

  useEffect(() => {
    if (activeDemo === "neural") {
      const nodes: NeuralNode[] = [];
      const layers = [4, 6, 4, 2];
      let nodeId = 0;
      
      layers.forEach((count, layer) => {
        for (let i = 0; i < count; i++) {
          nodes.push({
            id: nodeId++,
            x: (layer / (layers.length - 1)) * 100,
            y: ((i + 1) / (count + 1)) * 100,
            activation: Math.random(),
            connections: []
          });
        }
      });

      for (let i = 0; i < nodes.length - layers[layers.length - 1]; i++) {
        const currentLayer = Math.floor(i / layers[0]);
        if (currentLayer < layers.length - 1) {
          for (let j = 0; j < layers[currentLayer + 1]; j++) {
            const targetIndex = layers.slice(0, currentLayer + 1).reduce((a, b) => a + b, 0) + j;
            nodes[i].connections.push(targetIndex);
          }
        }
      }

      setNeuralNetwork(nodes);

      const interval = setInterval(() => {
        setNeuralNetwork(prev => prev.map(node => ({
          ...node,
          activation: Math.sin(Date.now() / 1000 + node.id) * 0.5 + 0.5
        })));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [activeDemo]);

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
    if (activeDemo === "chart") {
      const interval = setInterval(() => {
        setChartData(prev => {
          const newData = [...prev.slice(-19), Math.random() * 80 + 20];
          return newData.length === 0 ? Array.from({ length: 20 }, () => Math.random() * 80 + 20) : newData;
        });
      }, 200);

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
        }, index * 100);
      });
    }
  }, [activeDemo, isTyping]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDemo === "particles") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  }, [activeDemo]);

  const renderInteractiveDemo = () => {
    switch (activeDemo) {
      case "particles":
        return (
          <div 
            className="relative h-80 glassmorphism rounded-xl overflow-hidden cursor-crosshair bg-slate-900/50"
            onMouseMove={handleMouseMove}
            onClick={() => {
              setParticles(prev => [...prev, 
                ...Array.from({ length: 10 }, (_, i) => ({
                  id: Date.now() + i,
                  x: mousePos.x,
                  y: mousePos.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  size: Math.random() * 3 + 1,
                  color: colors[Math.floor(Math.random() * colors.length)]
                }))
              ]);
            }}
          >
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {particles.map(particle => (
                <motion.circle
                  key={particle.id}
                  cx={`${particle.x}%`}
                  cy={`${particle.y}%`}
                  r={particle.size}
                  fill={particle.color}
                  filter="url(#glow)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.9, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
              <motion.circle
                cx={`${mousePos.x}%`}
                cy={`${mousePos.y}%`}
                r="12"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                opacity={0.6}
              />
            </svg>
            <div className="absolute bottom-4 left-4 text-sm text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg">
              Particles: {particles.length} | Click to add more
            </div>
          </div>
        );

      case "matrix":
        return (
          <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-black">
            <canvas
              ref={matrixCanvasRef}
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 text-sm text-green-400 bg-black/60 px-3 py-1 rounded">
              Matrix Rain Active
            </div>
          </div>
        );

      case "neural":
        return (
          <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-slate-900/50">
            <svg className="absolute inset-0 w-full h-full">
              {neuralNetwork.map(node => (
                <g key={node.id}>
                  {node.connections.map(targetId => {
                    const target = neuralNetwork.find(n => n.id === targetId);
                    if (!target) return null;
                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke="#8b5cf6"
                        strokeWidth="1"
                        opacity={node.activation * 0.5}
                      />
                    );
                  })}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="8"
                    fill="#3b82f6"
                    opacity={node.activation}
                  />
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="12"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity={node.activation * 0.5}
                  />
                </g>
              ))}
            </svg>
          </div>
        );

      case "cube":
        return (
          <div className="relative h-80 glassmorphism rounded-xl flex items-center justify-center bg-slate-900/50">
            <motion.div
              className="relative w-40 h-40"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 border border-blue-400/50 rounded-lg backdrop-blur-sm" />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-purple-400/50 rounded-lg backdrop-blur-sm"
                style={{ transform: 'translateZ(40px)' }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-500/40 to-teal-500/40 border border-green-400/50 rounded-lg backdrop-blur-sm"
                style={{ transform: 'rotateY(90deg) translateZ(40px)' }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-orange-500/40 to-red-500/40 border border-orange-400/50 rounded-lg backdrop-blur-sm"
                style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}
              />
            </motion.div>
            <div className="absolute bottom-4 text-sm text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg">
              Rotation: X:{cubeRotation.x}° Y:{cubeRotation.y}°
            </div>
          </div>
        );

      case "game":
        return (
          <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-black">
            <canvas
              ref={gameCanvasRef}
              className="w-full h-full cursor-none"
            />
            <div className="absolute top-4 right-4 text-2xl font-bold text-white bg-black/80 px-4 py-2 rounded-lg border-2 border-cyan-500">
              Score: {gameScore}
            </div>
            <div className="absolute bottom-4 left-4 text-sm text-cyan-400 bg-black/60 px-3 py-1 rounded">
              Move mouse to control
            </div>
          </div>
        );

      case "chart":
        return (
          <div className="relative h-80 glassmorphism rounded-xl overflow-hidden bg-slate-900/50">
            <svg className="w-full h-full p-4">
              {chartData.map((value, index) => (
                <motion.rect
                  key={index}
                  x={`${(index / chartData.length) * 100}%`}
                  y={`${100 - value}%`}
                  width={`${(1 / chartData.length) * 100 - 2}%`}
                  height={`${value}%`}
                  fill="url(#gradient)"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  style={{ transformOrigin: 'bottom' }}
                />
              ))}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
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
            <span className="text-purple">Interactive Lab</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experiências interativas avançadas demonstrando domínio técnico em 
            física, animações, redes neurais e renderização em tempo real.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
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
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${demo.color} text-white mb-2`}>
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
            <p className="text-slate-400 mt-2 text-sm">
              {demos.find(d => d.id === activeDemo)?.description}
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
                if (activeDemo === "particles") {
                  setParticles([]);
                } else if (activeDemo === "game") {
                  setGameScore(0);
                } else if (activeDemo === "chart") {
                  setChartData([]);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeDemo === "particles" && "Clear All"}
              {activeDemo === "neural" && "Reset Network"}
              {activeDemo === "cube" && "Reset Rotation"}
              {activeDemo === "game" && "Reset Score"}
              {activeDemo === "chart" && "Clear Data"}
              {activeDemo === "matrix" && "Reset Rain"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

InteractiveInterface.displayName = 'InteractiveInterface';

export default InteractiveInterface;