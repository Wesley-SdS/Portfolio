'use client';
import React, { useState } from "react";
import { workExperience } from "@/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/moving-border";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaLaravel,
  FaPython,
  FaVuejs,
  FaAngular,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiRedux,
  SiGraphql,
  SiMongodb,
} from "react-icons/si";
import MagicButton from "./MagicButton";

const Experience = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const skillsTech = [
    { icon: <FaReact className="text-cyan-500" />, name: "React.js", description: "Interfaces dinâmicas e interativas." },
    { icon: <SiNextdotjs className="text-purple-500" />, name: "Next.js", description: "Framework moderno otimizado para SEO." },
    { icon: <SiTailwindcss className="text-teal-400" />, name: "Tailwind CSS", description: "Estilização responsiva e rápida." },
    { icon: <SiTypescript className="text-blue-600" />, name: "TypeScript", description: "Tipagem estática para escalabilidade." },
    { icon: <FaNodeJs className="text-green-500" />, name: "Node.js", description: "Backend escalável e eficiente." },
    { icon: <FaDocker className="text-blue-400" />, name: "Docker", description: "Contêineres para deploy eficiente." },
    { icon: <FaHtml5 className="text-orange-600" />, name: "HTML5", description: "Base para páginas web semânticas." },
    { icon: <FaCss3Alt className="text-blue-500" />, name: "CSS3", description: "Estilização visual de páginas web." },
    { icon: <FaJsSquare className="text-yellow-500" />, name: "JavaScript", description: "Linguagem para lógica e interatividade." },
    { icon: <FaLaravel className="text-red-600" />, name: "Laravel", description: "Framework PHP robusto e versátil." },
    { icon: <FaPython className="text-green-300" />, name: "Python", description: "Linguagem poderosa para diversas aplicações." },
    { icon: <SiDjango className="text-green-700" />, name: "Django", description: "Desenvolvimento web seguro e rápido." },
    { icon: <FaVuejs className="text-green-400" />, name: "Vue.js", description: "Interfaces interativas com foco em simplicidade." },
    { icon: <FaAngular className="text-red-700" />, name: "Angular", description: "Framework modular para aplicações web." },
    { icon: <SiGraphql className="text-pink-500" />, name: "GraphQL", description: "APIs flexíveis e performáticas." },
    { icon: <SiMysql className="text-blue-600" />, name: "MySQL", description: "Banco de dados relacional robusto." },
    { icon: <SiPostgresql className="text-blue-800" />, name: "PostgreSQL", description: "Banco avançado para grandes aplicações." },
    { icon: <SiMongodb className="text-green-600" />, name: "MongoDB", description: "Banco NoSQL para dados não estruturados." },
    { icon: <SiRedux className="text-purple-500" />, name: "Redux", description: "Gerenciamento de estado global." },
    { icon: <FaGitAlt className="text-orange-500" />, name: "Git", description: "Controle de versão eficiente." },
  ];

  const skillsPersonal = [
    {
      name: "Organização",
      description: "Capacidade de estruturar tarefas e gerenciar prioridades de forma eficiente para alcançar resultados consistentes.",
    },
    {
      name: "Trabalho em Equipe",
      description: "Habilidade de colaborar de maneira produtiva com colegas para alcançar objetivos comuns e superar desafios.",
    },
    {
      name: "Proatividade",
      description: "Iniciativa para identificar e resolver problemas ou sugerir melhorias antes que sejam solicitadas.",
    },
    {
      name: "Atenção aos Detalhes",
      description: "Foco em revisar e ajustar os mínimos aspectos para garantir precisão e qualidade em entregas.",
    },
    {
      name: "Comprometimento",
      description: "Dedicação total às responsabilidades, mantendo ética profissional e um padrão elevado de trabalho.",
    },
    {
      name: "Aprendizado Rápido",
      description: "Capacidade de adquirir novas habilidades e conhecimentos rapidamente, adaptando-se a diferentes contextos.",
    },
    {
      name: "Comunicação Clara",
      description: "Facilidade para transmitir ideias e informações de maneira eficiente, garantindo alinhamento e compreensão.",
    },
    {
      name: "Foco em Resultados",
      description: "Compromisso com a obtenção de objetivos mensuráveis e impacto positivo nas entregas e no time.",
    },
  ];
  

  return (
    <section id="experience" className="w-full py-20">
      <h1 className="heading text-purple">
        <span className="text-purple-500">Experiências</span>
      </h1>

      <div className="mt-12 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {workExperience.map((card) => (
          <Button
            key={card.id}
            borderRadius="1.75rem"
            duration={Math.floor(Math.random() * 10000) + 1000}
            style={{
              background: "rgb(0, 0, 0)",
              borderRadius: `calc(1.75rem * 0.96)`,
            }}
            className="text-white"
          >
            <div className="flex flex-col items-center gap-2 p-3 py-6 md:p-5 lg:p-10">
              <img
                src={card.thumbnail}
                alt={card.title}
                className="w-16 text-center"
              />
              <div className="text-center lg:mt-5">
                <h1 className="text-xl font-bold md:text-2xl">{card.title}</h1>
                <p className="mt-3 text-white-100">{card.desc}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>

  
      <div className="mt-12 flex justify-center">
  <div className="relative group">

    <div className="absolute inset-0 rounded-lg border-4 border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-spin-border"></div>


    <div className="mt-6 flex justify-center">
        <MagicButton
          title="Minhas Skills"
          icon={<FaReact />}
          position="left"
          onClick={() => setIsDialogOpen(true)} 
        />
      </div></div>
</div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="h-full w-full max-w-6xl p-8 bg-transparent backdrop-blur-md rounded-lg">




    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-center text-white">Minhas Skills</DialogTitle>
    </DialogHeader>
    <ScrollArea className="h-full w-full p-4">
      {/* Tecnologias */}
      <h2 className="text-lg font-semibold text-purple-300">Tecnologias:</h2>
      <div className="grid grid-cols-2 gap-6 mt-4 md:grid-cols-3 lg:grid-cols-4">
        {skillsTech.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 p-4 text-center border border-violet-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <div className="text-4xl text-purple-400">{skill.icon}</div>
            <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
            <p className="text-sm text-gray-300">{skill.description}</p>
          </div>
        ))}
      </div>

  
      <h2 className="mt-12 text-lg font-semibold text-purple-300">Habilidades Pessoais:</h2>
      <ul className="mt-4 space-y-3 pl-5 text-gray-300 list-disc">
        {skillsPersonal.map((skill, index) => (
          <li
            key={index}
            className="text-base font-medium hover:text-white transition-all duration-200"
          >
            {skill.name}: <span className="font-normal">{skill.description}</span>
          </li>
        ))}
      </ul>
      

    </ScrollArea>
    
  </DialogContent>
</Dialog>

  <div className="relative border-l-2 border-violet-900 pl-4 mt-8 space-y-8">
    {workExperience.map((experience) => (
      <div key={experience.id} className="relative">
  
        <div className="absolute -left-2 w-4 h-4 bg-violet-900 rounded-full border-2 border-white"></div>

        <div className="p-6 rounded-lg shadow-md border border-violet-900">
     
          <div className="flex items-center gap-4">
            <img
              src={experience.thumbnail}
              alt={experience.title}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold text-white">{experience.title}</h3>
              <p className="text-sm text-gray-300">{experience.company}</p>
            </div>
          </div>

    
          <div className="mt-2 text-gray-400 text-sm">
            <p>{experience.location}</p>
            <p>{experience.period}</p>
          </div>
          <ScrollArea className="h-96 w-full p-4">

     
          <p className="mt-4 text-gray-300">{experience.desc}</p>

          <ul className="mt-4 text-gray-400 list-disc list-inside">
            {experience.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>


          <ul className="mt-4 text-gray-300 list-disc list-inside">
            {experience.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          </ScrollArea>
        </div>
      </div>
    ))}
  </div>


    </section>
  );
};

export default Experience;
