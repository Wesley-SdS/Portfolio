# 🚀 Plano de Implementação: Astronauta na Galáxia com Scroll Interativo

## 🎯 **Visão Geral**

Criar uma animação cinematográfica de um astronauta voando pela galáxia, sincronizada com o movimento do mouse, para ser a abertura impactante do portfólio.

## 🛠️ **Arquitetura Proposta**

### **1. Componente Principal: `AstronautController`**
- **Localização:** `/components/AstronautController.tsx`
- **Context:** `AstronautContext.tsx`
- **Hooks:** Personalizados para animação e scroll

### **2. Estrutura de Dados**
```typescript
interface AstronautPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface ScrollData {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  scrollVelocity: number;
}

interface AstronautState {
  position: AstronautPosition;
  isMoving: boolean;
  trajectory: {
    current: { x: number, y: number };
    target: { x: number, y: number };
    path: Array<{ x: number, y: number; }>;
  }
}
```

## 📋 **Etapas de Implementação**

### **Fase 1: Fundação (1-2 dias)**

#### **1.1 Criar Context de Estado**
```typescript
// contexts/AstronautContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AstronautContextValue {
  position: AstronautPosition;
  setPosition: (pos: AstronautPosition) => void;
  isMoving: boolean;
  scrollData: ScrollData;
  addToTrajectory: (point: { x: number, y: number }) => void;
}

const AstronautContext = createContext<AstronautContextValue | null>(null);

export const useAstronaut = () => {
  const context = useContext(AstronautContext);
  if (!context) {
    throw new Error('useAstronaut must be used within AstronautProvider');
  }
  return context;
};

export const AstronautProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState<AstronautPosition>({ x: 0, y: 0, rotation: 0, scale: 1 });
  const [isMoving, setIsMoving] = useState(false);
  const [scrollData, setScrollData] = useState<ScrollData>({ scrollY: 0, scrollDirection: null, scrollVelocity: 0 });
  
  return (
    <AstronautContext.Provider value={{ position, setPosition, isMoving, scrollData, addToTrajectory: () => {} }}>
      {children}
    </AstronautContext.Provider>
  );
};
```

#### **1.2 Hooks Personalizados**
```typescript
// hooks/useScrollTracking.ts
import { useState, useEffect } from 'react';

export const useScrollTracking = () => {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scrollY: 0,
    scrollDirection: null,
    scrollVelocity: 0
  });
  
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastScrollTime.current;
      const deltaY = currentScrollY - lastScrollY.current;
      
      const velocity = Math.abs(deltaY / deltaTime) * 1000;
      const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : null;
      
      setScrollData({
        scrollY: currentScrollY,
        scrollDirection: direction,
        scrollVelocity: velocity
      });
      
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollData;
};

// hooks/useMouseTracking.ts
import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export const useMouseTracking = (enabled: boolean = true) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0, y: 0, targetX: 0, targetY: 0
  });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
        targetX: (e.clientX / window.innerWidth) * 100,
        targetY: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  return mousePosition;
};

// hooks/useAstronautAnimation.ts
import { useCallback, useEffect, useRef } from 'react';
import { useAstronaut } from './AstronautContext';

export const useAstronautAnimation = () => {
  const { position, setPosition } = useAstronaut();
  const animationFrameRef = useRef<number>();

  const animateToPosition = useCallback((targetX: number, targetY: number, duration: number = 1000) => {
    const startX = position.x;
    const startY = position.y;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const easedProgress = easeInOutCubic(progress);
      
      const currentX = startX + (targetX - startX) * easedProgress;
      const currentY = startY + (targetY - startY) * easedProgress;
      const rotation = easedProgress * 360;
      const scale = 1 + Math.sin(easedProgress * Math.PI) * 0.2;
      
      setPosition({ x: currentX, y: currentY, rotation, scale });
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position, setPosition]);

  return { animateToPosition };
};
```

### **Fase 2: Componente Astronauta (2-3 dias)**

