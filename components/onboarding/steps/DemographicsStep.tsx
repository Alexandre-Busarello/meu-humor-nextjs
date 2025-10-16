import React, { useState, useEffect } from 'react';
import { OnBoardingUserData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User } from 'lucide-react';

interface DemographicsStepProps {
  userData: Partial<OnBoardingUserData>;
  onNext: (data: Partial<OnBoardingUserData>) => void;
  isSubmitting: boolean;
}

const ageRangeOptions = [
  { value: '18-24', label: '18-24 anos' },
  { value: '25-34', label: '25-34 anos' },
  { value: '35-44', label: '35-44 anos' },
  { value: '45-54', label: '45-54 anos' },
  { value: '55-64', label: '55-64 anos' },
  { value: '65+', label: '65+ anos' },
  { value: 'prefiro-nao-informar', label: 'Prefiro não informar' },
];

const regionOptions = [
  { value: 'norte', label: 'Norte' },
  { value: 'nordeste', label: 'Nordeste' },
  { value: 'centro-oeste', label: 'Centro-Oeste' },
  { value: 'sudeste', label: 'Sudeste' },
  { value: 'sul', label: 'Sul' },
  { value: 'prefiro-nao-informar', label: 'Prefiro não informar' },
];

const DemographicsStep: React.FC<DemographicsStepProps> = ({
  userData,
  onNext,
  isSubmitting,
}) => {
  const [age, setAge] = useState<string>(userData.age?.toString() || '');
  const [ageRange, setAgeRange] = useState<string>(userData.ageRange || '');
  const [gender, setGender] = useState<string>(userData.gender || '');
  const [location, setLocation] = useState<string>(userData.location || '');
  const [region, setRegion] = useState<string>(userData.region || '');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(userData.isAnonymous !== false);

  // Update state when userData changes (for edit mode)
  useEffect(() => {
    setAge(userData.age?.toString() || '');
    setAgeRange(userData.ageRange || '');
    setGender(userData.gender || '');
    setLocation(userData.location || '');
    setRegion(userData.region || '');
    setIsAnonymous(userData.isAnonymous !== false);
  }, [userData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Partial<OnBoardingUserData> = {};

    // Data differs depending on mode (anonymous or not)
    if (isAnonymous) {
      if (ageRange) {
        data.ageRange = ageRange;
      }

      if (region) {
        data.region = region;
      }
    } else {
      if (age) {
        data.age = parseInt(age, 10);
      }

      if (location) {
        data.location = location;
      }
    }

    // Gender is collected in both modes
    if (gender) {
      data.gender = gender;
    }

    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-2">
          Informações Demográficas
        </h3>
        <p className="text-neutral-600">
          {isAnonymous
            ? 'Essas informações gerais nos ajudam a personalizar sua experiência'
            : 'Compartilhe um pouco sobre você para personalizarmos sua experiência'}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Age / Age Range */}
        {isAnonymous ? (
          <div>
            <label htmlFor="age-range" className="block text-sm font-medium text-neutral-700 mb-2">
              Faixa etária (opcional)
            </label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger id="age-range">
                <SelectValue placeholder="Selecione sua faixa etária" />
              </SelectTrigger>
              <SelectContent>
                {ageRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-neutral-700 mb-2">
              Idade (opcional)
            </label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Sua idade"
              min={0}
              max={120}
            />
          </div>
        )}

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-2">
            Gênero (opcional)
          </label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione seu gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="nao-binario">Não-binário</SelectItem>
              <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location / Region */}
        {isAnonymous ? (
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-2">
              Região (opcional)
            </label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Selecione sua região" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
              Localização (opcional)
            </label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Cidade, Estado"
              maxLength={100}
            />
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </form>
  );
};

export default DemographicsStep;

