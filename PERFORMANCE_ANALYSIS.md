-

## 🔧 Super Admin System - Planejamento

### Funcionalidades Requeridas

#### 1. **Dashboard Principal**
- Login seguro (JWT + 2FA)
- Overview de conteúdo atual
- Métricas de performance em tempo real

#### 2. **Gestão de Conteúdo**

##### **Hero Section**
- Editar texto principal
- Upload de foto/avatar
- Ajustar call-to-action

##### **Projetos**
- CRUD completo de projetos
- Upload de imagens
- Gestão de tecnologias/tags
- Status (completed, in-progress, planning)

##### **Skills & Stack**
- Adicionar/remover tecnologias
- Ajustar níveis de proficiência
- Cores personalizadas para barras

##### **Galeria**
- Upload de imagens
- Organização por categorias
- Compressão automática

#### 3. **Sistema de Arquivos**
- CDN integration (AWS S3 ou Cloudinary)
- Otimização automática de imagens
- Backup automatizado

### Arquitetura Técnica

#### **Backend (API Routes Next.js)**
```
/api/auth/
  - login.ts
  - refresh.ts
  - logout.ts

/api/admin/
  - hero.ts
  - projects/
    - index.ts (GET, POST)
    - [id].ts (GET, PUT, DELETE)
  - skills.ts
  - gallery/
    - upload.ts
    - [id].ts

/api/upload/
  - images.ts
```

#### **Database Schema (PostgreSQL)**
```sql
-- Users (admin)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP
);

-- Hero Content
CREATE TABLE hero_content (
  id UUID PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  avatar_url VARCHAR(500),
  cta_text VARCHAR(100),
  updated_at TIMESTAMP
);

-- Projects (expandir schema atual)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  long_description TEXT,
  technologies JSONB,
  images JSONB,
  links JSONB,
  status VARCHAR(50),
  featured BOOLEAN,
  category VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  level INTEGER,
  color VARCHAR(10),
  category VARCHAR(50), -- 'technical' | 'leadership'
  created_at TIMESTAMP
);

-- Gallery
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  order_index INTEGER,
  created_at TIMESTAMP
);
```

#### **Frontend Admin Panel**
```
/admin/
  - dashboard/
  - hero/
  - projects/
    - new/
    - [id]/edit/
  - skills/
  - gallery/
  - translations/
    - [locale]/
  - settings/
```

### Tecnologias Recomendadas

#### **Core Stack**
- **Frontend:** Next.js 14, React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase ou Vercel Postgres)
- **Auth:** NextAuth.js com JWT
- **Upload:** Cloudinary ou AWS S3
- **UI Components:** Shadcn/ui, Framer Motion
- **i18n:** next-intl para internacionalização

#### **Segurança**
- Rate limiting (Upstash Redis)
- Input validation (Zod)
- CSRF protection
- File upload validation
- Image compression (Sharp)

## 🌍 Sistema de Internacionalização (i18n)

### Funcionalidades i18n

#### **1. Suporte a 3 Idiomas**
- **Português (PT-BR)** - Idioma principal
- **Espanhol (ES)** - Mercado LATAM
- **Inglês (EN)** - Mercado internacional

#### **2. Estrutura de Tradução**
```
/locales/
  pt/
    - common.json (navegação, botões, labels)
    - hero.json (seção hero)
    - projects.json (projetos)
    - experience.json (experiências)
    - about.json (sobre mim)
    - contact.json (contato)
  es/
    - [mesma estrutura]
  en/
    - [mesma estrutura]
```

#### **3. Database Schema para i18n**
```sql
-- Translations table
CREATE TABLE translations (
  id UUID PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  locale VARCHAR(5) NOT NULL,
  value TEXT NOT NULL,
  namespace VARCHAR(100) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(key, locale, namespace)
);

-- Hero content multilingual
CREATE TABLE hero_translations (
  id UUID PRIMARY KEY,
  hero_content_id UUID REFERENCES hero_content(id),
  locale VARCHAR(5) NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  cta_text VARCHAR(100),
  updated_at TIMESTAMP,
  UNIQUE(hero_content_id, locale)
);

-- Project translations
CREATE TABLE project_translations (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  long_description TEXT,
  updated_at TIMESTAMP,
  UNIQUE(project_id, locale)
);
```

