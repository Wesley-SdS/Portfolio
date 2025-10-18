'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { workExperience } from "@/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/moving-border";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExperienceTimeline from "./3d/ExperienceTimeline";
import MagicButton from "./MagicButton";

const Experience = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <section id="experience" className="w-full py-20 deep-space-gradient">
      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="heading mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple">Experiências</span>
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
            Jornada Profissional 3D
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
                className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setIsDialogOpen(true)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={card.thumbnail}
                      alt={card.title}
                      className="w-full h-full object-cover"
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
              <motion.div
                key={skill.name}
                className="glassmorphism rounded-lg p-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
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
                    transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
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
            Liderança & Soft Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadershipSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="glassmorphism rounded-lg p-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
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
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
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
            title="Ver Projetos"
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
            <DialogTitle className="text-slate-200">Experiência Completa</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 gap-6">
              {workExperience.map((card) => (
                <div key={card.id} className="glassmorphism rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={card.thumbnail}
                      alt={card.company}
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
};

export default Experience;