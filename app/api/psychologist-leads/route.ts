import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendLeadEmails } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, crp, message } = body;

    // Validações básicas
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, e-mail e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      );
    }

    // Salvar lead no banco de dados
    const lead = await prisma.psychologistLead.create({
      data: {
        name,
        email,
        phone,
        crp: crp || null,
        message: message || null,
        status: 'NEW',
        source: 'WEBSITE',
      },
    });

    // Enviar e-mails (não espera para não bloquear a resposta)
    // Se falhar, não impede a criação do lead
    sendLeadEmails({
      name,
      email,
      phone,
      crp: crp || undefined,
      message: message || undefined,
    }).catch((error) => {
      console.error('Erro ao enviar e-mails (não crítico):', error);
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Lead capturado com sucesso',
        id: lead.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao capturar lead de psicólogo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para listar leads (apenas para admin)
export async function GET(req: NextRequest) {
  try {
    // TODO: Adicionar autenticação de admin aqui
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }

    const leads = await prisma.psychologistLead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

