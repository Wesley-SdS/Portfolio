"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { projects } from "@/data"; 
import { PinContainer } from "./ui/3d-pin";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaDatabase,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiVercel,
} from "react-icons/si";


interface Project {
  id: number;
  title: string;
  desc: string;
  img: string;
  link: string;
  details?: string; 
  additionalInfo?: {
    title: string;
    content: string;
  }[];
  technologiesUsed?: {
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }[];
}


const RecentProjects = () => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  return (
    <section id="projects" className="py-20">
      <h1 className="heading text-white">
        <span className="text-purple"> Projetos</span>
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-24 p-4 sm:grid-cols-2 md:grid-cols-3">
        {projects.map((item) => (
          <div
            className="flex w-full flex-col items-center justify-center"
            key={item.id}
          >
            <PinContainer title={item.title}>
              <div
                className="flex h-[20rem] w-[25rem] cursor-pointer flex-col p-4 tracking-tight"
                onClick={() => handleProjectClick(item)}
              >
                <h3 className="!m-0 max-w-xs !pb-2 font-bold text-slate-100">
                  {item.title}
                </h3>
                <div className="text-slate-500">{item.desc}</div>
                <div className="mt-4 flex w-full flex-1 rounded-lg">
                  <img
                    src={item.img}
                    alt="cover"
                    className="z-10 h-full w-full rounded-lg object-cover"
                  />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>

      {selectedProject && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div />
          </DialogTrigger>

          <DialogContent className="h-full w-full max-w-6xl p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="text-md text-slate-500">
                {selectedProject.desc}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-full w-full p-4">
         
              <div>
                <img
                  src={selectedProject.img}
                  alt="Project Image"
                  className="h-[30rem] w-full rounded-lg object-cover"
                />
              </div>

      
              <div className="mt-6">
                <h2 className="text-lg font-bold">Detalhes do Projeto</h2>
                <p className="text-md mt-2 text-slate-700">
                  {selectedProject.details}
                </p>
              </div>

      
              {selectedProject.additionalInfo && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold">Informações Adicionais</h2>
                  <div className="mt-4 space-y-4">
                    {selectedProject.additionalInfo.map((info, index) => (
                      <div key={index}>
                        <h3 className="text-md font-semibold">{info.title}</h3>
                        <p className="text-sm text-gray-700">{info.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

         
              <div className="mt-6">
                <h3 className="text-md font-bold">Tecnologias Usadas</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-2">
  {selectedProject.technologiesUsed && selectedProject.technologiesUsed.length > 0 && selectedProject.technologiesUsed.map((tech, index) => (
    <div
      key={index}
      className="flex gap-4 items-center justify-center bg-violet-100 shadow-lg rounded-lg p-6 hover:scale-105 transform transition-all duration-300 ease-in-out"
    >
      <tech.icon size={100} className={tech.color} />
      <span className="mt-2 text-sm text-black text-left">
        {tech.description}
      </span>
    </div>
  ))}
</div>


              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default RecentProjects;
