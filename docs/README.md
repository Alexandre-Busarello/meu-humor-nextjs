# 📚 Documentação - Meu Humor

Bem-vindo à documentação completa do projeto **Meu Humor**! Esta documentação está organizada para facilitar o onboarding de novos desenvolvedores e servir como referência para a equipe.

---

## 🎯 Para Começar

Se você é novo no projeto, siga esta ordem:

### 1️⃣ Leia Primeiro
👉 **[LEIA-ME-PRIMEIRO.md](../LEIA-ME-PRIMEIRO.md)** (Raiz do projeto)

Um guia de boas-vindas com links rápidos e visão geral dos novos comandos.

### 2️⃣ Setup Rápido (5 minutos)
👉 **[Quick Start](./getting-started/QUICK_START.md)**

Configuração rápida para começar a desenvolver em minutos:
- Instalação de dependências
- Configuração de variáveis de ambiente
- Primeiro run do projeto
- Checklist de verificação

### 3️⃣ Setup Detalhado (se necessário)
👉 **[Setup Instructions](./getting-started/SETUP_INSTRUCTIONS.md)**

Guia completo e detalhado de configuração:
- Pré-requisitos
- Setup manual passo a passo
- Troubleshooting
- Como obter API keys
- Deploy

---

## 📖 Documentação por Categoria

### 🚀 Getting Started (Primeiros Passos)

Documentação essencial para novos desenvolvedores:

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| **[Quick Start](./getting-started/QUICK_START.md)** | Setup em 5 minutos | Primeira vez no projeto |
| **[Setup Instructions](./getting-started/SETUP_INSTRUCTIONS.md)** | Setup detalhado e completo | Quando precisar de mais detalhes |

---

### 📋 Reference (Referência)

Documentação para consulta durante o desenvolvimento:

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| **[Comandos](./reference/COMANDOS.md)** | Todos os comandos disponíveis | Ao precisar rodar scripts |
| **[Exemplo de Uso](./reference/EXEMPLO_USO.md)** | Casos práticos e workflows | Para entender fluxos de trabalho |
| **[Estrutura do Projeto](./ESTRUTURA_PROJETO.md)** | Organização completa de pastas | Para navegar no codebase |

---

### 🔧 Technical (Documentação Técnica)

Documentação técnica para entender implementações e decisões:

| Documento | Descrição | Quando Usar |
|-----------|-----------|-------------|
| **[Novos Comandos - Summary](./technical/NOVOS_COMANDOS_SUMMARY.md)** | Resumo da implementação de comandos | Para entender o que mudou |
| **[Exemplos de Saída](./.technical/.comandos-exemplos.txt)** | Exemplos de output dos comandos | Para saber o que esperar |
| **[Migration Complete](./technical/MIGRATION_COMPLETE.md)** | Status da migração concluída | Contexto histórico |

---

## 🗺️ Guia de Navegação por Persona

### 👶 Novo Desenvolvedor (Primeiro Dia)

```
1. ../LEIA-ME-PRIMEIRO.md (raiz)
   └─> 2. getting-started/QUICK_START.md
       └─> 3. reference/COMANDOS.md (bookmark para consulta)
           └─> 4. reference/EXEMPLO_USO.md (quando tiver dúvidas)
```

**Objetivo**: Ter o ambiente configurado e rodando em 30 minutos.

---

### 💻 Desenvolvedor Experiente (Novo no Projeto)

```
1. ../README.md (visão geral da arquitetura)
   └─> 2. getting-started/SETUP_INSTRUCTIONS.md (detalhes técnicos)
       └─> 3. technical/NOVOS_COMANDOS_SUMMARY.md (mudanças recentes)
           └─> 4. reference/COMANDOS.md (referência rápida)
```

**Objetivo**: Entender a arquitetura e começar a contribuir em 1 hora.

---

### 🔍 Desenvolvedor Buscando Referência

```
reference/COMANDOS.md → Referência completa de comandos
reference/EXEMPLO_USO.md → Casos práticos e troubleshooting
```

