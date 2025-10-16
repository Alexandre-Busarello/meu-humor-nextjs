import { create } from 'zustand';

interface OnBoardingState {
  isModalOpen: boolean;
  isRequired: boolean;
  startWithPendingSteps: boolean;
  currentStep: number;
  setModalOpen: (isOpen: boolean) => void;
  setRequired: (isRequired: boolean) => void;
  setStartWithPendingSteps: (startWithPending: boolean) => void;
  setCurrentStep: (step: number) => void;
  resetState: () => void;
}

export const useOnBoardingStore = create<OnBoardingState>((set) => ({
  isModalOpen: false,
  isRequired: false,
  startWithPendingSteps: false,
  currentStep: 0,
  
  setModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
  setRequired: (isRequired: boolean) => set({ isRequired }),
  setStartWithPendingSteps: (startWithPending: boolean) => set({ startWithPendingSteps: startWithPending }),
  setCurrentStep: (step: number) => set({ currentStep: step }),
  
  resetState: () => set({
    isModalOpen: false,
    startWithPendingSteps: false,
    currentStep: 0
  })
}));

