"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { FaRocket, FaCode, FaBrain, FaCloud, FaShieldAlt, FaChartLine } from "react-icons/fa";

interface Solution {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  technologies: string[];
  gradient: string;
}

const Solutions: React.FC = React.memo(() => {
  const t = useTranslations('solutions');
  const [hoveredSolution, setHoveredSolution] = useState<number | null>(null);
  const solutions: Solution[] = [
    {
      id: 1,
      title: "Inteligência Artificial",
      description: "Soluções avançadas de IA para automação e análise preditiva",
      icon: <FaBrain className="text-4xl" />,
      features: [
        "Agentes inteligentes",
        "Análise preditiva",
        "Processamento de linguagem natural",
        "Visão computacional"
      ],
      technologies: ["Python", "OpenAI", "Anthropic", "TensorFlow", "PyTorch"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Web Applications",
      description: "Aplicações web escaláveis e performáticas com tecnologias modernas",
      icon: <FaCode className="text-4xl" />,
      features: [
        "Aplicações Full Stack",
        "E-commerce customizado",
        "Dashboards interativos",
        "APIs RESTful"
      ],
      technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Cloud & DevOps",
      description: "Infraestrutura em nuvem e pipelines de deploy automatizados",
      icon: <FaCloud className="text-4xl" />,
      features: [
        "Arquitetura serverless",
        "CI/CD pipelines",
        "Orquestração de contêineres",
        "Monitoramento e logging"
      ],
      technologies: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Vercel"],
      gradient: "from-green-500 to-teal-500"
    },
    {
      id: 4,
      title: "Segurança & Performance",
      description: "Implementação de práticas de segurança e otimização de performance",
      icon: <FaShieldAlt className="text-4xl" />,
      features: [
        "Segurança de aplicações",
        "Otimização de performance",
        "Testes automatizados",
        "Monitoramento contínuo"
      ],
      technologies: ["OWASP", "Jest", "Cypress", "Lighthouse", "Sentry"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 5,
      title: "Data Analytics",
      description: "Análise de dados e visualização para tomada de decisão",
      icon: <FaChartLine className="text-4xl" />,
      features: [
        "Business Intelligence",
        "Dashboards personalizados",
        "Data mining",
        "Machine Learning"
      ],
      technologies: ["Python", "R", "Tableau", "Power BI", "Apache Spark"],
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 6,
      title: "Consultoria Técnica",
      description: "Consultoria especializada para transformação digital",
      icon: <FaRocket className="text-4xl" />,
      features: [
        "Arquitetura de software",
        "Mentoria técnica",
        "Revisão de código",
        "Planejamento estratégico"
      ],
      technologies: ["SOLID", "Clean Code", "Agile", "Scrum", "TDD"],
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section id="solutions" className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
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
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredSolution(solution.id)}
              onMouseLeave={() => setHoveredSolution(null)}
            >
              <div className="glassmorphism rounded-xl p-8 h-full hover:glow-effect transition-all duration-300 relative" style={{ overflow: 'visible' }}>
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
                    width: hoveredSolution === solution.id ? '100%' : 0,
                    opacity: hoveredSolution === solution.id ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon and Title */}
                <div className="relative z-10 mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${solution.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {solution.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {solution.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-foreground/80 mb-6 relative z-10 leading-relaxed">
                  {solution.description}
                </p>

                {/* Features */}
                <div className="mb-6 relative z-10">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Principais Recursos:</h4>
                  <ul className="space-y-2">
                    {solution.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-purple-500 dark:text-purple-400 mt-1 text-xs">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="relative z-10">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Tecnologias:</h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded-full glassmorphism text-foreground/80 border border-primary/20 hover:border-purple-500/40 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {solution.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs rounded-full glassmorphism text-muted-foreground">
                        +{solution.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500/30 transition-colors duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="glassmorphism rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t('ready')}
            </h2>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('mailto:seu-email@dominio.com', '_blank')}
              >
                {t('cta.consultation')}
              </motion.button>
              <motion.button
                className="px-8 py-3 rounded-lg glassmorphism text-foreground font-medium hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('projects');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('cta.viewProjects')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Solutions.displayName = 'Solutions';

export default Solutions;