**Objetivo**: Resolver dúvidas específicas rapidamente.

---

### 🏗️ Tech Lead / Arquiteto

```
1. ../README.md (arquitetura geral)
   └─> 2. technical/NOVOS_COMANDOS_SUMMARY.md (decisões técnicas)
       └─> 3. ../IMPLEMENTATION_STATUS.md (status do projeto)
           └─> 4. complete-next-js-migration.plan.md (plano de migração)
```

**Objetivo**: Entender decisões arquiteturais e planejar próximos passos.

---

## 📊 Estrutura da Documentação

```
docs/
├── README.md (você está aqui!)
│
├── getting-started/        # 🚀 Para começar
│   ├── QUICK_START.md     # Setup em 5 minutos
│   └── SETUP_INSTRUCTIONS.md  # Setup detalhado
│
├── reference/              # 📋 Consulta durante desenvolvimento
│   ├── COMANDOS.md        # Referência completa de comandos
│   └── EXEMPLO_USO.md     # Casos práticos e troubleshooting
│
└── technical/              # 🔧 Documentação técnica
    ├── NOVOS_COMANDOS_SUMMARY.md  # Implementação de comandos
    ├── .comandos-exemplos.txt     # Exemplos de output
    └── MIGRATION_COMPLETE.md      # Status de migração
```

---

## 🎯 Casos de Uso Comuns

### "Quero rodar o projeto pela primeira vez"
→ [Quick Start](./getting-started/QUICK_START.md)

