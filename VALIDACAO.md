# Validação do redesign v3 ("Palco à venda")

Guia para você revisar o redesign **antes** de ele ir para produção. Worktree `Portfolio-redesign`, branch
`redesign-v3`. Nada foi commitado nem enviado. O repositório de produção (`Portfolio`) não foi alterado.

Referência técnica completa: [`docs/REDESIGN.md`](docs/REDESIGN.md). Screenshots da revisão: `.qa-shots/`
(ignorada pelo git).

---

## 1. Como rodar localmente

Pré-requisitos: **Node 22** (a máquina tem `C:\ProgramData\nvm\v22.22.3`) e o pnpm 11 via corepack.
O `package.json` pede Node ≥ 24 (`engines`). Por isso os comandos abaixo passam `--config.engine-strict=false`.
No Node 24 essa flag não é necessária.

Git Bash:

```bash
cd /c/Users/Users/Documents/github/Portfolio-redesign
export PATH="/c/ProgramData/nvm/v22.22.3:$PATH"
PNPM="node C:/Users/Users/AppData/Local/node/corepack/v1/pnpm/11.8.0/dist/pnpm.mjs --config.engine-strict=false --config.minimum-release-age=0"

$PNPM install                 # instala pelo pnpm-lock.yaml
cp .env.example .env.local    # todas as chaves vazias = modo demonstração
$PNPM dev                     # http://localhost:3000  (pt em /, inglês em /en, espanhol em /es)
```

Verificações (os mesmos comandos usados nesta revisão):

```bash
node node_modules/typescript/bin/tsc --noEmit        # tipos
node node_modules/next/dist/bin/next lint --dir .    # lint do projeto inteiro
node node_modules/jest/bin/jest.js                   # testes (60)
node node_modules/next/dist/bin/next build           # build de produção em .next
node node_modules/next/dist/bin/next start -p 3000   # servidor de produção local
```

- **`dev` × `start` sem chaves:** em `dev`, o formulário de cotação sem `RESEND_API_KEY` registra o pedido no
  terminal e mostra "Solicitação enviada". Em `start` (produção), a mesma situação responde `503` e o formulário
  mostra "Não foi possível enviar agora… escreva para <e-mail>". É proposital: em produção um pedido nunca é
  descartado em silêncio. Para testar o fluxo completo sem chaves, use `dev`.
- O build baixa as fontes do Google (Funnel Display, Host Grotesk, Geist Mono) uma vez, então precisa de internet.
- `NEXT_DIST_DIR` (opcional, em `next.config.mjs`) muda a pasta de build, por exemplo para rodar dois servidores na
  mesma pasta. Sem a variável, o build vai para `.next`. Na Vercel ela não é definida.
- `pnpm-workspace.yaml` só existe por causa do pnpm 10/11, que bloqueia scripts de build de dependências e pergunta
  quais liberar. O arquivo responde "não" para todos (`allowBuilds: false`): sharp, unrs-resolver e os demais usam
  binários pré-compilados. O pnpm 9 ignora o arquivo.

---

## 2. O que testar

Faça cada item em **pt, en e es**, em **tema claro e escuro**, no **desktop (≥1280)** e no **celular (~390)**.
Para testar movimento reduzido, ative "Reduzir movimento" no sistema operacional (as animações param no quadro final).

### Home `/`
- [ ] Hero: o único `h1`, relógio de São Paulo, links GitHub/LinkedIn e o botão "Falar com a Órbita" abrindo o chat.
- [ ] 01 Produtos (palco, `#projects`): 6 capítulos com autoplay, Pausar/Retomar, ‹ ›, barras. Passar o mouse ou o
      foco pausa só o relógio. Com movimento reduzido não há autoplay.
      - Órbita → "Estudo de caso" abre `/projetos/orbita`.
      - Os demais → "Quero algo assim" leva à cotação já preenchida com a referência.
