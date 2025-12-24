"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaRocket className="text-8xl text-purple-500 dark:text-purple-400 mx-auto mb-4" />
        </motion.div>

        <h1 className="text-6xl font-bold text-foreground dark:text-slate-200 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-foreground/80 dark:text-slate-300 mb-4">
          Página não encontrada
        </h2>

        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg glassmorphism text-foreground dark:text-slate-200 font-medium border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
          >
            Voltar ao Início
          </Link>
          <Link
            href="/#projects"
            className="px-6 py-3 rounded-lg glassmorphism text-foreground dark:text-slate-200 font-medium border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
          >
            Ver Projetos
          </Link>
        </div>
      </motion.div>
    </div>
  );
}



