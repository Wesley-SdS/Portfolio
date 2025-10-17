// Novo arquivo de projetos realista baseado na experiência real
import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'adalink-ia-platform',
    title: 'Adalink - Plataforma de IA e Automação',
    description: 'Plataforma avançada de automações e agentes inteligentes com Next.js, Python e integração com múltiplos serviços empresariais.',
    longDescription: 'Plataforma completa de automação empresarial desenvolvida como Programador Sênior Full Stack e evoluída para Líder Técnico. Sistema escalável para automação de processos de negócio com IA, integrando múltiplos serviços e APIs.',
    images: [
      { src: '/projects/adalink-dashboard.png', alt: 'Adalink Dashboard', type: 'cover' },
      { src: '/projects/adalink-workflow.png', alt: 'Editor de Workflows', type: 'screenshot' },
      { src: '/projects/adalink-integrations.png', alt: 'Painel de Integrações', type: 'demo' }
    ],
    technologies: [
      'Next.js', 'TypeScript', 'TailwindCSS', 'Node.js', 'Python',
      'PostgreSQL', 'API Integration', 'React', 'IA e Automação'
    ],
    links: [
      { type: 'live', url: 'https://adalink.com.br', label: 'Visitar Site' }
    ],
    featured: true,
    category: 'platform',
    status: 'in-progress',
    achievements: [
      'Desenvolvimento full stack de soluções IA',
      'Promoção para liderança técnica em 4 meses',
      'Sistemas escaláveis e de alta performance',
      'Evolução da arquitetura do produto'
    ],
    metrics: {
      performance: 'Alta performance',
      scalability: 'Sistemas escaláveis',
      customMetric: [
        { label: 'Tempo de Promoção', value: '4 meses' },
        { label: 'Soluções IA', value: 'Múltiplas' }
      ]
    },
    startDate: '2025-02-01',
    teamSize: 1,
    role: 'Programador Sênior Full Stack / Líder Técnico'
  },
  {
    id: 'love-startup-marketplace',
    title: 'Love Startup - Marketplace MVP',
    description: 'Marketplace para validação de ideias e produtos digitais com backend Python e frontend Next.js.',
    longDescription: 'MVP completo de marketplace multi-vendedor desenvolvido em 2 meses como Freelancer, com catálogo de produtos, autenticação de usuários, gestão de pedidos e pagamentos. Arquitetura moderna com Python/FastAPI no backend e Next.js no frontend.',
    images: [
      { src: '/projects/love-startup-dashboard.png', alt: 'Love Startup Dashboard', type: 'cover' },
      { src: '/projects/love-startup-catalog.png', alt: 'Catálogo de Produtos', type: 'screenshot' }
    ],
    technologies: [
      'Python', 'FastAPI', 'Django', 'Flask', 'Next.js', 
      'PostgreSQL', 'TailwindCSS', 'ORM', 'APIs REST'
    ],
    links: [
      { type: 'demo', url: '#', label: 'Em breve' }
    ],
    featured: true,
    category: 'ecommerce',
    status: 'completed',
    achievements: [
      'MVP funcional entregue em 2 meses',
      'APIs completas para gestão de produtos e pedidos',
      'Interface responsiva com UX otimizada',
      'Modelagem de dados PostgreSQL eficiente'
    ],
    metrics: {
      development: '2 meses',
      features: 'Completo',
      customMetric: [
        { label: 'Módulos', value: '5+' },
        { label: 'Integrações', value: 'Múltiplas' }
      ]
    },
    startDate: '2024-12-01',
    endDate: '2025-01-31',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'freelance-ecommerce',
    title: 'E-commerce Personalizado - Freelancer',
    description: 'E-commerce customizado de ponta a ponta com Next.js, Node.js e PostgreSQL, focado em performance e conversão.',
    longDescription: 'Desenvolvimento completo de e-commerce como Freelancer, com arquitetura Next.js App Router, API Routes Node.js, autenticação JWT, sistema de pagamentos integrado e painel administrativo completo.',
    images: [
      { src: '/ecommerce.png', alt: 'E-commerce Platform', type: 'cover' },
      { src: '/projects/ecommerce-admin.png', alt: 'Painel Administrativo', type: 'screenshot' }
    ],
    technologies: [
      'Next.js', 'Node.js', 'TailwindCSS', 'PostgreSQL', 'TypeScript',
      'JWT/Auth', 'Payment Gateway', 'Vercel Deploy', 'APIs'
    ],
    links: [
      { type: 'demo', url: '#', label: 'Portfolio Demo' }
    ],
    featured: true,
    category: 'ecommerce',
    status: 'completed',
    achievements: [
      'E-commerce full stack completo',
      'Performance e SEO otimizados',
      'Sistema de autenticação RBAC',
      'Checkout com múltiplos gateways'
    ],
    metrics: {
      conversion: 'Otimizado',
      performance: 'Alta',
      customMetric: [
        { label: 'Módulos', value: '8+' },
        { label: 'Integrações', value: '5+' }
      ]
    },
    startDate: '2023-10-01',
    endDate: '2024-12-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack Autônomo'
  },
  {
    id: 'melhor-do-grao-erp',
    title: 'Sistema ERP - Melhor do Grão',
    description: 'ERP completo integrado ao e-commerce com módulos financeiros, estoque, notas fiscais e dashboards gerenciais.',
    longDescription: 'Sistema ERP desenvolvido durante 8 anos na Melhor do Grão, totalmente integrado ao e-commerce e marketplace. Inclui conta digital interna, gestão financeira automatizada, sistema fiscal completo e dashboards analíticos.',
    images: [
      { src: '/projects/erp-dashboard.png', alt: 'ERP Dashboard', type: 'cover' },
      { src: '/projects/erp-finance.png', alt: 'Módulo Financeiro', type: 'screenshot' }
    ],
    technologies: [
      'Python', 'Django', 'Flask', 'PostgreSQL', 'MongoDB',
      'APIs Financeiras', 'Sistema Fiscal', 'React', 'Node.js'
    ],
    links: [
      { type: 'demo', url: '#', label: 'Sistema Interno' }
    ],
    featured: false,
    category: 'dashboard',
    status: 'completed',
    achievements: [
      'ERP completo com 8 anos de evolução',
      'Integração total com e-commerce',
      'Conta digital interna',
      'Sistema fiscal automatizado'
    ],
    metrics: {
      modules: '10+',
      integration: '100%',
      customMetric: [
        { label: 'Anos de Desenvolvimento', value: '8' },
        { label: 'Módulos Operacionais', value: 'Todos' }
      ]
    },
    startDate: '2015-10-01',
    endDate: '2023-10-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'melhor-do-grao-ecommerce',
    title: 'E-commerce & Marketplace - Melhor do Grão',
    description: 'Plataformas robustas de e-commerce e marketplace desenvolvidas com TypeScript, React, Node.js e integrações empresariais.',
    longDescription: 'Desenvolvimento e evolução de plataformas e-commerce e marketplace durante 8 anos na Melhor do Grão. Sistemas escaláveis, seguros e com múltiplas integrações including pagamentos, logística, CRM e marketing digital.',
    images: [
      { src: '/projects/marketplace-home.png', alt: 'Marketplace Home', type: 'cover' },
      { src: '/projects/ecommerce-catalog.png', alt: 'Catálogo de Produtos', type: 'screenshot' }
    ],
    technologies: [
      'TypeScript', 'React.js', 'Next.js', 'Node.js', 'React Native',
      'MongoDB', 'PostgreSQL', 'Amazon S3', 'APIs'
    ],
    links: [
      { type: 'live', url: 'https://melhordograo.com.br', label: 'Visitar Site' }
    ],
    featured: true,
    category: 'ecommerce',
    status: 'completed',
    achievements: [
      'Plataformas robustas e escaláveis',
      'Múltiplas integrações empresariais',
      'Evolução de frontend para full stack',
      'Liderança técnica e design de software'
    ],
    metrics: {
      scalability: 'Alta',
      performance: 'Otimizado',
      customMetric: [
        { label: 'Anos de Evolução', value: '8' },
        { label: 'Integrações', value: '10+' }
      ]
    },
    startDate: '2015-10-01',
    endDate: '2023-10-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  }
];