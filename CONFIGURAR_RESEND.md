# 📧 Como Configurar o Resend

## 🚀 Guia Rápido

### 1️⃣ Instalar o Resend

```bash
npm install resend @react-email/render @react-email/components
```

> 📦 **Importante:** O Resend requer `@react-email/render` como dependência peer

### 2️⃣ Criar conta no Resend

1. Acesse: https://resend.com
2. Clique em "Sign Up" (cadastro gratuito)
3. Confirme seu e-mail

### 3️⃣ Obter API Key

1. No dashboard do Resend, vá em **"API Keys"**
2. Clique em **"Create API Key"**
3. Dê um nome: `meu-humor-production`
4. Copie a key (começa com `re_`)

### 4️⃣ Configurar no projeto

Edite o arquivo `.env.local` e adicione:

```bash
# Resend Configuration
RESEND_API_KEY="re_sua_api_key_aqui"
SALES_EMAIL="vendas@meuhumor.com.br"
EMAIL_FROM="Meu Humor <noreply@meuhumor.com.br>"
```

### 5️⃣ Verificar domínio (Opcional mas recomendado)

#### Domínio próprio (Produção)

1. No Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `meuhumor.com.br`
4. Configure os registros DNS:

```
Tipo    Nome             Valor
----    ----             -----
TXT     _resend          [valor fornecido pelo Resend]
MX      @                feedback-smtp.resend.com
TXT     @                v=spf1 include:amazonses.com ~all
TXT     resend._domainkey [valor fornecido pelo Resend]
```

5. Aguarde verificação (pode levar até 48h)
6. Após verificado, atualize o `.env.local`:

```bash
EMAIL_FROM="Meu Humor <noreply@meuhumor.com.br>"
```

#### Domínio de teste (Desenvolvimento)

Por padrão, o Resend fornece um domínio de teste:

```bash
EMAIL_FROM="Meu Humor <onboarding@resend.dev>"
```

**⚠️ Limitações do domínio de teste:**
- Só envia para e-mails verificados no Resend
- Máximo de 100 e-mails por dia
- Não recomendado para produção

### 6️⃣ Testar

```bash
# Rodar o projeto
npm run dev

# Acessar a landing de psicólogos
# http://localhost:3000/para-psicologos

# Preencher e enviar o formulário
# Verificar os logs no terminal
```

---

## ✅ Verificação

### Logs esperados

**Quando configurado corretamente:**
```
✅ [EMAIL] E-mail enviado com sucesso: abc123xyz
```

**Quando não configurado:**
```
⚠️ [EMAIL] RESEND_API_KEY não configurada. E-mail não será enviado.
📧 [EMAIL] Simulando envio de e-mail:
   Para: exemplo@email.com
   Assunto: Novo Lead: Dr. João Silva
```

**Quando não instalado:**
```
⚠️ [EMAIL] Resend não está instalado. Execute: npm install resend
📧 [EMAIL] Simulando envio de e-mail:
```

---

## 📊 Planos do Resend

### Grátis (Free)
- ✅ 100 e-mails por dia
- ✅ 1 domínio verificado
- ✅ API completa
- ✅ Suporte a React Email
- ✅ Webhooks
- ✅ Logs por 30 dias

### Pro (US$ 20/mês)
- ✅ 50.000 e-mails por mês
- ✅ Domínios ilimitados
- ✅ Logs por 90 dias
- ✅ Suporte prioritário

### Enterprise (Customizado)
- ✅ Volume personalizado
- ✅ IP dedicado
- ✅ SLA garantido

**💡 Recomendação:** Comece com o plano gratuito. É suficiente para até 3.000 leads/mês!

---

## 🔍 Monitoramento

### Ver e-mails enviados

1. Acesse: https://resend.com/emails
2. Veja todos os e-mails enviados
3. Status: delivered, bounced, complained
4. Clique em um e-mail para ver detalhes

### Métricas importantes

- **Delivery Rate:** % de e-mails entregues
- **Bounce Rate:** % de e-mails rejeitados
- **Complaint Rate:** % marcados como spam

**Meta:** 
- Delivery > 95%
- Bounce < 2%
- Complaint < 0.1%

---

## 🐛 Troubleshooting

### E-mail não está sendo enviado

1. **Verificar API Key:**
```bash
echo $RESEND_API_KEY
# Deve retornar: re_xxxxx
```

2. **Verificar instalação:**
```bash
npm list resend
# Deve mostrar a versão instalada
```

3. **Verificar logs:**
Procure mensagens de erro no terminal onde o Next.js está rodando

### E-mails caem na caixa de spam

1. **Configure SPF, DKIM, DMARC** (essencial para domínio próprio)
2. Use domínio verificado (não use @gmail.com, @hotmail.com)
3. Evite palavras "spammy" no assunto
4. Inclua link de unsubscribe
5. Mantenha bounce rate baixo

### "Module not found: resend"

```bash
# Instalar Resend
npm install resend

# Verificar instalação
npm list resend

# Reiniciar servidor
npm run dev
```

### "Invalid API key"

1. Verificar se copiou a key corretamente
2. Gerar nova API key no dashboard do Resend
3. Atualizar `.env.local`
4. Reiniciar o servidor

---

## 🎨 Personalização dos E-mails

### Alterar remetente

No `.env.local`:

```bash
EMAIL_FROM="Nome da Empresa <contato@seudominio.com>"
```

### Alterar destinatário da equipe

No `.env.local`:

```bash
SALES_EMAIL="comercial@seudominio.com"
```

### Personalizar templates

Os templates estão em: `lib/email-service.ts`

Edite as funções:
- `newLeadNotificationTemplate()` - E-mail para equipe
- `psychologistConfirmationTemplate()` - E-mail para psicólogo

---

## 🚀 Próximos Passos

### 1. React Email (Templates em JSX)

Crie templates mais bonitos usando React:

```bash
npm install react-email @react-email/components
```

Crie `emails/new-lead.tsx`:

```tsx
import { Html, Button, Container, Heading, Text } from '@react-email/components';

export default function NewLeadEmail({ name, email }: { name: string; email: string }) {
  return (
    <Html>
      <Container>
        <Heading>Novo Lead! 🎉</Heading>
        <Text>Nome: {name}</Text>
        <Text>E-mail: {email}</Text>
        <Button href="https://meuhumor.com.br/admin/leads">
          Ver Lead
        </Button>
      </Container>
    </Html>
  );
}
```

### 2. Webhooks

Configure webhooks para receber eventos:
- E-mail entregue
- E-mail aberto
- E-mail clicado
- Bounce
- Reclamação de spam

URL do webhook: `https://seudominio.com/api/webhooks/resend`

### 3. Tracking

Adicione tracking de abertura e cliques:

```typescript
await resend.emails.send({
  from: 'Meu Humor <noreply@meuhumor.com.br>',
  to: 'destinatario@email.com',
  subject: 'Assunto',
  html: '<p>Conteúdo</p>',
  tags: [
    { name: 'category', value: 'psychologist-lead' }
  ]
});
```

---

## 📚 Recursos

- **Docs:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference/introduction
- **Dashboard:** https://resend.com/emails
- **Status:** https://status.resend.com

---

## ✨ Pronto!

Agora você tem envio de e-mails profissional configurado! 🎉

**Lembre-se:**
- ✅ Sempre teste em desenvolvimento primeiro
- ✅ Configure domínio próprio em produção
- ✅ Monitore métricas de entrega
- ✅ Mantenha templates responsivos

---

**Última atualização:** 17 de outubro de 2025

