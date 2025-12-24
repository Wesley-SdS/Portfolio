"use client";

import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaCube, FaTerminal, FaBrain, FaGamepad, FaChartLine } from "react-icons/fa";

// Lazy load dos demos para melhor performance
const ParticleDemo = lazy(() => import("./demos/ParticleDemo"));
const MatrixRainDemo = lazy(() => import("./demos/MatrixRainDemo"));
const NeuralNetworkDemo = lazy(() => import("./demos/NeuralNetworkDemo"));
const CubeDemo = lazy(() => import("./demos/CubeDemo"));
const SpaceGameDemo = lazy(() => import("./demos/SpaceGameDemo"));
const ChartDemo = lazy(() => import("./demos/ChartDemo"));

interface InteractiveDemo {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Loading fallback component
const DemoLoading: React.FC = () => (
  <div className="h-80 glassmorphism rounded-xl flex items-center justify-center bg-card/50 dark:bg-slate-900/50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-muted-foreground text-sm">Loading demo...</span>
    </div>
  </div>
);

const InteractiveInterface: React.FC = React.memo(() => {
  const [activeDemo, setActiveDemo] = useState<string>("particles");
  const [isVisible, setIsVisible] = useState(false);

  // Memoizar lista de demos
  const demos: InteractiveDemo[] = useMemo(() => [
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
  ], []);

  // Intersection Observer para pausar quando não visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const section = document.getElementById('interface');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Encontrar demo ativo
  const currentDemo = useMemo(
    () => demos.find(d => d.id === activeDemo),
    [demos, activeDemo]
  );

  // Renderizar demo baseado no ID
  const renderDemo = () => {
    // Só renderizar se visível
    if (!isVisible) {
      return <DemoLoading />;
    }

    switch (activeDemo) {
      case "particles":
        return <ParticleDemo isVisible={isVisible} />;
      case "matrix":
        return <MatrixRainDemo isVisible={isVisible} />;
      case "neural":
        return <NeuralNetworkDemo isVisible={isVisible} />;
      case "cube":
        return <CubeDemo isVisible={isVisible} />;
      case "game":
        return <SpaceGameDemo isVisible={isVisible} />;
      case "chart":
        return <ChartDemo isVisible={isVisible} />;
      default:
        return null;
    }
  };

  return (
    <section id="interface" className="py-20">
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
          <p className="text-xl text-foreground/80 dark:text-slate-300 max-w-3xl mx-auto">
            Experiências interativas avançadas demonstrando domínio técnico em
            física, animações, redes neurais e renderização em tempo real.
          </p>
        </motion.div>

        {/* Demo Buttons */}
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
              <h3 className="text-sm font-semibold text-foreground dark:text-slate-200">{demo.title}</h3>
            </motion.button>
          ))}
        </div>

        {/* Demo Container */}
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
              <h2 className="text-xl font-bold text-foreground dark:text-slate-200">
                {currentDemo?.title}
              </h2>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {currentDemo?.description}
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
              <Suspense fallback={<DemoLoading />}>
                {renderDemo()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
});

InteractiveInterface.displayName = 'InteractiveInterface';

export default InteractiveInterface;
