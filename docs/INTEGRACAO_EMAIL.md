# 📧 Integração de E-mail

## Visão Geral

O sistema de captura de leads já possui templates de e-mail prontos. Este guia mostra como integrar com serviços de envio reais.

---

## 🚀 Opção 1: Resend (Recomendado)

**Por que Resend?**
- ✅ Moderno e fácil de usar
- ✅ API simples e bem documentada
- ✅ Suporte a React Email (templates em JSX)
- ✅ 100 e-mails/dia grátis
- ✅ Domínio personalizado incluído

### Passo 1: Criar conta

1. Acesse https://resend.com
2. Crie uma conta grátis
3. Verifique seu e-mail

### Passo 2: Obter API Key

1. No dashboard, vá em "API Keys"
2. Clique em "Create API Key"
3. Dê um nome (ex: "meu-humor-production")
4. Copie a key (começa com `re_`)

### Passo 3: Configurar domínio (opcional mas recomendado)

1. Vá em "Domains"
2. Adicione seu domínio (ex: `meuhumor.com`)
3. Configure os registros DNS (SPF, DKIM, DMARC)
4. Aguarde verificação (pode levar até 48h)

### Passo 4: Instalar dependência

```bash
npm install resend
```

### Passo 5: Adicionar variável de ambiente

No arquivo `.env.local`:

```bash
RESEND_API_KEY="re_sua_api_key_aqui"
SALES_EMAIL="vendas@meuhumor.com"
```

### Passo 6: Atualizar o serviço de e-mail

Edite o arquivo `lib/email-service.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: 'Meu Humor <noreply@meuhumor.com>', // Use seu domínio verificado
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error(error.message);
  }

  console.log('✅ E-mail enviado:', data?.id);
}
```

### Passo 7: Testar

```bash
# Rode o projeto
npm run dev

# Teste o formulário em:
# http://localhost:3000/para-psicologos
```

---

## 📮 Opção 2: SendGrid

**Por que SendGrid?**
- ✅ Tradicional e confiável
- ✅ 100 e-mails/dia grátis
- ✅ Excelente deliverability
- ✅ Analytics detalhado

### Passo 1: Criar conta

1. Acesse https://sendgrid.com
2. Crie uma conta grátis
3. Complete o onboarding

### Passo 2: Obter API Key

1. No dashboard, vá em "Settings" → "API Keys"
2. Clique em "Create API Key"
3. Escolha "Full Access"
4. Copie a key (começa com `SG.`)

### Passo 3: Verificar remetente

1. Vá em "Settings" → "Sender Authentication"
2. Verifique um e-mail único (ex: noreply@meuhumor.com)
3. OU configure domínio completo (melhor para produção)

### Passo 4: Instalar dependência

```bash
npm install @sendgrid/mail
```

### Passo 5: Adicionar variável de ambiente

No arquivo `.env.local`:

```bash
SENDGRID_API_KEY="SG.sua_api_key_aqui"
SALES_EMAIL="vendas@meuhumor.com"
```

### Passo 6: Atualizar o serviço de e-mail

Edite o arquivo `lib/email-service.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(options: EmailOptions): Promise<void> {
  const msg = {
    from: 'noreply@meuhumor.com', // E-mail verificado no SendGrid
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ E-mail enviado com sucesso');
  } catch (error: any) {
    console.error('❌ Erro ao enviar e-mail:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}
```

---

## 📨 Opção 3: Amazon SES

**Por que Amazon SES?**
- ✅ Muito econômico (US$ 0,10 por 1.000 e-mails)
- ✅ Altamente escalável
- ✅ Integração com AWS
- ✅ Excelente para grandes volumes

### Passo 1: Configurar AWS

1. Crie conta na AWS
2. Acesse o console do SES
3. Verifique seu domínio ou e-mail
4. Solicite saída do sandbox (para produção)

### Passo 2: Obter credenciais

1. Crie um usuário IAM com permissões SES
2. Obtenha `Access Key ID` e `Secret Access Key`
3. Anote a região (ex: `us-east-1`)

### Passo 3: Instalar dependências

```bash
npm install @aws-sdk/client-ses
```

### Passo 4: Adicionar variáveis de ambiente

```bash
AWS_ACCESS_KEY_ID="sua_access_key"
AWS_SECRET_ACCESS_KEY="sua_secret_key"
AWS_REGION="us-east-1"
SALES_EMAIL="vendas@meuhumor.com"
```

### Passo 5: Atualizar o serviço de e-mail

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(options: EmailOptions): Promise<void> {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: options.html,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: options.subject,
      },
    },
    Source: 'noreply@meuhumor.com',
  });

  try {
    const response = await sesClient.send(command);
    console.log('✅ E-mail enviado:', response.MessageId);
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    throw error;
  }
}
```

---

## 🎨 Melhorando os Templates

### Usando React Email (com Resend)

React Email permite criar templates usando JSX:

```bash
npm install react-email @react-email/components
```

Crie `emails/new-lead.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from '@react-email/components';

