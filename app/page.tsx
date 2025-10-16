import Link from 'next/link';
import { Brain, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-neutral-50">
      {/* Header */}
      <header className="container-responsive py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-100 p-2 rounded-full">
              <Brain className="h-6 w-6 text-primary-500" />
            </div>
            <span className="text-xl font-semibold text-neutral-800">Meu Humor</span>
          </div>
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-responsive py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Acompanhe seu <span className="text-primary-500">bem-estar mental</span> com inteligência artificial
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-8">
            Registre seu humor diariamente, receba insights personalizados e gere prontuários profissionais com IA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?createAccount=true">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-12">
          Por que usar o Meu Humor?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <div className="bg-primary-100 p-3 rounded-full inline-flex mb-4">
              <Brain className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Diário de Humor
            </h3>
            <p className="text-neutral-600">
              Registre seu humor diário com notas e acompanhe padrões ao longo do tempo
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-secondary-100 p-3 rounded-full inline-flex mb-4">
              <Sparkles className="h-6 w-6 text-secondary-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              IA Integrada
            </h3>
            <p className="text-neutral-600">
              Análise automática dos seus registros e sugestões personalizadas
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-accent-100 p-3 rounded-full inline-flex mb-4">
              <TrendingUp className="h-6 w-6 text-accent-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Gráficos e Insights
            </h3>
            <p className="text-neutral-600">
              Visualize tendências e padrões do seu humor com gráficos interativos
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Privacidade Total
            </h3>
            <p className="text-neutral-600">
              Seus dados são protegidos e criptografados. Você tem controle total
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-responsive py-16 md:py-24">
        <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece a cuidar da sua saúde mental hoje
          </h2>
          <p className="text-lg mb-8 opacity-90">
            É grátis e leva menos de 1 minuto para criar sua conta
          </p>
          <Link href="/login?createAccount=true">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-neutral-100">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-responsive py-8 border-t border-neutral-200">
        <div className="text-center text-neutral-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Meu Humor. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