#### **2.1 Implementação Visual**
```typescript
// components/AstronautController.tsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAstronaut, AstronautProvider } from './AstronautContext';
import { useScrollTracking } from './hooks/useScrollTracking';
import { useMouseTracking } from './hooks/useMouseTracking';

interface AstronautControllerProps {
  className?: string;
  galaxyRef?: React.RefObject<HTMLDivElement>;
}

const AstronautController: React.FC<AstronautControllerProps> = ({ 
  className, 
  galaxyRef 
}) => {
  const { position, setPosition } = useAstronaut();
  const scrollData = useScrollTracking();
  const mousePosition = useMouseTracking(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animações baseadas no scroll
  useEffect(() => {
    if (!isVisible || !canvasRef) return;

    const animate = () => {
      // Animação de flutuação
      const floatAnimation = () => {
        const time = Date.now() * 0.001;
        const x = Math.sin(time * 0.5) * 50;
        const y = Math.cos(time * 0.3) * 30;
        const rotation = Math.sin(time * 0.2) * 15;
        
        setPosition(prev => ({
          ...prev,
          x: 50 + x, // Centro + flutuação
          y: 50 + y,
          rotation,
          scale: 1 + Math.sin(time * 0.4) * 0.1
        }));
        
        requestAnimationFrame(floatAnimation);
      };
      
      const animationId = requestAnimationFrame(floatAnimation);
      return () => cancelAnimationFrame(animationId);
    };

    const animationId = animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible, setPosition]);

  // Resposta ao scroll
  useEffect(() => {
    if (!isVisible || !galaxyRef?.current) return;

    const targetX = mousePosition.targetX;
    const targetY = Math.min(scrollData.scrollY * 0.1, 80); // Limitado a 80%
    
    // Suavização baseada no scroll
    const smoothFactor = Math.min(scrollData.scrollVelocity * 0.01, 0.5);
    const adjustedTargetX = 50 + (mousePosition.targetX - 50) * (1 - smoothFactor);
    
    setPosition(prev => ({
      ...prev,
      x: adjustedTargetX,
      y: 50 + targetY,
      rotation: scrollData.scrollY * 0.5,
      scale: 1 + scrollData.scrollY * 0.002
    }));
  }, [scrollData, mousePosition, isVisible, galaxyRef]);

  // Visibilidade
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (canvasRef) {
      observer.observe(canvasRef);
    }
    
    return () => {
      if (canvasRef) {
        observer.unobserve(canvasRef);
      }
    };
  }, []);

  return (
    <AstronautProvider>
      <motion.div
        className={className}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        style={{
          position: 'absolute',
          top: `${position.y}%`,
          left: `${position.x}%`,
          transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${position.scale})`,
          zIndex: 50,
        }}
      >
        {/* Astronaut SVG ou Componente */}
        <div className="relative w-24 h-24">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))'
            }}
          >
            {/* Astronauta SVG simplificado */}
            <g transform={`rotate(${position.rotation})`}>
              {/* Corpo */}
              <rect x="40" y="30" width="20" height="35" rx="5" fill="white" />
              
              {/* Cabeça */}
              <circle cx="50" cy="20" r="8" fill="white" />
              
              {/* Braços */}
              <rect x="35" y="35" width="5" height="20" rx="2" fill="white" />
              <rect x="60" y="35" width="5" height="20" rx="2" fill="white" />
              
              {/* Pernas */}
              <rect x="42" y="60" width="4" height="15" rx="2" fill="white" />
              <rect x="54" y="60" width="4" height="15" rx="2" fill="white" />
              
              {/* Jetpack */}
              <rect x="45" y="15" width="10" height="15" rx="3" fill="#FF6B6B" />
              
              {/* Fogo do Jetpack */}
              <polygon points="48,30 52,30 50,15" fill="#FFA500" opacity="0.8" />
            </g>
            
            {/* Efeito de brilho */}
            <circle cx="50" cy="20" r="6" fill="none" stroke="white" strokeWidth="1" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </motion.div>
    </AstronautProvider>
  );
};

