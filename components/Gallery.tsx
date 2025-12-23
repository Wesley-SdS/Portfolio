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
    {
      id: 1,
      category: 'screenshots',
      title: 'Adalink Dashboard',
      description: 'Painel principal da plataforma de automação',
      image: '/gallery-1.jpg',
      fullImage: '/gallery-1.jpg'
    },
    {
      id: 2,
      category: 'design',
      title: 'UI/UX Design Process',
      description: 'Processo de design da interface de usuários',
      image: '/gallery-2.jpg',
      fullImage: '/gallery-2.jpg'
    },
    {
      id: 3,
      category: 'mockups',
      title: 'Mobile App Mockup',
      description: 'Mockup do aplicativo mobile',
      image: '/project-1.jpg',
      fullImage: '/project-1.jpg'
    },
    {
      id: 4,
      category: 'devices',
      title: 'Responsive Design',
      description: 'Design responsivo em múltiplos dispositivos',
      image: '/project-2.jpg',
      fullImage: '/project-2.jpg'
    },
    {
      id: 5,
      category: 'screenshots',
      title: 'E-commerce Platform',
      description: 'Plataforma de e-commerce completa',
      image: '/project-3.jpg',
      fullImage: '/project-3.jpg'
    },
    {
      id: 6,
      category: 'design',
      title: 'Color Palette & Typography',
      description: 'Paleta de cores e tipografia do design system',
      image: '/project-4.jpg',
      fullImage: '/project-4.jpg'
    },
    {
      id: 7,
      category: 'mockups',
      title: 'Desktop Application',
      description: 'Mockup do aplicativo desktop',
      image: '/project-5.jpg',
      fullImage: '/project-5.jpg'
    },
    {
      id: 8,
      category: 'devices',
      title: 'Tablet Experience',
      description: 'Experiência otimizada para tablets',
      image: '/project-6.jpg',
      fullImage: '/project-6.jpg'
    },
    {
      id: 9,
      category: 'screenshots',
      title: 'Admin Dashboard',
      description: 'Painel administrativo com métricas em tempo real',
      image: '/project-7.jpg',
      fullImage: '/project-7.jpg'
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
    <section id="gallery" className="py-20 deep-space-gradient relative overflow-hidden">
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
            className="relative max-w-6xl max-h-[90vh] mx-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage}
              alt="Gallery image"
              fill
              sizes="90vw"
              className="object-contain rounded-xl"
              quality={90}
            />
            
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glassmorphism text-slate-300 hover:text-white flex items-center justify-center transition-colors duration-300"
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