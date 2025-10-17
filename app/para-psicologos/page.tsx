'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Brain, 
  Users, 
  Palette, 
  Shield, 
  BarChart3, 
  FileText, 
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Clock,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ParaPsicologosPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    crp: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/psychologist-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
      }

      setIsSubmitted(true);
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        crp: '',
        message: '',
      });
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      toast.error('Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-neutral-50">
      {/* Header */}
      <header className="container-responsive py-6 border-b border-neutral-200">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <ArrowLeft className="h-5 w-5 text-neutral-600 group-hover:text-primary-500 transition-colors" />
            <div className="flex items-center space-x-2">
              <div className="bg-primary-100 p-2 rounded-full">
                <Brain className="h-6 w-6 text-primary-500" />
              </div>
              <span className="text-xl font-semibold text-neutral-800">Meu Humor</span>
            </div>
          </Link>
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-responsive py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Para Profissionais da Saúde Mental</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Leve o <span className="text-primary-500">Meu Humor</span> para seus pacientes
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Plataforma white-label personalizada com sua identidade visual, para acompanhamento contínuo 
            dos seus pacientes entre as sessões
          </p>
        </div>
      </section>

      {/* How It Works - New Section */}
      <section className="container-responsive py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-center text-neutral-600 mb-12 text-lg">
            Uma solução completa para você e seus pacientes
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Para seus Pacientes */}
            <div className="card bg-white border-2 border-primary-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-500 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">
                  Para seus Pacientes
                </h3>
              </div>
              
              <p className="text-neutral-600 mb-4 font-medium">
                Acesso completo a todos os recursos do Meu Humor:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Diário Emocional:</strong> Registro diário de humor, atividades e observações
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Análise com IA:</strong> Insights personalizados sobre padrões emocionais
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Gráficos Interativos:</strong> Visualização clara da evolução do humor
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Recomendações:</strong> Sugestões de atividades para bem-estar
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Histórico Completo:</strong> Todos os registros salvos e organizados
                  </span>
                </li>
              </ul>
            </div>

            {/* Para Você - Profissional */}
            <div className="card bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-2 border-primary-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold">
                  Para Você - Profissional
                </h3>
              </div>
              
              <p className="mb-4 font-medium opacity-95">
                Dashboard completo de acompanhamento:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="opacity-95">
                    <strong>Visão Geral:</strong> Status e progresso de todos os seus pacientes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="opacity-95">
                    <strong>Registros Diários:</strong> Acesso ao diário emocional de cada paciente
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="opacity-95">
                    <strong>Evolução Temporal:</strong> Gráficos de progresso ao longo do tempo
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="opacity-95">
                    <strong>Prontuários Automáticos:</strong> IA gera prontuários profissionais prontos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="opacity-95">
                    <strong>Alertas:</strong> Notificações sobre padrões preocupantes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="opacity-95">
                    <strong>Exportação:</strong> Relatórios em PDF para documentação
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <span className="text-neutral-700 font-medium">
                Tudo integrado em uma única plataforma com sua marca
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container-responsive py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-12">
            Por que ter sua própria plataforma?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="bg-primary-100 p-3 rounded-full inline-flex mb-4">
                <Palette className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Personalização Completa
              </h3>
              <p className="text-neutral-600">
                Logo, cores e domínio próprio. Sua marca, sua identidade, sua plataforma.
              </p>
            </div>

            <div className="card">
              <div className="bg-secondary-100 p-3 rounded-full inline-flex mb-4">
                <Users className="h-6 w-6 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Dashboard Profissional
              </h3>
              <p className="text-neutral-600">
                Acompanhe o progresso de cada paciente com visão completa dos registros diários e evolução temporal.
              </p>
            </div>

            <div className="card">
              <div className="bg-accent-100 p-3 rounded-full inline-flex mb-4">
                <BarChart3 className="h-6 w-6 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Acesso Completo dos Pacientes
              </h3>
              <p className="text-neutral-600">
                Seus pacientes usam todos os recursos do Meu Humor: diário emocional, IA, gráficos e muito mais.
              </p>
            </div>

            <div className="card">
              <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Total Privacidade
              </h3>
              <p className="text-neutral-600">
                Dados criptografados e 100% em conformidade com LGPD e normas do CFP.
              </p>
            </div>

            <div className="card">
              <div className="bg-purple-100 p-3 rounded-full inline-flex mb-4">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                IA Integrada
              </h3>
              <p className="text-neutral-600">
                Prontuários gerados automaticamente com IA, economizando seu tempo.
              </p>
            </div>

            <div className="card">
              <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Acompanhamento Contínuo
              </h3>
              <p className="text-neutral-600">
                Seus pacientes registram o humor diariamente, você acompanha em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-12">
            Recursos da Plataforma
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200">
              <div className="flex items-start gap-4">
                <div className="bg-primary-500 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    Prontuários com IA
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    Geração automática de prontuários profissionais baseados nos registros dos pacientes.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-primary-500" />
                      <span className="text-sm">Análise de padrões emocionais</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-primary-500" />
                      <span className="text-sm">Sugestões de abordagem terapêutica</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-primary-500" />
                      <span className="text-sm">Exportação em PDF profissional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-secondary-50 to-white border-secondary-200">
              <div className="flex items-start gap-4">
                <div className="bg-secondary-500 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    Diário Emocional
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    Pacientes registram humor, atividades e eventos importantes diariamente.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm">Interface intuitiva e amigável</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm">Lembretes personalizáveis</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm">Acesso mobile e desktop</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-accent-50 to-white border-accent-200">
              <div className="flex items-start gap-4">
                <div className="bg-accent-500 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    Dashboard Profissional
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    Visualize dados consolidados de todos os seus pacientes.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" />
                      <span className="text-sm">Gráficos de evolução temporal</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" />
                      <span className="text-sm">Alertas de padrões preocupantes</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" />
                      <span className="text-sm">Comparação entre períodos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    Segurança e Conformidade
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    Máxima proteção dos dados dos seus pacientes.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Dados protegidos</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Conformidade com LGPD</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Backup automático diário</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container-responsive py-16 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Solicite uma demonstração
            </h2>
            <p className="text-lg text-neutral-600">
              Preencha o formulário e nossa equipe entrará em contato para apresentar a solução
            </p>
          </div>

          {isSubmitted ? (
            <div className="card text-center py-12">
              <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                Mensagem enviada com sucesso!
              </h3>
              <p className="text-neutral-600 mb-6">
                Entraremos em contato em breve para agendar uma demonstração personalizada.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nome completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr(a). Seu Nome"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="crp" className="block text-sm font-medium text-neutral-700 mb-2">
                      CRP (opcional)
                    </label>
                    <Input
                      id="crp"
                      name="crp"
                      type="text"
                      value={formData.crp}
                      onChange={handleChange}
                      placeholder="XX/XXXXX"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      E-mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Telefone *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Mensagem (opcional)
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Conte-nos um pouco sobre sua prática e suas necessidades..."
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Solicitar Demonstração'}
                </Button>

                <p className="text-xs text-neutral-500 text-center">
                  Ao enviar este formulário, você concorda em ser contatado pela nossa equipe
                </p>
              </div>
            </form>
          )}
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

