import { PersonalInfo, SEOMetadata } from '../types';

export const personalInfo: PersonalInfo = {
  name: 'Wesley Santos',
  title: 'Tech Lead Full Stack & Arquiteto de IA',
  subtitle: 'Especialista em plataformas escaláveis de IA e automação',
  bio: 'Tech Lead Sênior com 9+ anos de experiência em desenvolvimento Full Stack, especializado em Next.js, React, automação e Inteligência Artificial. Atualmente lidera equipe técnica na Adalink e é founder da OrbitMind, criando soluções inovadoras que impactam milhares de usuários.',
  profileImage: '/wesley-profile.jpg',
  resumeUrl: '/curriculo.pdf',
  contact: {
    email: 'wesleysantos.0095@gmail.com',
    phone: '+55 11 99999-9999',
    location: 'São Paulo, Brasil',
    timezone: 'UTC-3',
    availability: 'available'
  },
  socialLinks: [
    {
      platform: 'github',
      url: 'https://github.com/Wesley-SdS',
      username: 'Wesley-SdS',
      icon: '/icons/github.svg'
    },
    {
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/wesley-sds/',
      username: 'wesley-sds',
      icon: '/icons/linkedin.svg'
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/wesley_dev',
      username: 'wesley_dev',
      icon: '/icons/twitter.svg'
    },
    {
      platform: 'email',
      url: 'mailto:wesleysantos.0095@gmail.com',
      icon: '/icons/email.svg'
    }
  ]
};

export const seoMetadata: SEOMetadata = {
  title: 'Wesley Santos - Tech Lead Full Stack | IA & Automação',
  description: 'Tech Lead Sênior com 9+ anos em Next.js, React, IA e automação. Líder técnico na Adalink e founder da OrbitMind. Especialista em soluções escaláveis e inovadoras.',
  keywords: [
    'Tech Lead',
    'Full Stack Developer',
    'Next.js',
    'React',
    'TypeScript',
    'IA',
    'Automação',
    'Adalink',
    'OrbitMind',
    'São Paulo',
    'Desenvolvedor Sênior',
    'Arquiteto de Software'
  ],
  openGraph: {
    title: 'Wesley Santos - Tech Lead Full Stack',
    description: 'Especialista em plataformas escaláveis de IA e automação. Tech Lead na Adalink e Founder da OrbitMind.',
    images: ['/wesley-profile.jpg', '/og-image.jpg'],
    type: 'profile'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wesley Santos - Tech Lead Full Stack',
    description: 'Especialista em plataformas escaláveis de IA e automação',
    images: ['/wesley-profile.jpg']
  }
};