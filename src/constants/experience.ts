import { Experience, Skill, SkillsData } from '../types';

export const experienceData: Experience[] = [
  {
    id: 'adalink-senior',
    company: 'Adalink',
    position: 'Programador Sênior Full Stack',
    period: 'Fev 2025 - Jun 2025',
    location: 'Barueri, SP (Híbrida)',
    description: 'Atuei no desenvolvimento full stack de soluções em inteligência artificial e automação, contribuindo para a criação de sistemas escaláveis, seguros e de alta performance. Trabalhei com Next.js, TypeScript, Node.js e Python, integrando serviços e APIs para otimizar fluxos de dados e automações inteligentes.',
    technologies: [
      { name: 'Next.js 15', category: 'frontend', level: 'expert', years: 4 },
      { name: 'React 19', category: 'frontend', level: 'expert', years: 5 },
      { name: 'TypeScript', level: 'expert', years: 5, category: 'frontend' },
      { name: 'TailwindCSS', category: 'frontend', level: 'expert', years: 3 },
      { name: 'Node.js', category: 'backend', level: 'expert', years: 8 },
      { name: 'Python', category: 'backend', level: 'advanced', years: 6 },
      { name: 'PostgreSQL', category: 'database', level: 'expert', years: 6 },
      { name: 'API Integration', category: 'backend', level: 'expert', years: 7 }
    ],
    achievements: [
      {
        id: 'ai-dev1',
        description: 'Desenvolvimento de soluções em IA e automação',
        metrics: 'Sistemas escaláveis e alta performance',
        impact: 'Base para automações inteligentes'
      },
      {
        id: 'prom1',
        description: 'Promoção para liderança técnica',
        metrics: '4 meses para promoção',
        impact: 'Reconhecimento técnico e liderança'
      },
      {
        id: 'arch1',
        description: 'Evolução da arquitetura do produto',
        metrics: 'Decisões técnicas implementadas',
        impact: 'Melhoria na escalabilidade do sistema'
      }
    ],
    responsibilities: [
      {
        id: 'resp1',
        description: 'Desenvolvimento full stack de soluções IA',
        category: 'technical'
      },
      {
        id: 'resp2',
        description: 'Integração de serviços e APIs',
        category: 'technical'
      },
      {
        id: 'resp3',
        description: 'Implementação de boas práticas',
        category: 'technical'
      },
      {
        id: 'resp4',
        description: 'Participação em decisões técnicas',
        category: 'leadership'
      }
    ],
    type: 'fulltime',
    featured: true
  },
  {
    id: 'adalink-lead',
    company: 'Adalink',
    position: 'Líder Técnico Sênior',
    period: 'Jun 2025 - Presente',
    location: 'Barueri, SP (Híbrida)',
    description: 'Líder técnico com mais de 9 anos de experiência em desenvolvimento full stack e IA. Atuo na Adalink liderando projetos de automação inteligente e arquitetura moderna, com foco em Next.js, TypeScript, Python, Node.js e Go. Apaixonado por criar soluções que unem inovação, eficiência e propósito.',
    technologies: [
      { name: 'Next.js 15', category: 'frontend', level: 'expert', years: 4 },
      { name: 'React 19', category: 'frontend', level: 'expert', years: 5 },
      { name: 'TypeScript', level: 'expert', years: 5, category: 'frontend' },
      { name: 'Node.js', category: 'backend', level: 'expert', years: 8 },
      { name: 'Python', category: 'backend', level: 'advanced', years: 6 },
      { name: 'Go', category: 'backend', level: 'intermediate', years: 2 },
      { name: 'Arquitetura Moderna', category: 'devops', level: 'expert', years: 3 },
      { name: 'Automação IA', category: 'ai', level: 'expert', years: 2 }
    ],
    achievements: [
      {
        id: 'leader1',
        description: 'Liderança técnica de projetos de automação',
        metrics: 'Equipe de desenvolvimento',
        impact: 'Entrega de projetos complexos'
      },
      {
        id: 'innovation1',
        description: 'Soluções inovadoras em IA',
        metrics: 'Automatização inteligente',
        impact: 'Eficiência operacional'
      },
      {
        id: 'arch2',
        description: 'Arquitetura moderna e escalável',
        metrics: 'Sistemas de alta performance',
        impact: 'Soluções robustas e seguras'
      }
    ],
    responsibilities: [
      {
        id: 'resp5',
        description: 'Liderança técnica de projetos',
        category: 'leadership'
      },
      {
        id: 'resp6',
        description: 'Arquitetura de sistemas',
        category: 'technical'
      },
      {
        id: 'resp7',
        description: 'Mentoring técnico',
        category: 'leadership'
      },
      {
        id: 'resp8',
        description: 'Decisões estratégicas',
        category: 'strategic'
      }
    ],
    type: 'fulltime',
    featured: true
  },
  {
    id: 'love-startup',
    company: 'Love Startup',
    position: 'Desenvolvedor Full Stack',
    period: 'Dez 2024 - Jan 2025',
    location: 'São Paulo, Brasil (Remota)',
    description: 'Atuei no desenvolvimento do MVP de um marketplace voltado à validação de ideias e produtos digitais, com backend em Python e frontend em Next.js. Implementação de catálogo multi-vendedor, autenticação e perfis de usuário.',
    technologies: [
      { name: 'Python', category: 'backend', level: 'advanced', years: 6 },
      { name: 'Next.js', category: 'frontend', level: 'expert', years: 4 },
      { name: 'FastAPI', category: 'backend', level: 'advanced', years: 2 },
      { name: 'PostgreSQL', category: 'database', level: 'expert', years: 6 },
      { name: 'Django', category: 'backend', level: 'advanced', years: 4 },
      { name: 'Flask', category: 'backend', level: 'intermediate', years: 3 },
      { name: 'TailwindCSS', category: 'frontend', level: 'expert', years: 3 },
      { name: 'ORM', category: 'backend', level: 'advanced', years: 4 }
    ],
    achievements: [
      {
        id: 'mvp1',
        description: 'Desenvolvimento completo do MVP',
        metrics: 'Marketplace funcional em 2 meses',
        impact: 'Validação de modelo de negócio'
      },
      {
        id: 'api1',
        description: 'APIs Python para gestão completa',
        metrics: 'Produtos, pedidos e pagamentos',
        impact: 'Sistema backend robusto'
      },
      {
        id: 'ui1',
        description: 'Interface responsiva e painel',
        metrics: 'UX otimizada para conversão',
        impact: 'Experiência profissional'
      }
    ],
    responsibilities: [
      {
        id: 'resp9',
        description: 'Desenvolvimento full stack',
        category: 'technical'
      },
      {
        id: 'resp10',
        description: 'Modelagem de dados PostgreSQL',
        category: 'technical'
      },
      {
        id: 'resp11',
        description: 'APIs REST Python/FastAPI',
        category: 'technical'
      },
      {
        id: 'resp12',
        description: 'Frontend Next.js/ TailwindCSS',
        category: 'technical'
      }
    ],
    type: 'contract',
    featured: true
  },
  {
    id: 'freelance-ecommerce',
    company: 'Freelancer.com',
    position: 'Desenvolvedor Full Stack Autônomo',
    period: 'Out 2023 - Dez 2024',
    location: 'São Paulo, Brasil (Remota)',
    description: 'Desenvolvi um e-commerce customizado de ponta a ponta utilizando Next.js, Node.js, TailwindCSS e PostgreSQL, com foco em performance, SEO e conversão. Arquitetura full stack com Next.js (App Router) e API Routes/Node.',
    technologies: [
      { name: 'Next.js', category: 'frontend', level: 'expert', years: 4 },
      { name: 'Node.js', category: 'backend', level: 'expert', years: 8 },
      { name: 'TailwindCSS', category: 'frontend', level: 'expert', years: 3 },
      { name: 'PostgreSQL', category: 'database', level: 'expert', years: 6 },
      { name: 'TypeScript', level: 'expert', years: 5, category: 'frontend' },
      { name: 'JWT/Auth', category: 'backend', level: 'expert', years: 7 },
      { name: 'Payment Gateway', category: 'backend', level: 'advanced', years: 5 },
      { name: 'Vercel Deploy', category: 'devops', level: 'expert', years: 5 }
    ],
    achievements: [
      {
        id: 'ecom1',
        description: 'E-commerce completo full stack',
        metrics: 'Performance e SEO otimizados',
        impact: 'Alta taxa de conversão'
      },
      {
        id: 'auth1',
        description: 'Sistema de autenticação RBAC',
        metrics: 'Painel administrativo seguro',
        impact: 'Gestão eficiente de usuários'
      },
      {
        id: 'checkout1',
        description: 'Checkout otimizado',
        metrics: 'Carrinho persistente, fretes, cupons',
        impact: 'Melhora na experiência de compra'
      }
    ],
    responsibilities: [
      {
        id: 'resp13',
        description: 'Arquitetura full stack completa',
        category: 'technical'
      },
      {
        id: 'resp14',
        description: 'Integração gateways pagamento',
        category: 'technical'
      },
      {
        id: 'resp15',
        description: 'UI responsiva e acessível',
        category: 'technical'
      },
      {
        id: 'resp16',
        description: 'Observabilidade e deploy',
        category: 'devops'
      }
    ],
    type: 'freelance',
    featured: false
  },
  {
    id: 'melhor-do-grao-fullstack',
    company: 'Melhor do Grão',
    position: 'Desenvolvedor Full Stack',
    period: 'Out 2015 - Out 2023',
    location: 'São Paulo, Brasil (Remota)',
    description: 'Durante 8 anos, desenvolvi plataformas de e-commerce e marketplace robustas, escaláveis e seguras. Iniciei como Frontend e evoluí para Full Stack, liderando implementações de soluções completas.',
    technologies: [
      { name: 'TypeScript', level: 'expert', years: 5, category: 'frontend' },
      { name: 'React.js', category: 'frontend', level: 'expert', years: 5 },
      { name: 'Next.js', category: 'frontend', level: 'expert', years: 4 },
      { name: 'Node.js', category: 'backend', level: 'expert', years: 8 },
      { name: 'React Native', category: 'frontend', level: 'advanced', years: 4 },
      { name: 'MongoDB', category: 'database', level: 'advanced', years: 5 },
      { name: 'PostgreSQL', category: 'database', level: 'expert', years: 6 },
      { name: 'Amazon S3', category: 'devops', level: 'advanced', years: 6 }
    ],
    achievements: [
      {
        id: 'ecommerce1',
        description: 'Plataformas e-commerce marketplace',
        metrics: 'Sistemas robustos e escaláveis',
        impact: 'Consolidação digital da empresa'
      },
      {
        id: 'integration1',
        description: 'Integrações completas de negócio',
        metrics: 'Pagamentos, logística, CRM',
        impact: 'Eficiência operacional'
      },
      {
        id: 'leadership1',
        description: 'Liderança técnica e design',
        metrics: 'Decisões de arquitetura',
        impact: 'Evolução técnica da equipe'
      }
    ],
    responsibilities: [
      {
        id: 'resp17',
        description: 'Desenvolvimento e-commerce/marketplace',
        category: 'technical'
      },
      {
        id: 'resp18',
        description: 'Automações e integrações',
        category: 'technical'
      },
      {
        id: 'resp19',
        description: 'Liderança técnica',
        category: 'leadership'
      },
      {
        id: 'resp20',
        description: 'Design de software',
        category: 'technical'
      }
    ],
    type: 'fulltime',
    featured: true
  },
  {
    id: 'melhor-do-grao-erp',
    company: 'Melhor do Grão',
    position: 'Desenvolvedor Full Stack (ERP)',
    period: 'Out 2015 - Out 2023',
    location: 'São Paulo, Brasil (Remota)',
    description: 'Desenvolvi e evoluí um sistema ERP completo, totalmente integrado ao e-commerce e marketplace, com módulos financeiros, estoque, notas fiscais e dashboards gerenciais.',
    technologies: [
      { name: 'Python', category: 'backend', level: 'advanced', years: 6 },
      { name: 'Django', category: 'backend', level: 'advanced', years: 4 },
      { name: 'Flask', category: 'backend', level: 'intermediate', years: 3 },
      { name: 'PostgreSQL', category: 'database', level: 'expert', years: 6 },
      { name: 'MongoDB', category: 'database', level: 'advanced', years: 5 },
      { name: 'APIs Financeiras', category: 'backend', level: 'advanced', years: 4 },
      { name: 'Sistema Fiscal', category: 'backend', level: 'advanced', years: 5 },
      { name: 'Dashboard Analytics', category: 'frontend', level: 'advanced', years: 4 }
    ],
    achievements: [
      {
        id: 'erp1',
        description: 'Sistema ERP completo integrado',
        metrics: 'Todos os módulos operacionais',
        impact: 'Gestão 100% integrada'
      },
      {
        id: 'finance1',
        description: 'Conta digital interna',
        metrics: 'Gestão de créditos automatizada',
        impact: 'Conciliação em tempo real'
      },
      {
        id: 'fiscal1',
        description: 'Sistema fiscal completo',
        metrics: 'Emissão NF automatizada',
        impact: 'Compliance fiscal'
      }
    ],
    responsibilities: [
      {
        id: 'resp21',
        description: 'Desenvolvimento ERP Python',
        category: 'technical'
      },
      {
        id: 'resp22',
        description: 'Integrações financeiras',
        category: 'technical'
      },
      {
        id: 'resp23',
        description: 'Sistemas fiscais',
        category: 'technical'
      },
      {
        id: 'resp24',
        description: 'Dashboards gerenciais',
        category: 'technical'
      }
    ],
    type: 'fulltime',
    featured: false
  },
  {
    id: 'ceres-brasil',
    company: 'Ceres Brasil',
    position: 'Assistente de Produção',
    period: 'Set 2015 - Jul 2017',
    location: 'São Paulo, Brasil (Presencial)',
    description: 'Atuação inicial na indústria alimentícia, desenvolvendo habilidades de produção e atendimento ao cliente.',
    technologies: [],
    achievements: [
      {
        id: 'prod1',
        description: 'Experiência em produção industrial',
        metrics: '1 ano 11 meses',
        impact: 'Desenvolvimento profissional'
      }
    ],
    responsibilities: [
      {
        id: 'resp25',
        description: 'Produção industrial',
        category: 'business'
      },
      {
        id: 'resp26',
        description: 'Atendimento ao cliente',
        category: 'business'
      }
    ],
    type: 'fulltime',
    featured: false
  },
  {
    id: 'cptm-trainee',
    company: 'CPTM - Companhia Paulista de Trens Metropolitanos',
    position: 'Estágio Trainee',
    period: 'Fev 2012 - Fev 2013',
    location: 'São Paulo, Brasil (Presencial)',
    description: 'Primeira experiência profissional em atendimento ao cliente em grande empresa de transporte público.',
    technologies: [],
    achievements: [
      {
        id: 'trainee1',
        description: 'Estágio em atendimento',
        metrics: '1 ano 1 mês',
        impact: 'Início carreira profissional'
      }
    ],
    responsibilities: [
      {
        id: 'resp27',
        description: 'Atendimento ao cliente',
        category: 'business'
      }
    ],
    type: 'internship',
    featured: false
  }
];

