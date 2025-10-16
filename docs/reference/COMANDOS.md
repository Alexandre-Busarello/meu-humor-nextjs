# 📋 Comandos Simplificados - Meu Humor

Este documento lista todos os comandos disponíveis no **package.json raiz** para gerenciar o projeto de forma simplificada.

## 🚀 Comandos Principais (Raiz do Projeto)

### Instalação

```bash
npm run install:all
```
**O que faz**: Instala todas as dependências do frontend e backend de uma só vez.

**Equivalente a:**
```bash
npm install
cd backend && npm install
```

---

### Desenvolvimento

#### Executar Ambos os Projetos

```bash
npm run dev
```
**O que faz**: Inicia o backend (Express) e o frontend (Next.js) simultaneamente em modo de desenvolvimento.

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

**Equivalente a:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev
```

#### Executar Apenas o Backend

```bash
npm run dev:backend
```
**O que faz**: Inicia apenas o servidor Express em modo de desenvolvimento.

- Backend: `http://localhost:3001`

#### Executar Apenas o Frontend

```bash
npm run dev:frontend
```
**O que faz**: Inicia apenas o Next.js em modo de desenvolvimento.

- Frontend: `http://localhost:3000`

---

### Produção

#### Build do Frontend

```bash
npm run build
```
**O que faz**: Compila o frontend Next.js para produção.

#### Iniciar Frontend em Produção

```bash
npm run start
```
**O que faz**: Inicia o servidor Next.js em modo de produção (após build).

---

### Qualidade de Código

```bash
npm run lint
```
**O que faz**: Executa o ESLint no código do frontend.

---

## 🔧 Comandos do Backend (Diretório /backend)

Para executar comandos específicos do backend, navegue até o diretório:

```bash
cd backend
```

### Desenvolvimento

```bash
npm run dev
```
Inicia o servidor Express com hot-reload (nodemon).

### Produção

```bash
npm run build      # Compila TypeScript
npm run start      # Inicia servidor compilado
```

### Prisma (Banco de Dados)

```bash
npm run prisma:generate    # Gera Prisma Client
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre interface visual do banco
```

---

## 📊 Comparação: Antes vs Depois

### Antes (Comandos Separados)

```bash
# Instalação
npm install
cd backend && npm install

# Desenvolvimento (2 terminais)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npm run dev
```

### Depois (Comandos Simplificados)

```bash
# Instalação
npm run install:all

# Desenvolvimento (1 comando)
npm run dev
```

---

## 🎯 Fluxo de Trabalho Recomendado

### Primeira Configuração

```bash
# 1. Instalar tudo
npm run install:all

# 2. Configurar variáveis de ambiente
# Crie backend/.env e .env.local (veja SETUP_INSTRUCTIONS.md)

# 3. Configurar banco de dados
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..

# 4. Rodar o projeto
npm run dev
```

### Desenvolvimento Diário

```bash
# Apenas 1 comando!
npm run dev
```

### Depuração Específica

```bash
# Se precisar ver logs apenas do backend:
npm run dev:backend

# Se precisar ver logs apenas do frontend:
npm run dev:frontend
```

---

## 💡 Dicas

### Parar os Servidores

Se rodou com `npm run dev`, pressione `Ctrl+C` uma vez para parar ambos.

### Ver Logs Separadamente

Para melhor visualização dos logs durante desenvolvimento, você pode rodar em terminais separados:

```bash
# Terminal 1
npm run dev:backend

# Terminal 2  
npm run dev:frontend
```

### Instalar Nova Dependência

**Frontend:**
```bash
npm install nome-do-pacote
```

**Backend:**
```bash
cd backend
npm install nome-do-pacote
```

---

## 📦 Package.json Raiz (Resumo)

```json
{
  "scripts": {
    "install:all": "npm install && cd backend && npm install",
    "dev:frontend": "next dev --turbopack",
    "dev:backend": "cd backend && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  }
}
```

---

## 🔗 Links Úteis

- **Setup Completo**: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **README**: [README.md](./README.md)
- **Status**: [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)

---

**Última atualização**: 2025-10-15

