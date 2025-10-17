'use client';

import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Emoji ilustrativo */}
        <div className="text-8xl mb-6">🤔</div>
        
        {/* Título */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        {/* Subtítulo */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Página não encontrada
        </h2>
        
        {/* Descrição */}
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe mais ou foi movida. 
          Que tal começar a registrar seu humor?
        </p>
        
        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Ir para a Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>
        
        {/* Links úteis */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-4">Links úteis:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Fazer Login
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/para-psicologos"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Para Psicólogos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

