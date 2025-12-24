"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { FaExpand, FaSearch, FaFilter } from "react-icons/fa";
import MagicButton from "./MagicButton";

const Gallery: React.FC = React.memo(() => {
  const t = useTranslations('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: t('categories.all') },
    { id: 'screenshots', name: t('categories.screenshots') },
    { id: 'design', name: t('categories.design') },
    { id: 'mockups', name: t('categories.mockups') },
    { id: 'devices', name: t('categories.devices') },
  ];

  const galleryImages = [
    // FSJPII - Sistema Check-in
    {
      id: 1,
      category: 'screenshots',
      title: 'FSJPII - Login',
      description: 'Sistema de check-in com geolocalização para formações paroquiais',
      image: '/projects/fsjpii/Login.png',
      fullImage: '/projects/fsjpii/Login.png'
    },
    // OrbitFinance - Finanças Pessoais
    {
      id: 2,
      category: 'screenshots',
      title: 'OrbitFinance - Dashboard',
      description: 'Painel principal da plataforma de finanças pessoais com IA',
      image: '/projects/orbitfinance/Inicio.png',
      fullImage: '/projects/orbitfinance/Inicio.png'
    },
    {
      id: 3,
      category: 'screenshots',
      title: 'OrbitFinance - Painel',
      description: 'Painel de controle financeiro com insights personalizados',
      image: '/projects/orbitfinance/Painel.png',
      fullImage: '/projects/orbitfinance/Painel.png'
    },
    {
      id: 4,
      category: 'screenshots',
      title: 'OrbitFinance - Relatórios',
      description: 'Relatórios e analytics financeiros em tempo real',
      image: '/projects/orbitfinance/Relatorios.png',
      fullImage: '/projects/orbitfinance/Relatorios.png'
    },
    {
      id: 5,
      category: 'screenshots',
      title: 'OrbitFinance - Organizador',
      description: 'Organizador financeiro com categorização automática',
      image: '/projects/orbitfinance/Organizador.png',
      fullImage: '/projects/orbitfinance/Organizador.png'
    },
    {
      id: 6,
      category: 'screenshots',
      title: 'OrbitFinance - Login',
      description: 'Tela de autenticação da plataforma',
      image: '/projects/orbitfinance/Login.png',
      fullImage: '/projects/orbitfinance/Login.png'
    },
    {
      id: 7,
      category: 'screenshots',
      title: 'OrbitFinance - Recursos',
      description: 'Recursos e funcionalidades da plataforma',
      image: '/projects/orbitfinance/Recurso.png',
      fullImage: '/projects/orbitfinance/Recurso.png'
    },
    {
      id: 8,
      category: 'screenshots',
      title: 'OrbitFinance - Relatos',
      description: 'Sistema de relatos e transações',
      image: '/projects/orbitfinance/Relatos.png',
      fullImage: '/projects/orbitfinance/Relatos.png'
    },
    // OrbitMind - Plataforma SaaS
    {
      id: 9,
      category: 'screenshots',
      title: 'OrbitMind - Home',
      description: 'Página inicial da plataforma SaaS multi-agentes',
      image: '/projects/orbitmind/Inicio.png',
      fullImage: '/projects/orbitmind/Inicio.png'
    },
    {
      id: 10,
      category: 'screenshots',
      title: 'OrbitMind - Multi-Agentes',
      description: 'Sistema de multi-agentes especializados de IA',
      image: '/projects/orbitmind/Multi-agents.png',
      fullImage: '/projects/orbitmind/Multi-agents.png'
    },
    {
      id: 11,
      category: 'screenshots',
      title: 'OrbitMind - Analytics',
      description: 'Dashboard de analytics e métricas',
      image: '/projects/orbitmind/Analytics.png',
      fullImage: '/projects/orbitmind/Analytics.png'
    },
    {
      id: 12,
      category: 'screenshots',
      title: 'OrbitMind - Billing',
      description: 'Sistema de billing e assinaturas integrado',
      image: '/projects/orbitmind/Billings.png',
      fullImage: '/projects/orbitmind/Billings.png'
    },
    {
      id: 13,
      category: 'screenshots',
      title: 'OrbitMind - Catálogo',
      description: 'Catálogo de agentes e recursos disponíveis',
      image: '/projects/orbitmind/Catalogo.png',
      fullImage: '/projects/orbitmind/Catalogo.png'
    },
    {
      id: 14,
      category: 'screenshots',
      title: 'OrbitMind - Kanban',
      description: 'Sistema Kanban para gestão de projetos e financeiro',
      image: '/projects/orbitmind/Kanban.png',
      fullImage: '/projects/orbitmind/Kanban.png'
    },
    {
      id: 15,
      category: 'screenshots',
      title: 'OrbitMind - Tickets',
      description: 'Sistema de tickets de suporte com categorização',
      image: '/projects/orbitmind/Tickets.png',
      fullImage: '/projects/orbitmind/Tickets.png'
    },
    {
      id: 16,
      category: 'screenshots',
      title: 'OrbitMind - Workflow Builder',
      description: 'Construtor visual de workflows para orquestração',
      image: '/projects/orbitmind/flow.png',
      fullImage: '/projects/orbitmind/flow.png'
    },
    {
      id: 17,
      category: 'screenshots',
      title: 'OrbitMind - Agentes',
      description: 'Painel de gerenciamento de agentes de IA',
      image: '/projects/orbitmind/Agents.png',
      fullImage: '/projects/orbitmind/Agents.png'
    },
    {
      id: 18,
      category: 'screenshots',
      title: 'OrbitMind - Membros',
      description: 'Gestão de membros e permissões',
      image: '/projects/orbitmind/Membros.png',
      fullImage: '/projects/orbitmind/Membros.png'
    },
    {
      id: 19,
      category: 'screenshots',
      title: 'OrbitMind - Organizações',
      description: 'Gestão de organizações multi-tenant',
      image: '/projects/orbitmind/Organizacoes.png',
      fullImage: '/projects/orbitmind/Organizacoes.png'
    },
    {
      id: 20,
      category: 'screenshots',
      title: 'OrbitMind - Recursos',
      description: 'Painel de recursos e configurações',
      image: '/projects/orbitmind/Recursos.png',
      fullImage: '/projects/orbitmind/Recursos.png'
    },
    {
      id: 21,
      category: 'screenshots',
      title: 'OrbitMind - Templates',
      description: 'Biblioteca de templates e modelos',
      image: '/projects/orbitmind/tempates.png',
      fullImage: '/projects/orbitmind/tempates.png'
    },
    {
      id: 22,
      category: 'screenshots',
      title: 'OrbitMind - Logs',
      description: 'Sistema de logs e auditoria',
      image: '/projects/orbitmind/Logs.png',
      fullImage: '/projects/orbitmind/Logs.png'
    },
    {
      id: 23,
      category: 'screenshots',
      title: 'OrbitMind - Footer',
      description: 'Rodapé e navegação da plataforma',
      image: '/projects/orbitmind/Footer.png',
      fullImage: '/projects/orbitmind/Footer.png'
    },
    // OrbitMind VibeCoding
    {
      id: 24,
      category: 'screenshots',
      title: 'VibeCoding - Home',
      description: 'Página inicial da plataforma de geração de código com IA',
      image: '/projects/orbitmind-vibecoding/Inicio.png',
      fullImage: '/projects/orbitmind-vibecoding/Inicio.png'
    },
    {
      id: 25,
      category: 'screenshots',
      title: 'VibeCoding - Editor',
      description: 'Editor de código com preview ao vivo',
      image: '/projects/orbitmind-vibecoding/Editor-.png',
      fullImage: '/projects/orbitmind-vibecoding/Editor-.png'
    },
    {
      id: 26,
      category: 'screenshots',
      title: 'VibeCoding - Geração',
      description: 'Interface de geração de código assistida por IA',
      image: '/projects/orbitmind-vibecoding/Geracao-.png',
      fullImage: '/projects/orbitmind-vibecoding/Geracao-.png'
    },
    {
      id: 27,
      category: 'screenshots',
      title: 'VibeCoding - Features',
      description: 'Recursos e funcionalidades da plataforma',
      image: '/projects/orbitmind-vibecoding/Features.png',
      fullImage: '/projects/orbitmind-vibecoding/Features.png'
    },
    {
      id: 28,
      category: 'screenshots',
      title: 'VibeCoding - Arquitetura',
      description: 'Arquitetura e estrutura do sistema',
      image: '/projects/orbitmind-vibecoding/Arquitetura.png',
      fullImage: '/projects/orbitmind-vibecoding/Arquitetura.png'
    },
    {
      id: 29,
      category: 'screenshots',
      title: 'VibeCoding - Boas Práticas',
      description: 'Documentação de boas práticas de desenvolvimento',
      image: '/projects/orbitmind-vibecoding/Boas-praticas.png',
      fullImage: '/projects/orbitmind-vibecoding/Boas-praticas.png'
    },
    {
      id: 30,
      category: 'screenshots',
      title: 'VibeCoding - Segurança',
      description: 'Sistema de segurança e credenciais encriptadas',
      image: '/projects/orbitmind-vibecoding/Seguranca.png',
      fullImage: '/projects/orbitmind-vibecoding/Seguranca.png'
    },
    {
      id: 31,
      category: 'screenshots',
      title: 'VibeCoding - Usuários',
      description: 'Gestão de usuários e permissões',
      image: '/projects/orbitmind-vibecoding/Usuarios.png',
      fullImage: '/projects/orbitmind-vibecoding/Usuarios.png'
    },
    {
      id: 32,
      category: 'screenshots',
      title: 'VibeCoding - Planos',
      description: 'Planos e assinaturas da plataforma',
      image: '/projects/orbitmind-vibecoding/Planos.png',
      fullImage: '/projects/orbitmind-vibecoding/Planos.png'
    },
    {
      id: 33,
      category: 'screenshots',
      title: 'VibeCoding - Demo',
      description: 'Demonstração interativa da plataforma',
      image: '/projects/orbitmind-vibecoding/Demo.png',
      fullImage: '/projects/orbitmind-vibecoding/Demo.png'
    },
    {
      id: 34,
      category: 'screenshots',
      title: 'VibeCoding - Documentação',
      description: 'Documentação completa da API e recursos',
      image: '/projects/orbitmind-vibecoding/Doc.png',
      fullImage: '/projects/orbitmind-vibecoding/Doc.png'
    },
    {
      id: 35,
      category: 'screenshots',
      title: 'VibeCoding - Changelog',
      description: 'Histórico de versões e atualizações',
      image: '/projects/orbitmind-vibecoding/changelog.png',
      fullImage: '/projects/orbitmind-vibecoding/changelog.png'
    },
    {
      id: 36,
      category: 'screenshots',
      title: 'VibeCoding - História',
      description: 'História e evolução da plataforma',
      image: '/projects/orbitmind-vibecoding/Historia.png',
      fullImage: '/projects/orbitmind-vibecoding/Historia.png'
    },
    {
      id: 37,
      category: 'screenshots',
      title: 'VibeCoding - Valores',
      description: 'Valores e princípios da plataforma',
      image: '/projects/orbitmind-vibecoding/Valores.png',
      fullImage: '/projects/orbitmind-vibecoding/Valores.png'
    },
    {
      id: 38,
      category: 'screenshots',
      title: 'VibeCoding - Recursos',
      description: 'Recursos e funcionalidades avançadas',
      image: '/projects/orbitmind-vibecoding/recursos.png',
      fullImage: '/projects/orbitmind-vibecoding/recursos.png'
    },
    // Portfolio/Blog Gerado com IA
    {
      id: 39,
      category: 'screenshots',
      title: 'Portfolio - Home',
      description: 'Página inicial do portfolio gerado com IA',
      image: '/projects/dev-portfolio/Inicio.png',
      fullImage: '/projects/dev-portfolio/Inicio.png'
    },
    {
      id: 40,
      category: 'screenshots',
      title: 'Portfolio - Portfolio',
      description: 'Seção de projetos do portfolio',
      image: '/projects/dev-portfolio/Portfolio.png',
      fullImage: '/projects/dev-portfolio/Portfolio.png'
    },
    {
      id: 41,
      category: 'screenshots',
      title: 'Portfolio - Blog',
      description: 'Seção de blog e artigos',
      image: '/projects/dev-portfolio/blog.png',
      fullImage: '/projects/dev-portfolio/blog.png'
    },
    {
      id: 42,
      category: 'screenshots',
      title: 'Portfolio - Contatos',
      description: 'Formulário de contato',
      image: '/projects/dev-portfolio/Contatos.png',
      fullImage: '/projects/dev-portfolio/Contatos.png'
    },
    {
      id: 43,
      category: 'screenshots',
      title: 'Portfolio - Sobre',
      description: 'Página sobre o desenvolvedor',
      image: '/projects/dev-portfolio/Sobre.png',
      fullImage: '/projects/dev-portfolio/Sobre.png'
    },
  ];

  const filteredImages = useMemo(() => 
    selectedCategory === 'all' 
      ? galleryImages 
      : galleryImages.filter(image => image.category === selectedCategory),
    [selectedCategory]
  );

  const openLightbox = (image: string) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <section id="gallery" className="py-20 relative overflow-hidden">
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
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading mb-6">
            <span className="text-purple">{t('title')}</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full glassmorphism text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === category.id 
                    ? 'border-purple-500 text-purple-300 bg-purple-500/10' 
                    : 'border-indigo-500/20 text-slate-400 hover:border-purple-500/40 hover:text-purple-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-xl glassmorphism hover:glow-effect transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
              }}
              onClick={() => openLightbox(image.fullImage)}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={image.image}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaExpand className="text-white text-xl" />
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs rounded-full glassmorphism text-slate-300 border border-purple-500/20">
                    {image.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-1 group-hover:text-purple-400 transition-colors duration-300">
                  {image.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {image.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="glassmorphism rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{galleryImages.length}</div>
            <div className="text-slate-400 text-sm">{t('stats.total')}</div>
          </div>
          
          <div className="glassmorphism rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{categories.length}</div>
            <div className="text-slate-400 text-sm">{t('stats.categories')}</div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-slate-400 text-sm">{t('stats.original')}</div>
          </div>

          <div className="glassmorphism rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">4K</div>
            <div className="text-slate-400 text-sm">{t('stats.resolution')}</div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="glassmorphism rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaSearch className="text-2xl text-purple-400" />
              <h2 className="text-2xl font-bold text-slate-200">Explore a Galeria Completa</h2>
            </div>
            
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagicButton
                title={t('cta.viewGitHub')}
                icon={<FaExpand />}
                position="right"
                onClick={() => window.open('https://github.com/seu-usuario', '_blank')}
                otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
              />
              
              <motion.button
                onClick={() => {
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-lg glassmorphism text-slate-200 font-medium border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFilter className="text-sm" />
                {t('cta.customize')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={closeLightbox}
        >
          <motion.div
            className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
              <Image
                src={lightboxImage}
                alt="Gallery image"
                width={1920}
                height={1080}
                className="object-contain rounded-xl"
                quality={90}
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '90vh', 
                  width: 'auto', 
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glassmorphism text-slate-300 hover:text-white flex items-center justify-center transition-colors duration-300 z-10"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
});

Gallery.displayName = 'Gallery';

export default Gallery;