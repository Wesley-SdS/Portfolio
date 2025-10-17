"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { projectsData } from "@/src/constants/modernProjects";
import { PinContainer } from "./ui/3d-pin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/src/types/project";
import MagicButton from "./MagicButton";

const RecentProjects = () => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  return (
    <section id="projects" className="py-20 deep-space-gradient">
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
          <span className="text-purple"> Projetos</span>
        </motion.h1>
        
        <div className="mt-10 grid grid-cols-1 gap-24 p-4 sm:grid-cols-2 md:grid-cols-3">
          {projectsData.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex w-full flex-col items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <PinContainer title={item.title}>
                <div
                  className="flex h-[20rem] w-[25rem] cursor-pointer flex-col p-4 tracking-tight"
                  onClick={() => handleProjectClick(item)}
                >
                  <h3 className="!m-0 max-w-xs !pb-2 font-bold text-slate-100">
                    {item.title}
                  </h3>
                  <div className="text-slate-500">{item.description}</div>
                  <div className="mt-4 flex w-full flex-1 rounded-lg">
                    <img
                      src={item.images[0]?.src || '/project-placeholder.jpg'}
                      alt={item.images[0]?.alt || 'Project cover'}
                      className="z-10 h-full w-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              </PinContainer>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedProject && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div />
          </DialogTrigger>

          <DialogContent className="h-full w-full max-w-6xl p-8 glassmorphism">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-200">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="text-md text-slate-400">
                {selectedProject.longDescription || selectedProject.description}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-full w-full p-4">
              <div>
                <img
                  src={selectedProject.images[0]?.src || '/project-placeholder.jpg'}
                  alt={selectedProject.images[0]?.alt || 'Project screenshot'}
                  className="h-[30rem] w-full rounded-lg object-cover"
                />
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-slate-200">Detalhes do Projeto</h2>
                <p className="text-md mt-2 text-slate-300">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              {selectedProject.achievements && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-slate-200">Conquistas</h2>
                  <ul className="mt-4 space-y-2">
                    {selectedProject.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.metrics && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-slate-200">Métricas</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {Object.entries(selectedProject.metrics).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-semibold capitalize text-slate-200">{key}:</span>
                        <span className="ml-2 text-slate-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-md font-bold text-slate-200">Tecnologias Usadas</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-2">
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && selectedProject.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center justify-center glassmorphism rounded-lg p-6 hover:glow-effect transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{tech.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-slate-300 text-left">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                {selectedProject.links.map((link, index) => (
                  <MagicButton
                    key={index}
                    title={link.label}
                    icon={<></>}
                    position="right"
                    onClick={() => window.open(link.url, '_blank')}
                    otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
                  />
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default RecentProjects;