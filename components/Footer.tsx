"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaCode } from "react-icons/fa";
import MagicButton from "./MagicButton";

const Footer: React.FC = () => {
  const socialLinks = [
    {
      icon: <FaGithub className="text-2xl" />,
      href: "https://github.com/seu-usuario",
      label: "GitHub",
      color: "hover:text-white"
    },
    {
      icon: <FaLinkedin className="text-2xl" />,
      href: "https://linkedin.com/in/seu-usuario",
      label: "LinkedIn", 
      color: "hover:text-blue-400"
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      href: "mailto:seu-email@dominio.com",
      label: "Email",
      color: "hover:text-purple-400"
    }
  ];

  const quickLinks = [
    { name: "Início", href: "#home" },
    { name: "Sobre", href: "#about" },
    { name: "Experiência", href: "#experience" },
    { name: "Projetos", href: "#projects" }
  ];

  return (
    <footer id="contact" className="relative deep-space-gradient border-t border-indigo-500/20">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <FaRocket className="text-2xl text-purple-400" />
              <h3 className="text-xl font-bold text-slate-200">Tech Lead Software Engineer</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transformando código em experiências extraordinárias. 
              Tech Lead Full Stack especializado em IA e automação.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`w-10 h-10 rounded-lg glassmorphism flex items-center justify-center text-slate-400 transition-all duration-300 ${link.color} hover:glow-effect`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-slate-200">Navegação</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xs">▸</span>
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Expertise */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-slate-200">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'TypeScript', 'Python', 'IA', 'React', 'Node.js'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full glassmorphism text-slate-300 border border-indigo-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FaCode className="text-xl text-purple-400" />
              <h4 className="text-lg font-semibold text-slate-200">Vamos Conversar?</h4>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Pronto para transformar ideias em realidade digital? 
              Entre em contato e vamos construir algo extraordinário juntos.
            </p>
            <MagicButton
              title="Enviar Mensagem"
              icon={<FaEnvelope />}
              position="right"
              onClick={() => window.open('mailto:seu-email@dominio.com', '_blank')}
              otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-16 pt-8 border-t border-indigo-500/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Wesley Santos. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>Feito com</span>
              <span className="text-red-500">❤️</span>
              <span>e</span>
              <FaCode className="text-purple-400" />
              <span>no Deep Space</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;