# 🚀 Setup - SEO e Landing para Psicólogos

## ✅ O que foi implementado

### 1. **Sitemap XML** (`/sitemap.xml`)
- Arquivo: `app/sitemap.ts`
- Lista todas as páginas do site
- Atualização automática

### 2. **Robots.txt** (`/robots.txt`)
- Arquivo: `app/robots.ts`
- Controla acesso dos crawlers
- Bloqueia páginas privadas

### 3. **Landing Page para Psicólogos** (`/para-psicologos`)
- Arquivo: `app/para-psicologos/page.tsx`
- Design responsivo e profissional
- Formulário de captura de leads
- 6 benefícios + 4 recursos detalhados

### 4. **API de Leads**
- Endpoint: `/api/psychologist-leads`
- Salva leads no banco de dados
- POST para criar, GET para listar

### 5. **Model Prisma**
- Tabela: `psychologist_leads`
- Status do lead (NEW, CONTACTED, etc.)
- Campos: nome, email, phone, CRP, mensagem

---

## 🔧 Configuração Necessária

### 1. Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local` com:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/meu_humor"
DIRECT_URL="postgresql://user:password@localhost:5432/meu_humor"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# App URL (para sitemap)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Gemini AI
GEMINI_API_KEY="sua-api-key-aqui"

# Redis (opcional)
REDIS_URL="redis://localhost:6379"
```

**⚠️ Em produção**, substitua:
- `NEXT_PUBLIC_APP_URL` pela URL real (ex: `https://meuhumor.com`)
- As credenciais do banco de dados pela URL do Vercel/Supabase/etc

### 2. Executar Migration

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar a tabela no banco (desenvolvimento)
npx prisma migrate dev --name add_psychologist_leads_table

# OU em produção
npx prisma migrate deploy
```

### 3. Testar localmente

```bash
# Instalar dependências (se necessário)
npm install

# Rodar o projeto
npm run dev
```

### 4. Testar as páginas

Abra no navegador:
- **Sitemap:** http://localhost:3000/sitemap.xml
- **Robots:** http://localhost:3000/robots.txt
- **Landing:** http://localhost:3000/para-psicologos
- **Home:** http://localhost:3000

---

## 📋 Checklist Pós-Deploy

Após fazer deploy em produção:

- [ ] Verificar se `/sitemap.xml` está acessível
- [ ] Verificar se `/robots.txt` está acessível
- [ ] Testar formulário em `/para-psicologos`
- [ ] Submeter sitemap no [Google Search Console](https://search.google.com/search-console)
- [ ] Submeter sitemap no [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Configurar notificações de e-mail para novos leads
- [ ] Criar dashboard admin para gerenciar leads

---

## 🎯 Próximos Passos Recomendados

### Curto Prazo (1-2 semanas)
1. ✅ Implementar notificações por e-mail quando novo lead chegar
2. ✅ Adicionar Google reCAPTCHA no formulário (prevenir spam)
3. ✅ Criar página admin para visualizar leads

### Médio Prazo (1 mês)
4. ✅ Adicionar analytics (Google Analytics ou Plausible)
5. ✅ Criar seção de FAQ na landing
6. ✅ Adicionar depoimentos de psicólogos

### Longo Prazo (3 meses)
7. ✅ Implementar chat ao vivo (Intercom/Drift)
8. ✅ Criar material rico (e-book sobre uso da plataforma)
9. ✅ Adicionar agendamento de demo (Calendly)

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `docs/SEO_E_LANDING_PSICOLOGO.md` - Documentação completa

---

## 🐛 Problemas Comuns

### "Environment variable not found: DATABASE_URL"
**Solução:** Criar arquivo `.env.local` com as variáveis de ambiente

### "Table does not exist in the database"
**Solução:** Executar `npx prisma migrate dev` ou `npx prisma db push`

### Sitemap retorna 404
**Solução:** 
1. Fazer rebuild do projeto: `npm run build`
2. Verificar se `NEXT_PUBLIC_APP_URL` está definido
3. Reiniciar o servidor

### Formulário não envia
**Solução:**
1. Abrir DevTools (F12) e verificar erros no Console
2. Verificar se a API está respondendo em `/api/psychologist-leads`
3. Confirmar que o banco de dados está conectado

---

## 📞 Contato

Para suporte técnico ou dúvidas:
- Consulte a documentação do Next.js: https://nextjs.org/docs
- Veja exemplos do Prisma: https://www.prisma.io/docs

---

**Data:** 17 de outubro de 2025
**Versão:** 1.0