- [ ] Números, depois "Todos os produtos" (`#todos-os-produtos`).
      - Os chips de categoria mudam `?cat=` na URL, a busca filtra e o preview aparece no hover (≥1024).
      - "Estudo de caso" só aparece em projetos com página. VibeCoding e os projetos só do grid levam ao GitHub ou
        não têm link.
- [ ] 02 Serviços (modelos + "O que eu construo"), Processo, 03 Experiência (o accordion abre um por vez, com
      Adalink aberto de início), 04 Sobre.
- [ ] 05 Contato: chat inline da Órbita (≥1024) ou cartão (celular), canais (o botão copiar e-mail mostra
      "copiado") e o formulário de cotação `#cotacao`.

### Formulário de cotação (home e `/contratar`)
- [ ] Passos 1→5: erro ao avançar sem escolher; "Outro" exige texto; a descrição exige ≥ 20 caracteres.
      Voltar e avançar mantém o que foi digitado.
- [ ] Passo 5: nome, e-mail e consentimento obrigatórios. O link "Política de privacidade" abre `/privacidade`.
- [ ] Enviar (em `dev`): passo 6 com horários ilustrativos (nota "horários ilustrativos"). Ao escolher e confirmar,
      aparece o cartão de espera. "Prefiro aguardar o e-mail" também funciona.
- [ ] Pré-preenchimento: `/?tipo=orbitmind#cotacao`, `/contratar?formato=project#cotacao` e o chip
      "Referência: …", que pode ser removido.
- [ ] Anti-spam: 5 envios em 10 min por IP; o 6º mostra "Muitas tentativas".

### Órbita (widget)
- [ ] Desktop: pílula no canto inferior direito, painel não modal (Esc fecha e o foco volta ao botão).
      Celular: botão redondo e folha modal (fundo escurecido, a página não rola, a alça fecha).
- [ ] Faixa "Modo demonstração" sem `ANTHROPIC_API_KEY`. Roteiro completo:
      1. "Conhecer os projetos" → "Tenho um projeto".
      2. Enviar o rascunho digitado.
      3. "Projeto específico" → "O quanto antes".
      4. Escolher um horário, preencher nome/e-mail e marcar o consentimento.
      5. Aparece "Conversa marcada" com a nota "Demonstração: nenhum convite foi enviado".
- [ ] O link "Privacidade" do aviso de IA abre `/privacidade` sem perder a conversa.
- [ ] O botão some quando o formulário de cotação ou os controles do palco chegam no canto dele.

