# Configuração do Banco de Dados na Vercel

## 🔧 Problema: Connection Pool Timeout

Se você estiver recebendo o erro:
```
Timed out fetching a new connection from the connection pool
```

Isso acontece porque a Vercel executa múltiplas funções serverless simultaneamente, e cada uma precisa de uma conexão com o banco.

## ✅ Solução: Connection Pooling

### **1. Use Pooled Connection**

Na Vercel, configure **DUAS** variáveis de ambiente:

#### **DATABASE_URL** (Pooled Connection)
```
postgresql://user:password@host/database?pgbouncer=true&connection_limit=1
```

**Importante:**
- Use a **URL com pooling** (ex: Neon, Supabase, Railway com PgBouncer)
- Adicione `pgbouncer=true` se disponível
- Adicione `connection_limit=1` para cada função serverless usar apenas 1 conexão

#### **DIRECT_URL** (Direct Connection)
```
postgresql://user:password@host:5432/database
```

**Quando usar:**
- Migrations (Prisma precisa de conexão direta)
- Operações que exigem múltiplas statements

### **2. Provedor com Pooling Integrado**

#### **Neon (Recomendado)**
```bash
# Pooled connection (use para DATABASE_URL)
postgres://username:password@ep-xxx.pooler.neon.tech/database?sslmode=require

# Direct connection (use para DIRECT_URL)
postgres://username:password@ep-xxx.neon.tech/database?sslmode=require
```

#### **Supabase**
```bash
# Pooled connection (porta 6543)
postgres://username:password@db.xxx.supabase.co:6543/postgres

# Direct connection (porta 5432)
postgres://username:password@db.xxx.supabase.co:5432/postgres
```

### **3. Verificar Configuração**

Na Vercel:
1. Settings > Environment Variables
2. Verifique se tem **duas** variáveis:
   - `DATABASE_URL` → Pooled
   - `DIRECT_URL` → Direct
3. Ambas devem estar em **Production, Preview, Development**

### **4. Limites Recomendados**

Para Vercel (plano gratuito):
- **Connection Limit**: 1-2 por função
- **Pool Timeout**: 10s (padrão Prisma)
- **Máximo de conexões totais**: Depende do plano do banco

## 🚀 Após Configurar

1. Commit as mudanças
2. Deploy na Vercel
3. Monitore os logs: `vercel logs`
4. Verifique se as conexões estão OK

## 📊 Monitoramento

Adicione aos logs da sua função:
```typescript
console.log('Prisma pool info:', await prisma.$metrics.json());
```

Isso mostra quantas conexões estão ativas.

## ⚠️ Importante

- **NÃO** use o mesmo banco para dev e prod sem pooling
- **NÃO** aumente o `connection_limit` sem necessidade
- **SEMPRE** use URL pooled na DATABASE_URL
- **SEMPRE** use URL direta na DIRECT_URL

---

**Documentação Oficial:**
- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Vercel Serverless Functions Limits](https://vercel.com/docs/functions/serverless-functions/limits)

