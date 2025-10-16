'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Edit, Loader2 } from 'lucide-react';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { onboardingAPI } from '@/lib/api-client';
import { useAuthToken } from '@/components/providers/AuthTokenProvider';
import { OnBoardingUserData } from '@/types';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { isTokenReady } = useAuthToken();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Partial<OnBoardingUserData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!isTokenReady) return;
      
      try {
        setLoading(true);
        const data = await onboardingAPI.getUserData();
        setOnboardingData(data);
      } catch (error) {
        console.error('Error fetching onboarding data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();
  }, [isTokenReady]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleEditOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // Refresh data after editing
    window.location.reload();
  };

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        isRequired={false}
      />
      
      <div className="container-responsive py-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Perfil</h1>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <User className="h-8 w-8 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800">
                  {onboardingData?.name || session?.user?.email?.split('@')[0] || 'Usuário'}
                </h2>
                <p className="text-neutral-600">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <p className="text-neutral-800">{session?.user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo de Conta</label>
              <p className="text-neutral-800">
                {onboardingData?.isAnonymous ? 'Anônima' : 'Regular'}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-neutral-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Carregando dados...</span>
              </div>
            ) : onboardingData && (
              <>
                {onboardingData.name && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
                    <p className="text-neutral-800">{onboardingData.name}</p>
                  </div>
                )}

                {onboardingData.phone && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Telefone</label>
                    <p className="text-neutral-800">{onboardingData.phone}</p>
                  </div>
                )}

                {onboardingData.age && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Idade</label>
                    <p className="text-neutral-800">{onboardingData.age} anos</p>
                  </div>
                )}

                {onboardingData.gender && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Gênero</label>
                    <p className="text-neutral-800 capitalize">{onboardingData.gender.replace('-', ' ')}</p>
                  </div>
                )}

                {onboardingData.location && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Localização</label>
                    <p className="text-neutral-800">{onboardingData.location}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Seus Dados</h3>
          <p className="text-neutral-600 text-sm mb-4">
            Edite ou complete suas informações pessoais para personalizar sua experiência.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleEditOnboarding}
          >
            <Edit className="h-5 w-5 mr-2" />
            Editar Informações Pessoais
          </Button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Ações</h3>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );
}