### `/contratar`
- [ ] Um `h1`, comparação de modelos (#modelos), o que eu construo, processo + método, cotação e FAQ (accordion).
- [ ] O breadcrumb "Início" volta para a home.

### Estudos de caso `/projetos/orbita`, `/orbitmind`, `/nex`, `/orbitfinance`, `/vektus`
- [ ] Capa com leve inclinação ao mover o mouse (desligada com movimento reduzido), sumário fixo com a seção ativa,
      diagramas (Pausar, tooltips no hover/foco, versão empilhada abaixo de 1200px), galeria com lightbox (←/→, Esc).
- [ ] "Próximo estudo de caso" circula: orbita → orbitmind → nex → orbitfinance → vektus → orbita.
- [ ] `/projetos/vibecoding` ou qualquer outro slug → 404 do site (com cabeçalho e rodapé).

### `/privacidade` (nova)
- [ ] Texto nos 3 idiomas. Os trechos entre colchetes aparecem destacados (é o que você precisa preencher, §7).
- [ ] Link no rodapé (linha do ©), no consentimento da cotação e no aviso do chat.

### Transversais
- [ ] Seletor de idioma (cabeçalho e rodapé) mantém a página: `/contratar` → `/en/contratar` → `/es/contratar`.
- [ ] Botão de tema: alterna, persiste ao navegar e ao recarregar. O padrão segue o sistema.
- [ ] Teclado: o primeiro Tab mostra "Pular para o conteúdo"; a ordem segue marca → navegação → idioma → tema → CTA.
- [ ] 404: `/qualquer-coisa` mostra a página "não encontrada" do site.
- [ ] Sem rolagem horizontal em 320px.

---

## 3. Modo real: variáveis de ambiente

Todas estão documentadas em `.env.example`. Localmente vão em `.env.local`; na Vercel, em Settings → Environment
Variables (Production e Preview).

| Integração | Variáveis | Sem elas |
|---|---|---|
| E-mail (cotação, horário, leads da Órbita) | `RESEND_API_KEY`, `CONTACT_EMAIL` (destino), `RESEND_FROM_EMAIL` (remetente de domínio verificado; sem ele não sai e-mail de confirmação ao visitante), `QUOTE_CONFIRMATION_EMAIL=off` (opcional) | `dev`: registra no terminal · `start`/Vercel: 503 com mensagem ao visitante |
| Chat com IA | `ANTHROPIC_API_KEY`, `ORBITA_MODEL` (padrão `claude-opus-5`), `ORBITA_EFFORT` (padrão `low`), `ORBITA_MAX_TOKENS`, `ORBITA_FALLBACKS`, `ORBITA_RATE_CHAT_PER_MIN/HOUR` | conversa roteirizada (demo) |
| Agenda | `WESLEY_CALENDAR_ID` + opção A (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`) ou opção B (conta de serviço Workspace), `ORBITA_BOOKING_MODE` (`auto` ou `aprovacao`), `ORBITA_TIMEZONE`, `ORBITA_WORK_DAYS`, `ORBITA_WORK_HOURS`, `ORBITA_SLOT_MINUTES`, `ORBITA_LOOKAHEAD_DAYS`, `ORBITA_MIN_NOTICE_HOURS`, `ORBITA_BUFFER_MINUTES`, `ORBITA_NOTIFY_EMAIL` | horários fictícios; nada é gravado |
| Site | `NEXT_PUBLIC_SITE_URL` (canonical, sitemap, OG) | `https://wesley-santos.dev` |

Para conferir o estado: `GET /api/orbita/chat` responde `{ chat: "live"|"demo", calendar: "live"|"demo", bookingMode, … }`.

**Custo do chat (preços por 1 milhão de tokens, entrada/saída):** Claude Opus 5 US$ 5 / US$ 25 (padrão,
melhor qualidade) · Claude Sonnet 5 US$ 2 / US$ 10 (≈ 2,5× mais barato) · Claude Haiku 4.5 US$ 1 / US$ 5
(≈ 5× mais barato). O prompt de sistema e a base de conhecimento ficam em cache, então conversas repetidas pagam
só uma fração da entrada. Para trocar de modelo, defina `ORBITA_MODEL`. No Haiku 4.5 o código omite automaticamente
os parâmetros que ele não aceita (pensamento adaptativo e `effort`). Configure também um limite de gasto no
console da Anthropic.

### Refresh token do Google (opção A, Gmail pessoal, escopos mínimos)

Escopos usados pelo código: `https://www.googleapis.com/auth/calendar.freebusy` (ler só livre/ocupado) e
`https://www.googleapis.com/auth/calendar.events` (criar o evento com convite e Meet). Nenhum outro.

1. Em <https://console.cloud.google.com>, crie um projeto (por exemplo "site-agenda") e ative a **Google Calendar API**
   (APIs e serviços → Biblioteca).
2. **Tela de consentimento OAuth**:
   - Tipo "Externo". Informe o nome do app e o seu e-mail.
   - Em "Escopos", adicione só os dois acima.
   - Em "Usuários de teste", adicione o e-mail dono da agenda.
   - Depois **publique o app ("Em produção")**. Em modo "Teste" o refresh token expira em 7 dias. O Google vai
     avisar "app não verificado" na hora de autorizar; para uso próprio basta seguir em "Avançado → continuar".
3. **Credenciais → Criar credenciais → ID do cliente OAuth**, tipo "Aplicativo da Web". Em "URIs de redirecionamento
   autorizados", coloque `https://developers.google.com/oauthplayground`. Guarde o Client ID e o Client secret.
4. Em <https://developers.google.com/oauthplayground>:
   1. Engrenagem → marque "Use your own OAuth credentials" → cole o ID e o secret.
   2. No passo 1, digite os dois escopos (separados por espaço) → "Authorize APIs" → entre com a conta dona da agenda.
   3. No passo 2, clique "Exchange authorization code for tokens" e copie o **refresh_token**.
5. Preencha `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` e `WESLEY_CALENDAR_ID` (o seu e-mail
   para a agenda principal). Reinicie o servidor.
6. Teste com `GET /api/orbita/chat` (deve mostrar `calendar: "live"`) e `GET /api/orbita/slots?days=3&perDay=8`.
   Comece com `ORBITA_BOOKING_MODE=aprovacao`: cria só um bloqueio provisório na agenda, sem convidar ninguém, e te
   avisa por e-mail. Mude para `auto` quando estiver confiante.
7. Para revogar: <https://myaccount.google.com/permissions> → remova o app. Depois gere um token novo.

---

## 4. O que muda em relação à produção

**Rotas**

| Produção (`main`) | Redesign |
|---|---|
| `/` (pt), `/en`, `/es` — página única | `/`, `/en`, `/es` (home nova) |
| — | `/contratar` (+ `/en`, `/es`) — como trabalhar comigo + cotação + FAQ |
| — | `/projetos/orbita`, `/orbitmind`, `/nex`, `/orbitfinance`, `/vektus` (× 3 idiomas); outros slugs dão 404 |
| — | `/privacidade` (× 3 idiomas) |
| `/api/contact` | mantida (corrigida para não quebrar o build sem chave), mas **nenhuma tela usa mais** — decidir se remove |
| — | `/api/quote`, `/api/quote/slot`, `/api/orbita/chat`, `/api/orbita/slots`, `/api/orbita/book` |
| 404 padrão do Next | 404 do site dentro do layout (cabeçalho, rodapé, tema) |

O sitemap inclui todas as páginas novas com `hreflang`.

**Seções removidas:** galáxia 3D e linha do tempo 3D, interface interativa e as 6 demos (partículas, cubo, matrix,
rede neural, gráfico, jogo), barra de busca, galeria, "Solutions", árvore de projetos, formulário de contato antigo
(trocado pela cotação em passos + canais diretos), botões e efeitos da v2 (spotlight, sparkles, moving border etc.).

**Dependências removidas** (32; nenhuma era importada pelo código novo):
`three`, `@react-three/{fiber,drei,cannon,postprocessing}`, `@types/three`, `gsap`, `framer-motion`, `lottie-react`,
`i18next`, `react-i18next`, `i18next-browser-languagedetector`, `jotai`, `react-window`, `@types/react-window`,
`@tabler/icons-react`, `react-icons`, `class-variance-authority`, `date-fns`, `react-intersection-observer`,
`web-vitals`, `@radix-ui/{react-scroll-area,react-select,react-switch}`, `react-hook-form`, `@hookform/resolvers`,
`tailwindcss-animate`, `@rocketseat/eslint-config`, `@testing-library/{react,user-event}`, `vitest`, `@vitest/ui`.
Também saíram `vitest.config.ts` e `src/utils/*` (código morto da v2, junto com o teste dele).
**Adicionada:** `@anthropic-ai/sdk`. Continuam: next, next-intl, next-themes, @radix-ui/react-dialog, lucide-react,
resend, zod, clsx, tailwind-merge, @vercel/analytics, @vercel/speed-insights.

**Peso (build de produção, medido nesta revisão):** ver a tabela em §5.

---

## 5. Resultado da verificação (integração)

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | 0 erros |
| `next lint --dir .` | 0 avisos, 0 erros |
| `jest` | 6 suítes, 60 testes, todos passando (inclui `case-links.test.ts`: nenhum link de estudo de caso pode dar 404) |
| `next build` limpo em `.next` | ok, 31 páginas estáticas + rotas de API |
| Varredura de links (build rodando) | todas as páginas nos 3 idiomas: nenhum link interno quebrado nem âncora inexistente. Exceção conhecida: `#URL-DO-SITE-DA-ORBITMIND` (placeholder) |

**Build — rotas (First Load JS):**

| Rota | Produção (`main`, 2bd9480) | Redesign |
|---|---|---|
| `/[locale]` (home) | 39,9 kB · **202 kB** | 7,68 kB · **199 kB** |
| `/[locale]/contratar` | — | 1,62 kB · 182 kB |
| `/[locale]/projetos/[slug]` | — | 7,86 kB · 156 kB |
| `/[locale]/privacidade` | — | 0,17 kB · 125 kB |
| JS compartilhado | 106 kB | 105 kB |
| Middleware | 68,3 kB | **42,7 kB** |

A produção foi compilada a partir de uma cópia do `main` na pasta temporária (o repositório `Portfolio` não foi
tocado). Ela **não compila sem `RESEND_API_KEY`**, porque `/api/contact` cria o cliente Resend no carregamento do
módulo; foi usada uma chave fictícia só para o build. O redesign compila sem chave nenhuma.
O "First Load JS" da home parece igual, mas a produção carrega three.js, as demos etc. depois, por import dinâmico,
e isso não entra nesse número. A medição real abaixo mostra a diferença.

**Peso real transferido** (Chrome headless, cache desligado, home):

| Cenário | Produção | Redesign |
|---|---|---|
| Desktop 1440, rolando a página inteira: total | 808 KB | 775 KB |
| · JavaScript | **535 KB (35 arquivos)** | **229 KB (20 arquivos)** — −57% |
| · HTML / CSS / fontes | 21 / 13 / 0 KB | 69 / 36 / 60 KB |
| · Imagens | 214 KB | 136 KB |
| · Prefetch de rotas (RSC) | — | 219 KB (Next pré-carrega /contratar e os casos visíveis) |
| Celular 390, primeira dobra: total | 619 KB | 496 KB |
| · JavaScript | 533 KB | 227 KB |

Nesta revisão o catálogo de mensagens enviado ao navegador foi reduzido: os namespaces só de servidor (casos,
privacidade, metadados) saíram do payload do cliente, cerca de 40% do catálogo em cada página e em cada prefetch.
O middleware também encolheu (de 146 kB para 42,7 kB), porque a configuração de rotas foi separada da navegação.

**QA no navegador** (servidor de produção local + Chrome headless via DevTools Protocol):

- Matriz de 9 rotas (home, contratar, 5 casos, privacidade, 404) × pt/en/es × larguras 1440/1280/1120/1024/768/390/320
  × claro/escuro × movimento reduzido.
- Em cada combinação: erros de console e de hidratação, rolagem horizontal, imagens quebradas, elementos fixos
  sobrepostos, um único `h1` e ids duplicados.
- Interações: ordem de Tab no cabeçalho e skip link, persistência do tema, seletor de idioma, roteiro demo da Órbita
  (desktop e celular, Esc devolve o foco) e fluxo de cotação até o passo 7. A resposta do e-mail foi simulada; o
  caminho real sem chave (503) também foi testado.

**Resultado final: as 135 combinações passaram**, com zero erros de console/hidratação, zero rolagem horizontal,
zero imagens quebradas, zero sobreposição de elementos fixos, um `h1` por página e nenhum id duplicado.
As interações também passaram:
- Tab: skip link → marca → 5 itens da navegação → PT/ES/EN → tema → CTA.
- O tema persiste entre páginas e ao recarregar.
- O idioma mantém a página em /contratar, /projetos/nex e /privacidade.
- Órbita demo até "Conversa marcada" (desktop e celular).
- Cotação passo 1→7 (home e /contratar), e mensagem amigável no 503.

Corrigido durante a QA:
1. **404 quebrado.** Qualquer rota inexistente (e `/projetos/<slug-desconhecido>`) caía no 404 global do Next sem
   `<html>/<body>`: erro de hidratação React #418, sem cabeçalho nem rodapé. Agora usa o 404 do site em cada idioma,
   com título próprio (`app/[locale]/[...rest]` + `dynamicParams` no case + `app/not-found.tsx` de reserva).
2. **Rolagem horizontal de 8–16px em 1024px** nos casos Órbita e OrbitFinance (legenda do cartão de mecanismo). A
   legenda agora quebra para baixo quando falta largura.
3. **Links de estudo de caso** (palco, tabela, próximo caso) agora passam por `caseLinkFor`, com teste que garante que
   nenhum dá 404.
4. **Payload e middleware menores** (ver acima).

Screenshots finais em `.qa-shots/`:
- páginas inteiras em 1440 e 390: home, contratar, 5 casos, privacidade, 404;
- home escura; /en/privacidade escura;
- Órbita aberta, cotação e palco em viewport.

Nas capturas de página inteira o palco (01 Produtos) aparece escuro, porque só anima quando entra na tela. Veja
`stage-1440.png` e `stage-390.png`.

---

## 6. Lacunas conhecidas / não verificado

- **APIs reais não testadas ao vivo.**
  - Resend (envio real), Anthropic (chat em streaming com chave) e Google Calendar (livre/ocupado, criação de evento
    e Meet) só foram exercitados por testes unitários com mocks e pelo modo demo.
  - Antes de publicar, teste com as chaves num preview da Vercel.
- **Deploy na Vercel não testado.** O `vercel.json` usa `pnpm install`/`pnpm build`. Confira a versão do Node do
  projeto na Vercel (o `.nvmrc` diz 24).
- **Acessibilidade:** a ordem de foco, os rótulos e o `aria` foram checados automaticamente. Não houve teste com leitor
  de tela real (NVDA/VoiceOver) nem em aparelhos reais (Safari iOS, Android).
- **Lighthouse/Core Web Vitals** não foram medidos. Localmente o script `/_vercel/insights` dá 404, o que é normal
  fora da Vercel.
- O rate limit (cotação e chat) fica em memória por instância: é uma proteção "melhor esforço", não global.
- Comportamento do next-intl (esperado): depois de escolher EN/ES, o cookie `NEXT_LOCALE` faz um link sem prefixo
  (ex.: `/contratar`) redirecionar para `/en/contratar`. Para voltar ao português, use o seletor (PT).
- `next lint` está deprecado no Next 15.5+/16. Funciona no 15.1 usado aqui.

---

## 7. Decisões que continuam com você

**Placeholders visíveis no site** (aparecem entre colchetes; na `/privacidade` ficam destacados):
- `[URL DO SITE DA ORBITMIND]`: o link "OrbitMind ↗" no hero, no contato, no rodapé e no case aponta para
  `#URL-DO-SITE-DA-ORBITMIND`, que não leva a lugar nenhum.
- `[RETENÇÃO]`: dica do chat e política.
- `[PRAZO DE RESPOSTA]`.
- `[LINK DO GOOGLE MEET]`: só no demo.
- Na `/privacidade`: `[ENTIDADE-CONTRATANTE …]`, `[DATA DE PUBLICAÇÃO]` e os três `[REVISAR: …]` (bases legais,
  retenção da Anthropic, prazos).
- A política é um rascunho. Vale uma revisão jurídica rápida (LGPD, transferência internacional para EUA).

**Do v3spec §13 (resumo):**
- A. Posicionamento e texto:
  - escolha do H1;
  - aprovar os textos novos e as traduções EN/ES (cards de modelo, processo, FAQ, "Método AI-native", Sobre, roteiro
    do chat, microcopy);
  - entidade contratante (Orbitmind Tecnologia LTDA? CNPJ? "contrate a OrbitMind" ou "o Wesley");
  - data de fundação e logo da OrbitMind (o "OM" é provisório);
  - "desde 2015";
  - stack sem Go.
- B. **Maior risco: vínculo com empregadores.**
  - Oferecer contratação sendo Tech Lead na REVOLUNA e na Adalink: verificar exclusividade, não concorrência e PI.
  - Confirmar por escrito com a Adalink o nome "OrbitMind", a origem de código e os números (datas, ~70% dos commits,
    20 microsserviços, ~1.800 endpoints, 16 ADRs), além do subcaso anonimizado.
  - REVOLUNA: nome, logo e o caso anonimizado.
  - Trabalhos de clientes: excluídos por padrão.
  - Rubrica: continua excluída.
- C. Projetos:
  - confirmar que os repositórios públicos são os canônicos (Orbita, orbitmind-platform, OrbitFinance,
    OrbitMind-VibeCoding, Vektus, InfluencerAI);
  - FSJPII está "Em produção"? O crédito ao coautor está ok?
  - corrigir o "700+ integrações" da landing da OrbitMind (o verificado é 39);
  - números aproximados (1.000+, 1.258);
  - screenshots (saudação "Wesley", gasto "US$ 0,44", marca de cliente em ecommerce.png).
- D. Órbita:
  - modo de agendamento (`auto` × `aprovacao`);
  - OAuth do Google (§3 acima);
  - modelo e custo (§3);
  - Turnstile e limite diário de custo ainda não existem (hoje só há rate limit por IP);
  - alternativa Cal.com/Calendly.
- E. Cotação:
  - faixas de orçamento ocultas (hoje "discutir na conversa");
  - reenviar para o `POST /api/quote-requests` da OrbitMind?
  - o visitante fictício "Ana Ribeiro / Clínica Exemplo" e os horários fictícios no demo estão ok?

**Das implementações:**
- Remover a rota `/api/contact`, que não é mais usada?
- VibeCoding ficou sem estudo de caso (material verificado insuficiente). O link cai no GitHub.
- Confirmar o e-mail do visitante: exige `RESEND_FROM_EMAIL` com domínio verificado no Resend.

---

## 8. Como promover para produção (quando aprovar — não foi feito)

1. Revise o diff inteiro no worktree:
   ```bash
   cd /c/Users/Users/Documents/github/Portfolio-redesign
   git status
   git diff main --stat
   ```
   Arquivos novos aparecem como `??`.
2. Preencha os placeholders do §7 (mensagens em `messages/{pt,en,es}.json`; URL da OrbitMind em
   `src/content/site.ts`) e rode de novo `tsc`, `lint`, `jest` e `build`.
3. Faça commit **na branch `redesign-v3`**:
   ```bash
   git add -A
   git commit -m "feat: redesign v3"
   git push -u origin redesign-v3
   ```
   Conferir antes que `.env.local` e `.qa-shots/` não entram: os dois estão no `.gitignore`.
4. Abra um PR `redesign-v3 → main` (`gh pr create`). A Vercel gera um preview. Nele:
   1. cadastre as variáveis do §3 em **Preview**;
   2. teste o modo real (e-mail, chat, agenda em `aprovacao`);
   3. repita o checklist do §2.
5. Cadastre as variáveis em **Production** e faça o merge. Depois do deploy, confira `/api/orbita/chat`
   (`chat: "live"`) e envie uma cotação de teste.
6. Se algo der errado, reverta o merge na `main`. A versão anterior continua no histórico da Vercel ("Promote to
   Production" no deploy antigo).
