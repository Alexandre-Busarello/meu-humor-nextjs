# 🔧 Troubleshooting - Meu Humor

Soluções para problemas comuns ao rodar o projeto.

---

## 🚨 Problemas ao Iniciar o Projeto

### Erro: "No overload matches this call" (JWT expiresIn)

**Sintoma:**
```
TSError: error TS2769: No overload matches this call.
src/services/auth.service.ts(198,16): Type 'string' is not assignable to type 'number | StringValue | undefined'.
```

**Causa:** TypeScript não consegue inferir corretamente o tipo do parâmetro `expiresIn` no `jwt.sign()`.

**Solução:**
Adicione tipo explícito na declaração da variável:

```typescript
// ❌ Antes
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

// ✅ Depois
const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';
```

---

### Erro: "Export withAuth doesn't exist" (NextAuth v5)

**Sintoma:**
```
Export withAuth doesn't exist in target module
./middleware.ts (1:1)
```

**Causa:** NextAuth v5 mudou a API do middleware. `withAuth` não existe mais.

**Solução:**
Atualize o middleware.ts para usar `getToken` do `next-auth/jwt`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/registrar/:path*', /* ... */],
};
```

---

### Erro: "Cannot apply unknown utility class font-sans" (Tailwind)

**Sintoma:**
```
Error: Cannot apply unknown utility class `font-sans`
Module not found: Can't resolve 'tailwindcss-animate'
```

**Causa:** Incompatibilidade entre Tailwind CSS v4 (beta) e configuração v3, ou falta de dependências.

**Solução:**

**1. Instalar dependências faltando:**
```bash
npm install tailwindcss-animate
```

**2. Se ainda tiver erro, fazer downgrade para Tailwind v3 (estável):**
```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@3.4.17 postcss autoprefixer
```

**3. Atualizar `postcss.config.mjs`:**
```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

---

### Erro: "Could not find a declaration file for module 'compression'"

**Sintoma:**
```
TSError: ⨯ Unable to compile TypeScript:
error TS7016: Could not find a declaration file for module 'compression'
Try `npm i --save-dev @types/compression`
```

**Causa:** Faltam os tipos TypeScript para o módulo `compression` no backend.

**Solução:**
```bash
cd backend
npm install --save-dev @types/compression @types/helmet
cd ..
npm run dev
```

---

### Erro: "Port 3000 already in use"

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causa:** Outra aplicação está usando a porta 3000.

**Solução:**

**Opção 1: Matar o processo:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Opção 2: Usar outra porta:**
```bash
PORT=3002 npm run dev:frontend
```

---

### Erro: "Port 3001 already in use" (Backend)

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Causa:** O backend já está rodando em outra janela ou processo.

**Solução:**

**Opção 1: Matar o processo:**
```bash
lsof -ti:3001 | xargs kill -9
npm run dev
```

**Opção 2: Mudar porta no backend:**
Edite `backend/.env`:
```env
PORT=3002
```

Atualize também `.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3002/api"
```

---

### Erro: "Cannot connect to database"

**Sintoma:**
```
PrismaClientInitializationError: Can't reach database server at `localhost:5432`
```

**Causa:** O PostgreSQL não está rodando ou a `DATABASE_URL` está incorreta.

**Solução:**

1. **Verifique a DATABASE_URL:**
```bash
cat backend/.env | grep DATABASE_URL
```

2. **Teste a conexão:**
```bash
cd backend
npm run prisma:studio
```

Se o Prisma Studio abrir, a conexão está OK.

3. **Se estiver usando Supabase:**
   - Verifique se o projeto está ativo
   - Pegue a connection string em: Settings > Database
   - Use o formato: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`

---

### Erro: "Redis connection failed"

**Sintoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Causa:** Redis não está rodando ou `REDIS_URL` está incorreta.

**Solução:**

1. **Se estiver usando Redis local:**
```bash
# Instalar Redis
brew install redis  # macOS
sudo apt install redis  # Linux

# Iniciar Redis
redis-server
```

2. **Se estiver usando Upstash (recomendado):**
   - Crie um database em https://upstash.com
   - Copie a Redis URL
   - Cole em `backend/.env`:
   ```env
   REDIS_URL="rediss://default:[PASSWORD]@[HOST]:[PORT]"
   ```

3. **Modo sem Redis (não recomendado para produção):**
   - Comente o código de Redis em `backend/src/lib/redis.ts` temporariamente

---

### Erro: "NEXTAUTH_SECRET is not set"

**Sintoma:**
```
Error: NEXTAUTH_SECRET is required
```

**Causa:** Variável `NEXTAUTH_SECRET` não está definida no `.env.local`.

**Solução:**

1. **Gere um secret seguro:**
```bash
openssl rand -base64 32
```

2. **Adicione ao `.env.local`:**
```env
NEXTAUTH_SECRET="[RESULTADO_DO_COMANDO_ACIMA]"
```

3. **Reinicie o frontend:**
```bash
npm run dev:frontend
```

---

### Erro: "JWT_SECRET is not set"

**Sintoma:**
```
Error: JWT_SECRET is required
```

**Causa:** Variável `JWT_SECRET` não está definida no `backend/.env`.

**Solução:**

1. **Gere um secret seguro:**
```bash
openssl rand -base64 32
```

2. **Adicione ao `backend/.env`:**
```env
JWT_SECRET="[RESULTADO_DO_COMANDO_ACIMA]"
```

3. **Reinicie o backend:**
```bash
npm run dev:backend
```

---

## 📦 Problemas com Dependências

### Erro: "Module not found"

**Sintoma:**
```
Error: Cannot find module 'X'
```

**Solução:**

1. **Reinstale todas as dependências:**
```bash
npm run install:all
```

2. **Se o erro persistir, limpe o cache:**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

### Erro: "Prisma Client not generated"

**Sintoma:**
```
Error: @prisma/client did not initialize yet
```

**Causa:** O Prisma Client não foi gerado após alterações no schema.

**Solução:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..
npm run dev
```

---

## 🌐 Problemas de CORS

### Erro: "Blocked by CORS policy"

**Sintoma:**
```
Access to fetch at 'http://localhost:3001/api/...' from origin 'http://localhost:3003' 
has been blocked by CORS policy
```

**Causa:** O backend não está configurado para aceitar requisições da porta onde o frontend está rodando.

**Solução:**

**1. Identifique as portas:**
- Frontend: Veja a URL no navegador (ex: `localhost:3003`)
- Backend: Veja nos logs do backend (ex: `localhost:3001`)

**2. Atualize o CORS no backend** (`backend/src/server.ts`):

```typescript
// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',  // ← Adicione a porta do seu frontend
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
```

**3. Reinicie o backend:**
```bash
npm run dev:backend
```

**4. Se o problema persistir, verifique `.env.local`:**

```env
# Certifique-se que aponta para o backend correto
NEXT_PUBLIC_API_URL="http://localhost:3001/api"  # ← Porta do backend

# NEXTAUTH_URL deve ser a porta do frontend
NEXTAUTH_URL="http://localhost:3003"  # ← Porta do frontend
```

---

## 🔑 Problemas de Autenticação

### Erro: "Invalid token" ou "Unauthorized"

**Sintoma:**
- Requests retornam 401 Unauthorized
- Usuário é deslogado automaticamente

**Causa:** Token JWT expirado ou inválido.

**Solução:**

1. **Limpe cookies e localStorage:**
```javascript
// No console do navegador:
localStorage.clear();
// Depois pressione Ctrl+Shift+Delete e limpe cookies
```

2. **Verifique se JWT_SECRET é o mesmo:**
```bash
cat backend/.env | grep JWT_SECRET
```

3. **Faça login novamente**

---

### Erro: "Session not found"

**Sintoma:**
- NextAuth não encontra sessão
- Redirecionamento constante para login

**Causa:** Configuração incorreta do NextAuth ou cookies bloqueados.

**Solução:**

1. **Verifique as variáveis de ambiente:**
```bash
cat .env.local | grep NEXTAUTH
```

Deve ter:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[seu-secret]"
```

2. **Verifique cookies no navegador:**
   - Abra DevTools > Application > Cookies
   - Deve existir um cookie `next-auth.session-token`

3. **Tente em modo anônimo:**
   - Se funcionar, o problema são extensões/cookies

---

## 🎨 Problemas de Interface

### Erro: "Hydration failed"

**Sintoma:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Causa:** Diferenças entre renderização do servidor e cliente.

**Solução:**

1. **Identifique o componente problemático** (mensagem de erro mostra)

2. **Use `useEffect` para conteúdo dinâmico:**
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

3. **Use `suppressHydrationWarning` se necessário:**
```tsx
<div suppressHydrationWarning>
  {/* conteúdo dinâmico */}
</div>
```

---

### Erro: "Chart.js not rendering"

**Sintoma:**
- Gráfico não aparece
- Console mostra erro de Chart.js

**Causa:** Chart.js precisa de configuração específica para SSR.

**Solução:**

Verifique se o componente está registrando os elementos:
```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

---

## 🤖 Problemas com IA (Gemini)

### Erro: "GEMINI_API_KEY is invalid"

**Sintoma:**
```
Error: Invalid API key
```

**Causa:** API key inválida ou não definida.

**Solução:**

1. **Obtenha uma API key válida:**
   - Acesse: https://makersuite.google.com/app/apikey
   - Crie ou copie sua chave

2. **Adicione ao `backend/.env`:**
```env
GEMINI_API_KEY="sua-chave-aqui"
```

3. **Reinicie o backend**

---

