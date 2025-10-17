"use client";
import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "./ui/Spotlight";
import MagicButton from "./MagicButton";
import { FaLocationCrosshairs } from "react-icons/fa6";
import DigitalGalaxy from "./3d/DigitalGalaxy";

const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden deep-space-gradient">
      {/* 3D Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <DigitalGalaxy className="w-full h-full" />
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
      <div className="relative z-20 my-20 flex justify-center">
        <motion.div 
          className="flex max-w-[89vw] flex-col items-center justify-center md:max-w-2xl lg:max-w-[60vw]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="heading mb-6 text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <span className="text-purple">Digital Artisan</span>
          </motion.h1>
          
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
    </section>
  );
};

export default Hero;
