'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MoodEntryForm from '@/components/mood/MoodEntryForm';
import { Check } from 'lucide-react';

export default function RecordPage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      router.push('/home');
    }, 2000);
  };
  
  return (
    <div className="container-responsive py-6">
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Registrar Humor</h1>
      
      {!isCompleted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <MoodEntryForm onComplete={handleComplete} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-8"
        >
          <div className="bg-accent-100 p-4 rounded-full inline-flex mb-4">
            <Check className="h-8 w-8 text-accent-600" />
          </div>
          <h2 className="text-xl font-medium text-neutral-800 mb-2">
            Registro salvo com sucesso!
          </h2>
          <p className="text-neutral-600">
            Obrigado por compartilhar como está se sentindo.
          </p>
        </motion.div>
      )}
    </div>
  );
}

