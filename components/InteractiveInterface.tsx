"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMousePointer, FaDesktop, FaMobileAlt, FaPalette, FaCode, FaRocket } from "react-icons/fa";

interface InterfaceDemo {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  technologies: string[];
  features: string[];
  color: string;
  demoType: 'web' | 'mobile' | 'dashboard';
}

const InteractiveInterface: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);

  const demos: InterfaceDemo[] = [
    {
      id: 1,
      title: "Web Applications",
      description: "Interfaces web responsivas e interativas com performance otimizada",
      icon: <FaDesktop className="text-4xl" />,
      technologies: ["React", "Next.js", "TypeScript", "TailwindCSS"],
      features: ["Design responsivo", "Acessibilidade WCAG", "SEO otimizado", "Progressive Web App"],
      color: "from-blue-500 to-cyan-500",
      demoType: 'web'
    },
    {
      id: 2,
      title: "Mobile Experience",
      description: "Aplicações mobile-first com gestos intuitivos e fluxos otimizados",
      icon: <FaMobileAlt className="text-4xl" />,
      technologies: ["React Native", "Flutter", "PWA", "Capacitor"],
      features: ["Gestos touch", "Offline-first", "Push notifications", "App-like experience"],
      color: "from-purple-500 to-pink-500",
      demoType: 'mobile'
    },
    {
      id: 3,
      title: "Dashboard Analytics",
      description: "Dashboards interativos com visualização de dados em tempo real",
      icon: <FaMousePointer className="text-4xl" />,
      technologies: ["D3.js", "Chart.js", "WebSocket", "GraphQL"],
      features: ["Real-time updates", "Data visualization", "Interactive charts", "Custom widgets"],
      color: "from-green-500 to-teal-500",
      demoType: 'dashboard'
    },
    {
      id: 4,
      title: "Design System",
      description: "Sistemas de design consistentes e escaláveis com componentes reutilizáveis",
      icon: <FaPalette className="text-4xl" />,
      technologies: ["Storybook", "Figma", "Design Tokens", "CSS-in-JS"],
      features: ["Component library", "Design tokens", "Theme system", "Documentation"],
      color: "from-orange-500 to-red-500",
      demoType: 'web'
    }
  ];

  const renderDemoContent = (demo: InterfaceDemo) => {
    switch (demo.demoType) {
      case 'web':
        return (
          <div className="space-y-4">
            <div className="glassmorphism rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                <div className="h-3 bg-slate-600 rounded w-5/6"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded"></div>
                <div className="h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="space-y-4">
            <div className="glassmorphism rounded-xl p-4 w-48 mx-auto">
              <div className="bg-slate-700 rounded-lg p-2 h-64">
                <div className="h-4 bg-purple-500 rounded w-3/4 mx-auto mb-2"></div>
                <div className="space-y-1">
                  <div className="h-2 bg-slate-600 rounded w-full"></div>
                  <div className="h-2 bg-slate-600 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-600 rounded w-2/3"></div>
                </div>
                <div className="grid grid-cols-3 gap-1 mt-4">
                  <div className="h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded"></div>
                  <div className="h-8 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded"></div>
                  <div className="h-8 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="glassmorphism rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-12 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded flex items-center justify-center text-xs text-slate-300">Chart 1</div>
                <div className="h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded flex items-center justify-center text-xs text-slate-300">Chart 2</div>
              </div>
              <div className="h-20 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded flex items-center justify-center text-xs text-slate-300">
                Real-time Analytics
              </div>
              <div className="grid grid-cols-3 gap-1 mt-2">
                <div className="h-8 bg-slate-600 rounded"></div>
                <div className="h-8 bg-slate-600 rounded"></div>
                <div className="h-8 bg-slate-600 rounded"></div>
              </div>
            </div>
          </div>
        );
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
          transition={{ duration: 0.8 }}
        >
          <h1 className="heading mb-6">
            <span className="text-purple">Interface</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Criando experiências digitais memoráveis com design intuitivo, 
            interações fluidas e performance excepcional.
          </p>
        </motion.div>

        {/* Interactive Demos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              className="group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div 
                className="glassmorphism rounded-xl p-8 cursor-pointer hover:glow-effect transition-all duration-300"
                onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
              >
                <div className="flex items-start gap-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${demo.color} text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    {demo.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                      {demo.title}
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {demo.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {demo.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs rounded-full glassmorphism text-slate-300 border border-indigo-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Demo Preview */}
                {activeDemo === demo.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-indigo-500/20"
                  >
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-200 mb-2">Principais Recursos:</h4>
                      <ul className="space-y-1">
                        {demo.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="text-purple-400 text-xs">▸</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 mb-2">Preview:</h4>
                      {renderDemoContent(demo)}
                    </div>
                  </motion.div>
                )}

                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center mt-4 text-purple-400 text-sm group-hover:text-purple-300 transition-colors duration-300">
                  {activeDemo === demo.id ? 'Clique para recolher ▲' : 'Clique para expandir ▼'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Playground */}
        <motion.div 
          className="glassmorphism rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaCode className="text-2xl text-purple-400" />
              <h2 className="text-2xl font-bold text-slate-200">Interactive Playground</h2>
            </div>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Experimente interativamente algumas das interfaces e componentes que crio. 
              Clique nos elementos para ver as animações e transições em ação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Button Variants */}
            <motion.div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Botões Interativos</h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hover me
                </motion.button>
                <motion.button
                  className="w-full px-4 py-2 rounded-lg glassmorphism text-slate-200 font-medium border border-indigo-500/20"
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: '#8b5cf6',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Glow Effect
                </motion.button>
                <motion.button
                  className="w-full px-4 py-2 rounded-lg border border-slate-500 text-slate-300 font-medium"
                  whileHover={{ 
                    x: 5,
                    borderColor: '#10b981',
                    color: '#10b981'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Slide Effect
                </motion.button>
              </div>
            </motion.div>

            {/* Card Variants */}
            <motion.div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Cards Animados</h3>
              <div className="space-y-3">
                <motion.div
                  className="glassmorphism rounded-lg p-4 cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-semibold text-slate-200 mb-2">3D Hover</h4>
                  <p className="text-sm text-slate-400">Passe o mouse para ver o efeito 3D</p>
                </motion.div>
                <motion.div
                  className="glassmorphism rounded-lg p-4 cursor-pointer overflow-hidden"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-semibold text-slate-200 mb-2">Lift Effect</h4>
                  <p className="text-sm text-slate-400">Card que levanta ao hover</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Loading States */}
            <motion.div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Loading States</h3>
              <div className="space-y-3">
                <div className="glassmorphism rounded-lg p-4">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="glassmorphism rounded-lg p-4">
                  <div className="flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveInterface;