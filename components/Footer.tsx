"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaCode } from "react-icons/fa";
import MagicButton from "./MagicButton";

const Footer: React.FC = React.memo(() => {
  const t = useTranslations('footer');
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

  const tCommon = useTranslations('common');
  const quickLinks = [
    { name: tCommon('nav.home'), href: "#home" },
    { name: tCommon('nav.about'), href: "#about" },
    { name: tCommon('nav.experience'), href: "#experience" },
    { name: tCommon('nav.projects'), href: "#projects" }
  ];

  return (
    <footer id="contact" className="relative border-t border-primary/20">
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
              <FaRocket className="text-2xl text-purple-500 dark:text-purple-400" />
              <h3 className="text-xl font-bold text-foreground dark:text-slate-200">{t('brand')}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('description')}
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`w-10 h-10 rounded-lg glassmorphism flex items-center justify-center text-muted-foreground transition-all duration-300 ${link.color} hover:glow-effect`}
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
            <h4 className="text-lg font-semibold text-foreground dark:text-slate-200">{t('navigation')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300 flex items-center gap-2"
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
            <h4 className="text-lg font-semibold text-foreground dark:text-slate-200">{t('expertise')}</h4>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'TypeScript', 'Python', 'IA', 'React', 'Node.js'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full glassmorphism text-foreground/80 dark:text-slate-300 border border-primary/20"
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
              <FaCode className="text-xl text-purple-500 dark:text-purple-400" />
              <h4 className="text-lg font-semibold text-foreground dark:text-slate-200">{t('cta.title')}</h4>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t('cta.description')}
            </p>
            <MagicButton
              title={t('cta.button')}
              icon={<FaEnvelope />}
              position="right"
              onClick={() => window.open('mailto:seu-email@dominio.com', '_blank')}
              otherClasses="glassmorphism hover:glow-effect transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="mt-16 pt-8 border-t border-primary/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {t('copyright')}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {t('madeWith')}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;