#### **4. API Routes para i18n**
```
/api/admin/translations/
  - index.ts (GET, POST - listar/criar traduções)
  - [key].ts (GET, PUT, DELETE - gerenciar tradução específica)
  - batch.ts (POST - tradução em lote)
  - export.ts (GET - exportar traduções)
  - import.ts (POST - importar traduções)

/api/i18n/
  - [locale].ts (GET - obter todas traduções de um idioma)
  - sync.ts (POST - sincronizar com arquivos locais)
```

#### **5. Admin Panel i18n**
- **Editor de Traduções:** Interface visual para editar textos
- **Gestão de Idiomas:** Ativar/desativar idiomas
- **Tradução em Lote:** Traduzir múltiplas keys de uma vez
- **Export/Import:** Backup e sincronização de traduções
- **Preview Multi-idioma:** Visualizar site em diferentes idiomas

### Implementação Técnica

#### **1. Next-intl Setup**
```typescript
// next.config.js
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

module.exports = withNextIntl({
  // outras configurações
});

// i18n.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./locales/${locale}.json`)).default
}));

// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pt', 'es', 'en'],
  defaultLocale: 'pt',
  localePrefix: 'as-needed'
});
```

#### **2. Estrutura de URLs**
```
/ (português - padrão)
/es (espanhol)
/en (inglês)

/admin (sempre em português)
/admin/translations/pt
/admin/translations/es
/admin/translations/en
```

#### **3. Componente de Seletor de Idioma**
```typescript
const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: string) => {
    router.push(pathname, { locale });
  };

  return (
    <Select onValueChange={switchLanguage}>
      <SelectItem value="pt">🇧🇷 Português</SelectItem>
      <SelectItem value="es">🇪🇸 Español</SelectItem>
      <SelectItem value="en">🇺🇸 English</SelectItem>
    </Select>
  );
};
```

### Estratégia de Tradução

#### **1. Conteúdo Dinâmico vs Estático**
- **Estático:** Labels, navegação, botões (arquivos JSON)
- **Dinâmico:** Projetos, experiências, about (database)

#### **2. Fallback Strategy**
- Idioma não disponível → Português
- Tradução faltando → Exibir chave + warning no admin
- Conteúdo parcial → Mesclar com idioma padrão

#### **3. SEO Multilíngue**
- `hreflang` tags automáticas
- Sitemap por idioma
- Meta tags traduzidas
- Open Graph por idioma

### Performance i18n

#### **1. Otimizações**
- Lazy loading de traduções por namespace
- Cache de traduções no localStorage
- Bundle splitting por idioma
- CDN para arquivos de tradução

#### **2. Métricas**
- Tempo de carregamento por idioma
- Taxa de bounce por idioma
- Engajamento por região

### Cronograma de Implementação

#### **Sprint 1 (1 semana) - Foundation**
- Configurar database e Prisma
- Implementar autenticação
- Criar layout básico do admin

#### **Sprint 2 (1 semana) - Hero & Projects**
- Sistema de upload de imagens
- CRUD de projetos
- Edição do Hero

#### **Sprint 3 (1 semana) - Skills & Gallery**
- Gestão de skills/stack
- Sistema de galeria
- Testes e refinamentos

#### **Sprint 4 (1 semana) - Internacionalização (i18n)**
- **Setup next-intl:** Configuração base, middleware, estrutura de arquivos
- **Database i18n:** Schema multilíngue, migrations, seeds iniciais
- **API Routes:** Endpoints para traduções, CRUD multilíngue
- **Admin Panel i18n:** Editor visual, gestão de idiomas, preview
- **Frontend i18n:** Componentes traduzidos, seletor de idioma
- **SEO Multilíngue:** hreflang, sitemaps, meta tags por idioma
- **Fallback Strategy:** Sistema de fallback e cache de traduções

#### **Sprint 5 (3 dias) - Polish & Deploy**
- Testes de segurança
- Performance optimization
- Deploy e configuração

### Estimativa Total: **4-5 semanas**

---

*Análise realizada em: ${new Date().toLocaleDateString()}*
*Próxima revisão: Após implementação das correções da Fase 1*