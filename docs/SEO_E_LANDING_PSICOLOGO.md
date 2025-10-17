# SEO e Landing Page para Psicólogos

## 📋 Resumo das Implementações

Este documento descreve as implementações de SEO (Sitemap e Robots.txt) e a Landing Page dedicada para psicólogos.

---

## 🔍 SEO - Sitemap e Robots.txt

### Sitemap (`/sitemap.xml`)

O sitemap foi implementado usando a API do Next.js 13+ e lista todas as páginas públicas e autenticadas do site.

**Arquivo:** `app/sitemap.ts`

**Páginas incluídas:**
- `/` - Página inicial (prioridade 1.0)
- `/login` - Login (prioridade 0.8)
- `/para-psicologos` - Landing para psicólogos (prioridade 0.9)
- `/home` - Home autenticado (prioridade 0.7)
- `/dia` - Registro diário (prioridade 0.7)
- `/historico` - Histórico (prioridade 0.6)
- `/prontuarios` - Prontuários (prioridade 0.6)
- `/perfil` - Perfil do usuário (prioridade 0.5)
- `/registrar` - Registrar mood (prioridade 0.6)

**Acesso:** `https://seudominio.com/sitemap.xml`

**Configuração:**
Defina a variável de ambiente `NEXT_PUBLIC_APP_URL` com a URL de produção:
```bash
NEXT_PUBLIC_APP_URL="https://seudominio.com"
```

### Robots.txt (`/robots.txt`)

O robots.txt foi implementado para controlar o acesso dos crawlers às páginas do site.

**Arquivo:** `app/robots.ts`

**Configuração:**
- ✅ **Permitido:** `/`, `/login`, `/para-psicologos`
- ❌ **Bloqueado:** `/api/`, `/home`, `/dia/`, `/historico`, `/prontuarios`, `/perfil`, `/registrar`

**Acesso:** `https://seudominio.com/robots.txt`

---

## 🧠 Landing Page para Psicólogos

### Visão Geral

Uma landing page completa e profissional dedicada a capturar leads de psicólogos interessados em ter uma plataforma white-label customizada para seus pacientes.

**URL:** `/para-psicologos`

**Arquivo:** `app/para-psicologos/page.tsx`

### Recursos da Landing Page

#### 1. **Seções da Página**

- **Hero Section:**
  - Título chamativo sobre a solução white-label
  - Subtítulo explicando os benefícios
  - Badge "Para Profissionais da Saúde Mental"

- **Benefícios (6 cards):**
  - ✨ Personalização Completa
  - 👥 Gestão de Pacientes
  - 📊 Relatórios Detalhados
  - 🛡️ Total Privacidade
  - ✨ IA Integrada
  - ⏰ Acompanhamento Contínuo

- **Recursos da Plataforma (4 cards detalhados):**
  - 📄 Prontuários com IA
  - ❤️ Diário Emocional
  - 📊 Dashboard Profissional
  - 🛡️ Segurança e Conformidade

- **Formulário de Captura de Leads:**
  - Nome completo (obrigatório)
  - CRP - Registro profissional (opcional)
  - E-mail (obrigatório)
  - Telefone (obrigatório)
  - Mensagem personalizada (opcional)
  - Estado de sucesso após envio

#### 2. **Formulário Interativo**

**Campos:**
```typescript
{
  name: string;      // Nome completo
  email: string;     // E-mail profissional
  phone: string;     // Telefone com DDD
  crp: string;       // CRP (opcional)
  message: string;   // Mensagem personalizada (opcional)
}
```

**Validações:**
- Nome, e-mail e telefone obrigatórios
- Validação de formato de e-mail
- Feedback visual de loading durante envio
- Mensagem de sucesso após envio
- Toast notifications para feedback

#### 3. **Design Responsivo**

- Layout otimizado para mobile, tablet e desktop
- Animações suaves e transições
- Cores harmoniosas usando o design system
- Ícones do Lucide React
- Cards com gradientes sutis

---

## 🗄️ Banco de Dados - Leads de Psicólogos

### Model no Prisma

**Arquivo:** `prisma/schema.prisma`

```prisma
enum PsychologistLeadStatus {
  NEW
  CONTACTED
  DEMO_SCHEDULED
  DEMO_COMPLETED
  PROPOSAL_SENT
  CONVERTED
  LOST
}

enum PsychologistLeadSource {
  WEBSITE
  REFERRAL
  SOCIAL_MEDIA
  OTHER
}

model PsychologistLead {
  id        String                   @id @default(uuid())
  name      String
  email     String
  phone     String
  crp       String?
  message   String?                  @db.Text
  status    PsychologistLeadStatus   @default(NEW)
  source    PsychologistLeadSource   @default(WEBSITE)
  notes     String?                  @db.Text
  createdAt DateTime                 @default(now())
  updatedAt DateTime                 @updatedAt
  
  @@index([status, createdAt])
  @@index([email])
  @@map("psychologist_leads")
}
```

### Campos Explicados

- **id**: UUID único do lead
- **name**: Nome completo do psicólogo
- **email**: E-mail de contato
- **phone**: Telefone para contato
- **crp**: Registro no Conselho Regional de Psicologia (opcional)
- **message**: Mensagem enviada pelo psicólogo (opcional)
- **status**: Status do lead no funil de vendas
- **source**: Origem do lead (padrão: WEBSITE)
- **notes**: Notas internas da equipe de vendas (opcional)
- **createdAt**: Data de criação
- **updatedAt**: Data de última atualização

### Índices

- `[status, createdAt]`: Para filtrar leads por status e ordenar por data
- `[email]`: Para buscar leads específicos por e-mail

---

## 🚀 API - Endpoint de Captura de Leads

### Endpoint POST

**URL:** `/api/psychologist-leads`

**Arquivo:** `app/api/psychologist-leads/route.ts`

**Método:** POST

**Body:**
```json
{
  "name": "Dr. João Silva",
  "email": "joao@email.com",
  "phone": "(11) 98765-4321",
  "crp": "06/12345",
  "message": "Gostaria de saber mais sobre a solução white-label"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Lead capturado com sucesso",
  "id": "uuid-do-lead"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Nome, e-mail e telefone são obrigatórios"
}
```

### Endpoint GET (Lista de Leads)

**URL:** `/api/psychologist-leads`

**Método:** GET

**Autenticação:** Requer admin (TODO: Implementar)

**Resposta:**
```json
{
  "leads": [
    {
      "id": "uuid",
      "name": "Dr. João Silva",
      "email": "joao@email.com",
      "phone": "(11) 98765-4321",
      "crp": "06/12345",
      "message": "...",
      "status": "NEW",
      "source": "WEBSITE",
      "createdAt": "2025-10-17T...",
      "updatedAt": "2025-10-17T..."
    }
  ]
}
```

---

## 📝 Próximos Passos (TODOs)

### 1. **Executar Migration**

Antes de usar em produção, execute a migration para criar a tabela:

```bash
# Desenvolvimento
npx prisma migrate dev --name add_psychologist_leads_table

# Produção
npx prisma migrate deploy
```

### 2. **Configurar Variáveis de Ambiente**

No arquivo `.env.local` (produção), adicione:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # Para Vercel/connection pooling
NEXT_PUBLIC_APP_URL="https://seudominio.com"
```

### 3. **Implementar Notificações por E-mail**

Adicione integração com serviço de e-mail (SendGrid, Resend, etc.):

```typescript
// No arquivo: app/api/psychologist-leads/route.ts
// TODO: Descomentar e implementar

// Enviar e-mail para a equipe
await sendEmail({
  to: 'vendas@meuhumor.com',
  subject: 'Novo Lead - Psicólogo',
  html: `<p>Novo lead capturado: ${name}</p>...`
});

