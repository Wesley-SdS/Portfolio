"use client";
import React from "react";
import { motion } from "framer-motion";
import MagicButton from "./MagicButton";
import { FaBriefcase, FaCode, FaUsers, FaRocket } from "react-icons/fa";

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 lg:px-20 deep-space-gradient w-full">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="heading mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Sobre <span className="text-purple">Mim</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Profile Section */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Sua foto aqui */}
            <div className="mb-8 lg:mb-12">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden glow-effect glassmorphism border-2 border-purple-500/20 mx-auto lg:mx-0">
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl lg:text-8xl mb-4">👤</div>
                    <p className="text-slate-300 text-sm lg:text-base">Sua foto aqui</p>
                    <p className="text-xs text-slate-400 mt-2">Adicione sua imagem em /public</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-200 mb-4">
              Wesley Santos
            </h3>
            <p className="text-xl text-slate-400 mb-6">
              Tech Lead Full Stack & Digital Artisan
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {['9+ Anos', 'IA & Automação', 'Liderança', 'Full Stack'].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full glassmorphism text-sm text-slate-300">
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
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <FaRocket className="text-purple-400" />
                Minha Missão
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Com mais de nove anos de experiência em tecnologia, atuo como Programador Sênior e Líder Técnico na Adalink, onde conduzo o desenvolvimento de soluções avançadas em Inteligência Artificial e automação. Minha missão é transformar ideias complexas em sistemas inteligentes e escaláveis.
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <FaCode className="text-purple-400" />
                Expertise Técnica
              </h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                Trabalho com uma stack moderna que inclui Next.js, TypeScript, Python, Node.js e Go, explorando o melhor de cada linguagem para construir aplicações robustas e de alta performance.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <FaCode className="text-purple-400" />
                Liderança & Inovação
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Na Adalink, lidero iniciativas de automações inteligentes e orquestração de agentes. Participo ativamente de decisões de arquitetura e guio o time na implementação de práticas sólidas como clean code, testes e CI/CD.
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-6 hover:glow-effect transition-all duration-300">
              <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <FaCode className="text-purple-400" />
                Visão & Valores
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Sou entusiasta de Inteligência Artificial aplicada a negócios, com experiência em integrações com LLMs como OpenAI, Anthropic e Gemini. Minha abordagem une técnica e propósito, buscando sempre entender o contexto do problema.
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
                title="Ver Experiência"
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
};

export default AboutMe;