### Erro: "Cannot generate health record - not enough data"

**Sintoma:**
- Botão de gerar prontuário desabilitado
- Mensagem: "Você precisa de pelo menos 7 dias de registros"

**Causa:** Não há registros de humor suficientes nos últimos 30 dias.

**Solução:**

1. **Registre humor por pelo menos 7 dias diferentes**
2. **Verifique no banco se os registros existem:**
```bash
cd backend
npm run prisma:studio
# Abra a tabela mood_entries e verifique
```

---

## 📱 Problemas Mobile/Responsivo

### Interface quebrada no mobile

**Sintoma:**
- Layout quebrado em dispositivos móveis
- Elementos sobrepostos

**Solução:**

1. **Verifique viewport meta tag em `app/layout.tsx`:**
```tsx
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

2. **Use classes responsive do Tailwind:**
```tsx
<div className="flex flex-col md:flex-row">
  {/* conteúdo */}
</div>
```

3. **Teste em diferentes tamanhos:**
   - Chrome DevTools > Toggle device toolbar (Ctrl+Shift+M)

---

## 🐛 Problemas Gerais

### Backend funciona mas frontend não encontra API

**Sintoma:**
```
FetchError: request to http://localhost:3001/api/... failed
```

**Causa:** Frontend está tentando conectar no endereço errado.

**Solução:**

1. **Verifique se backend está rodando:**
```bash
curl http://localhost:3001/api/health
```

Deve retornar: `{"status":"ok"}`

2. **Verifique NEXT_PUBLIC_API_URL:**
```bash
cat .env.local | grep NEXT_PUBLIC_API_URL
```

Deve ser: `NEXT_PUBLIC_API_URL="http://localhost:3001/api"`

3. **Reinicie o frontend** (variáveis de ambiente são carregadas no build)

---

### Logs não aparecem no terminal

**Sintoma:**
- `console.log` não aparece
- Difícil debugar

**Solução:**

1. **Para ver logs do backend:**
```bash
npm run dev:backend
```

2. **Para ver logs do frontend:**
```bash
npm run dev:frontend
```

3. **Use o console do navegador:**
   - Chrome DevTools > Console (F12)

---

### Build falha na produção

**Sintoma:**
```
Error: Build failed
```

**Causa:** Vários motivos possíveis.

**Solução:**

1. **Limpe o cache:**
```bash
rm -rf .next
npm run build
```

2. **Verifique erros de TypeScript:**
```bash
npm run lint
```

3. **Verifique imports dinâmicos:**
   - Componentes que usam `window` devem ser lazy-loaded

---

## 📋 Checklist de Debug

Quando algo não funciona, siga esta ordem:

### 1️⃣ Verifique Variáveis de Ambiente
```bash
# Frontend
cat .env.local

# Backend
cat backend/.env
```

### 2️⃣ Verifique se os Serviços Estão Rodando
```bash
# Backend
curl http://localhost:3001/

# Frontend
curl http://localhost:3000/
```

### 3️⃣ Verifique Logs
```bash
# Rode separadamente para ver logs claros
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2
```

### 4️⃣ Verifique Conexões Externas
```bash
# PostgreSQL
cd backend && npm run prisma:studio

# Redis (se usando Upstash)
# Acesse o dashboard em upstash.com
```

### 5️⃣ Limpe Tudo e Reinstale
```bash
# Último recurso
rm -rf node_modules backend/node_modules
rm package-lock.json backend/package-lock.json
npm run install:all
```

---

## 🆘 Ainda com Problemas?

### Passos Adicionais:

1. **Verifique a versão do Node.js:**
```bash
node --version  # Deve ser 18+
```

2. **Verifique logs completos:**
```bash
npm run dev 2>&1 | tee debug.log
# Compartilhe debug.log com a equipe
```

3. **Teste conexões individuais:**
```bash
# Backend
cd backend && npm run dev

# Frontend (em outro terminal)
npm run dev:frontend
```

4. **Consulte a documentação:**
   - [Setup Instructions](./getting-started/SETUP_INSTRUCTIONS.md)
   - [Exemplo de Uso](./reference/EXEMPLO_USO.md)
   - [Project Structure](./ESTRUTURA_PROJETO.md)

5. **Entre em contato com a equipe** com:
   - Descrição do erro
   - Logs completos
   - O que você já tentou
   - Versões (Node, npm, sistema operacional)

---

## 📞 Links Úteis

- **Setup Detalhado**: [getting-started/SETUP_INSTRUCTIONS.md](./getting-started/SETUP_INSTRUCTIONS.md)
- **Comandos**: [reference/COMANDOS.md](./reference/COMANDOS.md)
- **Estrutura do Projeto**: [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)
- **Documentação Index**: [README.md](./README.md)

---

**Última atualização**: 2025-10-15  
**Mantido por**: Equipe Meu Humor


