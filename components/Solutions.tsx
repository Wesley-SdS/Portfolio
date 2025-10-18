"use client";
import React from "react";
import { motion } from "framer-motion";
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

const Solutions: React.FC = () => {
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
    <section id="solutions" className="py-20 deep-space-gradient">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading mb-6">
            <span className="text-purple">Soluções</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Transformando desafios complexos em soluções digitais inovadoras 
            com tecnologia de ponta e melhores práticas do mercado.
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
            >
              <div className="glassmorphism rounded-xl p-8 h-full hover:glow-effect transition-all duration-300 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon and Title */}
                <div className="relative z-10 mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${solution.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {solution.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {solution.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-6 relative z-10 leading-relaxed">
                  {solution.description}
                </p>

                {/* Features */}
                <div className="mb-6 relative z-10">
                  <h4 className="text-sm font-semibold text-slate-200 mb-3">Principais Recursos:</h4>
                  <ul className="space-y-2">
                    {solution.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-purple-400 mt-1 text-xs">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="relative z-10">
                  <h4 className="text-sm font-semibold text-slate-200 mb-3">Tecnologias:</h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded-full glassmorphism text-slate-300 border border-indigo-500/20 hover:border-purple-500/40 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {solution.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs rounded-full glassmorphism text-slate-400">
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
            <h2 className="text-2xl font-bold text-slate-200 mb-4">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Vamos discutir como minhas soluções podem ajudar sua empresa a alcançar 
              seus objetivos tecnológicos e de negócios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('mailto:seu-email@dominio.com', '_blank')}
              >
                Agendar Consultoria
              </motion.button>
              <motion.button
                className="px-8 py-3 rounded-lg glassmorphism text-slate-200 font-medium hover:bg-indigo-500/10 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('projects');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Projetos
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Solutions;