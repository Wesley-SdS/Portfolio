"use client";
import React from "react";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: 'pt', label: '🇧🇷 Português', name: 'Português' },
  { code: 'es', label: '🇪🇸 Español', name: 'Español' },
  { code: 'en', label: '🇺🇸 English', name: 'English' },
];

export const LanguageSwitcher: React.FC = React.memo(() => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    // Persist preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-9 glassmorphism border-primary/20 text-foreground dark:text-slate-300">
        <SelectValue placeholder={currentLanguage?.label || "Select language"} />
      </SelectTrigger>
      <SelectContent className="glassmorphism border-primary/20 bg-card/95 dark:bg-slate-950/95">
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="text-foreground dark:text-slate-300 hover:text-purple-500 dark:hover:text-purple-400 focus:text-purple-500 dark:focus:text-purple-400 cursor-pointer"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

