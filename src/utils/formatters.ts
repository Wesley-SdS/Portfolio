import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

const locales = {
  pt: ptBR,
  en: enUS,
  es: es
};

export const formatDate = (
  date: string | Date,
  formatStr: string = 'dd/MM/yyyy',
  locale: 'pt' | 'en' | 'es' = 'pt'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: locales[locale] });
};

export const formatDateDistance = (
  date: string | Date,
  locale: 'pt' | 'en' | 'es' = 'pt'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locales[locale]
  });
};

export const formatPeriod = (
  startDate: string,
  endDate?: string,
  locale: 'pt' | 'en' | 'es' = 'pt'
): string => {
  const start = formatDate(startDate, 'MMM yyyy', locale);
  const end = endDate ? formatDate(endDate, 'MMM yyyy', locale) : 'Atual';
  return `${start} - ${end}`;
};

export const formatSkillLevel = (level: string, locale: 'pt' | 'en' | 'es' = 'pt'): string => {
  const translations = {
    pt: {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
      expert: 'Especialista'
    },
    en: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert'
    },
    es: {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      expert: 'Experto'
    }
  };

  return translations[locale][level as keyof typeof translations[typeof locale]] || level;
};

export const formatMetrics = (value: string | number): string => {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }
  return value;
};