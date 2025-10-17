import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AuthTokenProvider } from "@/components/providers/AuthTokenProvider";
import { Toaster } from 'sonner';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.meuhumor.com.br'),
  title: {
    default: "Meu Humor - Acompanhe seu bem-estar mental com IA",
    template: "%s | Meu Humor",
  },
  description: "Registre seu humor diariamente, receba insights personalizados e gere prontuários profissionais com inteligência artificial. Cuide da sua saúde mental de forma inteligente.",
  keywords: [
    'saúde mental',
    'diário de humor',
    'bem-estar',
    'inteligência artificial',
    'prontuários',
    'psicologia',
    'autoconhecimento',
    'terapia',
    'mood tracking',
  ],
  authors: [{ name: 'Meu Humor' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.meuhumor.com.br',
    siteName: 'Meu Humor',
    title: 'Meu Humor - Acompanhe seu bem-estar mental com IA',
    description: 'Registre seu humor diariamente, receba insights personalizados e gere prontuários profissionais com inteligência artificial.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <SessionProvider>
          <AuthTokenProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthTokenProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
