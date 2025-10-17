import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Para Psicólogos - Plataforma White-Label Personalizada',
  description: 'Tenha sua própria plataforma de acompanhamento de pacientes com sua marca, personalização completa e IA integrada. Solução profissional para psicólogos.',
  keywords: [
    'plataforma para psicólogos',
    'white-label',
    'gestão de pacientes',
    'prontuários digitais',
    'psicologia digital',
    'telessaúde',
    'saúde mental',
    'CRP',
  ],
  openGraph: {
    title: 'Para Psicólogos - Plataforma White-Label Personalizada | Meu Humor',
    description: 'Tenha sua própria plataforma de acompanhamento de pacientes com sua marca, personalização completa e IA integrada.',
    type: 'website',
  },
};

export default function ParaPsicologosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

