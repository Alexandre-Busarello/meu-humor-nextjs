/**
 * Serviço de E-mail
 * 
 * Este arquivo contém funções para envio de e-mails.
 * Atualmente são apenas templates, você precisa integrar com um serviço real.
 * 
 * Serviços recomendados:
 * - Resend (https://resend.com) - Moderno e fácil
 * - SendGrid (https://sendgrid.com) - Tradicional e confiável
 * - Amazon SES (https://aws.amazon.com/ses/) - Econômico
 * - Postmark (https://postmarkapp.com) - Focado em transacionais
 */

// ============================================
// INTERFACES
// ============================================

import { Resend } from 'resend';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

interface PsychologistLeadData {
  name: string;
  email: string;
  phone: string;
  crp?: string;
  message?: string;
}

// ============================================
// FUNÇÃO PRINCIPAL DE ENVIO
// ============================================

/**
 * Envia um e-mail usando Resend
 * 
 * Certifique-se de ter a variável RESEND_API_KEY configurada no .env.local
 * 
 * Para instalar o Resend:
 * npm install resend
 * 
 * Para obter API key:
 * 1. Acesse https://resend.com
 * 2. Crie uma conta
 * 3. Vá em API Keys e crie uma nova
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Se não tiver Resend configurado, apenas loga
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ [EMAIL] RESEND_API_KEY não configurada. E-mail não será enviado.');
    console.log('📧 [EMAIL] Simulando envio de e-mail:');
    console.log('   Para:', options.to);
    console.log('   Assunto:', options.subject);
    console.log('   HTML:', options.html.substring(0, 100) + '...');
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Meu Humor <noreply@meuhumor.com.br>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('❌ [EMAIL] Erro ao enviar e-mail:', error);
      throw new Error(error.message);
    }

    console.log('✅ [EMAIL] E-mail enviado com sucesso:', data?.id);
  } catch (error: any) {
    // Se o Resend não estiver instalado, apenas avisa
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️ [EMAIL] Resend não está instalado. Execute: npm install resend');
      console.log('📧 [EMAIL] Simulando envio de e-mail:');
      console.log('   Para:', options.to);
      console.log('   Assunto:', options.subject);
      return;
    }
    
    // Outros erros são propagados
    console.error('❌ [EMAIL] Erro crítico ao enviar e-mail:', error);
    throw error;
  }
}

// ============================================
// TEMPLATES DE E-MAIL
// ============================================

/**
 * Template base para e-mails
 */
function baseEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meu Humor</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 0 0 10px 10px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .info-box {
          background: #f9f9f9;
          border-left: 4px solid #667eea;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧠 Meu Humor</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Meu Humor. Todos os direitos reservados.</p>
        <p>Você recebeu este e-mail porque interagiu com nossa plataforma.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template de notificação para a equipe sobre novo lead
 */
function newLeadNotificationTemplate(lead: PsychologistLeadData): string {
  const content = `
    <h2>🎉 Novo Lead de Psicólogo!</h2>
    <p>Um novo psicólogo demonstrou interesse na plataforma white-label.</p>
    
    <div class="info-box">
      <h3>Informações do Lead:</h3>
      <p><strong>Nome:</strong> ${lead.name}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
      <p><strong>Telefone:</strong> ${lead.phone}</p>
      ${lead.crp ? `<p><strong>CRP:</strong> ${lead.crp}</p>` : ''}
      ${lead.message ? `<p><strong>Mensagem:</strong><br>${lead.message}</p>` : ''}
    </div>
    
    <p><strong>Próximos passos:</strong></p>
    <ol>
      <li>Entrar em contato em até 24 horas</li>
      <li>Agendar demonstração da plataforma</li>
      <li>Apresentar proposta comercial</li>
    </ol>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads/psicologos" class="button">
      Ver Lead no Dashboard
    </a>
  `;
  
  return baseEmailTemplate(content);
}

/**
 * Template de confirmação para o psicólogo
 */
function psychologistConfirmationTemplate(lead: PsychologistLeadData): string {
  const firstName = lead.name.split(' ')[0];
  
  const content = `
    <h2>Olá, ${firstName}! 👋</h2>
    
    <p>Recebemos sua solicitação e agradecemos o interesse na plataforma <strong>Meu Humor</strong>!</p>
    
    <p>Nossa equipe vai analisar suas informações e entrar em contato em breve para:</p>
    
    <ul>
      <li>✅ Apresentar a plataforma white-label em detalhes</li>
      <li>✅ Demonstrar as funcionalidades e recursos</li>
      <li>✅ Entender suas necessidades específicas</li>
      <li>✅ Discutir as possibilidades de personalização</li>
    </ul>
    
    <div class="info-box">
      <h3>📋 Suas informações:</h3>
      <p><strong>Nome:</strong> ${lead.name}</p>
      <p><strong>E-mail:</strong> ${lead.email}</p>
      <p><strong>Telefone:</strong> ${lead.phone}</p>
      ${lead.crp ? `<p><strong>CRP:</strong> ${lead.crp}</p>` : ''}
    </div>
    
    <p>Enquanto isso, você pode explorar mais sobre a plataforma:</p>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/para-psicologos" class="button">
      Conhecer a Plataforma
    </a>
    
    <p>Se tiver alguma dúvida, não hesite em responder este e-mail!</p>
    
    <p>Atenciosamente,<br><strong>Equipe Meu Humor</strong></p>
  `;
  
  return baseEmailTemplate(content);
}

// ============================================
// FUNÇÕES DE ALTO NÍVEL
// ============================================

/**
 * Envia notificação de novo lead para a equipe
 */
export async function sendNewLeadNotification(lead: PsychologistLeadData): Promise<void> {
  const emailTo = process.env.SALES_EMAIL || 'vendas@meuhumor.com';
  
  await sendEmail({
    to: emailTo,
    subject: `🎯 Novo Lead: ${lead.name}`,
    html: newLeadNotificationTemplate(lead),
  });
}

/**
 * Envia e-mail de confirmação para o psicólogo
 */
export async function sendPsychologistConfirmation(lead: PsychologistLeadData): Promise<void> {
  await sendEmail({
    to: lead.email,
    subject: 'Recebemos sua solicitação - Meu Humor',
    html: psychologistConfirmationTemplate(lead),
  });
}

/**
 * Envia ambos os e-mails (notificação + confirmação)
 */
export async function sendLeadEmails(lead: PsychologistLeadData): Promise<void> {
  try {
    // Enviar em paralelo
    await Promise.all([
      sendNewLeadNotification(lead),
      sendPsychologistConfirmation(lead),
    ]);
    
    console.log('✅ E-mails enviados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao enviar e-mails:', error);
    // Não falhar a criação do lead se o e-mail falhar
    // Apenas logar o erro
  }
}