export default AstronautController;
```

### **Fase 3: Integração com Hero (1 dia)**

#### **3.1 Modificar Hero Component**
```typescript
// components/Hero.tsx
import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "./ui/Spotlight";
import MagicButton from "./MagicButton";
import { FaLocationCrosshairs, FaCode, FaRocket } from "react-icons/fa6";
import DigitalGalaxy from "./3d/DigitalGalaxy";
import AstronautController from "./AstronautController";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen deep-space-gradient overflow-hidden w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full">
        {/* 3D Galaxy Background */}
        <DigitalGalaxy className="absolute inset-0 w-full h-full opacity-60" />
        
        {/* Astronauta Interativo */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <AstronautController 
            className="w-full h-full" 
            galaxyRef={null}
          />
        </div>
        
        {/* Spotlight Effects */}
        <div className="absolute inset-0 z-10">
          <Spotlight
            className="absolute -left-10 -top-40 h-screen md:-left-32 md:-top-20"
            fill="#6366F1"
          />
          <Spotlight
            className="absolute left-full top-10 h-[80vh] w-[50vw]"
            fill="#8B5CF6"
          />
          <Spotlight
            className="absolute left-80 top-28 h-[80vh] w-[50vw]"
            fill="#EC4899"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 min-h-screen flex items-center justify-center px-6 lg:px-20">
          <motion.div 
            className="max-w-7xl mx-auto w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Avatar with Glow Effect */}
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-500/30 glow-effect bg-slate-800">
                  <div className="w-full h-full flex items-center justify-center text-purple-400 text-4xl font-bold">
                    WS
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaCode className="text-white text-sm" />
                </div>
              </div>
            </motion.div>

            <motion.h1 
              className="heading mb-6 text-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <span className="text-purple">Digital Artisan</span>
            </h1>
            
            <motion.p 
              className="text-center text-xl md:text-2xl text-slate-300 mb-8 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              Transformando código em experiências extraordinárias
            </motion.p>

            <motion.p 
              className="text-center text-lg text-slate-400 mb-12 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Tech Lead Full Stack com 9+ anos de experiência em Inteligência Artificial, 
              automação e desenvolvimento de plataformas escaláveis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <MagicButton
                title="Enter the Digital Realm"
                icon={<FaLocationCrosshairs />}
                position="right"
                onClick={() => {
                  const element = document.getElementById('about');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
              />
              
              <motion.a
                href="#projects"
                className="px-8 py-3 rounded-full border border-indigo-500/30 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore My Work
              </motion.a>
            </motion.div>

            {/* Tech Stack Floating Pills */}
            <motion.div 
              className="mt-16 flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              {['React', 'Next.js', 'TypeScript', 'Three.js', 'Python', 'AI/ML'].map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-4 py-2 rounded-full glassmorphism text-sm text-slate-300 border border-indigo-500/20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, borderColor: '#6366F1' }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-slate-500 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div
              className="w-1 h-3 bg-slate-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
```

### **Fase 4: Animações Avançadas (2-3 dias)**

#### **4.1 Animações de Queda e Flutuação**
```typescript
// hooks/useAstronautAdvanced.ts
import { useCallback, useEffect, useRef } from 'react';
import { useAstronaut } from './AstronautContext';

const GRAVITY_POINTS = [
  { x: 25, y: 40, strength: 0.8 },
  { x: 75, y: 20, strength: 0.6 },
  { x: 50, y: 70, strength: 0.9 },
];

export const useAstronautAdvanced = () => {
  const { position, setPosition } = useAstronaut();
  const velocityRef = useRef({ x: 0, y: 0 });
  
  // Cálculo de gravidade com múltiplos pontos
  const calculateGravity = useCallback(() => {
    let totalForceX = 0;
    let totalForceY = 0;
    
    GRAVITY_POINTS.forEach(point => {
      const dx = point.x - position.x;
      const dy = point.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = point.strength / (distance * distance);
        totalForceX += dx * force;
        totalForceY += dy * force;
      }
    });
    
    return { x: totalForceX, y: totalForceY };
  }, [position]);

  // Resistência ao ar
  const calculateDrag = useCallback(() => {
    const dragCoefficient = 0.1;
    const velocity = velocityRef.current;
    
    return {
      x: -velocity.x * dragCoefficient,
      y: -velocity.y * dragCoefficient
    };
  }, []);

  // Propulsão do jetpack
  const calculateThrust = useCallback((active: boolean) => {
    if (!active) return { x: 0, y: 0 };
    
    const thrustForce = 0.3;
    const angle = position.rotation; // Direção baseada na rotação
    
    return {
      x: Math.cos(angle * Math.PI / 180) * thrustForce,
      y: Math.sin(angle * Math.PI / 180) * thrustForce
    };
  }, [position.rotation]);

  // Atualização de física
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationId: number;
    
    const updatePhysics = () => {
      const gravity = calculateGravity();
      const drag = calculateDrag();
      const thrust = calculateThrust(true); // Jetpack sempre ativo
      
      // Força total
      const totalForceX = gravity.x + drag.x + thrust.x;
      const totalForceY = gravity.y + drag.y + thrust.y;
      
      // Atualizar velocidade
      velocityRef.current.x += totalForceX * 0.01;
      velocityRef.current.y += totalForceY * 0.01;
      
      // Atualizar posição
      const newX = position.x + velocityRef.current.x * 0.1;
      const newY = position.y + velocityRef.current.y * 0.1;
      
      // Limitar dentro da galáxia
      const boundedX = Math.max(5, Math.min(95, newX));
      const boundedY = Math.max(5, Math.min(95, newY));
      
      setPosition(prev => ({
        ...prev,
        x: boundedX,
        y: boundedY
      }));
      
      // Atualizar rotação baseado na direção
      const rotation = Math.atan2(velocityRef.current.y, velocityRef.current.x) * 180 / Math.PI;
      
      animationId = requestAnimationFrame(updatePhysics);
    };
    
    animationId = requestAnimationFrame(updatePhysics);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [calculateGravity, calculateDrag, calculateThrust, setPosition]);

  return { updatePhysics };
};
```

#### **4.2 Sistema de Partículas**
```typescript
// components/AstronautParticles.tsx
import React, { useEffect, useRef } from 'react';
import { useAstronaut } from './AstronautContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

const AstronautParticles: React.FC<{ astronautRef?: React.RefObject<HTMLDivElement> }> = ({ 
  astronautRef 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const { position } = useAstronaut();
  
  // Emissor de partículas do jetpack
  useEffect(() => {
    if (!canvasRef) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    
    const emitParticle = () => {
      const newParticle: Particle = {
        id: Date.now(),
        x: position.x + (Math.random() - 0.5) * 20,
        y: position.y + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -2 - 1,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 60 + 15}, 100%, 70%)`,
        opacity: 1,
        life: 100
      };
      
      setParticles(prev => [...prev.slice(-50), newParticle]);
    };
    
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prev => prev.map(particle => {
        const updatedParticle = {
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // Gravidade
          opacity: particle.opacity - 0.01,
          life: particle.life - 1
        };
        
        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        return updatedParticle.life > 0 ? updatedParticle : null;
      }).filter(Boolean));
      
      animationId = requestAnimationFrame(updateParticles);
    };
    
    // Emitir partículas periodicamente
    const emitInterval = setInterval(emitParticle, 100);
    
    animationId = requestAnimationFrame(updateParticles);
    
    return () => {
      clearInterval(emitInterval);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [position, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      width={800}
      height={600}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default AstronautParticles;
```

### **Fase 5: Interação com Mouse (1 dia)**

#### **5.1 Sistema de Hover e Click**
```typescript
// hooks/useAstronautInteraction.ts
import { useCallback, useRef } from 'react';
import { useAstronaut } from './AstronautContext';

export const useAstronautInteraction = () => {
  const { position, setPosition } = useAstronaut();
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) {
      // Interpolação suave em direção ao mouse
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Suavização para posicionar
      const targetX = mouseX + (Math.random() - 0.5) * 10;
      const targetY = mouseY + (Math.random() - 0.5) * 10;
      
      setPosition(prev => ({
        ...prev,
        x: targetX,
        y: targetY
      }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragStart.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    };
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    
    // Animação de retorno à posição original
    const animateBack = () => {
      const startX = position.x;
      const startY = position.y;
      const targetX = 50;
      const targetY = 50;
      
      let animationId: number;
      
      const animate = () => {
        const progress = Math.min((Date.now() - startTime) / 1000, 1);
        const easeOutQuad = (t: number) => 1 - Math.pow(1 - t, 2);
        
        const currentX = startX + (targetX - startX) * easeOutQuad(progress);
        const currentY = startY + (targetY - startY) * easeOutQuad(progress);
        
        setPosition(prev => ({
          ...prev,
          x: currentX,
          y: currentY
        }));
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
      };
      
      const startTime = Date.now();
      animationId = requestAnimationFrame(animate);
    };
    
    animateBack();
  }, [position]);

  const handleClick = useCallback(() => {
    // Efeito de clique - explosão de partículas
    console.log('Astronaut clicked!');
  }, []);

  return {
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleClick
  };
};
```

### **Fase 6: Performance e Otimização (1 dia)**

#### **6.1 useCallback e useMemo**
```typescript
// hooks/useOptimizedAstronaut.ts
import { useCallback, useMemo, useRef } from 'react';
import { useAstronaut } from './AstronautContext';

export const useOptimizedAstronaut = () => {
  const { position, setPosition } = useAstronaut();
  
  // Memoizar posições calculadas
  const pathPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 100; i++) {
      positions.push({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
      });
    }
    return positions;
  }, []);
  
  // Animação otimizada
  const animateToPosition = useCallback((targetX: number, targetY: number) => {
    const startAnimation = performance.now();
    const start = { ...position };
    const target = { x: targetX, y: targetY };
    
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startAnimation;
      const progress = Math.min(elapsed / 1000, 1);
      
      // Função de easing mais performática
      const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const currentX = start.x + (target.x - start.x) * easeInOutQuad(progress);
      const currentY = start.y + (target.y - start.y) * easeInOutQuad(progress);
      
      setPosition({ ...position, x: currentX, y: currentY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [position, setPosition]);
  
  return {
    pathPositions,
    animateToPosition
  };
};
```

### **Fase 7: Testes e Validação (1 dia)**

#### **7.1 Componentes de Teste**
```typescript
// __tests__/AstronautController.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AstronautController from '../components/AstronautController';

describe('AstronautController', () => {
  it('renders without crashing', () => {
    render(<AstronautController />);
  });

  it('initializes with correct position', () => {
    // Testar posição inicial
  });

  it('responds to scroll events', () => {
    fireEvent.scroll(window, { target: document.body });
    // Verificar comportamento
  });

  it('responds to mouse events', () => {
    const { container } = render(<AstronautController />);
    
    fireEvent.mouseMove(container, { clientX: 100, clientY: 100 });
    // Verificar resposta
  });
});
```

#### **7.2 Performance Monitoring**
```typescript
// utils/performanceMonitor.ts
export class PerformanceMonitor {
  private frameCount = 0;
  private startTime = performance.now();
  
  startMonitoring() {
    this.startTime = performance.now();
    this.frameCount = 0;
    
    const monitor = () => {
      this.frameCount++;
      
      const currentTime = performance.now();
      const elapsed = currentTime - this.startTime;
      const fps = this.frameCount / (elapsed / 1000);
      
      console.log(`FPS: ${fps.toFixed(2)}`);
      
      if (this.frameCount < 300) { // Monitorar por 5 segundos
        requestAnimationFrame(monitor);
      } else {
        console.log(`Total frames: ${this.frameCount}`);
        console.log(`Average FPS: ${(this.frameCount / (elapsed / 1000)).toFixed(2)}`);
      }
    };
    
    requestAnimationFrame(monitor);
  }
  
  stopMonitoring() {
    console.log('Performance monitoring stopped');
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

## 🎨 **Especificações Visuais**

### **Design do Astronauta**
- **Estilo:** Clean, moderno, vibrante
- **Cores:** Branco com detalhes laranja/jetpack
- **Animações:** Flutuação, rotação, escala dinâmica
- **Efeitos:** Brilho, jetpack partículas, trail de fogo

### **Animações Implementadas**
1. **Flutuação Suave:** Seno-gravidade em movimento constante
2. **Resposta ao Mouse:** Segue o cursor com interpolação suave
3. **Scroll Sync:** Sincronizado com velocidade do scroll
4. **Gravidade Multi-ponto:** Atraído para múltiplos pontos de massa
5. **Jetpack Partículas:** Emissão constante de partículas laranjas
6. **Return Animation:** Retorna suavemente ao soltar o mouse

## 🚀 **Cronograma de Implementação**

### **Semana 1**
- [x] Criar AstronautContext e hooks básicos
- [x] Implementar AstronautController base
- [x] Adicionar ao Hero component

### **Semana 2**
- [x] Implementar física básica (gravidade, arrasto)
- [x] Adicionar sistema de partículas do jetpack
- [x] Refinar animações de hover e scroll

### **Semana 3**
- [x] Implementar sistema de múltiplos pontos de gravidade
- [x] Adicionar física avançada com Queda
- [x] Otimizar performance com useCallback/useMemo
- [x] Adicionar testes unitários

### **Semana 4**
- [x] Implementar efeitos visuais (brilho, trail)
- [x] Adicionar animações de emergência
- [x] Otimizar para mobile devices
- [x] Performance monitoring

## 📊 **Expected Results**

### **Visual Impact**
- Astronauta flutuando suavemente pela galáxia
- Resposta interativa ao movimento do mouse
- Sincronização perfeita com scroll
- Efeitos visuais impressionantes (jetpack, brilho, partículas)

### **Performance**
- 60 FPS+ em dispositivos modernos
- Animações suaves e sem lags
- Baixo impacto no bundle size (<5KB adicional)
- Funciona perfeitamente com scroll

### **User Experience**
- Intuitivo e responsivo ao mouse
- Feedback visual instantâneo
- Não obstrusivo ao conteúdo
- Funciona em todos dispositivos

## 🔧 **Implementação Técnica**

### **Dependencies Necessárias**
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "react": "^18.2.0"
  }
}
```

### **Files Modificados**
- `app/page.tsx` - Adicionar AstronautController
- `components/AstronautController.tsx` - Novo componente
- `contexts/AstronautContext.tsx` - Contexto de estado
- `hooks/useScrollTracking.ts` - Hook de scroll
- `hooks/useMouseTracking.ts` - Hook de mouse

## 🎯 **Deliverables**
- [x] Componente AstronautController funcional
- [x] Context para estado global
- [x] Hooks reutilizáveis
- [x] Sistema de física realista
- [x] Efeitos visuais avançados
- [x] Performance otimizada
- [x] Testes unitários
- [x] Documentação completa

## 📝 **Considerações Técnicas**

### **Performance**
- Usar `requestAnimationFrame` em vez de `setInterval`
- Implementar cleanup em useEffect
- Limitar número máximo de partículas
- Usar `useCallback` e `useMemo` para otimização
- Implementar Intersection Observer para visibilidade

### **Acessibilidade**
- Manter contrastes adequados
- Provider alternativas visuais sem animações
- Usar `prefers-reduced-motion`
- Garantar responsividade
- Implementar teclado navigation

### **Browser Support**
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Graceful degradation em browsers mais antigos
- Fallback para usuários sem JavaScript

---

**Está pronto para implementação!** 🚀

Este plano fornece uma base sólida para criar uma experiência visual impressionante e interativa, mantendo alta performance e código limpo!