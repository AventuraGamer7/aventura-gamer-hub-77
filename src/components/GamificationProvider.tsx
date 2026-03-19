import React, { createContext, useContext } from 'react';
import { useGamification } from '@/hooks/useGamification';
import PowerUpAnimation from './PowerUpAnimation';

interface GamificationContextType {
  profile: any;
  addPoints: (points: number, reason: string) => Promise<void>;
  calculateLevel: (points: number) => number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, currentEvent, addPoints, clearCurrentEvent, calculateLevel } = useGamification();

  return (
    <GamificationContext.Provider value={{ profile, addPoints, calculateLevel }}>
      {children}
      {currentEvent && (
        <PowerUpAnimation
          type={currentEvent.type}
          value={currentEvent.value}
          onComplete={clearCurrentEvent}
        />
      )}
    </GamificationContext.Provider>
  );
};
