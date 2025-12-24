"use client";
import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import MagicButton from "./MagicButton";
import { FaRocket, FaCode } from "react-icons/fa";

const InteractiveBackground = dynamic(
  () => import("@/components/ui/InteractiveBackground"),
  { ssr: false }
);

const AboutMe: React.FC = React.memo(() => {
  const t = useTranslations('about');

  return (
    <section id="about" className="relative py-20 px-6 lg:px-20 w-full overflow-hidden section-fade-top section-fade-bottom">
      {/* Background 3D interativo apenas nesta seção */}
      <InteractiveBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2 
          className="heading mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t('title', { highlight: t('highlight') })}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Profile Section */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
           
            <div className="mb-8 lg:mb-12">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden glow-effect glassmorphism border-2 border-purple-500/20 mx-auto lg:mx-0 relative">
                <Image
                  src="/Wesley.jpg"
                  alt="Wesley Santos"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 256px, 320px"
                  priority
                  loading="eager"
                />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('name')}
            </h3>
            <p className="text-xl text-muted-foreground mb-6">
              {t('role')}
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                t('tags.experience'),
                t('tags.ai'),
                t('tags.leadership'),
                t('tags.fullstack')
              ].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full glassmorphism text-sm text-slate-700 dark:text-slate-300 border border-slate-300/30 dark:border-transparent">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <FaRocket className="text-purple-500 dark:text-purple-400" />
                {t('sections.mission.title')}
              </h4>
              <p className="text-foreground/80 leading-relaxed">
                {t('sections.mission.content')}
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <FaCode className="text-purple-500 dark:text-purple-400" />
                {t('sections.expertise.title')}
              </h4>
              <p className="text-foreground/80 leading-relaxed mb-4">
                {t('sections.expertise.content')}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="text-xs px-3 py-1 bg-primary/20 text-indigo-700 dark:text-indigo-300 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <FaCode className="text-purple-500 dark:text-purple-400" />
                {t('sections.leadership.title')}
              </h4>
              <p className="text-foreground/80 leading-relaxed">
                {t('sections.leadership.content')}
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <FaCode className="text-purple-500 dark:text-purple-400" />
                {t('sections.vision.title')}
              </h4>
              <p className="text-foreground/80 leading-relaxed">
                {t('sections.vision.content')}
              </p>
            </div>

            <motion.div 
              className="flex justify-center lg:justify-start pt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <MagicButton
                title={t('cta')}
                icon={<></>}
                position="right"
                onClick={() => {
                  const element = document.getElementById('experience');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

AboutMe.displayName = 'AboutMe';

export default AboutMe;