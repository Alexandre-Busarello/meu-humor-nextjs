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
  title: "Meu Humor - Acompanhe seu bem-estar mental",
  description: "Registre seu humor diariamente e receba insights sobre sua saúde mental com IA",
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
