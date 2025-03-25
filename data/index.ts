import { FaReact, FaNodeJs, FaGitAlt, FaDatabase, FaWpforms, FaChartBar, FaCode, FaIcons } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiExpress, SiVercel, SiVite,  SiTypescript, SiJest, SiAxios } from "react-icons/si";
import { SiPrisma, SiPostgresql, SiStripe, SiOpenai, SiClerk } from "react-icons/si";
import { MdOutlineAnimation } from "react-icons/md";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { MdOutlineNotifications } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { SiZod } from "react-icons/si";
import { SiFastify } from "react-icons/si";
import { MdOutlineTextFields, MdOutlineMic, MdOutlineSync } from "react-icons/md";
import { TbArrowsDiagonal, TbIcons } from "react-icons/tb";
import { FiFeather } from "react-icons/fi";


export const navItems = [
  { name: "Início", link: "#home" },
  { name: "Sobre Mim", link: "#AboutMe" },
  { name: "Experiência", link: "#experience" },
  { name: "Projetos", link: "#projects" },
  { name: "Abordagem", link: "#approach" },
  { name: "Galeria", link: "#gallery" },
];

export const projects = [
  {
    id: 1,
    title: "E-commerce",
    desc: "O e-commerce é uma plataforma moderna que combina um design elegante com funcionalidades avançadas. Desenvolvido com Next.js e Tailwind CSS.",
    img: "/ecommerce.png",
    link: "https://ecommerce-example.com",
    details: "Este e-commerce foi desenvolvido com foco na performance, escalabilidade e experiência do usuário. Utilizando tecnologias modernas como React, Next.js, Tailwind CSS e Node.js, o sistema garante uma navegação rápida, responsiva e agradável, independentemente do dispositivo. O design foi pensado para ser minimalista, mas elegante, proporcionando uma interface intuitiva e fácil de usar. Além disso, a aplicação é totalmente escalável, com suporte a futuras implementações e melhorias. O backend é robusto, utilizando MongoDB para garantir uma gestão eficiente dos dados, e a infraestrutura está otimizada para performance, sendo hospedada em Vercel para garantir alta disponibilidade.",
    additionalInfo: [
      {
        title: "Objetivo do Projeto",
        content: "Criar uma experiência de compra única para os usuários, com foco na performance, SEO, e escalabilidade para suportar o crescimento da loja.",
      },
      {
        title: "Funcionalidades",
        content: "Carrinho de compras, gerenciamento de estoque, sistema de busca eficiente, filtros dinâmicos e integrações com gateways de pagamento.",
      },
      {
        title: "Desafios",
        content: "Garantir uma navegação rápida mesmo em redes de baixa qualidade e implementar um design responsivo para dispositivos móveis.",
      },
      {
        title: "Destaques Técnicos",
        content: "A utilização de SSR para melhor desempenho e SEO, otimização de imagens com Next.js e deploy contínuo via Vercel.",
      },
    ],
    technologiesUsed: [
      {
        name: "Next.js",
        description: "Framework para criar aplicações web com renderização do lado do servidor (SSR).",
        icon: SiNextdotjs,
        color: "text-gray-800",
      },
      {
        name: "Tailwind CSS",
        description: "Biblioteca de CSS para design responsivo e personalizável.",
        icon: SiTailwindcss,
        color: "text-blue-500",
      },
      {
        name: "Node.js",
        description: "Execução de JavaScript no servidor, essencial para criar a API do e-commerce.",
        icon: FaNodeJs,
        color: "text-green-500",
      },
      {
        name: "Express.js",
        description: "Framework usado para criar a API RESTful.",
        icon: SiExpress,
        color: "text-gray-600",
      },
      {
        name: "MongoDB",
        description: "Banco de dados NoSQL para armazenamento de produtos, usuários e transações.",
        icon: FaDatabase,
        color: "text-green-600",
      },
      {
        name: "Git",
        description: "Controle de versão utilizado para gerenciar o código-fonte.",
        icon: FaGitAlt,
        color: "text-red-600",
      },
      {
        name: "Vercel",
        description: "Plataforma de hospedagem para frontend com alta performance e deploy contínuo.",
        icon: SiVercel,
        color: "text-black",
      },
    ],
  },
  
  {
    id: 2,
    title: "Dashboard",
    desc: "Um portfólio minimalista e responsivo, apresentando trabalhos profissionais e habilidades com uma interface elegante.",
    img: "/Dashboard.png",
    link: "https://portfolio-example.com",
    details: "Este dashboard foi desenvolvido para fornecer uma visão clara e organizada de dados e métricas importantes, com um design minimalista e responsivo. Utilizando tecnologias como React e Tailwind CSS, a interface é intuitiva e agradável, enquanto o backend é eficiente e escalável, utilizando Node.js e Express.js para servir a API.",
    additionalInfo: [
      {
        title: "Funcionalidades",
        content: `
          O dashboard oferece uma série de funcionalidades para a gestão de dados e operações, 
          incluindo integração com APIs externas para sincronização em tempo real, controle financeiro e gestão de vendas. 
      
           Algumas das principais funcionalidades incluem:
    - Controle financeiro
    - Contas a pagar e a receber
    - Caixa
    - Diário de Bordo
    - Multicanais
    - Vendas
    - Produtos
    - Categorias
    - Múltiplos usuários
        `,
      },
      
      {
        title: "Integrações com API",
        content: "O dashboard possui integrações com várias APIs externas para sincronizar dados de diferentes fontes. As integrações incluem APIs para sistemas de pagamentos, gateways de entrega, e plataformas de e-commerce, garantindo que o sistema se mantenha atualizado com as informações mais recentes e funcionando de forma eficiente.",
      },
      {
        title: "Performance",
        content: "O sistema foi otimizado para garantir a melhor performance possível, com carregamento rápido e baixo consumo de recursos. A interface foi projetada para ser responsiva, garantindo que os usuários tenham uma boa experiência tanto em desktops quanto em dispositivos móveis.",
      },
      {
        title: "Segurança",
        content: "Com autenticação e autorização robustas, o dashboard garante que os dados sensíveis sejam acessados apenas por usuários autorizados. Foi implementado um sistema de login seguro e proteção contra ataques comuns como XSS e CSRF.",
      },
    ],
    technologiesUsed: [
      {
        name: "React",
        description: "Biblioteca JavaScript para construção de interfaces de usuário, com foco em desempenho e reatividade.",
        icon: FaReact,
        color: "text-blue-500",
      },
      {
        name: "Tailwind CSS",
        description: "Biblioteca de CSS para construção de interfaces responsivas e personalizáveis.",
        icon: SiTailwindcss,
        color: "text-blue-500",
      },
      {
        name: "Node.js",
        description: "Execução de JavaScript no servidor, essencial para criar a API do dashboard.",
        icon: FaNodeJs,
        color: "text-green-500",
      },
      {
        name: "Express.js",
        description: "Framework para Node.js utilizado para criar a API RESTful.",
        icon: SiExpress,
        color: "text-gray-600",
      },
      {
        name: "MongoDB",
        description: "Banco de dados NoSQL utilizado para armazenar os dados de usuários, métricas e registros do dashboard.",
        icon: FaDatabase,
        color: "text-green-600",
      },
      {
        name: "Git",
        description: "Controle de versão utilizado para gerenciar o código-fonte.",
        icon: FaGitAlt,
        color: "text-red-600",
      },
      {
        name: "Vercel",
        description: "Plataforma de hospedagem para frontend com alta performance e deploy contínuo.",
        icon: SiVercel,
        color: "text-black",
      },
    ],
  },
  
  
  {
    id: 3,
    title: "Finance AI",
    desc: "Uma plataforma inovadora de gerenciamento financeiro, integrada com IA e ferramentas de análise avançadas.",
    img: "/finance-dashboard.png",
    link: "https://finance-ai.com",
    details: `
      O Finance AI é um sistema avançado de controle financeiro que combina inteligência artificial com ferramentas modernas 
      para oferecer uma gestão eficiente e precisa. A plataforma é ideal para empresas e indivíduos que buscam otimizar 
      processos financeiros, desde a organização de receitas e despesas até previsões baseadas em dados históricos.
    `,
    additionalInfo: [
      {
        title: "Funcionalidades",
        content: `
          O Finance AI oferece uma ampla gama de funcionalidades para controle financeiro e gestão de dados, incluindo:
          - Controle de receitas e despesas em tempo real
          - Gerenciamento de contas a pagar e receber
          - Integração com APIs de bancos e gateways de pagamento
          - Previsões financeiras com base em inteligência artificial
          - Relatórios detalhados e gráficos dinâmicos
          - Seleção de datas avançada para customização de relatórios
          - Interface responsiva e moderna
        `,
      },
      {
        title: "Integrações com APIs",
        content: `
          O Finance AI possui integração com APIs de sistemas bancários e ferramentas de pagamento, como Stripe e gateways de e-commerce, 
          permitindo sincronização em tempo real dos dados financeiros. Também utilizamos a API da OpenAI para gerar análises detalhadas 
          e previsões baseadas em dados históricos e tendências.
        `,
      },
      {
        title: "Performance",
        content: `
          O sistema foi otimizado para garantir carregamento rápido e uma experiência fluida para o usuário. A combinação de 
          Next.js, React e Tailwind CSS proporciona uma interface moderna e responsiva, enquanto o backend utiliza Prisma 
          e PostgreSQL para gerenciar dados de forma eficiente.
        `,
      },
      {
        title: "Segurança",
        content: `
          A segurança dos dados é uma prioridade no Finance AI. Implementamos autenticação com NextAuth.js, integração com Clerk para 
          gestão de usuários e proteção contra ataques comuns como XSS, CSRF e SQL Injection. Além disso, todas as transações financeiras 
          são criptografadas.
        `,
      },
    ],
    technologiesUsed: [
      {
        name: "Next.js",
        description: "Framework React para construção de aplicações web rápidas e escaláveis.",
        icon: SiNextdotjs,
        color: "text-black",
      },
      {
        name: "Tailwind CSS",
        description: "Framework CSS utilitário para construção de layouts modernos e responsivos.",
        icon: SiTailwindcss,
        color: "text-blue-500",
      },
      {
        name: "React Hook Form",
        description: "Biblioteca eficiente para gerenciamento de formulários.",
        icon: FaWpforms,
        color: "text-yellow-500",
      },
      {
        name: "Prisma",
        description: "ORM moderno para interagir com bancos de dados.",
        icon: SiPrisma,
        color: "text-green-500",
      },
      {
        name: "PostgreSQL",
        description: "Banco de dados relacional utilizado para armazenamento seguro de dados financeiros.",
        icon: SiPostgresql,
        color: "text-blue-600",
      },
      {
        name: "Stripe",
        description: "Plataforma de pagamentos integrada para gerenciar transações.",
        icon: SiStripe,
        color: "text-indigo-600",
      },
      {
        name: "OpenAI",
        description: "API de inteligência artificial para geração de análises avançadas.",
        icon: SiOpenai,
        color: "text-blue-600",
      },
      {
        name: "Recharts",
        description: "Biblioteca para gráficos e visualizações de dados.",
        icon: FaChartBar,
        color: "text-purple-500",
      },
      {
        name: "Clerk",
        description: "Plataforma para autenticação e gerenciamento de usuários.",
        icon: SiClerk,
        color: "text-teal-500",
      },
      {
        name: "Husky",
        description: "Ferramenta para automação de pre-commit hooks e garantia de qualidade do código.",
        icon: FaCode,
        color: "text-red-500",
      },
    ],
  },
  
  {id: 4,
  title: "Landing Page Itaú",
  desc: "Landing page moderna e responsiva para o Itaú, projetada para oferecer uma experiência intuitiva e elegante aos usuários.",
  img: "/site-itau.png",
  link: "https://itau-landing-example.com",
  details: `
    A landing page do Itaú foi desenvolvida com foco em oferecer uma experiência de navegação fluida e moderna. 
    O design é altamente responsivo, garantindo uma ótima usabilidade em diferentes dispositivos. 
    Integrações com componentes dinâmicos e interativos tornam a página atrativa e funcional.
  `,
  additionalInfo: [
    {
      title: "Funcionalidades",
      content: `
        A landing page apresenta diversas funcionalidades modernas, incluindo:
        - Carrossel dinâmico para exibição de conteúdos e campanhas
        - Animações elegantes para melhorar a experiência do usuário
        - Integração com ícones interativos e design minimalista
        - Sistema de notificações com toast customizável
        - Componentes reutilizáveis com Radix UI para consistência no design
      `,
    },
    {
      title: "Performance",
      content: `
        A página foi otimizada para carregar rapidamente e fornecer uma experiência de usuário sem interrupções. 
        Utilizando Next.js para renderização eficiente, Tailwind CSS para estilos responsivos, e Embla Carousel 
        para exibição de slides, a performance foi uma prioridade em todas as etapas de desenvolvimento.
      `,
    },
    {
      title: "Acessibilidade",
      content: `
        Implementamos práticas de acessibilidade (WCAG) para garantir que a landing page seja inclusiva, 
        como navegação por teclado, contraste adequado e descrições para usuários de tecnologias assistivas.
      `,
    },
  ],
  technologiesUsed: [
    {
      name: "Next.js",
      description: "Framework React para criação de aplicações web rápidas e escaláveis.",
      icon: SiNextdotjs,
      color: "text-black",
    },
    {
      name: "Tailwind CSS",
      description: "Framework CSS utilitário para construção de layouts responsivos e modernos.",
      icon: SiTailwindcss,
      color: "text-blue-500",
    },
    {
      name: "React",
      description: "Biblioteca JavaScript para construção de interfaces de usuário.",
      icon: FaReact,
      color: "text-blue-500",
    },
    {
      name: "Radix UI",
      description: "Biblioteca de componentes acessíveis e estilizados para construção de UIs consistentes.",
      icon: FaIcons,
      color: "text-purple-500",
    },
    {
      name: "Embla Carousel",
      description: "Biblioteca moderna para criar carrosséis fluidos e personalizáveis.",
      icon: FaIcons,
      color: "text-gray-500",
    },
    {
      name: "Tailwind CSS Animate",
      description: "Extensão do Tailwind CSS para animações e transições elegantes.",
      icon: MdOutlineAnimation,
      color: "text-yellow-500",
    },
  ],
},
{ 
id: 5,
  title: "App de Notas",
  desc: "Aplicativo de notas com suporte a texto e áudio, criado para facilitar a organização pessoal e produtividade.",
  img: "/Notas.png",
  link: "https://notes-app-example.com",
  details: `
    Este aplicativo de notas oferece uma maneira simples e eficiente de criar, organizar e acessar notas. 
    Com suporte a entrada de texto e gravação de áudio, ele se adapta às necessidades do usuário, permitindo flexibilidade e acessibilidade. 
    O design é limpo e responsivo, garantindo uma ótima experiência em todos os dispositivos.
  `,
  additionalInfo: [
    {
      title: "Funcionalidades",
      content: `
        O aplicativo possui as seguintes funcionalidades principais:
        - Criação de notas em texto
        - Gravação e armazenamento de áudio como notas
        - Organização de notas por categorias
        - Sistema de busca para encontrar notas rapidamente
        - Interface minimalista e intuitiva
        - Notificações com toast usando Sonner
      `,
    },
    {
      title: "Melhorias Futuras",
      content: `
        Planejamos adicionar as seguintes funcionalidades nas próximas versões:
        - Suporte para upload e gerenciamento de fotos dentro das notas
        - Sincronização de arquivos com armazenamento em nuvem
        - Integração com a agenda para vincular notas a compromissos e eventos
        - Opções de exportação e compartilhamento de notas
      `,
    },
    {
      title: "Acessibilidade",
      content: `
        Este aplicativo foi projetado com acessibilidade em mente, garantindo que todas as funcionalidades 
        sejam utilizáveis por pessoas com diferentes necessidades. Recursos incluem suporte a navegação por teclado 
        e opções para personalização de fontes e temas.
      `,
    },
  ],
  technologiesUsed: [
    {
      name: "React",
      description: "Biblioteca JavaScript para construção de interfaces de usuário.",
      icon: FaReact,
      color: "text-blue-500",
    },
    {
      name: "Tailwind CSS",
      description: "Framework CSS utilitário para criação de designs responsivos e personalizáveis.",
      icon: SiTailwindcss,
      color: "text-blue-500",
    },
    {
      name: "Vite",
      description: "Ferramenta de build rápida e otimizada para desenvolvimento de aplicações web.",
      icon: SiVite,
      color: "text-purple-500",
    },
    {
      name: "Sonner",
      description: "Biblioteca para notificações simples e elegantes, usada para mostrar toasts de feedback ao usuário.",
      icon: MdOutlineTextFields,
      color: "text-yellow-500",
    },
    {
      name: "Gravação de Áudio",
      description: "Recurso nativo de reconhecimento de voz para capturar áudio e armazená-lo como notas.",
      icon: MdOutlineMic,
      color: "text-red-500",
    },
    {
      name: "Sincronização",
      description: "Planejado para futura sincronização de arquivos com armazenamento em nuvem e integração com agendas.",
      icon: MdOutlineSync,
      color: "text-green-500",
    },
  ],
},

{
  id: 6,
  title: "Word Hierarchy",
  desc: "Um sistema completo para analisar e organizar a hierarquia de palavras, oferecendo uma interface intuitiva e ferramentas poderosas para análises e visualizações.",
  img: "/Word.png",
  link: "https://word-hierarchy.example.com",
  details: "O Word Hierarchy é uma aplicação projetada para auxiliar na análise e visualização de hierarquias de palavras. A solução combina uma interface frontend moderna e responsiva com um backend robusto, fornecendo uma experiência fluida e funcional para usuários que precisam organizar e explorar relações entre palavras.",
  additionalInfo: [
    {
      title: "Funcionalidades",
      content: `
        O sistema Word Hierarchy oferece funcionalidades que tornam a análise de palavras intuitiva e eficiente:
        - Criação e edição de hierarquias de palavras.
        - Visualizações interativas para explorar relações entre palavras.
        - Exportação de hierarquias para diferentes formatos.
        - API backend para integração com outras plataformas e ferramentas.
        - Suporte para análises em tempo real através de algoritmos otimizados.
      `
    },
    {
      title: "Integração CLI",
      content: `
        O projeto inclui uma interface de linha de comando (CLI) que permite aos usuários realizar análises diretamente no backend. Isso é útil para automações ou operações avançadas de análise de texto.
      `
    },
    {
      title: "Backend Robusto",
      content: `
        A API backend foi desenvolvida com Express.js e TypeScript, garantindo tipagem segura, organização eficiente do código e suporte para múltiplas operações simultâneas. Além disso, o uso de middlewares como CORS e Body Parser melhora a segurança e a compatibilidade do sistema.
      `
    },
    {
      title: "Interface Moderna",
      content: `
        A interface frontend foi criada com Next.js, Tailwind CSS e Radix UI, oferecendo uma experiência elegante, acessível e altamente personalizável. Funcionalidades adicionais incluem suporte a animações e notificações amigáveis para o usuário.
      `
    }
  ],
  technologiesUsed: [
    {
      name: "Next.js",
      description: "Framework de React para desenvolvimento web rápido e escalável, com renderização no lado do servidor e rotas dinâmicas.",
      icon: SiNextdotjs,
      color: "text-black"
    },
    {
      name: "React",
      description: "Biblioteca JavaScript para criação de interfaces de usuário reativas e modulares.",
      icon: FaReact,
      color: "text-blue-500"
    },
    {
      name: "Tailwind CSS",
      description: "Framework CSS para construção de layouts responsivos e estilizados com facilidade.",
      icon: SiTailwindcss,
      color: "text-blue-500"
    },
    {
      name: "Radix UI",
      description: "Conjunto de componentes acessíveis e estilizados para interfaces modernas.",
      icon: AiOutlineDeploymentUnit,
      color: "text-gray-600"
    },
    {
      name: "Express.js",
      description: "Framework de backend minimalista e flexível para Node.js, utilizado para criar a API.",
      icon: SiExpress,
      color: "text-gray-600"
    },
    {
      name: "TypeScript",
      description: "Superset de JavaScript que adiciona tipagem estática, aumentando a segurança e a robustez do código.",
      icon: SiTypescript,
      color: "text-blue-700"
    },
    {
      name: "Jest",
      description: "Framework de testes para garantir a qualidade do código, com suporte a testes unitários e de integração.",
      icon: SiJest,
      color: "text-pink-600"
    },
    {
      name: "React Toastify",
      description: "Biblioteca para criar notificações amigáveis e estilizadas no frontend.",
      icon: MdOutlineNotifications,
      color: "text-yellow-500"
    },
    {
      name: "Axios",
      description: "Biblioteca de requisições HTTP utilizada para comunicação com a API backend.",
      icon: SiAxios,
      color: "text-blue-400"
    }
  ]
},

{
  id: 7,
  title: "TranscripVision",
  desc: "Uma solução inovadora para transcrição de vídeos utilizando inteligência artificial avançada.",
  img: "/transcrip.png",
  link: "https://transcripvision.example.com",
  details: "O TranscripVision é uma aplicação que automatiza o processo de transcrição de vídeos, oferecendo precisão e agilidade através do uso de inteligência artificial. Integrando uma interface intuitiva com um backend robusto, a ferramenta permite transcrever vídeos de forma eficiente e personalizada.",
  additionalInfo: [
    {
      title: "Funcionalidades",
      content: `
        O TranscripVision oferece um conjunto completo de funcionalidades para atender às necessidades dos usuários:
        - Upload de vídeos diretamente pela interface do usuário.
        - Geração automática de transcrições usando modelos avançados de IA.
        - Personalização de prompts para adequar a transcrição às suas necessidades.
        - Suporte a múltiplos formatos de entrada e saída.
        - Integração com APIs externas para análises adicionais.
      `
    },
    {
      title: "Integração com IA",
      content: `
        O backend é integrado ao ChatGPT da OpenAI, permitindo transcrições personalizadas e de alta qualidade. A temperatura da IA pode ser ajustada para controlar o nível de criatividade nas respostas.
      `
    },
    {
      title: "Backend Escalável",
      content: `
        Desenvolvido com Fastify e Prisma, o backend do TranscripVision é otimizado para alto desempenho, escalabilidade e segurança, garantindo um serviço confiável para qualquer volume de dados.
      `
    },
    {
      title: "Interface Intuitiva",
      content: `
        A interface foi criada com Next.js e Tailwind CSS, proporcionando uma experiência de usuário moderna, responsiva e elegante. O design foi otimizado para facilitar o uso, mesmo para iniciantes.
      `
    }
  ],
  technologiesUsed: [
    {
      name: "Next.js",
      description: "Framework de React para desenvolvimento web rápido e escalável, com renderização no lado do servidor e rotas dinâmicas.",
      icon: SiNextdotjs,
      color: "text-black"
    },
    {
      name: "React",
      description: "Biblioteca JavaScript para criação de interfaces de usuário reativas e modulares.",
      icon: FaReact,
      color: "text-blue-500"
    },
    {
      name: "Tailwind CSS",
      description: "Framework CSS para construção de layouts responsivos e estilizados com facilidade.",
      icon: SiTailwindcss,
      color: "text-blue-500"
    },
    {
      name: "Fastify",
      description: "Framework web para Node.js, focado em desempenho e simplicidade, utilizado no backend.",
      icon: SiFastify,
      color: "text-green-500"
    },
    {
      name: "OpenAI API",
      description: "Plataforma para integração com os modelos de inteligência artificial mais avançados, como o ChatGPT.",
      icon: AiOutlineRobot,
      color: "text-gray-600"
    },
    {
      name: "Prisma",
      description: "ORM moderno para Node.js e TypeScript, utilizado para gerenciar o banco de dados.",
      icon: SiPrisma,
      color: "text-indigo-600"
    },
    {
      name: "TypeScript",
      description: "Superset de JavaScript que adiciona tipagem estática, aumentando a segurança e a robustez do código.",
      icon: SiTypescript,
      color: "text-blue-700"
    },
    {
      name: "React Toastify",
      description: "Biblioteca para criar notificações amigáveis e estilizadas no frontend.",
      icon: MdOutlineNotifications,
      color: "text-yellow-500"
    },
    {
      name: "Zod",
      description: "Biblioteca para validação de esquemas e segurança na tipagem de dados.",
      icon: SiZod,
      color: "text-purple-500"
    }
  ]
},


 
  {
    id: 8,
    title: "IntelliFlow",
    desc: "**IntelliFlow** é um assistente inteligente desenvolvido com Next.js, TypeScript e Tailwind CSS. Ele simplifica o fluxo de dados.",
    img: "/chat.png",
    link: "https://chat-7k38i3zx5-wesley-sds.vercel.app/",
  },
  {
    id: 9,
    title: "Apple Iphone 15",
    desc: "Um site interativo apresenta o iPhone 15 Pro em 3D. Desenvolvido com tecnologia de ponta (Three.js, React Three Fiber e GSAP)",
    img: "/apple.png",
    link: "https://apple-iphone-15-ivory.vercel.app/",
  },
  {
    id: 10,
    title: "Will's Pizzas Dashboard",
    desc: "Um painel de administração completo para gestão de pizzarias, com funcionalidades avançadas e integração inteligente.",
    img: "/wills.png",
    link: "https://wills-pizzas.example.com",
    details: "O Will's Pizzas Dashboard é um sistema administrativo para pizzarias que oferece ferramentas para controle de pedidos, gestão financeira, integração com chatbots, relatórios avançados, e muito mais. Desenvolvido com foco em eficiência e facilidade de uso, é a solução ideal para gerenciar todas as operações do dia a dia.",
    additionalInfo: [
      {
        title: "Funcionalidades Principais",
        content: `
          - **Gestão de caixas:** Controle completo das entradas e saídas financeiras.
          - **Pedidos e entregas:** Monitoramento em tempo real de pedidos e rastreamento de entregas.
          - **Integrações:** Conexão com sistemas externos e chatbots inteligentes para suporte ao cliente.
          - **Relatórios e gráficos:** Visualização detalhada de dados operacionais e financeiros.
          - **Diário de bordo:** Registro das atividades diárias da equipe e operações.
          - **Controle financeiro:** Ferramentas de gestão de receitas e despesas para melhor organização financeira.
        `
      },
      {
        title: "Tecnologias de Integração",
        content: `
          O dashboard suporta integrações com serviços de entrega, APIs de pagamento e chatbots baseados em inteligência artificial. Isso facilita a automação de processos e o suporte ao cliente.
        `
      },
      {
        title: "Interface Personalizável",
        content: `
          A interface foi construída com Next.js e Tailwind CSS, permitindo personalizações rápidas e mantendo a usabilidade para diferentes tipos de pizzarias.
        `
      },
      {
        title: "Relatórios e Análises",
        content: `
          Relatórios detalhados e gráficos interativos permitem uma visão clara das operações e ajudam na tomada de decisões estratégicas.
        `
      }
    ],
    technologiesUsed: [
      {
        name: "Next.js",
        description: "Framework de React para desenvolvimento web rápido e escalável, com renderização no lado do servidor e rotas dinâmicas.",
        icon: SiNextdotjs,
        color: "text-black"
      },
      {
        name: "React",
        description: "Biblioteca JavaScript para criação de interfaces de usuário reativas e modulares.",
        icon: FaReact,
        color: "text-blue-500"
      },
      {
        name: "Tailwind CSS",
        description: "Framework CSS para construção de layouts responsivos e estilizados com facilidade.",
        icon: SiTailwindcss,
        color: "text-blue-500"
      },
      {
        name: "Framer Motion",
        description: "Biblioteca de animações para React, utilizada para melhorar a experiência do usuário com transições suaves.",
        icon: TbArrowsDiagonal,
        color: "text-red-500"
      },
      {
        name: "Radix UI",
        description: "Conjunto de componentes acessíveis e estilizados para interfaces modernas.",
        icon: AiOutlineDeploymentUnit,
        color: "text-gray-600"
      },
      {
        name: "Lucide Icons",
        description: "Conjunto de ícones modernos e leves, utilizados para criar uma interface visualmente rica.",
        icon: TbIcons,
        color: "text-yellow-500"
      },
      {
        name: "TypeScript",
        description: "Superset de JavaScript que adiciona tipagem estática, aumentando a segurança e a robustez do código.",
        icon: SiTypescript,
        color: "text-blue-700"
      },
      {
        name: "React Feather",
        description: "Coleção de ícones leves e responsivos, integrados ao design do dashboard.",
        icon: FiFeather,
        color: "text-green-500"
      },
      {
        name: "React Icons",
        description: "Biblioteca para uso de ícones no React, proporcionando flexibilidade na escolha de ícones estilizados.",
        icon: FaReact,
        color: "text-blue-500"
      }
    ]
  }
  
];


