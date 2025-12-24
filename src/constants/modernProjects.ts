// Novo arquivo de projetos realista baseado na experiência real
import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'adalink-ia-platform',
    title: 'Adalink - Plataforma de IA e Automação',
    description: 'Plataforma avançada de automações e agentes inteligentes com Next.js, Python e integração com múltiplos serviços empresariais.',
    longDescription: 'Plataforma completa de automação empresarial desenvolvida como Programador Sênior Full Stack e evoluída para Líder Técnico na Adalink. Sistema escalável para automação de processos de negócio com IA, integrando múltiplos serviços e APIs. A plataforma permite criar workflows complexos de automação, orquestrar agentes inteligentes de IA, e integrar com diversos sistemas empresariais. Desenvolvida com arquitetura moderna, suporta processamento assíncrono, filas de tarefas, e monitoramento em tempo real. Inclui dashboard analítico completo, sistema de logs detalhado, e gestão de permissões avançada. A solução foi fundamental para aumentar a eficiência operacional da empresa e reduzir custos com processos manuais.',
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
    longDescription: 'MVP completo de marketplace multi-vendedor desenvolvido em 2 meses como Freelancer para a Love Startup. O sistema inclui catálogo completo de produtos com busca avançada e filtros, sistema de autenticação robusto com múltiplos provedores, gestão completa de pedidos com rastreamento, integração com múltiplos gateways de pagamento, painel administrativo para vendedores, sistema de avaliações e reviews, notificações em tempo real, e dashboard analítico. Arquitetura moderna com Python/FastAPI no backend oferecendo APIs RESTful completas, e Next.js no frontend com SSR para melhor performance e SEO. O projeto demonstrou capacidade de entregar soluções completas em prazos apertados mantendo alta qualidade de código.',
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
  },
  {
    id: 'fsjpii-checkin-system',
    title: 'FSJPII - Sistema Check-in',
    description: 'Sistema web moderno para gerenciar check-ins em formações paroquiais com geolocalização, validação automática e dashboard de presenças.',
    longDescription: 'Sistema completo de check-in desenvolvido para a Paróquia FSJPII com Next.js 15, TypeScript e PostgreSQL. O sistema resolve o problema de controle de presença em formações paroquiais através de validação por geolocalização, garantindo que apenas participantes no local correto possam fazer check-in. Inclui gestão completa de formações com múltiplos eventos simultâneos, cadastro de locais com coordenadas GPS, sistema de usuários com diferentes níveis de permissão, dashboard de presenças em tempo real, relatórios detalhados de participação, exportação de dados, e notificações automáticas. Desenvolvido com 69 testes automatizados (unitários e E2E com Playwright) alcançando 85% de cobertura, arquitetura serverless otimizada para Vercel, e Lighthouse Score de 95+. O sistema está em produção e sendo utilizado com sucesso pela paróquia.',
    images: [
      { src: '/projects/fsjpii/Login.png', alt: 'FSJPII Login', type: 'cover' }
    ],
    technologies: [
      'Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth.js',
      'Jest', 'Playwright', 'TailwindCSS', 'shadcn/ui', 'Geolocalização'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/FSJPII', label: 'Ver Código' }
    ],
    featured: true,
    category: 'dashboard',
    status: 'completed',
    achievements: [
      '69 testes automatizados passando',
      'Arquitetura serverless moderna',
      'Validação de presença por geolocalização',
      'Lighthouse Score 95+',
      'Sistema pronto para produção'
    ],
    metrics: {
      performance: '95+ Lighthouse',
      customMetric: [
        { label: 'Testes Automatizados', value: '69' },
        { label: 'Cobertura de Testes', value: '85%' }
      ]
    },
    startDate: '2024-06-01',
    endDate: '2024-12-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'orbitfinance',
    title: 'OrbitFinance - Finanças Pessoais com IA',
    description: 'Plataforma moderna de gestão financeira pessoal com insights gerados por IA, integração WhatsApp e suporte multilíngue completo.',
    longDescription: 'Plataforma completa de finanças pessoais desenvolvida com Next.js 15 e React 19. A solução revoluciona a gestão financeira pessoal através de um assistente WhatsApp inteligente que permite registrar transações via mensagens naturais em linguagem livre, utilizando NLU (Natural Language Understanding) para interpretar intenções. O sistema gera insights financeiros personalizados usando Anthropic Claude, identificando padrões de gastos, sugerindo economias, e criando projeções futuras. Inclui dashboard interativo com visualizações em tempo real usando Recharts, categorização automática de transações, metas financeiras, alertas inteligentes, relatórios detalhados, e suporte completo para Português, Inglês e Espanhol com next-intl. Arquitetura baseada em Clean Architecture e princípios SOLID, com 102 testes automatizados cobrindo 85% do código, integração com BullMQ e Redis para processamento assíncrono, e sistema de filas para processar mensagens do WhatsApp. A plataforma demonstra expertise em IA aplicada, processamento de linguagem natural, e arquitetura escalável.',
    images: [
      { src: '/projects/orbitfinance/Inicio.png', alt: 'OrbitFinance Dashboard', type: 'cover' },
      { src: '/projects/orbitfinance/Painel.png', alt: 'Painel Principal', type: 'screenshot' },
      { src: '/projects/orbitfinance/Relatorios.png', alt: 'Relatórios e Analytics', type: 'screenshot' },
      { src: '/projects/orbitfinance/Organizador.png', alt: 'Organizador Financeiro', type: 'screenshot' }
    ],
    technologies: [
      'Next.js', 'React 19', 'TypeScript', 'Prisma', 'Better Auth',
      'Anthropic Claude', 'BullMQ', 'Redis', 'WhatsApp Integration',
      'Recharts', 'next-intl', 'PostgreSQL'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/OrbitFinance', label: 'Ver Código' }
    ],
    featured: true,
    category: 'saas',
    status: 'completed',
    achievements: [
      '102 testes automatizados passando',
      'Assistente WhatsApp com NLU',
      'Insights financeiros com IA',
      'Arquitetura Clean Architecture',
      'Suporte multilíngue (pt/es/en)'
    ],
    metrics: {
      languages: '3 idiomas',
      customMetric: [
        { label: 'Testes Automatizados', value: '102' },
        { label: 'Idiomas Suportados', value: '3' },
        { label: 'Cobertura de Testes', value: '85%' }
      ]
    },
    startDate: '2024-08-01',
    endDate: '2025-01-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'orbitmind-platform',
    title: 'OrbitMind - Plataforma SaaS Multi-Agentes',
    description: 'Plataforma SaaS completa de multi-agentes de IA com 30 agentes especializados, automação inteligente e análise preditiva para empresas.',
    longDescription: 'Plataforma enterprise de multi-agentes de IA desenvolvida com Next.js 15 e TypeScript. A solução oferece 30 agentes especializados de IA para diferentes casos de uso: automação de processos, análise preditiva, otimização de operações, geração de conteúdo, análise de dados, e muito mais. Cada agente é configurável e pode ser orquestrado através de workflows visuais. O sistema é multi-tenant completo permitindo que múltiplas organizações utilizem a plataforma de forma isolada, com RBAC (Role-Based Access Control) granular controlando permissões por usuário, projeto e recurso. Billing integrado com Stripe suporta diferentes planos e modelos de cobrança, sistema de uso e limites, e relatórios financeiros. Suporte multilíngue completo (pt/es/en) com next-intl. Arquitetura altamente escalável usando Redis para cache e sessões, BullMQ para processamento assíncrono de tarefas pesadas, e PostgreSQL para persistência. Inclui sistema de logs completo, monitoramento de performance, analytics de uso, e API RESTful documentada. A plataforma está em desenvolvimento ativo e já demonstra capacidade de escalar para milhares de usuários simultâneos.',
    images: [
      { src: '/projects/orbitmind/Inicio.png', alt: 'OrbitMind Home', type: 'cover' },
      { src: '/projects/orbitmind/Multi-agents.png', alt: 'Multi-Agentes', type: 'screenshot' },
      { src: '/projects/orbitmind/Analytics.png', alt: 'Analytics Dashboard', type: 'screenshot' },
      { src: '/projects/orbitmind/Billings.png', alt: 'Sistema de Billing', type: 'screenshot' },
      { src: '/projects/orbitmind/Catalogo.png', alt: 'Catálogo de Agentes', type: 'screenshot' }
    ],
    technologies: [
      'Next.js', 'TypeScript', 'Prisma', 'Better Auth', 'Anthropic',
      'OpenAI', 'Stripe', 'Redis', 'BullMQ', 'PostgreSQL',
      'next-intl', 'React Flow', 'Socket.io'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/orbitmind', label: 'Ver Código' }
    ],
    featured: true,
    category: 'ai-platform',
    status: 'in-progress',
    achievements: [
      '30 agentes especializados de IA',
      'Arquitetura multi-tenant',
      'Sistema de billing integrado',
      'RBAC completo',
      'Suporte multilíngue'
    ],
    metrics: {
      scalability: 'Multi-tenant',
      customMetric: [
        { label: 'Agentes Especializados', value: '30' },
        { label: 'Idiomas Suportados', value: '3' }
      ]
    },
    startDate: '2024-10-01',
    teamSize: 1,
    role: 'Tech Lead & Desenvolvedor Full Stack'
  },
  {
    id: 'orbitmind-kanban',
    title: 'OrbitMind Kanban - Gestão de Projetos',
    description: 'Sistema Kanban completo para gestão de projetos e financeiro com drag-and-drop, timeline interativa, tags e links.',
    longDescription: 'Sistema Kanban avançado desenvolvido para o OrbitMind com suporte a múltiplos tabs (Projetos e Financeiro). O sistema permite gerenciar projetos e finanças através de boards Kanban interativos com drag-and-drop fluido usando React DnD. Cada card pode conter informações detalhadas, anexos, comentários, e checklists. Timeline completa de atividades mostra o histórico de cada item, sistema de tags coloridas para categorização visual, links externos para documentos e recursos, atribuição de responsáveis com notificações, e histórico completo de mudanças com auditoria. Interface moderna e responsiva funciona perfeitamente em desktop, tablet e mobile. O sistema suporta múltiplos boards por organização, filtros avançados, busca inteligente, e exportação de dados. Integrado com o sistema de tickets e workflow builder do OrbitMind para criar fluxos completos de trabalho.',
    images: [
      { src: '/projects/orbitmind/Kanban.png', alt: 'OrbitMind Kanban', type: 'cover' }
    ],
    technologies: [
      'Next.js', 'TypeScript', 'React DnD', 'Prisma', 'PostgreSQL',
      'Framer Motion', 'TailwindCSS'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/orbitmind', label: 'Ver Código' }
    ],
    featured: false,
    category: 'dashboard',
    status: 'completed',
    achievements: [
      'Sistema Kanban completo',
      'Drag-and-drop funcional',
      'Timeline interativa',
      'Gestão de projetos e financeiro'
    ],
    metrics: {
      features: 'Completo',
      customMetric: [
        { label: 'Tabs Suportados', value: '2' },
        { label: 'Status Disponíveis', value: '10+' }
      ]
    },
    startDate: '2024-11-01',
    endDate: '2024-12-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'orbitmind-tickets',
    title: 'OrbitMind Tickets - Sistema de Suporte',
    description: 'Sistema completo de tickets de suporte com categorização, priorização, setores especializados e workflow completo.',
    longDescription: 'Sistema de tickets desenvolvido para o OrbitMind com suporte a múltiplos setores (DEV, COMERCIAL, PROMPTERS), cada um com seu próprio workflow e regras de negócio. Categorização detalhada por tipo (UI, Funcionalidade, Performance, Segurança, API, Integração), níveis de prioridade (Baixa, Média, Alta, Crítica) com SLA automático, e workflow completo de resolução com estados customizáveis. O sistema inclui sistema de comentários em tempo real com menções, anexos de múltiplos formatos com preview, atribuição de responsáveis com notificações, histórico completo de mudanças com diff visual, templates de resposta, automações baseadas em regras, integração com sistema de billing para tickets pagos, e dashboard de métricas de atendimento. Interface intuitiva permite filtrar, ordenar e buscar tickets de forma eficiente, com suporte a views salvas e relatórios personalizados.',
    images: [
      { src: '/projects/orbitmind/Tickets.png', alt: 'OrbitMind Tickets', type: 'cover' }
    ],
    technologies: [
      'Next.js', 'TypeScript', 'Prisma', 'PostgreSQL',
      'React Hook Form', 'Zod', 'TailwindCSS'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/orbitmind', label: 'Ver Código' }
    ],
    featured: false,
    category: 'dashboard',
    status: 'completed',
    achievements: [
      'Sistema de tickets completo',
      'Múltiplos setores e categorias',
      'Workflow de resolução',
      'Histórico e comentários'
    ],
    metrics: {
      customMetric: [
        { label: 'Setores', value: '3' },
        { label: 'Categorias', value: '6' },
        { label: 'Níveis de Prioridade', value: '4' }
      ]
    },
    startDate: '2024-11-01',
    endDate: '2024-12-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'orbitmind-worker-build',
    title: 'OrbitMind Worker-Build - Workflow Builder',
    description: 'Sistema de construção de workflows visuais para orquestração de agentes e automações com interface drag-and-drop.',
    longDescription: 'Sistema de construção de workflows visuais desenvolvido para o OrbitMind usando React Flow. Permite criar workflows complexos de orquestração de agentes de IA através de interface visual intuitiva tipo no-code. O sistema inclui biblioteca extensa de nodes customizáveis para diferentes tipos de operações (agentes de IA, condições, loops, delays, webhooks, etc.), conexões dinâmicas com validação de tipos, validação de fluxos em tempo real detectando erros antes da execução, exportação e importação de configurações, versionamento de workflows, execução em modo debug com step-by-step, histórico de execuções com logs detalhados, e sistema de templates para workflows comuns. A interface suporta zoom, pan, minimap, e busca de nodes. Workflows podem ser executados manualmente, agendados, ou disparados por eventos. Integrado com o sistema de agentes do OrbitMind para criar automações poderosas sem escrever código.',
    images: [
      { src: '/projects/orbitmind/flow.png', alt: 'OrbitMind Workflow Builder', type: 'cover' }
    ],
    technologies: [
      'Next.js', 'TypeScript', 'React Flow', 'Dagre',
      'Prisma', 'PostgreSQL', 'Zustand'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/orbitmind', label: 'Ver Código' }
    ],
    featured: false,
    category: 'platform',
    status: 'completed',
    achievements: [
      'Workflow builder visual',
      'Orquestração de agentes',
      'Interface drag-and-drop',
      'Validação de fluxos'
    ],
    metrics: {
      features: 'Completo',
      customMetric: [
        { label: 'Tipo de Nodes', value: 'Múltiplos' },
        { label: 'Validação', value: 'Automática' }
      ]
    },
    startDate: '2024-11-01',
    endDate: '2024-12-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'orbitmind-vibecoding',
    title: 'OrbitMind VibeCoding - Geração de Código com IA',
    description: 'Plataforma enterprise de geração de código assistida por IA com sistema de plugins extensível e painel administrativo dinâmico.',
    longDescription: 'Plataforma enterprise completa de geração de código com IA inspirada no Lovable, desenvolvida com Next.js 16 e React 19. A solução revoluciona o desenvolvimento de software permitindo gerar aplicações completas através de descrições em linguagem natural. Suporta múltiplos providers de IA (OpenAI GPT-4, Anthropic Claude, Google Gemini, DeepSeek, Meta Llama, Alibaba Qwen) através de arquitetura de plugins extensível que permite adicionar novos providers facilmente. Inclui editor de código avançado com syntax highlighting, preview ao vivo mostrando mudanças em tempo real, histórico completo de versões com diff visual, streaming em tempo real mostrando código sendo gerado, painel administrativo completo para gerenciar modelos, providers, e configurações, sistema de credenciais encriptadas com AES-256-GCM garantindo segurança máxima, sistema de projetos com múltiplos arquivos, deploy automático, integração com Git, e suporte a múltiplos frameworks (React, Vue, Angular, etc.). A plataforma demonstra expertise avançada em IA, processamento de linguagem natural, e arquitetura de sistemas complexos. Type-safe 100% com TypeScript garantindo robustez e manutenibilidade.',
    images: [
      { src: '/projects/orbitmind-vibecoding/Inicio.png', alt: 'VibeCoding Home', type: 'cover' },
      { src: '/projects/orbitmind-vibecoding/Editor-.png', alt: 'Editor de Código', type: 'screenshot' },
      { src: '/projects/orbitmind-vibecoding/Geracao-.png', alt: 'Geração com IA', type: 'screenshot' },
      { src: '/projects/orbitmind-vibecoding/Features.png', alt: 'Features', type: 'screenshot' },
      { src: '/projects/orbitmind-vibecoding/Arquitetura.png', alt: 'Arquitetura', type: 'screenshot' }
    ],
    technologies: [
      'Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'NextAuth.js',
      'OpenAI', 'Anthropic', 'Google AI', 'DeepSeek', 'Meta AI', 'Alibaba AI',
      'AES-256-GCM', 'Prisma', 'Zustand', 'React Hook Form'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS/OrbitMind-VibeCoding', label: 'Ver Código' }
    ],
    featured: true,
    category: 'ai-platform',
    status: 'completed',
    achievements: [
      'Sistema de plugins extensível',
      '6+ providers de IA suportados',
      'Streaming em tempo real',
      'Credenciais encriptadas AES-256',
      'Painel admin dinâmico',
      'Type-safe 100%'
    ],
    metrics: {
      customMetric: [
        { label: 'Providers de IA', value: '6+' },
        { label: 'Idiomas Suportados', value: '3' },
        { label: 'Type Safety', value: '100%' }
      ]
    },
    startDate: '2024-09-01',
    endDate: '2024-12-01',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  },
  {
    id: 'portfolio-blog-ai-generated',
    title: 'Portfolio/Blog - Gerado com IA',
    description: 'Portfolio e blog moderno gerado com OrbitMind VibeCoding, demonstrando as capacidades da plataforma de geração de código.',
    longDescription: 'Portfolio e blog moderno gerado utilizando a plataforma OrbitMind VibeCoding, servindo como prova de conceito e showcase das capacidades da plataforma. O projeto demonstra que é possível gerar aplicações completas e funcionais através de descrições em linguagem natural. Inclui estrutura FSD (Feature-Sliced Design) seguindo melhores práticas de arquitetura frontend, componentes reutilizáveis bem estruturados, sistema de blog completo com markdown, categorias e tags, formulário de contato integrado, design responsivo que funciona perfeitamente em todos os dispositivos, sistema de temas (dark/light), otimizações de performance com lazy loading e code splitting, e SEO otimizado. O projeto foi gerado em grande parte pela IA, com ajustes manuais mínimos, demonstrando o potencial da plataforma VibeCoding para acelerar o desenvolvimento de software.',
    images: [
      { src: '/projects/dev-portfolio/Inicio.png', alt: 'Portfolio Home', type: 'cover' },
      { src: '/projects/dev-portfolio/Portfolio.png', alt: 'Portfolio Section', type: 'screenshot' },
      { src: '/projects/dev-portfolio/blog.png', alt: 'Blog Section', type: 'screenshot' },
      { src: '/projects/dev-portfolio/Contatos.png', alt: 'Contact Form', type: 'screenshot' }
    ],
    technologies: [
      'Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS',
      'shadcn/ui', 'FSD Architecture', 'React Hook Form', 'Zod'
    ],
    links: [
      { type: 'github', url: 'https://github.com/Wesley-SdS', label: 'Ver Código' }
    ],
    featured: false,
    category: 'landing',
    status: 'completed',
    achievements: [
      'Gerado com OrbitMind VibeCoding',
      'Arquitetura FSD',
      'Design moderno e responsivo',
      'Sistema de blog completo'
    ],
    metrics: {
      customMetric: [
        { label: 'Arquitetura', value: 'FSD' },
        { label: 'Gerado por', value: 'VibeCoding' }
      ]
    },
    startDate: '2024-12-01',
    endDate: '2024-12-15',
    teamSize: 1,
    role: 'Desenvolvedor Full Stack'
  }
];