interface NewLeadEmailProps {
  name: string;
  email: string;
  phone: string;
  crp?: string;
}

export default function NewLeadEmail({ name, email, phone, crp }: NewLeadEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>🎉 Novo Lead de Psicólogo!</Heading>
          <Text>Um novo psicólogo demonstrou interesse na plataforma.</Text>
          <Section>
            <Text><strong>Nome:</strong> {name}</Text>
            <Text><strong>E-mail:</strong> {email}</Text>
            <Text><strong>Telefone:</strong> {phone}</Text>
            {crp && <Text><strong>CRP:</strong> {crp}</Text>}
          </Section>
          <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/leads`}>
            Ver no Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 🧪 Testando E-mails

### 1. Modo de Desenvolvimento (Logs)

Já está configurado! Os e-mails são apenas logados no console:

```bash
npm run dev
# Teste o formulário e veja os logs no terminal
```

### 2. MailHog (Servidor SMTP local)

```bash
# Instalar MailHog
brew install mailhog  # macOS
# ou baixe de: https://github.com/mailhog/MailHog/releases

# Rodar
mailhog

# Acessar interface: http://localhost:8025
```

Configure SMTP no código:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
});

export async function sendEmail(options: EmailOptions): Promise<void> {
  await transporter.sendMail({
    from: 'noreply@meuhumor.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
```

### 3. Mailtrap (Sandbox de E-mail)

1. Crie conta em https://mailtrap.io
2. Obtenha credenciais SMTP
3. Use com nodemailer (similar ao MailHog)

---

## 📊 Monitoramento

### Logs importantes

```typescript
// No arquivo lib/email-service.ts
console.log('📧 Enviando e-mail para:', options.to);
console.log('✅ E-mail enviado com sucesso');
console.error('❌ Erro ao enviar:', error);
```

### Métricas para acompanhar

- **Taxa de entrega:** E-mails que chegaram com sucesso
- **Taxa de abertura:** E-mails abertos (com tracking)
- **Taxa de rejeição:** E-mails rejeitados (bounce)
- **Reclamações de spam:** Usuários que marcaram como spam

### Dashboard de cada serviço

- **Resend:** https://resend.com/emails
- **SendGrid:** https://app.sendgrid.com/statistics
- **Amazon SES:** AWS Console → SES → Sending Statistics

---

## 🚨 Troubleshooting

### E-mails não chegam

1. Verificar se API key está correta
2. Verificar se domínio/e-mail foi verificado
3. Checar se não está no spam
4. Verificar logs do serviço
5. Verificar configuração de DNS (SPF, DKIM, DMARC)

### E-mails caem no spam

1. **Configurar SPF, DKIM, DMARC** (essencial!)
2. Usar domínio próprio verificado
3. Evitar palavras "spammy" no assunto
4. Ter link de unsubscribe
5. Manter taxa de rejeição baixa

### Rate limiting

Se enviar muitos e-mails rapidamente:

```typescript
// Adicionar delay entre e-mails
import { setTimeout } from 'timers/promises';

export async function sendLeadEmails(lead: PsychologistLeadData) {
  await sendNewLeadNotification(lead);
  await setTimeout(1000); // Espera 1 segundo
  await sendPsychologistConfirmation(lead);
}
```

---

## 📝 Boas Práticas

### ✅ DO

- Use domínio próprio verificado
- Configure SPF, DKIM e DMARC
- Tenha endereço de resposta válido
- Inclua link de unsubscribe
- Teste antes de colocar em produção
- Monitore métricas de entrega
- Use templates responsivos
- Personalize os e-mails

### ❌ DON'T

- Não use domínios genéricos (@gmail.com, @hotmail.com)
- Não envie sem verificar o domínio
- Não ignore bounces e reclamações
- Não use assuntos enganosos
- Não exagere em formatação (maiúsculas, exclamações!!!)
- Não compre listas de e-mail
- Não envie sem consentimento

---

## 💰 Comparação de Preços

| Serviço | Grátis | Pago | Melhor para |
|---------|--------|------|-------------|
| **Resend** | 100/dia | US$ 20/mês (50k) | Startups modernas |
| **SendGrid** | 100/dia | US$ 20/mês (40k) | Negócios tradicionais |
| **Amazon SES** | 62k (1º ano) | US$ 0.10/1k | Alto volume |
| **Postmark** | - | US$ 15/mês (10k) | Transacionais |

---

## 🎓 Recursos Adicionais

### Documentação
- [Resend Docs](https://resend.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com)
- [AWS SES Docs](https://docs.aws.amazon.com/ses/)
- [React Email](https://react.email)

### Ferramentas
- [Mail Tester](https://www.mail-tester.com) - Teste de spam score
- [MXToolbox](https://mxtoolbox.com) - Verificação de DNS
- [Can I Email](https://www.caniemail.com) - Compatibilidade CSS

---

**Última atualização:** 17 de outubro de 2025