export const skillsData: SkillsData = {
  frontend: [
    { name: 'Next.js', level: 'expert', years: 4, category: 'frontend' },
    { name: 'React.js', level: 'expert', years: 5, category: 'frontend' },
    { name: 'React 19', level: 'expert', years: 5, category: 'frontend' },
    { name: 'TypeScript', level: 'expert', years: 5, category: 'frontend' },
    { name: 'TailwindCSS', level: 'expert', years: 3, category: 'frontend' },
    { name: 'React Native', level: 'advanced', years: 4, category: 'frontend' },
    { name: 'HTML5/CSS3', level: 'expert', years: 9, category: 'frontend' },
    { name: 'JavaScript ES6+', level: 'expert', years: 9, category: 'frontend' }
  ],
  backend: [
    { name: 'Node.js', level: 'expert', years: 8, category: 'backend' },
    { name: 'Python', level: 'advanced', years: 6, category: 'backend' },
    { name: 'TypeScript', level: 'expert', years: 5, category: 'backend' },
    { name: 'Go', level: 'intermediate', years: 2, category: 'backend' },
    { name: 'Express.js', level: 'expert', years: 7, category: 'backend' },
    { name: 'Django', level: 'advanced', years: 4, category: 'backend' },
    { name: 'Flask', level: 'intermediate', years: 3, category: 'backend' },
    { name: 'FastAPI', level: 'advanced', years: 2, category: 'backend' },
    { name: 'API REST', level: 'expert', years: 8, category: 'backend' },
    { name: 'GraphQL', level: 'intermediate', years: 3, category: 'backend' }
  ],
  database: [
    { name: 'PostgreSQL', level: 'expert', years: 6, category: 'database' },
    { name: 'MongoDB', level: 'advanced', years: 5, category: 'database' },
    { name: 'Redis', level: 'intermediate', years: 3, category: 'database' },
    { name: 'MySQL', level: 'advanced', years: 4, category: 'database' },
    { name: 'Prisma', level: 'advanced', years: 3, category: 'database' },
    { name: 'ORM', level: 'advanced', years: 4, category: 'database' }
  ],
  devops: [
    { name: 'Vercel', level: 'expert', years: 5, category: 'devops' },
    { name: 'Amazon S3', level: 'advanced', years: 6, category: 'devops' },
    { name: 'GitHub', level: 'expert', years: 9, category: 'devops' },
    { name: 'Git', level: 'expert', years: 9, category: 'devops' },
    { name: 'CI/CD', level: 'advanced', years: 4, category: 'devops' },
    { name: 'Docker', level: 'intermediate', years: 2, category: 'devops' },
    { name: 'Nginx', level: 'intermediate', years: 3, category: 'devops' }
  ],
  ai: [
    { name: 'Inteligência Artificial', level: 'advanced', years: 2, category: 'ai' },
    { name: 'Automação Inteligente', level: 'expert', years: 2, category: 'ai' },
    { name: 'Machine Learning', level: 'intermediate', years: 1, category: 'ai' },
    { name: 'Processamento de Linguagem Natural', level: 'intermediate', years: 2, category: 'ai' }
  ],
  automation: [
    { name: 'Automação de Processos', level: 'expert', years: 2, category: 'automation' },
    { name: 'Integração de APIs', level: 'expert', years: 7, category: 'automation' },
    { name: 'Web Services', level: 'expert', years: 8, category: 'automation' },
    { name: 'Sistemas de Pagamentos', level: 'advanced', years: 5, category: 'automation' },
    { name: 'Gateways de Pagamento', level: 'advanced', years: 5, category: 'automation' },
    { name: 'CRM Integration', level: 'advanced', years: 4, category: 'automation' }
  ]
};