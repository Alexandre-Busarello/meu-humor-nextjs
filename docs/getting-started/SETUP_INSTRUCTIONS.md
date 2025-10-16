# Meu Humor - Instruções de Setup

## 🚀 Início Rápido

Este guia ajudará você a configurar e executar o aplicativo Meu Humor localmente.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL database (recomendado: Supabase)
- Redis instance (recomendado: Upstash para Vercel)
- Google Gemini API key (para geração de prontuários com IA)

## ⚡ Setup Simplificado (Recomendado)

### Instalação Rápida

**1. Instale todas as dependências (frontend + backend) de uma vez:**
```bash
npm run install:all
```

**2. Configure as variáveis de ambiente:**
- Crie `.env` no diretório `backend/` (veja seção "Configuração do Backend")
- Crie `.env.local` no diretório raiz (veja seção "Configuração do Frontend")

**3. Configure o banco de dados:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..
```

**4. Execute ambos os projetos simultaneamente:**
```bash
npm run dev
```
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

**Comandos adicionais disponíveis:**
```bash
npm run dev:backend   # Apenas backend
npm run dev:frontend  # Apenas frontend
```

---

## 🔧 Configuração Manual (Detalhada)

Se preferir configurar cada projeto separadamente, siga as instruções abaixo.

### Configuração do Backend

### 1. Navegue para o diretório do backend

```bash
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` no diretório `backend` com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/meu_humor"

# Redis Cache
REDIS_URL="redis://localhost:6379"
# Ou para Upstash:
# REDIS_URL="rediss://default:password@host:port"

# JWT Authentication
JWT_SECRET="seu-secret-key-super-seguro-mude-em-producao"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="sua-chave-api-do-gemini"

# Stripe (opcional, para futura integração de pagamentos)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Configure o banco de dados

```bash
# Gera o Prisma Client
npm run prisma:generate

# Executa as migrações
npm run prisma:migrate

# (Opcional) Abre o Prisma Studio para visualizar o banco
npm run prisma:studio
```

### 5. Inicie o servidor backend

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3001`

## 🎨 Configuração do Frontend

### 1. Volte para o diretório raiz

```bash
cd ..
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` no diretório raiz com o seguinte conteúdo:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-nextauth-secret-mude-em-producao"

# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

**Importante**: Gere um secret seguro para `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Inicie o servidor frontend

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## ✅ Verificação

1. Acesse `http://localhost:3000` - você deve ver a landing page
2. Clique em "Criar Conta" e registre um novo usuário
3. Após o login, você será redirecionado para `/home`
4. Teste o registro de humor em `/registrar`

## 🔑 Obtendo API Keys

### Google Gemini API

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Get API Key"
4. Copie a chave e adicione ao `.env` do backend

### Supabase (PostgreSQL)

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Na aba "Settings" > "Database", copie a "Connection string"
4. Use como `DATABASE_URL` no `.env` do backend

### Upstash (Redis)

1. Crie uma conta em [Upstash](https://upstash.com)
2. Crie um novo banco Redis
3. Copie a "Redis URL"
4. Use como `REDIS_URL` no `.env` do backend

## 📦 Scripts Disponíveis

### Root (Gerencia ambos os projetos)

```bash
npm run install:all    # Instala dependências do frontend e backend
npm run dev            # Executa frontend e backend simultaneamente
npm run dev:backend    # Executa apenas o backend
npm run dev:frontend   # Executa apenas o frontend
npm run build          # Compila o frontend para produção
npm run start          # Inicia servidor de produção do frontend
npm run lint           # Executa ESLint no frontend
```

### Backend (no diretório /backend)

```bash
cd backend
npm run dev                # Inicia servidor de desenvolvimento
npm run build              # Compila para produção
npm run start              # Inicia servidor de produção
npm run prisma:generate    # Gera Prisma Client
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre Prisma Studio
```

### Frontend (no diretório raiz)

```bash
npm run dev:frontend   # Inicia Next.js em modo desenvolvimento
npm run build          # Compila para produção
npm run start          # Inicia servidor de produção
npm run lint           # Executa ESLint
```

## 🐛 Troubleshooting

### Erro: "connect ECONNREFUSED" ao conectar ao backend

- Verifique se o backend está rodando em `http://localhost:3001`
- Confirme que `NEXT_PUBLIC_API_URL` no `.env.local` está correto

### Erro: "PrismaClientInitializationError"

- Verifique se a `DATABASE_URL` está correta
- Execute `npm run prisma:generate` no diretório backend
- Verifique se o PostgreSQL está rodando

### Erro: "Invalid token" ou problemas de autenticação

- Verifique se `JWT_SECRET` no backend está definido
- Confirme que `NEXTAUTH_SECRET` no frontend está definido
- Tente limpar cookies do navegador e fazer login novamente

### Erro ao gerar prontuário

- Verifique se `GEMINI_API_KEY` está correta
- Confirme que você tem registros de humor nos últimos 30 dias
- Verifique os logs do backend para mais detalhes

## 🚀 Deploy

### Backend (Railway/Render)

1. Faça push do código para um repositório Git
2. Conecte o repositório ao Railway/Render
3. Configure as variáveis de ambiente
4. Deploy command: `cd backend && npm install && npm run build && npm start`

### Frontend (Vercel)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Output directory: `.next`

## 📚 Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do NextAuth](https://next-auth.js.org)
- [Google Gemini API](https://ai.google.dev)

## 💡 Próximos Passos

Após o setup básico, você pode:

1. Implementar o sistema de onboarding (12 passos)
2. Adicionar mais componentes de análise
3. Implementar integração com Stripe para planos premium
4. Adicionar testes automatizados
5. Melhorar a UI/UX com base no feedback dos usuários

## 🤝 Suporte

Se encontrar problemas, verifique:
1. O arquivo `IMPLEMENTATION_STATUS.md` para ver o status atual
2. Os logs do backend e frontend
3. As issues no repositório Git

---

**Última atualização**: $(date +%Y-%m-%d)

