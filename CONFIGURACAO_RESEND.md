# 📧 Guia de Configuração do Resend

Este guia vai te ajudar a configurar o Resend para que o formulário de contato funcione corretamente.

## ❓ Perguntas Frequentes

### Preciso contratar uma caixa de email?
**NÃO!** O Resend é um serviço de **envio** de emails (como SendGrid, Mailgun). Você não precisa contratar serviço de recebimento de emails. Os emails serão enviados para o seu Gmail (ou qualquer email que você configurar).

### Preciso verificar um domínio?
**NÃO é obrigatório!** Você pode usar o domínio padrão do Resend (`onboarding@resend.dev`) para sempre, sem custo adicional. A verificação de domínio é opcional e só necessária se você quiser que os emails apareçam como vindos do seu próprio domínio.

### O que eu realmente preciso fazer?
1. Criar conta no Resend (grátis)
2. Pegar a API Key
3. Adicionar na Vercel como variável de ambiente
4. Pronto! Já funciona! 🎉

## 🚀 Passo a Passo para Obter a API Key do Resend

### 1. Acesse o Dashboard do Resend

1. Acesse: [https://resend.com](https://resend.com)
2. Faça login na sua conta (ou crie uma se ainda não tiver)

### 2. Navegue até a Seção de API Keys

1. No dashboard, clique em **"API Keys"** no menu lateral esquerdo
2. Ou acesse diretamente: [https://resend.com/api-keys](https://resend.com/api-keys)

### 3. Criar uma Nova API Key

1. Clique no botão **"Create API Key"** ou **"Add API Key"**
2. Dê um nome descritivo para a chave (ex: "Portfolio Contact Form")
3. Selecione as permissões:
   - ✅ **Sending access** (acesso de envio)
4. Clique em **"Add"** ou **"Create"**

### 4. Copiar a API Key

⚠️ **IMPORTANTE**: A API Key será mostrada apenas UMA VEZ. Copie e guarde em local seguro!

1. A API Key aparecerá na tela (formato: `re_xxxxxxxxxxxxx`)
2. **Copie a chave completa** (clique no botão de copiar ou selecione e copie manualmente)
3. Guarde em um local seguro (gerenciador de senhas, por exemplo)

### 5. Configurar na Vercel

#### Opção A: Via Dashboard da Vercel (Recomendado)

1. Acesse o dashboard da Vercel: [https://vercel.com](https://vercel.com)
2. Selecione seu projeto **Portfolio**
3. Vá em **Settings** → **Environment Variables**
4. Clique em **"Add New"** ou **"Add"**
5. Preencha:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Cole a API Key que você copiou (formato: `re_xxxxxxxxxxxxx`)
   - **Environment**: Selecione todas as opções:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Clique em **"Save"**

#### Opção B: Via CLI da Vercel

```bash
vercel env add RESEND_API_KEY
```

Quando solicitado, cole a API Key e selecione os ambientes (Production, Preview, Development).

### 6. Configurar Email de Destino (Opcional)

Se quiser usar um email diferente do padrão (`wesleysantos.0095@gmail.com`):

1. Na Vercel, adicione outra variável de ambiente:
   - **Name**: `CONTACT_EMAIL`
   - **Value**: Seu email de destino (ex: `seu-email@gmail.com`)
   - **Environment**: Todas as opções

### 7. Configurar Email de Origem (OPCIONAL - Não é obrigatório!)

⚠️ **IMPORTANTE**: Você NÃO precisa verificar domínio para começar! O formulário já funciona com o domínio padrão do Resend.

#### Opção 1: Usar o Domínio Padrão do Resend (Recomendado para começar)

**Você pode usar para sempre sem custo adicional:**
- Email de origem: `onboarding@resend.dev` (já está configurado como padrão)
- **Não precisa fazer nada!** Já funciona assim.

#### Opção 2: Usar Seu Próprio Domínio (Opcional - Apenas se quiser)

**Só faça isso se:**
- Você já tem um domínio próprio (ex: `wesley-santos.dev`)
- Você quer que os emails apareçam como vindos do seu domínio
- **NÃO precisa contratar serviço de email!** O Resend apenas envia emails, não recebe.

**Como fazer (se quiser):**

1. **Verificar seu domínio no Resend**:
   - Acesse: [https://resend.com/domains](https://resend.com/domains)
   - Clique em **"Add Domain"**
   - Digite seu domínio (ex: `wesley-santos.dev`)
   - O Resend vai te dar alguns registros DNS para adicionar
   - Vá no seu provedor de domínio (GoDaddy, Namecheap, etc.) e adicione esses registros
   - Aguarde a verificação (pode levar alguns minutos a algumas horas)

2. **Configurar na Vercel** (só se verificou o domínio):
   - Adicione a variável de ambiente:
     - **Name**: `RESEND_FROM_EMAIL`
     - **Value**: `contact@seudominio.com` (use o domínio que você verificou)
     - **Environment**: Production

**Resumo:**
- ✅ **Para começar**: Não precisa fazer nada! Use `onboarding@resend.dev`
- ✅ **Para produção**: Pode continuar usando `onboarding@resend.dev` sem problemas
- ⚙️ **Opcional**: Só verifique domínio se quiser emails com seu próprio domínio

### 8. Fazer Deploy

Após configurar as variáveis de ambiente:

1. **Se já estiver em produção**: Faça um novo deploy
   - Vá em **Deployments** na Vercel
   - Clique nos três pontos (...) do último deployment
   - Selecione **"Redeploy"**

2. **Ou faça um commit e push**:
   ```bash
   git add .
   git commit -m "Configure Resend email service"
   git push
   ```

### 9. Testar o Formulário

1. Acesse seu site em produção
2. Vá até a seção de contato
3. Preencha o formulário com dados de teste
4. Envie a mensagem
5. Verifique se você recebeu o email!

## 🔍 Verificando se Está Funcionando

### No Dashboard do Resend:

1. Acesse: [https://resend.com/emails](https://resend.com/emails)
2. Você verá todos os emails enviados
3. Status de cada envio (entregue, falhou, etc.)

### Logs da Vercel:

1. No dashboard da Vercel, vá em **Deployments**
2. Clique no deployment mais recente
3. Vá em **"Functions"** → `/api/contact`
4. Veja os logs para verificar erros

## ⚠️ Troubleshooting

### Erro: "RESEND_API_KEY não está configurada"

- Verifique se a variável de ambiente está configurada na Vercel
- Certifique-se de que fez um novo deploy após adicionar a variável
- Verifique se o nome está exatamente: `RESEND_API_KEY` (case-sensitive)

### Erro: "Domain not verified"

- Você está tentando usar um domínio que não foi verificado no Resend
- Use `onboarding@resend.dev` para testes
- Ou verifique seu domínio no Resend primeiro

### Email não está chegando

- Verifique a pasta de spam
- Confira os logs no dashboard do Resend
- Verifique se o email de destino está correto
- Teste com o email padrão primeiro

## 📝 Resumo das Variáveis de Ambiente

| Variável | Obrigatória | Valor Exemplo | Descrição |
|----------|-------------|--------------|-----------|
| `RESEND_API_KEY` | ✅ Sim | `re_xxxxxxxxxxxxx` | API Key do Resend |
| `CONTACT_EMAIL` | ❌ Não | `wesleysantos.0095@gmail.com` | Email de destino (padrão já configurado) |
| `RESEND_FROM_EMAIL` | ❌ Não | `onboarding@resend.dev` | Email de origem (padrão já configurado) |

## 🎉 Pronto!

Após seguir esses passos, seu formulário de contato estará funcionando perfeitamente!

Qualquer dúvida, consulte a documentação do Resend: [https://resend.com/docs](https://resend.com/docs)

