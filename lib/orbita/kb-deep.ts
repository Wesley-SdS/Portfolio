/**
 * Deep knowledge for Órbita's visitor mode: verified facts beyond what the home page shows, from the
 * owner's CV and a read-only audit of his repositories (2026-09-30, sources in docs/REDESIGN.md §15).
 * Written once in Portuguese; Órbita answers in the visitor's language. Public-safe only: no client
 * names, no internal screens, no salary, nothing from plataforma-unica, cg_platform or CIA internals.
 *
 * To add a fact: put it under the right heading, short and checkable. Never add a number you can't prove.
 */
export const KB_DEEP = `
# Perfil (para recrutadores e empresas)
- Nome completo: Wesley Souza dos Santos. Mora em São Paulo, SP. Fuso de Brasília (UTC−3).
- Mais de 10 anos de experiência, começando em 2015 como front-end. Hoje é Tech Lead em duas empresas ao mesmo tempo: Companhia de Estágios (desde jul/2026) e Adalink (desde fev/2025; entrou como Senior Software Engineer e foi promovido a Technical Lead em 4 meses). Também é fundador da OrbitMind, onde constrói produtos próprios de IA.
- Formatos de contratação aceitos: CLT ou PJ, dedicação integral ou parcial, remoto ou híbrido em São Paulo. Também atende pela OrbitMind (time contínuo, projeto fechado ou consultoria).
- Status público: disponível para conversar sobre projetos e posições. Disponibilidade, data de início e pretensão são tratadas diretamente com ele na call; a Órbita não informa valores.
- Liderança: mentoria, code review, decisões de arquitetura registradas em ADRs, padrões de código, rituais do time, ponte com as áreas de negócio (requisitos, prazos e homologação), boards e automações no Jira.
- Forma de trabalhar: AI-native. Escreve a especificação, decide a arquitetura, orienta agentes de código e revisa cada entrega; testes e portões de CI seguram a qualidade.
- Escala com que já lidou: plataformas que atendem mais de 600 clientes no Brasil, EUA, Itália e América Latina (Companhia de Estágios); plataforma educacional com milhões de alunos (Alura); SaaS de atendimento no WhatsApp para empresas em escala (ChatGuru).

# Adaflow (plataforma de IA corporativa da Adalink, que ele arquitetou e lidera)
- O que é: SaaS white-label de infraestrutura de IA para empresas. Também funciona como provedor de identidade (SSO) e expõe uma API compatível com OpenAI para apps parceiros.
- Escala do backend: 20 microsserviços, cerca de 1.734 rotas HTTP, 402 modelos de dados em 18 schemas, 247 permissões no catálogo, 34 ADRs, i18n com 10.389 chaves em português, inglês e espanhol.
- Qualidade: 25.937 testes automatizados em 2.404 suítes no backend; CI com 16 portões (lint, testes, build, auditoria, migrações, segredos, segurança de containers e outros); mais de 60 scripts de verificação.
- Módulos: chat com assistentes e "conselho" de especialistas; RAG com busca vetorial (pgvector), memória em grafo e OCR (Tesseract com fallback de visão por IA); agentes autônomos; workflows; conectores; voz; squads de agentes; avaliação de modelos (datasets, drift, champion/challenger); governança e segurança; créditos e FinOps; cobrança; canal de WhatsApp; marketplace de apps.
- Conectores: 114 conectores nativos (118 adaptadores contando MCP, Composio e HTTP genérico), com OAuth gerenciado pelo Nango, limite por conector e proteção contra SSRF. Inclui Google Workspace e Microsoft 365; CRMs (Salesforce, HubSpot, Pipedrive, Zoho, RD Station); ERPs e serviços brasileiros (Bling, Omie, Conta Azul, Clicksign, D4Sign, Mercado Pago, Nuvemshop, VTEX, Gupy); bancos de dados (Postgres, MySQL, MongoDB, BigQuery, Snowflake, Supabase); anúncios e redes (Meta Ads, TikTok Ads, Google Ads, Instagram, YouTube); mensageria (WhatsApp, Slack, Teams, Telegram, Discord, Twilio); automação (Zapier, Make, n8n).
- Workflows: editor visual com 10 tipos de nó (gatilho, agente, roteador, condição, ação, espera, loop, paralelo, fim e aprovação humana) e 5 tipos de gatilho (manual, agendado, webhook, evento e mensagem de WhatsApp). Execução durável com Trigger.dev, pausa e retomada na etapa de aprovação. Também cria workflows a partir de linguagem natural.
- Segurança: RBAC com permissões por escopo (próprio, time, todos) e permissões negativas; SSO OIDC por organização (Microsoft Entra); 2FA; auditoria obrigatória em 870 endpoints de escrita, com redação de dados sensíveis; DLP com detectores de dados pessoais; cifragem AES-256-GCM; rate limiting e fila justa por tenant; LGPD (consentimento e pedidos do titular).
- FinOps e cobrança: carteira de créditos, custo por chamada de LLM, centros de custo e chargeback; cobrança por PIX, boleto, cartão e NFS-e.
- Observabilidade: OpenTelemetry, Prometheus, Grafana, Loki, Tempo e Pyroscope.
- Stack: NestJS 11, Nx, Prisma, Next.js 16, React 19, PostgreSQL (Neon) com pgvector, Redis, BullMQ, RabbitMQ, Cloudflare R2, Vercel AI SDK, Mastra, MCP, Trigger.dev, Nango, Render e Vercel.

# Esteira OrbitMind (entrega autônoma com agentes, usada na Adalink)
- Da issue ao deploy sem fila de revisão: um agente implementa a issue e abre o PR; um revisor independente avalia em 8 eixos (bugs, segurança, performance, arquitetura, clean code, testes, contratos de API e padrões de microsserviço) e dá nota de A a F; nota A faz merge automático; C a F vão para um agente de autofix e voltam para revisão; depois do merge, outro agente atualiza o changelog e publica release notes.
- Portões antes do A: CI verde, acentuação em português, logger estruturado, teste de regressão e teste para todo serviço novo.
- Extras: agente paralelo que divide uma especificação entre 8 subagentes especialistas; orquestrador que quebra uma demanda entre front e back; rebase automático de conflitos; agentes de pesquisa de mercado e relatórios.
- Resultados medidos nos últimos 30 PRs: 100% chegam a nota A; mediana de 0,5 h da issue ao merge no backend (0,7 h no front).

# Órbita (o assistente pessoal dele, e a mesma IA que atende neste site em modo visitante)
- Assistente pessoal local-first e voz-primeiro: conversa por texto e voz, usa mais de 100 ferramentas escolhidas por relevância e só age no mundo com aprovação do dono.
- Voz: palavra de ativação "Ei Órbita", transcrição e síntese locais ou na nuvem, detecção de fala.
- 7 provedores de LLM com failover (inclusive modelos locais com Ollama).
- Conectores: Google (Gmail, Agenda, Contatos, Meet), Microsoft (Outlook, Teams), Jira, Notion, Slack, Zoom, WhatsApp pessoal e um bot no Telegram. Tokens cifrados com AES-256-GCM.
- RAG medido: 86,7% de acerto no top-5 (era 50,0%), com citação da página.
- Stack: Next.js 16, React 19, NestJS, Expo (app mobile), Python para voz e percepção, PostgreSQL com pgvector.
- O núcleo animado (10 estados) que aparece neste site é o mesmo código do produto, em WebGL.

# Outros produtos e projetos (detalhes)
- Workspace de WhatsApp com IA (prova de conceito para a Adalink): caixa de entrada compartilhada multi-tenant, fila humana e atribuição, copiloto de IA (sugestão, tom, tradução, resumo), busca semântica, automações, campanhas com proteção contra banimento, trilha de auditoria, exportação probatória (PDF com manifesto SHA-256), webhooks e chaves de API. 800 testes unitários, 103 testes ponta a ponta, 27 telas.
- Plataforma de plantões (reescrita para a Revoluna): vagas, escalas, check-in, mensagens em tempo real, notificações, relatórios e WhatsApp com três provedores intercambiáveis (Meta, Twilio e Zapster). 21 módulos, 35 modelos de dados, mais de 121 endpoints, 175 arquivos de teste e cobertura de 73,7% no backend.
- Suíte Nex: NexBot cuida da IA, dos fluxos visuais, da base de conhecimento e do handoff humano em mais de 10 canais (WhatsApp, Telegram, Slack, Discord, Instagram, Messenger, Teams, widget e voz); NexConnect é o motor de mensageria (sessões de WhatsApp, pipeline de entrada em 7 etapas, broadcasts A/B, webhooks assinados, escala horizontal no Kubernetes).
- Vektus: documentos viram respostas com citação; aceita PDF, Office, imagem, áudio e vídeo, sincroniza Google Drive, SharePoint e Notion, faz OCR híbrido e busca vetorial, com chat multi-modelo.
- InfluencerAI: estúdio de influenciadores virtuais com rosto consistente; 6 modelos de imagem e 8 de vídeo (entre eles Veo 3, Kling e MiniMax), lip-sync e voz.
- OrbitFinance: finanças pessoais pelo WhatsApp (mensagem ou áudio), com assinaturas detectadas, previsões, alertas, score financeiro e desafios; 102 testes; português, inglês e espanhol.
- OrbitMind: o cliente descreve o objetivo e um agente Arquiteto monta, por conversa, um squad de agentes que pesquisa, cria, revisa e publica, com checkpoints humanos; escritório 3D, board e marketplace.

# Perguntas frequentes de recrutadores e empresas
- "Ele está empregado?" Sim, é Tech Lead na Companhia de Estágios e na Adalink, e mesmo assim avalia propostas e projetos; o formato (CLT, PJ, parcial ou integral) se combina na call.
- "Ele fala inglês?" A Órbita não tem essa informação confirmada; sugira perguntar na call.
- "Qual a pretensão salarial ou o valor/hora?" Não é informado aqui; ele trata isso na conversa ou na proposta escrita.
- "Pode mostrar o código?" Os repositórios públicos estão no GitHub (github.com/Wesley-SdS); os de empregadores e clientes são privados.
- "Ele lidera times?" Sim: hoje lidera dois times, e já liderou na Revoluna e na Melhor do Grão.
`.trim();
