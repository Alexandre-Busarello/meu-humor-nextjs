import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meu Humor - Acompanhe seu bem-estar mental com IA',
  description: 'Registre seu humor diariamente, receba insights personalizados e gere prontuários profissionais com inteligência artificial. Cuide da sua saúde mental de forma inteligente.',
  keywords: [
    'saúde mental',
    'diário de humor',
    'bem-estar emocional',
    'inteligência artificial',
    'prontuários psicológicos',
    'psicologia',
    'autoconhecimento',
    'terapia digital',
    'mood tracking',
    'registro de humor',
    'análise de humor',
    'saúde emocional',
  ],
  authors: [{ name: 'Meu Humor' }],
  creator: 'Meu Humor',
  publisher: 'Meu Humor',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.meuhumor.com.br',
    siteName: 'Meu Humor',
    title: 'Meu Humor - Acompanhe seu bem-estar mental com IA',
    description: 'Registre seu humor diariamente, receba insights personalizados e gere prontuários profissionais com inteligência artificial.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Meu Humor - Plataforma de acompanhamento de bem-estar mental',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meu Humor - Acompanhe seu bem-estar mental com IA',
    description: 'Registre seu humor diariamente, receba insights personalizados e gere prontuários profissionais com IA.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.meuhumor.com.br',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

