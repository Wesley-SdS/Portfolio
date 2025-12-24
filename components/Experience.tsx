'use client';
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { workExperience } from "@/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/moving-border";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MagicButton from "./MagicButton";

const ExperienceTimeline = dynamic(() => import("./3d/ExperienceTimeline"), {
  ssr: false,
  loading: () => <div className="w-full h-96 mb-8 animate-pulse bg-slate-800/20 rounded-lg" />
});

interface TechSkill {
  name: string;
  level: number;
  color: string;
}

interface LeadershipSkill {
  name: string;
  level: number;
}

const TechSkillBar = React.memo<{ skill: TechSkill; index: number }>(({ skill, index }) => (
  <motion.div
    className="glassmorphism rounded-lg p-4"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-200 font-medium">{skill.name}</span>
      <span className="text-slate-400 text-sm">{skill.level}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <motion.div
        className="h-2 rounded-full"
        style={{ backgroundColor: skill.color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
      />
    </div>
  </motion.div>
));

TechSkillBar.displayName = 'TechSkillBar';

const LeadershipSkillBar = React.memo<{ skill: LeadershipSkill; index: number }>(({ skill, index }) => (
  <motion.div
    className="glassmorphism rounded-lg p-4"
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-200 font-medium">{skill.name}</span>
      <span className="text-slate-400 text-sm">{skill.level}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <motion.div
        className="h-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        style={{
          background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)'
        }}
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
      />
    </div>
  </motion.div>
));

LeadershipSkillBar.displayName = 'LeadershipSkillBar';

const Experience = React.memo(() => {
  const t = useTranslations('experience');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const techSkills = [
    { name: "Next.js", level: 95, color: "#ffffff" },
    { name: "React", level: 95, color: "#61DAFB" },
    { name: "TypeScript", level: 90, color: "#3178C6" },
    { name: "Python", level: 85, color: "#3776AB" },
    { name: "Node.js", level: 90, color: "#339933" },
    { name: "PostgreSQL", level: 85, color: "#336791" },
    { name: "Three.js", level: 60, color: "#ff6b35" },
    { name: "TailwindCSS", level: 95, color: "#06B6D4" },
  ];

  const leadershipSkills = [
    { name: "Liderança Técnica", level: 90 },
    { name: "Arquitetura de Software", level: 85 },
    { name: "Mentoria", level: 80 },
    { name: "Gestão de Projetos", level: 75 },
  ];

  return (
    <section id="experience" className="w-full py-20">
      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="heading mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-purple">{t('title')}</span>
        </motion.h1>

        {/* 3D Timeline Experience */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-8 text-center">
            {t('subtitle')}
          </h2>
          <ExperienceTimeline />
        </motion.div>

        {/* Professional Experience Cards */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-8 text-center">
            Posições Destacadas
          </h2>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {workExperience.slice(0, 6).map((card, index) => (
              <motion.div
                key={card.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300 cursor-pointer relative"
                  style={{ overflow: 'visible' }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setIsDialogOpen(true)}
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
                      width: hoveredCard === card.id ? '100%' : 0,
                      opacity: hoveredCard === card.id ? 1 : 0
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                    <Image
                      src={card.thumbnail}
                      alt={card.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200">{card.title}</h3>
                    <p className="text-sm text-slate-400">{card.company}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">{card.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {card.skills?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Skills */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-8 text-center">
            Stack Tecnológico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techSkills.map((skill, index) => (
              <TechSkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Leadership Skills */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-8 text-center">
            {t('leadershipSkills')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadershipSkills.map((skill, index) => (
              <LeadershipSkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <MagicButton
            title={t('cta')}
            icon={<></>}
            position="right"
            onClick={() => {
              const element = document.getElementById('projects');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
          />
        </motion.div>
      </motion.div>

      {/* Dialog for detailed view */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] glassmorphism">
          <DialogHeader>
            <DialogTitle className="text-slate-200">{t('viewAll')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 gap-6">
              {workExperience.map((card) => (
                <div key={card.id} className="glassmorphism rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={card.thumbnail}
                      alt={card.company}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-200">{card.title}</h3>
                      <p className="text-slate-400">{card.company}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{card.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.skills?.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
});

Experience.displayName = 'Experience';

export default Experience;