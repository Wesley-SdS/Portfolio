"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket, FaStar, FaPlay, FaEye, FaCalendar, FaUsers, FaTrophy, FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";
import { projectsData } from "@/src/constants/modernProjects";
import { Project } from "@/src/types/project";
import MagicButton from "./MagicButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  index: number;
  setSelectedProject: (project: Project) => void;
  getCategoryBorder: (category: Project['category']) => string;
  getProjectIcon: (category: Project['category']) => string;
  t: ReturnType<typeof useTranslations>;
}

const ProjectCard = React.memo<ProjectCardProps>(({
  project,
  index,
  setSelectedProject,
  getCategoryBorder,
  getProjectIcon,
  t
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      key={project.id}
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="glassmorphism rounded-xl p-6 cursor-pointer h-[380px] flex flex-col hover:glow-effect transition-all duration-300 relative"
        style={{ overflow: 'visible' }}
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={() => setSelectedProject(project)}
      >
        {/* Barra deslizante da esquerda para direita */}
        <motion.div
          className="absolute bottom-0 left-0 h-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
          style={{
            borderRadius: '0 0 0.75rem 0.75rem',
            boxShadow: '0 -2px 12px rgba(139, 92, 246, 0.7), 0 0 20px rgba(168, 85, 247, 0.4)',
            zIndex: 60
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isHovered ? '100%' : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      {/* Status badges */}
      <div className="flex gap-2 mb-4">
        <span className={`px-3 py-1 text-xs rounded-full border ${
          project.status === 'completed'
            ? 'border-green-500/50 text-green-300 bg-green-500/10'
            : project.status === 'in-progress'
            ? 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10'
            : 'border-blue-500/50 text-blue-300 bg-blue-500/10'
        }`}>
          {project.status === 'completed' ? '🌳' :
           project.status === 'in-progress' ? '🌱' : '🌰'}
          <span className="ml-1">
            {project.status === 'completed' ? t('status.completed') :
             project.status === 'in-progress' ? t('status.inProgress') : t('status.planned')}
          </span>
        </span>

        {project.featured && (
          <span className="px-3 py-1 text-xs rounded-full border border-yellow-500/50 text-yellow-300 bg-yellow-500/10 flex items-center gap-1">
            <FaStar className="text-xs" />
            Estrela
          </span>
        )}
      </div>

      {/* Title and icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg border ${getCategoryBorder(project.category)} flex items-center justify-center text-lg`}>
          {getProjectIcon(project.category)}
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground">{project.category}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-foreground/80 text-sm mb-4 line-clamp-2 flex-shrink-0">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-2">Stack:</div>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-2 py-1 text-xs rounded-full bg-secondary/50 dark:bg-slate-800/50 text-foreground/80 border border-border"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 text-xs rounded-full bg-secondary/50 dark:bg-slate-800/50 text-muted-foreground">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Achievement */}
      {project.achievements && project.achievements.length > 0 && (
        <div className="mt-auto">
          <div className="text-xs text-muted-foreground mb-1">Destaque:</div>
          <div className="text-xs text-foreground/80 line-clamp-2">
            {project.achievements[0]}
          </div>
        </div>
      )}
      </motion.div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// Componente de Carrossel
interface ProjectCarouselProps {
  images: Project['images'];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="relative w-full max-w-[70%] mx-auto">
        <div className="relative rounded-xl overflow-hidden glassmorphism border border-purple-500/20 bg-slate-900/50 inline-block w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full flex items-center justify-center"
            >
              <div className="relative w-full" style={{ maxHeight: '70vh' }}>
                <Image
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  width={1920}
                  height={1080}
                  className="object-contain w-full h-auto max-h-[70vh]"
                  style={{ width: '100%', height: 'auto' }}
                  priority={currentIndex === 0}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botões de Navegação */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glassmorphism text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 z-20 hover:scale-110"
                aria-label="Imagem anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glassmorphism text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 z-20 hover:scale-110"
                aria-label="Próxima imagem"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Indicadores */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-purple-400 w-8'
                      : 'bg-slate-500/50 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Contador de Imagens */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full glassmorphism text-xs text-slate-300 border border-purple-500/20 z-20">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsTree: React.FC = React.memo(() => {
  const t = useTranslations('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar projetos baseado na busca
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery.trim()) return projectsData;

    const query = searchQuery.toLowerCase();
    return projectsData.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
      project.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const getProjectIcon = React.useCallback((category: Project['category']) => {
    switch (category) {
      case 'platform': return '🚀';
      case 'ai-platform': return '🤖';
      case 'ecommerce': return '🛒';
      case 'dashboard': return '📊';
      case 'saas': return '💼';
      default: return '💻';
    }
  }, []);

  const getCategoryBorder = React.useCallback((category: Project['category']) => {
    switch (category) {
      case 'platform': return 'border-purple-500';
      case 'ai-platform': return 'border-blue-500';
      case 'ecommerce': return 'border-green-500';
      case 'dashboard': return 'border-orange-500';
      case 'saas': return 'border-indigo-500';
      default: return 'border-gray-500';
    }
  }, []);

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header com título e busca */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="text-center md:text-left">
              <h1 className="heading mb-4">
                <span className="text-purple">{t('title')}</span>
              </h1>
              <p className="text-lg text-foreground/80 max-w-2xl">
                {t('subtitle')}
              </p>
            </div>

            {/* Campo de busca */}
            <div className="relative w-full md:w-80 flex-shrink-0">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder') || 'Buscar projetos...'}
                className="w-full pl-11 pr-10 py-3 rounded-xl glassmorphism border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/40 transition-colors text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Contador de resultados */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center md:text-left mb-4"
            >
              <span className="text-sm text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
                {searchQuery && <span className="text-purple-500 dark:text-purple-400"> para &quot;{searchQuery}&quot;</span>}
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="glassmorphism rounded-xl p-8 max-w-md mx-auto">
                <FaSearch className="text-4xl text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">Nenhum projeto encontrado</p>
                <p className="text-muted-foreground/70 text-sm">Tente buscar por outro termo</p>
              </div>
            </motion.div>
          ) : filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              setSelectedProject={setSelectedProject}
              getCategoryBorder={getCategoryBorder}
              getProjectIcon={getProjectIcon}
              t={t}
            />
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-purple-500 dark:text-purple-400 mb-2">{projectsData.length}</div>
              <div className="text-muted-foreground text-sm">{t('stats.total')}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">🌳 Árvore Completa</div>
            </div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">
                {projectsData.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-muted-foreground text-sm">{t('stats.completed')}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">🌳 Produzindo Valor</div>
            </div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">
                {projectsData.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-muted-foreground text-sm">{t('stats.growing')}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">🌱 Potencial Máximo</div>
            </div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">
                {new Set(projectsData.flatMap(p => p.technologies)).size}
              </div>
              <div className="text-muted-foreground text-sm">{t('stats.technologies')}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">🌳 Solo Rico</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="glassmorphism rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCode className="text-2xl text-purple-500 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-foreground">Explore a Árvore de Projetos</h2>
              </div>

              <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
                {t('description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagicButton
                  title={t('cta.viewGitHub')}
                  icon={<FaGithub />}
                  position="right"
                  onClick={() => window.open('https://github.com/seu-usuario', '_blank')}
                  otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
                />

                {selectedProject && (
                  <motion.button
                    onClick={() => setSelectedProject(null)}
                    className="px-8 py-3 rounded-lg glassmorphism text-foreground font-medium border border-primary/20 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('cta.clearSelection')}
                  </motion.button>
                )}

                <motion.button
                  onClick={() => {
                    const element = document.getElementById('contact');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 rounded-lg glassmorphism text-foreground font-medium border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket className="text-sm" />
                  {t('cta.contact')}
                </motion.button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Detalhes do Projeto */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full glassmorphism border-purple-500/20 p-0 overflow-hidden">
          {selectedProject && (
            <>
              <DialogHeader className="p-6 border-b border-purple-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-16 h-16 rounded-xl border-2 ${getCategoryBorder(selectedProject.category)} flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {getProjectIcon(selectedProject.category)}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold text-slate-200 mb-2">
                        {selectedProject.title}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 text-xs rounded-full border border-purple-500/30 text-purple-300 bg-purple-500/10">
                          {selectedProject.category}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full border ${
                          selectedProject.status === 'completed'
                            ? 'border-green-500 text-green-300 bg-green-500/10'
                            : selectedProject.status === 'in-progress'
                            ? 'border-yellow-500 text-yellow-300 bg-yellow-500/10'
                            : 'border-blue-500 text-blue-300 bg-blue-500/10'
                        }`}>
                          {selectedProject.status === 'completed' ? '🌳 ' + t('status.completed') :
                           selectedProject.status === 'in-progress' ? '🌱 ' + t('status.inProgress') : '🌰 ' + t('status.planned')}
                        </span>
                        {selectedProject.featured && (
                          <span className="px-3 py-1 text-xs rounded-full border border-yellow-500 text-yellow-300 bg-yellow-500/10 flex items-center gap-1">
                            <FaStar className="text-xs" />
                            Estrela
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="h-[calc(95vh-120px)]">
                <div className="p-6 space-y-6">
                  {/* Carrossel de Imagens */}
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <ProjectCarousel images={selectedProject.images} />
                  )}

                  {/* Descrição Completa */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Descrição</h3>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedProject.longDescription || selectedProject.description}
                    </p>
                  </div>

                  {/* Stack Tecnológico */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Stack Tecnológico</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-sm rounded-full glassmorphism text-slate-300 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <FaTrophy className="text-yellow-400" />
                        Achievements
                      </h3>
                      <ul className="space-y-2">
                        {selectedProject.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <span className="text-purple-400 mt-1">▸</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Métricas */}
                  {selectedProject.metrics && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-3">Métricas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedProject.metrics.customMetric && selectedProject.metrics.customMetric.map((metric, idx) => (
                          <div key={idx} className="glassmorphism rounded-lg p-4 border border-purple-500/20">
                            <div className="text-2xl font-bold text-purple-400 mb-1">{metric.value}</div>
                            <div className="text-xs text-slate-400">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedProject.startDate && (
                      <div className="glassmorphism rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <FaCalendar className="text-sm" />
                          <span className="text-xs">Início</span>
                        </div>
                        <div className="text-slate-200 font-semibold">
                          {new Date(selectedProject.startDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                        </div>
                      </div>
                    )}
                    {selectedProject.endDate && (
                      <div className="glassmorphism rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <FaCalendar className="text-sm" />
                          <span className="text-xs">Conclusão</span>
                        </div>
                        <div className="text-slate-200 font-semibold">
                          {new Date(selectedProject.endDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                        </div>
                      </div>
                    )}
                    {selectedProject.teamSize && (
                      <div className="glassmorphism rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <FaUsers className="text-sm" />
                          <span className="text-xs">Equipe</span>
                        </div>
                        <div className="text-slate-200 font-semibold">{selectedProject.teamSize} {selectedProject.teamSize === 1 ? 'pessoa' : 'pessoas'}</div>
                      </div>
                    )}
                  </div>

                  {selectedProject.role && (
                    <div className="glassmorphism rounded-lg p-4 border border-purple-500/20">
                      <div className="text-xs text-slate-400 mb-1">Função</div>
                      <div className="text-slate-200 font-semibold">{selectedProject.role}</div>
                    </div>
                  )}

                  {/* Links */}
                  {selectedProject.links && selectedProject.links.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-3">Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.links.map((link, linkIndex) => (
                          <motion.a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg glassmorphism text-slate-200 border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {link.type === 'github' ? <FaGithub /> : <FaExternalLinkAlt />}
                            <span>{link.label}</span>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
});

ProjectsTree.displayName = 'ProjectsTree';

export default ProjectsTree;