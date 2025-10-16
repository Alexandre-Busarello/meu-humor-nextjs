import { ReactNode } from 'react';
import Link from 'next/link';
import { Brain, Home, Plus, FileText, User } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center space-x-2">
              <div className="bg-primary-100 p-2 rounded-full">
                <Brain className="h-5 w-5 text-primary-500" />
              </div>
              <span className="text-xl font-semibold text-neutral-800">Meu Humor</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/home" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Início</span>
              </Link>
              <Link 
                href="/registrar" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Registrar</span>
              </Link>
              <Link 
                href="/historico" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Histórico</span>
              </Link>
              <Link 
                href="/perfil" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Perfil</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-10">
        <div className="flex justify-around items-center py-2">
          <Link href="/home" className="flex flex-col items-center p-2 text-neutral-600 hover:text-primary-500">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Início</span>
          </Link>
          <Link href="/registrar" className="flex flex-col items-center p-2 text-neutral-600 hover:text-primary-500">
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Registrar</span>
          </Link>
          <Link href="/historico" className="flex flex-col items-center p-2 text-neutral-600 hover:text-primary-500">
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Histórico</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center p-2 text-neutral-600 hover:text-primary-500">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

