# 🎬 Exemplo Prático de Uso - Meu Humor

## Cenário: Novo Desenvolvedor no Projeto

Este documento mostra um exemplo prático de como um novo desenvolvedor pode configurar e começar a trabalhar no projeto em minutos.

---

## 🚀 Do Zero ao Desenvolvimento em 3 Minutos

### Passo 1: Clonar o Repositório (30 segundos)

```bash
git clone <url-do-repositorio>
cd meu-humor-nextjs
```

---

### Passo 2: Instalar Dependências (1 minuto)

#### Antes (método antigo - 2 comandos):
```bash
npm install
cd backend && npm install && cd ..
```

#### ✨ Agora (1 comando):
```bash
npm run install:all
```

**Saída esperada:**
```
Installing frontend dependencies...
✓ Installed 426 packages

Installing backend dependencies...
✓ Installed 234 packages

✅ All dependencies installed successfully!
```

---

### Passo 3: Configurar Variáveis de Ambiente (1 minuto)

#### Backend: `backend/.env`
```bash
# Copie o exemplo
cp backend/.env.example backend/.env

# Edite com suas credenciais
nano backend/.env
```

#### Frontend: `.env.local`
```bash
# Copie o exemplo  
cp env.example.txt .env.local

# Edite com suas credenciais
nano .env.local
```

---

### Passo 4: Configurar Banco de Dados (30 segundos)

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..
```

**Saída esperada:**
```
✓ Generated Prisma Client
✓ Applied 5 migrations
✓ Database ready!
```

---

### Passo 5: Iniciar Desenvolvimento (Imediato)

#### Antes (método antigo - 2 terminais):
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2 (novo terminal)
npm run dev
```

#### ✨ Agora (1 comando):
```bash
npm run dev
```

**Saída esperada:**
```
[backend] 
[backend] > backend@1.0.0 dev
[backend] > nodemon src/server.ts
[backend] 
[backend] [nodemon] starting `ts-node src/server.ts`
[backend] ✅ Server running on http://localhost:3001
[backend] 
[frontend] 
[frontend] > meu-humor-nextjs@0.1.0 dev:frontend
[frontend] > next dev --turbopack
[frontend] 
[frontend]   ▲ Next.js 15.5.5 (Turbopack)
[frontend]   - Local:        http://localhost:3000
[frontend] 
[frontend] ✓ Starting...
[frontend] ✓ Ready in 1.2s
```

---

## 🎯 Fluxo de Trabalho Diário

### Início do Dia

```bash
# 1. Pull das últimas mudanças
git pull origin main

# 2. Instalar novas dependências (se houver)
npm run install:all

# 3. Rodar migrações (se houver)
cd backend && npm run prisma:migrate && cd ..

# 4. Iniciar desenvolvimento
npm run dev
```

---

### Durante o Desenvolvimento

#### Cenário 1: Trabalhando no Frontend

```bash
# Se o backend estiver com problemas, rode apenas o frontend
npm run dev:frontend
```

**Quando usar:**
- Backend com erro que você não quer consertar agora
- Trabalhando em UI/UX puro
- Usando dados mockados

---

#### Cenário 2: Trabalhando no Backend

```bash
# Se quiser focar nos logs do backend
npm run dev:backend
```

**Quando usar:**
- Debugando endpoints da API
- Trabalhando em lógica de negócio
- Testando queries do Prisma

---

#### Cenário 3: Desenvolvimento Full-Stack

```bash
# Rode ambos e alterne entre os logs
npm run dev
```

**Quando usar:**
- Trabalhando em features completas
- Integrando frontend e backend
- Testando fluxo completo do usuário

---

### Fim do Dia

```bash
# Parar servidores
Ctrl+C

# Commit suas mudanças
git add .
git commit -m "feat: add new feature"
git push origin main
```

---

## 🔍 Cenários de Troubleshooting

### Problema: Port 3000 já está em uso

```bash
# Opção 1: Encontrar e matar o processo
lsof -ti:3000 | xargs kill -9

# Opção 2: Rodar em outra porta
PORT=3001 npm run dev:frontend
```

---

### Problema: Port 3001 já está em uso

```bash
# Encontrar e matar o processo
lsof -ti:3001 | xargs kill -9

# Ou edite o backend/.env para usar outra porta
PORT=3002
```

---

### Problema: Banco de dados não conecta

```bash
# 1. Verificar se DATABASE_URL está correto
cat backend/.env | grep DATABASE_URL

# 2. Testar conexão com Prisma Studio
cd backend
npm run prisma:studio

# 3. Se funcionar, o problema é no código
```

---

### Problema: Frontend não encontra backend

```bash
# 1. Verificar se backend está rodando
curl http://localhost:3001/api/health

# 2. Verificar NEXT_PUBLIC_API_URL
cat .env.local | grep NEXT_PUBLIC_API_URL

# 3. Deve ser exatamente: http://localhost:3001/api
```

---

## 📊 Comparação de Produtividade

### Setup Inicial

| Método | Comandos | Tempo | Terminais |
|--------|----------|-------|-----------|
| **Antigo** | 4+ comandos | ~5 min | 2 |
| **Novo** | 2 comandos | ~2 min | 1 |

### Desenvolvimento Diário

| Método | Comandos | Tempo | Terminais |
|--------|----------|-------|-----------|
| **Antigo** | 2 comandos | ~30s | 2 |
| **Novo** | 1 comando | ~10s | 1 |

---

## 💡 Dicas Pro

### 1. Alias no Shell

Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
alias mh-dev="cd /home/busamar/projetos/meu-humor-nextjs && npm run dev"
alias mh-install="cd /home/busamar/projetos/meu-humor-nextjs && npm run install:all"
```

Agora você pode rodar de qualquer lugar:

```bash
mh-dev        # Inicia o projeto
mh-install    # Instala dependências
```

---

### 2. VS Code Tasks

Crie `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev (Both)",
      "type": "npm",
      "script": "dev",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Install All",
      "type": "npm",
      "script": "install:all",
      "problemMatcher": []
    }
  ]
}
```

Acesse com: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Dev (Both)"

---

### 3. Script de Setup Completo

Crie `setup.sh` na raiz:

```bash
#!/bin/bash

echo "🚀 Setting up Meu Humor..."

# Instalar dependências
npm run install:all

# Copiar .env examples
cp backend/.env.example backend/.env
cp env.example.txt .env.local

# Configurar banco
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..

echo "✅ Setup complete! Edit .env files and run: npm run dev"
```

Torne executável:
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎓 Para Novos Desenvolvedores

### Resumo Ultra-Rápido

```bash
# 1. Clonar
git clone <repo> && cd meu-humor-nextjs

# 2. Instalar
npm run install:all

# 3. Configurar (edite os .env)
cp backend/.env.example backend/.env
cp env.example.txt .env.local

# 4. Banco
cd backend && npm run prisma:generate && npm run prisma:migrate && cd ..

# 5. Rodar
npm run dev

# 6. Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📚 Documentação Relacionada

- **Comandos Completos**: [COMANDOS.md](./COMANDOS.md)
- **Setup Detalhado**: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **README**: [README.md](./README.md)

---

**Data**: 2025-10-15  
**Autor**: Equipe Meu Humor