export const workExperience = [
  {
    id: 1,
    title: "Programador FullStack",
    company: "Melhor do Grão",
    location: "São Paulo, Brasil",
    period: "Outubro 2015 - Novembro 2024",
    desc: "Responsável pela criação de interfaces intuitivas e atraentes para aplicações web e móveis. Colaborei com equipes multifuncionais para otimizar a experiência do usuário, implementando práticas de design centradas no usuário.",
    responsibilities: [
      "Desenvolver interfaces de usuário responsivas e modernas para e-commerces, dashboards e aplicativos utilizando frameworks como React e Next.js.",
      "Atuar na criação e implementação de soluções focadas na experiência do usuário (UX) e na usabilidade (UI), alinhando-se às melhores práticas de design.",
      "Criar protótipos interativos e wireframes detalhados com ferramentas como Figma e Adobe XD para validação junto a stakeholders.",
      "Manter comunicação contínua com equipes de design, produto e desenvolvimento para garantir integração perfeita entre frontend e backend.",
      "Gerenciar o ciclo de vida completo de projetos, desde a concepção até a entrega e manutenção, garantindo alta qualidade e cumprimento de prazos.",
      "Desenvolver e gerenciar APIs robustas e escaláveis com Node.js e Express, integrando sistemas backend com bancos de dados como MongoDB e MySQL.",
      "Implementar práticas de testes automatizados e realizar revisões de código para garantir a consistência e qualidade do software.",
      "Otimizar as aplicações para desempenho e escalabilidade, garantindo a melhor experiência para o usuário final.",
      "Liderar a integração de novas tecnologias e ferramentas para melhorar a eficiência do desenvolvimento e a entrega de projetos."
    ],
    
    skills: [
      // Desenvolvimento Frontend
      "React", 
      "Next.js", 
      "HTML5", 
      "CSS3", 
      "Tailwind CSS", 
      "JavaScript (ES6+)", 
      "TypeScript",
      
      // Desenvolvimento Backend
      "Node.js", 
      "Express.js", 
      "RESTful APIs", 
      "GraphQL", 
      "WebSockets",
      
      // Bancos de Dados
      "MongoDB", 
      "MySQL", 
      "PostgreSQL", 
      "Redis",
    
      // Design e Prototipagem
      "Figma", 
      "Adobe XD", 
      "Prototipagem Interativa", 
      "Wireframing",
    
      // Testes e Qualidade
      "Jest", 
      "Cypress", 
      "Testes Automatizados", 
      "TDD (Test Driven Development)",
    
      // Ferramentas e Infraestrutura
      "Git", 
      "GitHub", 
      "GitLab", 
      "CI/CD (Continuous Integration/Continuous Deployment)",
      "Docker", 
      "Kubernetes",
    
      // Outras Habilidades
      "Metodologias Ágeis (Scrum, Kanban)", 
      "Otimização de Performance", 
      "Design Responsivo", 
      "Comunicação Interdisciplinar", 
      "Gerenciamento de Projetos",
      "Liderança Técnica",
      "Análise de Métricas e KPI's",
      "Resolução de Problemas Complexos"
    ],
    
      thumbnail: "/01.svg",
      className: "md:col-span-2",
  },
  {
    id: 2,
    title: "Gerente de Produção",
    company: "Ceres Brasil" ,
    location: "São Paulo",
    period: "2010 a 2015",
    desc: "Profissional com sólida experiência na indústria alimentícia, atuando inicialmente como Auxiliar de Produção e alcançando o cargo de Gerente de Produção. Responsável pela gestão de equipes, otimização de processos produtivos e garantia de padrões de qualidade em uma fábrica de macarrão.",  
    responsibilities: [
      "Operar e monitorar máquinas de produção para garantir a eficiência e qualidade no processo de fabricação de macarrão.",
      "Acompanhar o cumprimento das metas diárias de produção, garantindo a entrega dentro dos prazos estipulados.",
      "Supervisionar a equipe de produção, promovendo treinamentos e assegurando a adesão às normas de segurança e higiene alimentar.",
      "Identificar gargalos no processo produtivo e implementar melhorias para otimizar a eficiência operacional.",
      "Realizar controle de qualidade, verificando a conformidade dos produtos com os padrões estabelecidos.",
      "Gerenciar inventário de matérias-primas e insumos, garantindo a continuidade das operações.",
      "Elaborar relatórios de produção e propor estratégias para redução de custos e aumento de produtividade.",
      "Manter comunicação eficaz com outros departamentos, como logística e manutenção, para assegurar o fluxo contínuo de operações."
    ],
    
    skills: [
      "Liderança e Gestão de Equipes",
      "Comunicação Eficaz",
      "Resolução de Problemas",
      "Tomada de Decisão",
      "Planejamento e Organização",
      "Trabalho em Equipe",
      "Proatividade e Adaptabilidade",
      "Foco em Resultados",
      "Gestão de Tempo",
      "Pensamento Estratégico"
    ],
    
    thumbnail: "/02.svg",
    className: "md:col-span-2",
  },
  {
    id: 3,
    title: "Desenvolvedor Fullstack",
    company: "Freelancer",
    location: "Remoto",
    period: "2021 a 2022",
    desc: "Atuação como desenvolvedor fullstack em projetos sob demanda, criando soluções completas para startups e pequenas empresas.",
    responsibilities: [
      "Desenvolver APIs RESTful com Node.js e Express, integrando bancos de dados como MongoDB e PostgreSQL.",
      "Implementar interfaces modernas e responsivas utilizando React.js e Tailwind CSS.",
      "Fornecer suporte técnico e manutenção para sistemas desenvolvidos, garantindo a continuidade dos serviços.",
      "Colaborar com designers para transformar wireframes e protótipos em aplicativos funcionais.",
      "Configurar pipelines de CI/CD para automação de deploys em ambientes de produção e homologação.",
    ],
    skills: [
      "JavaScript (ES6+)",
      "React.js",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "API REST",
      "Git e GitHub",
      "CI/CD",
      "Docker",
      "Responsividade",
    ],
    thumbnail: "/03.svg",
    className: "md:col-span-2",
  },
  {
    id: 4,
    title: "Desenvolvedor Frontend",
    company: "freelancer",
    location: "Remoto",
    period: "2020 a 2021",
    desc: "Criação de interfaces visuais para aplicações web, focando em desempenho e experiência do usuário.",
    responsibilities: [
      "Desenvolver interfaces utilizando Next.js e React.js com integração a APIs externas.",
      "Implementar animações interativas para aprimorar a usabilidade das plataformas.",
      "Otimizar o desempenho de aplicações para reduzir o tempo de carregamento.",
      "Escrever testes unitários e de integração para garantir a estabilidade do código.",
      "Trabalhar em estreita colaboração com equipes de backend e design.",
    ],
    skills: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Figma",
      "Jest",
      "TypeScript",
      "Webpack",
      "SEO",
      "Performance Web",
      "UX/UI Design",
    ],
    thumbnail: "/04.svg",
    className: "md:col-span-1",
  },
  {
    id: 5,
    title: "Desenvolvedor Backend",
    company: "Freelancer",
    location: "São Paulo",
    period: "2022 a 2023",
    desc: "Responsável por desenvolver e otimizar APIs para integração de sistemas corporativos.",
    responsibilities: [
      "Criar e manter APIs robustas utilizando Node.js e TypeScript.",
      "Desenvolver rotinas para processamento de dados em larga escala.",
      "Gerenciar bancos de dados relacionais e não relacionais, garantindo alta disponibilidade.",
      "Implementar autenticação e autorização segura com JWT e OAuth.",
      "Fornecer documentação detalhada das APIs para equipes parceiras.",
    ],
    skills: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "JWT",
      "OAuth",
      "Kubernetes",
      "GraphQL",
      "ElasticSearch",
      "Microservices",
    ],
    thumbnail: "/05.svg",
    className: "md:col-span-1",
  },
  {
    id: 6,
    title: "Desenvolvedor Fullstack",
    company: "Freelancer",
    location: "Remoto",
    period: "2023",
    desc: "Criação de plataformas completas para gerenciamento de dados empresariais.",
    responsibilities: [
      "Projetar arquitetura de software utilizando tecnologias modernas.",
      "Desenvolver dashboards dinâmicos com React.js e Chart.js.",
      "Integrar plataformas a serviços de terceiros, como Stripe e AWS.",
      "Implementar autenticação segura com autenticação multifatorial (MFA).",
      "Fornecer manutenção contínua e otimizações baseadas no feedback do cliente.",
    ],
    skills: [
      "JavaScript (ES6+)",
      "React.js",
      "Node.js",
      "AWS",
      "Stripe",
      "MFA",
      "Chart.js",
      "Express",
      "MySQL",
      "REST APIs",
    ],
    thumbnail: "/06.svg",
    className: "md:col-span-2",
  },
  {
    id: 7,
    title: "Desenvolvedor Backend",
    company: "Freelancer",
    location: "Remoto",
    period: "2019 a 2020",
    desc: "Desenvolvimento de soluções de backend escaláveis para e-commerces de médio porte.",
    responsibilities: [
      "Criar microsserviços para integração de sistemas de pagamento e envio.",
      "Implementar soluções para cache utilizando Redis e Memcached.",
      "Otimizar queries SQL para maior eficiência e desempenho.",
      "Trabalhar com arquiteturas baseadas em eventos utilizando RabbitMQ.",
      "Configurar servidores e monitorar logs para resolver problemas em produção.",
    ],
    skills: [
      "Node.js",
      "Redis",
      "RabbitMQ",
      "SQL",
      "Docker",
      "Express",
      "APIs RESTful",
      "Serverless",
      "Memcached",
      "Arquitetura de Microsserviços",
    ],
    thumbnail: "/7.svg",
    className: "md:col-span-1",
  },
  {
    id: 8,
    title: "Desenvolvedor Frontend",
    company: "Freelancer",
    location: "Remoto",
    period: "2020 a 2021",
    desc: "Colaboração com equipes de design para desenvolvimento de aplicações web focadas em estética e usabilidade.",
    responsibilities: [
      "Criar componentes reutilizáveis utilizando React.js e Storybook.",
      "Desenvolver landing pages otimizadas para conversão.",
      "Realizar integrações com APIs de marketing digital, como Google Analytics.",
      "Garantir a acessibilidade dos sites, seguindo as diretrizes do WCAG.",
      "Escrever código limpo e documentado para facilitar a manutenção.",
    ],
    skills: [
      "React.js",
      "Storybook",
      "WCAG",
      "Google Analytics",
      "Sass",
      "TypeScript",
      "Tailwind CSS",
      "Acessibilidade Web",
      "Responsive Design",
      "Figma",
    ],
    thumbnail: "/03.svg",
    className: "md:col-span-1",
  },
  {
    id: 9,
    title: "Desenvolvedor Fullstack - Plataforma de E-commerce",
    company: "Freelancer",
    location: "Remoto",
    period: "2022 a 2023",
    desc: "Desenvolvimento de uma plataforma de e-commerce personalizada, atendendo a demandas específicas de integração e escalabilidade para pequenos e médios lojistas.",
    responsibilities: [
      "Projetar e implementar o backend com Node.js e MongoDB, otimizando a performance para lidar com alto volume de acessos.",
      "Desenvolver um frontend responsivo utilizando Next.js e Tailwind CSS, focando em uma experiência de usuário intuitiva.",
      "Integrar serviços de pagamento, como PayPal e Stripe, PagSeguro, para suportar múltiplas formas de checkout.",
      "Implementar funcionalidades de carrinho de compras, recomendação de produtos e pesquisa avançada.",
      "Monitorar e corrigir bugs em tempo real, garantindo disponibilidade 24/7.",
    ],
    skills: [
      "Node.js",
      "MongoDB",
      "Next.js",
      "Tailwind CSS",
      "Stripe",
      "PayPal",
      "ElasticSearch",
      "Webhooks",
      "GraphQL",
      "JWT",
    ],
    thumbnail: "/01.svg",
    className: "md:col-span-2",
  },
  {
    id: 10,
    title: "Desenvolvedor Frontend - Dashboard Empresarial",
    company: "Freelancer",
    location: "Remoto",
    period: "2021 a 2022",
    desc: "Criação de dashboards analíticos interativos para empresas de médio porte, facilitando a visualização e o gerenciamento de dados operacionais.",
    responsibilities: [
      "Desenvolver dashboards interativos com React.js e libraries como Recharts e D3.js.",
      "Implementar autenticação segura com OAuth e permissões baseadas em níveis de acesso.",
      "Criar filtros dinâmicos e gráficos customizáveis para visualização de KPIs.",
      "Colaborar com equipes de backend para integrar dados em tempo real através de WebSockets.",
      "Aprimorar a usabilidade do sistema com testes A/B e feedback de usuários.",
    ],
    skills: [
      "React.js",
      "D3.js",
      "Recharts",
      "TypeScript",
      "WebSockets",
      "OAuth",
      "UX Design",
      "Material UI",
      "Figma",
      "Firebase",
    ],
    thumbnail: "/02.svg",
    className: "md:col-span-2",
  },
  
];

export const socialIcons = [
  {
    id: 1,
    img: "/git.svg",
    name: "GitHub",
    link: "https://github.com/Wesley-SdS",
  },
  {
    id: 2,
    img: "/twit.svg",
    name: "Twitter",
    link: "https://github.com/Wesley-SdS",
  },
  {
    id: 3,
    img: "/link.svg",
    name: "Linkedin",
    link: "https://github.com/Wesley-SdS",
  },
];
