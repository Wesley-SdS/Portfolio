"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  name: string;
  link: string;
  icon?: string;
}

interface CosmicNavProps {
  navItems: NavItem[];
  className?: string;
}

const CosmicNav: React.FC<CosmicNavProps> = ({ navItems, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    const sectionId = link.replace("#", "");
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      if (scrollDirection === 'down' && currentScrollY > 100) {
        setIsVisible(false);
      } else if (scrollDirection === 'up' || currentScrollY < 100) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      const sections = navItems.map(item => item.link.replace("#", ""));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    const throttledHandleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 50);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY, navItems]);

  const navVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number]
      }
    }
  };

  const iconMap: Record<string, string> = {
    "Início": "⚡",
    "Sobre": "👨‍💻",
    "Experiência": "🚀",
    "Projetos": "💎",
    "Soluções": "🔮",
    "Interface": "🌐",
    "Galeria": "🎨",
    "Contato": "📡"
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={navVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="exit"
          className={cn(
            "fixed top-8 left-0 right-0 mx-auto z-[9999] px-4 py-2",
            "backdrop-blur-xl bg-card/90 dark:bg-card/80",
            "border border-primary/30 rounded-2xl",
            "shadow-[0_8px_32px_hsl(var(--primary)/0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "w-fit max-w-[90vw]",
            className
          )}
        >
          <nav className="flex items-center gap-2 flex-nowrap relative overflow-x-auto scrollbar-hide">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.link.replace("#", "");
              
              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative flex-shrink-0"
                >
                  <Link
                    href={item.link}
                    onClick={(e) => handleNavClick(e, item.link)}
                    className={cn(
                      "relative block px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-all duration-300",
                      "flex items-center gap-1.5 md:gap-2 whitespace-nowrap z-10",
                      isActive
                        ? "text-primary dark:text-indigo-300"
                        : "text-muted-foreground hover:text-primary dark:hover:text-indigo-200"
                    )}
                  >
                    <span className="text-sm md:text-base">{iconMap[item.name] || "✦"}</span>
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-primary/15 rounded-lg border border-primary/30"
                      transition={{ 
                        type: "spring", 
                        bounce: 0.2, 
                        duration: 0.6 
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
            <div className="flex-shrink-0 ml-2 border-l border-primary/20 pl-2 flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Glow effect estático - sem animação infinita */}
          <div
            className="absolute -inset-px bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 dark:opacity-30 blur-sm -z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { CosmicNav };