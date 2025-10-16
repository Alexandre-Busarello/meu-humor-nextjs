'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardingAPI } from '@/lib/api-client';
import { OnBoardingUserData } from '@/types';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PersonalInfoStep from './steps/PersonalInfoStep';
import DemographicsStep from './steps/DemographicsStep';
import MotivationStep from './steps/MotivationStep';
import CurrentMoodStep from './steps/CurrentMoodStep';
import CompletionStep from './steps/CompletionStep';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRequired?: boolean;
}

const steps = [
  { id: 'personal-info', component: PersonalInfoStep, title: 'Informações Pessoais', required: true },
  { id: 'demographics', component: DemographicsStep, title: 'Dados Demográficos', required: true },
  { id: 'motivation', component: MotivationStep, title: 'Sua Motivação', required: true },
  { id: 'current-mood', component: CurrentMoodStep, title: 'Como você está?', required: true },
  { id: 'completion', component: CompletionStep, title: 'Concluído', required: false },
];

export default function OnboardingModal({ isOpen, onClose, isRequired = false }: OnboardingModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<Partial<OnBoardingUserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  useEffect(() => {
    if (isOpen) {
      loadOnboardingData();
    }
  }, [isOpen]);

  const loadOnboardingData = async () => {
    try {
      const [existingData, status] = await Promise.all([
        onboardingAPI.getUserData(),
        onboardingAPI.getStatus(),
      ]);
      
      if (existingData) {
        setUserData(existingData);
      }
      
      if (status.completedSteps) {
        setCompletedSteps(status.completedSteps);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const handleNext = async (stepData: Partial<OnBoardingUserData> = {}) => {
    try {
      setIsSubmitting(true);
      
      // Merge data
      const updatedData = {
        ...userData,
        ...stepData,
      };
      setUserData(updatedData);
      
      // Save to backend
      if (Object.keys(stepData).length > 0) {
        await onboardingAPI.updateUserData(updatedData);
      }
      
      // Mark step as complete
      if (!completedSteps.includes(currentStep.id)) {
        await onboardingAPI.completeStep(currentStep.id);
        setCompletedSteps([...completedSteps, currentStep.id]);
      }
      
      // Move to next step
      if (isLastStep) {
        // Onboarding complete
        onClose();
      } else {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } catch (error) {
      console.error('Error saving onboarding step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleClose = () => {
    if (!isRequired || completedSteps.length >= steps.filter(s => s.required).length) {
      onClose();
    }
  };

  const StepComponent = currentStep.component;

  return (
    <Dialog open={isOpen} onOpenChange={(!isRequired || completedSteps.length >= steps.filter(s => s.required).length) ? handleClose : undefined}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0"
        onPointerDownOutside={(e) => {
          // Prevent closing on outside click if required
          if (isRequired && completedSteps.length < steps.filter(s => s.required).length) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing on ESC if required
          if (isRequired && completedSteps.length < steps.filter(s => s.required).length) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative">{/* The default close button from DialogContent will handle closing */}
          
          {/* Progress Bar */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-neutral-800">
                {currentStep.title}
              </h2>
              <span className="text-sm text-neutral-500">
                {currentStepIndex + 1} de {steps.length}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Step Content */}
          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StepComponent
                  userData={userData}
                  onNext={handleNext}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Buttons */}
          {!isLastStep && (
            <div className="px-6 pb-6 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isFirstStep || isSubmitting}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <div className="flex gap-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentStepIndex
                        ? 'bg-primary-500'
                        : completedSteps.includes(step.id)
                        ? 'bg-primary-300'
                        : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

