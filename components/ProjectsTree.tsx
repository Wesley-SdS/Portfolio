"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket, FaStar, FaPlay, FaEye } from "react-icons/fa";
import { projectsData } from "@/src/constants/modernProjects";
import { Project } from "@/src/types/project";
import MagicButton from "./MagicButton";

const ProjectsTree: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const getProjectIcon = (category: Project['category']) => {
    switch (category) {
      case 'platform': return '🚀';
      case 'ai-platform': return '🤖';
      case 'ecommerce': return '🛒';
      case 'dashboard': return '📊';
      case 'saas': return '💼';
      default: return '💻';
    }
  };

  const getCategoryBorder = (category: Project['category']) => {
    switch (category) {
      case 'platform': return 'border-purple-500';
      case 'ai-platform': return 'border-blue-500';
      case 'ecommerce': return 'border-green-500';
      case 'dashboard': return 'border-orange-500';
      case 'saas': return 'border-indigo-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <section id="projects" className="py-20 deep-space-gradient relative overflow-hidden w-full">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="heading mb-6">
            <span className="text-purple">Projetos</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Árvore de projetos inovadores crescendo com minha evolução como desenvolvedor.
            Cada galho representa uma nova conquista tecnológica.
          </p>
        </motion.div>

        {/* Projects Tree Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Tree Branch */}
              {index > 0 && (
                <motion.div
                  className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-purple-500/30 to-transparent transform -translate-x-1/2"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.4 }}
                />
              )}

              {/* Project Card */}
              <motion.div
                className="glassmorphism rounded-xl p-8 hover:glow-effect transition-all duration-300 relative overflow-hidden cursor-pointer h-[480px] flex flex-col"
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Status and Featured Badges */}
                <div className="flex gap-2 mb-6">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 text-xs rounded-full border ${
                    project.status === 'completed'
                      ? 'border-green-500 text-green-300 bg-green-500/10'
                      : project.status === 'in-progress'
                      ? 'border-yellow-500 text-yellow-300 bg-yellow-500/10'
                      : 'border-blue-500 text-blue-300 bg-blue-500/10'
                  }`}>
                    {project.status === 'completed' ? '🌳' :
                     project.status === 'in-progress' ? '🌱' : '🌰'}
                    <span className="ml-1">
                      {project.status === 'completed' ? 'Maduro' :
                       project.status === 'in-progress' ? 'Crescendo' : 'Semente'}
                    </span>
                  </span>

                  {/* Featured Badge */}
                  {project.featured && (
                    <span className="px-3 py-1 text-xs rounded-full border border-yellow-500 text-yellow-300 bg-yellow-500/10 flex items-center gap-1">
                      <FaStar className="text-xs" />
                      Estrela
                    </span>
                  )}
                </div>

                {/* Project Header */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg" />

                  {/* Icon and Title */}
                  <div className="relative flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl border-2 ${getCategoryBorder(project.category)} flex items-center justify-center text-white text-lg shadow-lg`}>
                      {getProjectIcon(project.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400">{project.category}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies Tree */}
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-2">Stack Tecnológico:</div>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <motion.div
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded-full glassmorphism text-slate-300 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        style={{ marginLeft: techIndex > 0 ? '-4px' : '0', zIndex: techIndex }}
                      >
                        {tech}
                      </motion.div>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs rounded-full glassmorphism text-slate-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Achievements Branch */}
                {project.achievements && project.achievements.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 mb-2">Frutos:</div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {project.achievements[0]}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  {project.links.map((link, linkIndex) => (
                    <motion.button
                      key={linkIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(link.url, '_blank');
                      }}
                      className="flex-1 px-3 py-2 rounded-lg glassmorphism text-xs text-slate-300 border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.type === 'github' ? <FaGithub /> : <FaExternalLinkAlt />}
                    </motion.button>
                  ))}
                </div>

                {/* Hover overlay */}
                {hoveredProject === project.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Animated particles on hover */}
                {hoveredProject === project.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400 rounded-full"
                        initial={{ 
                          opacity: 0, 
                          scale: 0,
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 100 - 50
                        }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          y: [0, -30, -60]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          delay: i * 0.1,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Connection lines to next project */}
              {index < projectsData.length - 1 && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-purple-500/30 to-transparent transform -translate-x-1/2 z-0"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Tree Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-purple-400 mb-2">{projectsData.length}</div>
              <div className="text-slate-400 text-sm">Projetos</div>
              <div className="text-xs text-slate-500 mt-1">🌳 Árvore Completa</div>
            </div>
          </div>
          
          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {projectsData.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-slate-400 text-sm">Frutos Maduros</div>
              <div className="text-xs text-slate-500 mt-1">🌳 Produzindo Valor</div>
            </div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {projectsData.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-slate-400 text-sm">Crescendo</div>
              <div className="text-xs text-slate-500 mt-1">🌱 Potencial Máximo</div>
            </div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {new Set(projectsData.flatMap(p => p.technologies)).size}
              </div>
              <div className="text-slate-400 text-sm">Tecnologias</div>
              <div className="text-xs text-slate-500 mt-1">🌳 Solo Rico</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="glassmorphism rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCode className="text-2xl text-purple-400" />
                <h2 className="text-2xl font-bold text-slate-200">Explore a Árvore de Projetos</h2>
              </div>
              
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Cada galho representa uma conquista. Da semente inicial aos frutos maduros, 
                minha jornada reflete crescimento contínuo e evolução tecnológica.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagicButton
                  title="Ver GitHub"
                  icon={<FaGithub />}
                  position="right"
                  onClick={() => window.open('https://github.com/seu-usuario', '_blank')}
                  otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
                />
                
                {selectedProject && (
                  <motion.button
                    onClick={() => setSelectedProject(null)}
                    className="px-8 py-3 rounded-lg glassmorphism text-slate-200 font-medium border border-indigo-500/20 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Limpar Seleção
                  </motion.button>
                )}
                
                <motion.button
                  onClick={() => {
                    const element = document.getElementById('contact');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 rounded-lg glassmorphism text-slate-200 font-medium border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket className="text-sm" />
                  Vamos Conversar
                </motion.button>
              </div>

              {/* Selected Project Detail */}
              {selectedProject && (
                <motion.div
                  className="mt-6 p-6 glassmorphism rounded-xl border border-purple-500/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg border-2 border-purple-500 flex items-center justify-center text-white">
                      {getProjectIcon(selectedProject.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">{selectedProject.title}</h3>
                      <p className="text-xs text-slate-400">{selectedProject.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-3">{selectedProject.description}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsTree;