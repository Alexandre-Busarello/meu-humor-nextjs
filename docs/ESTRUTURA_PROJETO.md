# 📁 Estrutura do Projeto - Meu Humor

Este documento descreve a organização completa de arquivos e pastas do projeto.

---

## 🗂️ Visão Geral

```
meu-humor-nextjs/
│
├── 📄 Arquivos de Configuração Raiz
├── 📚 docs/ (Documentação Organizada)
├── 🎨 app/ (Frontend Next.js)
├── ⚙️ backend/ (API Express)
├── 🧩 components/ (Componentes React)
├── 📦 lib/ (Bibliotecas e Utilitários)
├── 🗃️ stores/ (Zustand State Management)
├── 📝 types/ (TypeScript Definitions)
└── 🌐 public/ (Assets Estáticos)
```

---

## 📚 Documentação (docs/)

```
docs/
├── README.md                           # 🗂️ Índice da documentação
│
├── getting-started/                    # 🚀 Primeiros Passos
│   ├── QUICK_START.md                 # Setup em 5 minutos
│   └── SETUP_INSTRUCTIONS.md          # Setup detalhado + Troubleshooting
│
├── reference/                          # 📋 Referência
│   ├── COMANDOS.md                    # Todos os comandos disponíveis
│   └── EXEMPLO_USO.md                 # Casos práticos e workflows
│
└── technical/                          # 🔧 Documentação Técnica
    ├── NOVOS_COMANDOS_SUMMARY.md      # Resumo de implementação
    ├── .comandos-exemplos.txt         # Exemplos de output
    └── MIGRATION_COMPLETE.md          # Status de migração
```

**Quando usar:**
- **getting-started/**: Primeira vez no projeto ou configurando ambiente
- **reference/**: Durante desenvolvimento para consultar comandos/exemplos
- **technical/**: Para entender decisões técnicas e implementações

---

## 🎨 Frontend (app/)

```
app/
├── layout.tsx                          # Layout raiz (inclui SessionProvider)
├── page.tsx                           # Landing page pública
├── globals.css                        # Estilos globais
│
├── (auth)/                            # 🔒 Rotas Autenticadas (protegidas)
│   ├── layout.tsx                     # Layout com header e navegação
│   ├── home/
│   │   └── page.tsx                   # Dashboard principal
│   ├── registrar/
│   │   └── page.tsx                   # Registrar humor
│   ├── historico/
│   │   └── page.tsx                   # Histórico de humores
│   ├── prontuarios/
│   │   └── page.tsx                   # Prontuários médicos (AI)
│   └── perfil/
│       └── page.tsx                   # Perfil do usuário
│
├── login/
│   └── page.tsx                       # Login/Registro
│
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts               # NextAuth API routes
```

**Convenções:**
- `(auth)/`: Pasta com parênteses = route group (não aparece na URL)
- `layout.tsx`: Layout compartilhado por rotas filhas
- `page.tsx`: Página acessível via URL

---

## ⚙️ Backend (backend/)

```
backend/
├── package.json                       # Dependências do backend
├── tsconfig.json                      # Config TypeScript
│
├── prisma/
│   ├── schema.prisma                  # Schema do banco de dados
│   └── migrations/                    # Migrações do Prisma
│
└── src/
    ├── server.ts                      # Entry point (Express app)
    │
    ├── controllers/                   # 🎛️ Route Controllers
    │   ├── auth.controller.ts
    │   ├── mood.controller.ts
    │   ├── health-record.controller.ts
    │   └── onboarding.controller.ts
    │
    ├── services/                      # 💼 Business Logic
    │   ├── auth.service.ts
    │   ├── mood.service.ts
    │   ├── health-record.service.ts
    │   └── onboarding.service.ts
    │
    ├── routes/                        # 🛣️ API Routes
    │   ├── index.ts                   # Route aggregator
    │   ├── auth.routes.ts
    │   ├── mood.routes.ts
    │   ├── health-records.routes.ts
    │   ├── mood-patterns.routes.ts
    │   └── onboarding.routes.ts
    │
    ├── middleware/                    # 🔐 Express Middleware
    │   ├── auth.ts                    # JWT validation
    │   └── error-handler.ts           # Error handling
    │
    ├── lib/                           # 📚 Libraries
    │   ├── prisma.ts                  # Prisma Client
    │   └── redis.ts                   # Redis Client
    │
    └── utils/                         # 🛠️ Utilities
        └── password.ts                # Password hashing
```

**Arquitetura:**
- **Controllers**: Recebem requisições HTTP, chamam services
- **Services**: Lógica de negócio, interagem com banco de dados
- **Routes**: Definem endpoints da API
- **Middleware**: Validação de autenticação, error handling

---

## 🧩 Componentes (components/)

```
components/
├── ui/                                # 🎨 Shadcn/UI Base Components
│   ├── button.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── dialog.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── slider.tsx
│   ├── switch.tsx
│   └── select.tsx
│
├── mood/                              # 😊 Mood Components
│   ├── MoodChart.tsx                  # Gráfico Chart.js
│   ├── MoodSelector.tsx               # Seletor de humor (1-5)
│   ├── MoodEntryForm.tsx              # Form para registrar humor
│   ├── MoodEntryCard.tsx              # Card de um registro
│   └── MoodEditForm.tsx               # Form para editar
│
├── shared/                            # 🔄 Shared Components
│   ├── WeeklySummary.tsx              # Resumo semanal
│   ├── DailyRecommendations.tsx       # Recomendações diárias
│   ├── QuickActions.tsx               # Ações rápidas
│   ├── HealthRecordItem.tsx           # Item de prontuário
│   └── HealthRecordLimitModal.tsx     # Modal de limites
│
├── onboarding/                        # 🎯 Onboarding (Pending)
│   ├── OnBoardingModal.tsx            # Modal principal
│   ├── OnBoardingReminder.tsx         # Banner de lembrete
│   └── steps/                         # 12 passos do onboarding
│       ├── PersonalInfoStep.tsx
│       ├── RecoveryEmailStep.tsx
│       ├── DemographicsStep.tsx
│       ├── MotivationStep.tsx
│       ├── CurrentMoodStep.tsx
│       ├── DepressionScreeningStep.tsx
│       ├── AnxietyScreeningStep.tsx
│       ├── MentalHealthHistoryStep.tsx
│       ├── CurrentTreatmentStep.tsx
│       ├── SleepQualityStep.tsx
│       ├── SocialSupportStep.tsx
│       └── CompletionStep.tsx
│
└── providers/
    └── SessionProvider.tsx            # NextAuth Session Provider
```

**Organização:**
- **ui/**: Componentes básicos do Shadcn/UI (reutilizáveis)
- **mood/**: Componentes específicos para funcionalidade de humor
- **shared/**: Componentes compartilhados entre páginas
- **onboarding/**: Sistema de onboarding (backend pronto, frontend pendente)

---

## 📦 Bibliotecas e Utilitários (lib/)

```
lib/
├── auth.ts                            # NextAuth configuration
├── api-client.ts                      # API client (Axios wrapper)
├── utils.ts                           # cn() e outras utils
└── utils/
    ├── moodUtils.ts                   # Mood data processing
    ├── dateUtils.ts                   # Date formatting
    └── formatters.ts                  # Text/number formatting
```

**Propósito:**
- **auth.ts**: Configuração do NextAuth (providers, callbacks)
- **api-client.ts**: Camada de API centralizada para comunicação com backend
- **utils/**: Funções utilitárias reutilizáveis

---

## 🗃️ State Management (stores/)

```
stores/
└── onBoardingStore.ts                 # Zustand store para onboarding
```

**Estado Global:**
- Gerenciado com **Zustand**
- Leve e simples comparado ao Redux
- Usado principalmente para onboarding flow

---

## 📝 TypeScript Types (types/)

```
types/
├── index.ts                           # Types compartilhados (frontend)
└── next-auth.d.ts                     # Extensões de tipos NextAuth
```

**Types Principais:**
- `MoodEntry`: Registro de humor
- `HealthRecord`: Prontuário médico
- `OnBoardingUserData`: Dados do onboarding
- `User`: Dados do usuário
- `WeeklySummary`: Resumo semanal

---

## 🌐 Assets Estáticos (public/)

```
public/
├── favicon.svg                        # Favicon
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

**Convenção:**
- Arquivos em `public/` são servidos na raiz
- Ex: `public/favicon.svg` → `http://localhost:3000/favicon.svg`

---

## 📄 Arquivos de Configuração (Raiz)

```
meu-humor-nextjs/
├── package.json                       # Dependências do frontend + scripts
├── package-lock.json                  # Lock file
├── tsconfig.json                      # TypeScript config
├── next.config.ts                     # Next.js config
├── tailwind.config.ts                 # Tailwind CSS config
├── postcss.config.mjs                 # PostCSS config
├── components.json                    # Shadcn/UI config
├── eslint.config.mjs                  # ESLint config
├── .gitignore                         # Git ignore rules
│
├── .env.local                         # 🔒 Frontend env vars (NÃO commitar)
├── env.example.txt                    # Exemplo de .env.local
│
├── README.md                          # Documentação principal
├── LEIA-ME-PRIMEIRO.md                # Guia de boas-vindas
├── IMPLEMENTATION_STATUS.md           # Status da implementação
└── complete-next-js-migration.plan.md # Plano de migração original
```

---

## 🔐 Arquivos Sensíveis (Não Commitados)

```
❌ NÃO COMMITAR:
├── .env.local                         # Frontend env vars
├── backend/.env                       # Backend env vars
├── node_modules/                      # Dependencies (frontend)
└── backend/node_modules/              # Dependencies (backend)
```

**Sempre verifique** antes de commitar:
```bash
git status
# Se .env ou .env.local aparecer, NÃO adicione!
```

---

## 🛣️ Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                        USUÁRIO                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js - Port 3000)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ app/                                                  │  │
│  │  ├── pages (landing, login, dashboard, etc)         │  │
│  │  └── api/auth/[...nextauth]/ (NextAuth routes)      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ components/                                           │  │
│  │  ├── mood/ (MoodChart, MoodSelector, etc)           │  │
│  │  ├── shared/ (WeeklySummary, QuickActions)          │  │
│  │  └── ui/ (Shadcn components)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ lib/api-client.ts                                     │  │
│  │  └── Centraliza chamadas HTTP ao backend             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests (JWT in header)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express - Port 3001)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ routes/ → controllers/ → services/                    │  │
│  │                                                        │  │
│  │ Exemplo: POST /api/mood-entries                      │  │
│  │  1. routes/mood.routes.ts (define endpoint)          │  │
│  │  2. middleware/auth.ts (valida JWT)                  │  │
│  │  3. controllers/mood.controller.ts (recebe request)  │  │
│  │  4. services/mood.service.ts (business logic)        │  │
│  │  5. Prisma Client (query ao banco)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────┬───────────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────────┐  ┌─────────────────────┐
│  PostgreSQL (Supabase) │  │  Redis (Upstash)    │
│  - users               │  │  - Cache            │
│  - mood_entries        │  │  - Sessions         │
│  - health_records      │  │                     │
│  - onboarding_data     │  │                     │
└────────────────────────┘  └─────────────────────┘
```

---

## 📊 Convenções de Nomenclatura

### Arquivos

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Componentes React** | PascalCase.tsx | `MoodChart.tsx` |
| **Pages (Next.js)** | lowercase/page.tsx | `app/home/page.tsx` |
| **Layouts** | layout.tsx | `app/(auth)/layout.tsx` |
| **Services/Controllers** | kebab-case.ts | `mood.service.ts` |
| **Utils** | camelCase.ts | `moodUtils.ts` |
| **Types** | index.ts ou .d.ts | `types/index.ts` |
| **Config** | kebab-case | `tailwind.config.ts` |

### Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Route Group** | (nome) | `app/(auth)/` |
| **Route Segment** | lowercase | `app/registrar/` |
| **Component Folder** | lowercase | `components/mood/` |
| **Multiple Words** | kebab-case | `getting-started/` |

---

## 🎯 Arquivos Importantes para Novos Devs

### Primeiro Dia
1. `LEIA-ME-PRIMEIRO.md` - Comece aqui!
2. `docs/getting-started/QUICK_START.md` - Setup rápido
3. `package.json` - Entender scripts disponíveis

### Durante Desenvolvimento
4. `docs/reference/COMANDOS.md` - Comandos disponíveis
5. `lib/api-client.ts` - Como fazer requests ao backend
6. `types/index.ts` - Types compartilhados

### Debug e Troubleshooting
7. `docs/getting-started/SETUP_INSTRUCTIONS.md` - Troubleshooting
8. `docs/reference/EXEMPLO_USO.md` - Casos práticos
9. `backend/prisma/schema.prisma` - Schema do banco

### Arquitetura
10. `README.md` - Visão geral
11. `docs/README.md` - Índice de documentação
12. `IMPLEMENTATION_STATUS.md` - O que está feito/pendente

---

## 🔍 Como Encontrar Algo

### "Onde fica o código de autenticação?"
- **Frontend**: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`
- **Backend**: `backend/src/controllers/auth.controller.ts`

### "Onde fica o código de mood tracking?"
- **Frontend**: `components/mood/`, `app/(auth)/registrar/page.tsx`
- **Backend**: `backend/src/services/mood.service.ts`

### "Onde ficam os estilos?"
- **Global**: `app/globals.css`
- **Config**: `tailwind.config.ts`
- **Componentes**: CSS-in-JS via Tailwind classes

### "Onde está a configuração do banco?"
- **Schema**: `backend/prisma/schema.prisma`
- **Client**: `backend/src/lib/prisma.ts`
- **Env var**: `backend/.env` → `DATABASE_URL`

### "Onde ficam os tipos TypeScript?"
- **Frontend**: `types/index.ts`
- **Backend**: Gerados pelo Prisma em `backend/node_modules/@prisma/client`

---

## 📚 Mais Informações

Para entender a organização completa da documentação, consulte:

👉 **[docs/README.md](./README.md)**

---

**Última atualização**: 2025-10-15  
**Mantido por**: Equipe Meu Humor