// Enviar e-mail de confirmação para o psicólogo
await sendEmail({
  to: email,
  subject: 'Recebemos sua solicitação',
  html: `<p>Olá ${name}, recebemos sua solicitação...</p>`
});
```

### 4. **Implementar Dashboard de Leads**

Criar página admin para visualizar e gerenciar leads:

**URL sugerida:** `/admin/leads/psicologos`

**Recursos:**
- Listar todos os leads
- Filtrar por status
- Adicionar notas internas
- Mudar status do lead
- Exportar para CSV
- Estatísticas de conversão

### 5. **Adicionar Autenticação Admin no GET**

No endpoint GET de `/api/psychologist-leads`:

```typescript
// Adicionar verificação de admin
const session = await getServerSession(authOptions);
if (!session?.user?.isAdmin) {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
}
```

### 6. **Implementar CRM Simples**

Criar sistema de gerenciamento de relacionamento com leads:
- Pipeline visual (Kanban)
- Histórico de interações
- Agendamento de follow-ups
- Integração com calendário

### 7. **Analytics**

Adicionar tracking para medir:
- Taxa de conversão do formulário
- Origem dos leads
- Tempo médio até conversão
- ROI de campanhas

---

## 🎯 Integração com a Landing Principal

A landing page de psicólogos está integrada na página principal (`app/page.tsx`):

**No Header:**
- Link "Para Psicólogos" visível no desktop

**No Footer:**
- Link "Para Psicólogos" sempre visível

**Sugestão futura:**
- Adicionar seção na landing principal destacando a solução B2B
- Criar página de cases de sucesso
- Adicionar depoimentos de psicólogos

---

## 🔒 Segurança e Privacidade

### Validações Implementadas

- ✅ Validação de formato de e-mail
- ✅ Campos obrigatórios
- ✅ Proteção contra injeção SQL (Prisma)
- ✅ Sanitização de inputs

### A Implementar

- [ ] Rate limiting (prevenir spam)
- [ ] CAPTCHA (Google reCAPTCHA ou hCaptcha)
- [ ] Validação de telefone
- [ ] Validação de CRP contra API do CFP
- [ ] Criptografia de dados sensíveis
- [ ] LGPD compliance (termos de uso)

---

## 📊 Métricas Recomendadas

Acompanhar no Google Analytics / Mixpanel:

1. **Tráfego:**
   - Pageviews de `/para-psicologos`
   - Taxa de rejeição
   - Tempo na página

2. **Conversão:**
   - Taxa de preenchimento do formulário
   - Taxa de envio bem-sucedido
   - Leads por fonte de tráfego

3. **Engajamento:**
   - Scroll depth
   - Clicks nos CTAs
   - Interações com os cards

---

## 🎨 Customizações Futuras

### Design
- Adicionar vídeo explicativo
- Galeria de screenshots da plataforma
- Animações mais elaboradas (Framer Motion)
- Modo escuro

### Conteúdo
- Seção de FAQ
- Planos e preços
- Comparação de features
- Estudos de caso

### Funcionalidades
- Chat ao vivo (Intercom, Drift)
- Agendamento direto de demo (Calendly)
- Download de material rico (e-book, guia)
- Teste grátis por 30 dias

---

## 📱 Teste em Produção

### Checklist antes do deploy:

- [ ] Testar formulário em diferentes dispositivos
- [ ] Verificar links de navegação
- [ ] Confirmar que sitemap.xml está acessível
- [ ] Confirmar que robots.txt está acessível
- [ ] Testar validações do formulário
- [ ] Verificar responsividade
- [ ] Testar performance (Lighthouse)
- [ ] Submeter sitemap no Google Search Console
- [ ] Submeter sitemap no Bing Webmaster Tools

---

## 🆘 Troubleshooting

### Sitemap não está acessível

1. Verifique se `NEXT_PUBLIC_APP_URL` está definido
2. Execute `npm run build` e verifique se há erros
3. Acesse `http://localhost:3000/sitemap.xml` em desenvolvimento

### Formulário não envia

1. Verifique se o banco de dados está conectado
2. Veja os logs no console do navegador
3. Verifique os logs do servidor
4. Confirme que a tabela `psychologist_leads` existe

### Migration falha

1. Verifique se `DATABASE_URL` e `DIRECT_URL` estão corretos
2. Execute `npx prisma generate` primeiro
3. Tente `npx prisma db push` como alternativa

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Next.js: https://nextjs.org/docs
- Documentação do Prisma: https://www.prisma.io/docs
- Issues do projeto no GitHub

---

**Última atualização:** 17 de outubro de 2025

