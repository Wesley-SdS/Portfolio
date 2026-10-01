import { crops } from "./images";

/**
 * "Sobre" data, shown inside "Sobre & experiência" (#experience) and the stack marquee.
 * Copy: about.paragraphs.<id>.{head,text} (Órbita knowledge base) · leadership.stack.<group> (titles) ·
 * leadership.stackMeta.<group> (the label under each group's proof number).
 * Stack items are proper nouns and stay language-neutral here. Groups follow the owner's CV, extended
 * with what the repo audit of 2026-09-30 found in production (Adaflow, Órbita, Nex, Vektus); the
 * `proof` number per group comes from the same audit.
 */
export const ABOUT = {
  portrait: crops.wesley.portrait,
  portraitMobile: crops.wesley.portraitMobile,
  paragraphs: ["trajectory", "work", "drive"] as const,
  stack: [
    {
      id: "frontend",
      proof: "207",
      items: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Micro Front-end", "Jotai / Effector", "TanStack Query", "SWR", "React Hook Form", "Shadcn/UI", "@xyflow", "Framer Motion", "next-intl", "Expo"],
    },
    {
      id: "backend",
      proof: "20",
      items: ["Node.js", "NestJS", "Express", "Fastify", "Python", "FastAPI", "Flask", "Go", "Laravel", "Nx / Turborepo", "Clean Architecture", "BullMQ", "RabbitMQ", "Kafka", "Socket.IO", "Trigger.dev"],
    },
    {
      id: "ai",
      proof: "102",
      items: ["LLMs", "RAG", "Agentes de IA", "Prompt Engineering", "Vercel AI SDK", "Mastra", "MCP", "LangChain", "pgvector", "Anthropic · OpenAI · Gemini", "Ollama", "OCR (Tesseract + visão)", "Whisper · ElevenLabs", "Kestra", "n8n"],
    },
    {
      id: "data",
      proof: "402",
      items: ["PostgreSQL", "pgvector", "MongoDB", "Prisma ORM", "Drizzle", "Redis", "Supabase", "Neon", "SQL", "Cloudflare R2 / S3", "Memgraph"],
    },
    {
      id: "devops",
      proof: "16",
      items: ["AWS (ECS, Lambda, S3, CloudFront)", "Docker", "Kubernetes", "GitHub Actions", "CI/CD", "Render", "Vercel", "Cloudflare", "Infisical", "Terraform", "Linux", "OpenTelemetry", "Prometheus · Grafana · Loki · Tempo"],
    },
    {
      id: "integrations",
      proof: "114",
      items: ["WhatsApp Business API", "Meta Cloud API", "Stripe", "Asaas", "Salesforce", "HubSpot", "Airtable", "Google Workspace", "Microsoft 365", "Nango (OAuth)", "Webhooks / REST", "OAuth2", "MCP", "SQS"],
    },
    {
      id: "security",
      proof: "870",
      items: ["NextAuth / Better Auth", "JWT / JWKS", "OAuth2 / OIDC", "SSO por organização", "2FA (TOTP)", "RBAC por escopo", "Auditoria obrigatória", "DLP", "AES-256-GCM", "Cookies HttpOnly", "Rate Limiting", "CORS", "Helmet", "SSRF guard", "Isolamento por tenant"],
    },
    {
      id: "quality",
      proof: "25.937",
      items: ["Clean Code", "SOLID", "Feature-Sliced", "Code Review", "ADRs", "Conventional Commits", "Jest", "Vitest", "Playwright", "Esteira com agentes (8 eixos)", "Quality ratchet", "Sentry", "Datadog"],
    },
  ],
  /** marquee strip: the headline technologies only (the full list is in the stack grid) */
  marquee: ["Next.js", "React", "TypeScript", "Node.js", "NestJS", "Python", "FastAPI", "Go", "PostgreSQL", "pgvector", "MongoDB", "Redis", "AWS", "Docker", "Kubernetes", "Cloudflare", "OpenTelemetry", "Vercel AI SDK", "MCP", "LangChain", "Kestra"],
} as const;
