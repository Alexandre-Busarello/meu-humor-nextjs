# 🚀 Quick Start - Meu Humor

## Início Rápido em 5 Minutos

### 1. Clone e Instale (2 min)

#### Opção A: Comando Simplificado (Recomendado)
```bash
cd /home/busamar/projetos/meu-humor-nextjs

# Instala TUDO de uma vez (frontend + backend)
npm run install:all
```

#### Opção B: Instalação Manual
```bash
cd /home/busamar/projetos/meu-humor-nextjs

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..
```

### 2. Configure Variáveis de Ambiente (2 min)

#### Backend: `backend/.env`
```env
DATABASE_URL="postgresql://user:password@host:5432/meu_humor"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="gere-um-secret-seguro"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
GEMINI_API_KEY="sua-chave-gemini"
```

#### Frontend: `.env.local`
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-seguro"
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

**Gerar secrets seguros:**
```bash
openssl rand -base64 32
```

### 3. Configure o Banco (1 min)

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..
```

### 4. Inicie os Servidores

#### Opção A: Ambos Simultaneamente (Recomendado)
```bash
npm run dev
```
✅ Backend rodando em http://localhost:3001  
✅ Frontend rodando em http://localhost:3000

#### Opção B: Manualmente (2 Terminais)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend rodando em http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
✅ Frontend rodando em http://localhost:3000

**Comandos Individuais:**
```bash
npm run dev:backend   # Apenas backend
npm run dev:frontend  # Apenas frontend
```

### 5. Teste o App!

1. Abra http://localhost:3000
2. Clique em "Criar Conta"
3. Registre-se com email e senha
4. Faça login
5. Registre seu primeiro humor!

---

## 📝 Obter API Keys

### PostgreSQL (Supabase) - GRÁTIS
1. https://supabase.com → Sign up
2. Create new project
3. Settings > Database > Connection string
4. Copie para `DATABASE_URL`

### Redis (Upstash) - GRÁTIS
1. https://upstash.com → Sign up
2. Create Redis Database
3. Copie a "REST URL" 
4. Use como `REDIS_URL`

### Google Gemini - GRÁTIS
1. https://makersuite.google.com/app/apikey
2. Create API Key
3. Copie para `GEMINI_API_KEY`

---

## ✅ Checklist Rápido

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL criado (Supabase)
- [ ] Redis criado (Upstash)
- [ ] Gemini API key obtida
- [ ] Backend `.env` configurado
- [ ] Frontend `.env.local` configurado
- [ ] Prisma migrate executado
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 3000)
- [ ] Conta de teste criada

---

## 🆘 Problemas Comuns

### Backend não conecta ao banco
```bash
# Verifique se DATABASE_URL está correto
cd backend
npm run prisma:studio  # Testa conexão
```

### Frontend não encontra backend
```bash
# Confirme que backend está em http://localhost:3001
curl http://localhost:3001/api/health
```

### Erro ao gerar prontuário
- Você precisa ter pelo menos 7 dias de registros de humor
- Verifique se GEMINI_API_KEY está correta

---

## 📚 Documentação Completa

- **Setup Detalhado**: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Status da Migração**: [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- **Resumo da Migração**: [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)

---

## 🎉 Pronto!

Seu app Meu Humor está rodando! 

Explore as funcionalidades:
- 📝 Registrar humor diário
- 📊 Ver gráficos e resumos
- 📄 Gerar prontuários com IA
- 📥 Exportar para PDF

**Aproveite!** 🚀

