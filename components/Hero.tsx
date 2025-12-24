"use client";
import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from 'next-intl';
import { FaCode, FaLocationCrosshairs, FaRocket } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";

const DigitalGalaxy = dynamic(() => import("./3d/DigitalGalaxy"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full bg-slate-900/20" />
});

const Hero = React.memo(() => {
  const t = useTranslations('hero');

  return (
    <section id="home" className="relative min-h-screen deep-space-gradient overflow-hidden w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full">
        {/* 3D Galaxy Background */}
        <DigitalGalaxy className="absolute inset-0 w-full h-full opacity-60" />
        
        {/* Additional gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
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
      <div className="relative z-20 min-h-screen flex items-center justify-center w-full px-6">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar with Glow Effect */}
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
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

            {/* Main Title */}
            <motion.h1 
              className="heading mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <span className="text-purple">{t('title')}</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 mb-6 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* Description */}
            <motion.p 
              className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {t('description', { years: '9+' })}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
            >
              <MagicButton
                title={t('cta.primary')}
                icon={<FaLocationCrosshairs />}
                position="right"
                onClick={() => {
                  const element = document.getElementById('about');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
              />
              
              <motion.button
                onClick={() => {
                  const element = document.getElementById('projects');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-lg glassmorphism text-slate-300 font-medium border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket className="text-sm" />
                {t('cta.secondary')}
              </motion.button>
            </motion.div>

            {/* Tech Stack Floating Pills */}
            <motion.div 
              className="flex flex-wrap gap-3 justify-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              {['Next.js', 'TypeScript', 'Python', 'React', 'Node.js', 'AI/ML'].map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-4 py-2 rounded-full glassmorphism text-sm text-slate-300 border border-indigo-500/20 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
            >
              <div className="text-center mb-10">
                <div className="text-3xl font-bold text-purple-400 mb-2">9+</div>
                <div className="text-slate-400 text-sm">{t('stats.experience')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-slate-400 text-sm">{t('stats.projects')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-slate-400 text-sm">{t('stats.quality')}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-purple-500/50 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <motion.div
            className="w-1 h-3 bg-gradient-to-b from-purple-400 to-transparent rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
