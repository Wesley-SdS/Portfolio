"use client";
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { useTranslations } from 'next-intl';
import { FaSearch, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";

export const SearchBar: React.FC = React.memo(() => {
  const t = useTranslations('search');
  const { query, results, isOpen, handleSearch, clearSearch, setIsOpen } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  const handleResultClick = (url: string) => {
    clearSearch();
    window.location.href = url;
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={t('placeholder')}
          className={cn(
            "w-full pl-10 pr-10 py-2 rounded-lg glassmorphism border border-indigo-500/20",
            "text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40",
            "transition-colors text-sm"
          )}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glassmorphism rounded-lg border border-indigo-500/20 max-h-96 overflow-y-auto z-50"
          >
            <div className="p-2 space-y-1">
              {results.map((result) => (
                <motion.button
                  key={result.id}
                  onClick={() => handleResultClick(result.url)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-500/10 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="text-sm font-medium text-slate-200">{result.title}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{result.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';