### "Tenho um erro e não sei o que fazer"
→ [Setup Instructions - Troubleshooting](./getting-started/SETUP_INSTRUCTIONS.md#-troubleshooting)  
→ [Exemplo de Uso - Troubleshooting](./reference/EXEMPLO_USO.md#-cen%C3%A1rios-de-troubleshooting)

### "Esqueci qual comando usar"
→ [Comandos - Resumo](./reference/COMANDOS.md#-comandos-principais-raiz-do-projeto)

### "Como faço X no dia a dia?"
→ [Exemplo de Uso - Fluxo Diário](./reference/EXEMPLO_USO.md#-fluxo-de-trabalho-di%C3%A1rio)

### "Quero entender as decisões técnicas"
→ [Novos Comandos Summary](./technical/NOVOS_COMANDOS_SUMMARY.md)

### "O que foi implementado na migração?"
→ [Migration Complete](./technical/MIGRATION_COMPLETE.md)

---

## 📑 Documentação Adicional (Raiz do Projeto)

Alguns documentos importantes ficam na raiz por convenção:

| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| **README.md** | `/README.md` | Visão geral do projeto e arquitetura |
| **LEIA-ME-PRIMEIRO.md** | `/LEIA-ME-PRIMEIRO.md` | Guia de boas-vindas |
| **IMPLEMENTATION_STATUS.md** | `/IMPLEMENTATION_STATUS.md` | Status atual de implementação |
| **complete-next-js-migration.plan.md** | `/complete-next-js-migration.plan.md` | Plano de migração completo |

---

## 🔄 Fluxo Completo: Do Zero ao Desenvolvimento

```bash
# 1. Clone o repositório
git clone <repo>
cd meu-humor-nextjs

# 2. Leia a documentação inicial
# Leia: LEIA-ME-PRIMEIRO.md
# Leia: docs/getting-started/QUICK_START.md

# 3. Instale dependências
npm run install:all

# 4. Configure ambiente
# Crie backend/.env e .env.local
# Veja: docs/getting-started/SETUP_INSTRUCTIONS.md

# 5. Configure banco de dados
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..

# 6. Rode o projeto!
npm run dev

# 7. Durante desenvolvimento, consulte:
# - docs/reference/COMANDOS.md (comandos)
# - docs/reference/EXEMPLO_USO.md (casos práticos)
```

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns

1. **Erro ao instalar dependências**
   - Verifique versão do Node.js (18+)
   - Limpe cache: `npm cache clean --force`
   - Tente: `rm -rf node_modules package-lock.json && npm install`

2. **Backend não conecta ao banco**
   - Verifique `DATABASE_URL` no `backend/.env`
   - Teste conexão: `cd backend && npm run prisma:studio`

3. **Frontend não encontra backend**
   - Verifique se backend está rodando em `http://localhost:3001`
   - Verifique `NEXT_PUBLIC_API_URL` no `.env.local`

4. **Portas já em uso**
   - Backend (3001): `lsof -ti:3001 | xargs kill -9`
   - Frontend (3000): `lsof -ti:3000 | xargs kill -9`

Para mais detalhes: [Setup Instructions - Troubleshooting](./getting-started/SETUP_INSTRUCTIONS.md#-troubleshooting)

---

## 🎓 Dicas para Novos Desenvolvedores

### ✅ Do's

- ✅ Leia `LEIA-ME-PRIMEIRO.md` antes de começar
- ✅ Use `npm run dev` para desenvolvimento diário
- ✅ Consulte `docs/reference/COMANDOS.md` frequentemente
- ✅ Execute `npm run install:all` após pull de mudanças
- ✅ Mantenha os `.env` atualizados

### ❌ Don'ts

- ❌ Não commite arquivos `.env` ou `.env.local`
- ❌ Não modifique `schema.prisma` sem rodar migrations
- ❌ Não rode `npm install` manualmente em cada pasta
- ❌ Não force push para main/master
- ❌ Não pule o onboarding da documentação

---

## 📈 Roadmap de Aprendizado

### Semana 1: Setup e Familiarização
- [ ] Configurar ambiente local
- [ ] Rodar projeto com sucesso
- [ ] Criar conta e testar funcionalidades
- [ ] Entender estrutura de pastas
- [ ] Fazer primeiro commit

### Semana 2: Desenvolvimento Básico
- [ ] Implementar uma feature simples
- [ ] Entender fluxo de autenticação
- [ ] Trabalhar com API do backend
- [ ] Usar Prisma para queries
- [ ] Criar componente React

### Semana 3: Desenvolvimento Avançado
- [ ] Implementar feature complexa
- [ ] Trabalhar com Zustand
- [ ] Integrar Google Gemini AI
- [ ] Implementar testes
- [ ] Revisar código de outros

### Mês 2+: Contribuições Significativas
- [ ] Arquitetar novas features
- [ ] Mentorar novos desenvolvedores
- [ ] Melhorar documentação
- [ ] Otimizar performance
- [ ] Planejar melhorias arquiteturais

---

## 🔗 Links Úteis

### Documentação Externa

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com
- **Zustand**: https://docs.pmnd.rs/zustand
- **Chart.js**: https://www.chartjs.org/docs

### Ferramentas

- **Google Gemini**: https://ai.google.dev
- **Supabase**: https://supabase.com/docs
- **Upstash Redis**: https://docs.upstash.com

---

## 📝 Como Contribuir com a Documentação

A documentação é um documento vivo! Se você encontrar:

- **Erros ou informações desatualizadas**: Corrija e faça PR
- **Falta de clareza**: Melhore a explicação
- **Casos de uso não documentados**: Adicione exemplos
- **Novos comandos/features**: Documente-os

### Template para Novas Páginas

```markdown
# Título da Página

## Objetivo

O que esta página documenta e quando usar.

## Conteúdo Principal

Informação detalhada aqui.

## Exemplos

Exemplos práticos.

## Troubleshooting

Problemas comuns e soluções.

## Links Relacionados

- Link para doc A
- Link para doc B
```

---

## 🎉 Conclusão

Esta documentação foi criada para facilitar sua jornada no projeto **Meu Humor**. Siga o guia de navegação por persona acima e você estará produtivo rapidamente!

**Dúvidas?** Consulte a seção de ajuda ou entre em contato com a equipe.

**Bem-vindo ao time!** 💙

---

**Última atualização**: 2025-10-15  
**Mantido por**: Equipe Meu Humor


