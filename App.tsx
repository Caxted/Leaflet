import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { usePlantState } from './hooks/usePlantState';
import { Onboarding } from './components/Onboarding';
import { Plant } from './components/Plant';
import { ActionButtons } from './components/ActionButtons';
import { HealthBar } from './components/HealthBar';
import { getStatusMessage } from './constants';
import { GrowthStage, ActionType } from './types';

export type ActiveAnimation = ActionType | null;

export default function App() {
  const [activeAnimation, setActiveAnimation] = useState<ActiveAnimation>(null);
  const [isGrowing, setIsGrowing] = useState(false);
  const [displayedStatus, setDisplayedStatus] = useState('');
  const [statusKey, setStatusKey] = useState(0);

  const triggerAnimation = useCallback((type: ActionType) => {
    setActiveAnimation(type);
    setTimeout(() => setActiveAnimation(null), 1000); // Animation duration
  }, []);

  const {
    plant,
    actions,
    actionCooldowns,
    isDead,
    revivePlant,
    startNewPlant,
    initializePlant,
  } = usePlantState(triggerAnimation);
  
  const prevStageRef = useRef(plant.stage);
  const prevHealthRef = useRef(plant.health);

  const statusMessage = useMemo(() => getStatusMessage(plant.health, isDead), [plant.health, isDead]);

  useEffect(() => {
    // Animate status message change
    if (statusMessage !== displayedStatus) {
      setStatusKey(prev => prev + 1);
      setDisplayedStatus(statusMessage);
    }

    // Trigger growth animation
    if (plant.stage > prevStageRef.current) {
      setIsGrowing(true);
      setTimeout(() => setIsGrowing(false), 2000); // Duration of growth burst
    }
    prevStageRef.current = plant.stage;
    
  }, [statusMessage, plant.stage, displayedStatus]);

  if (!plant.name) {
    return <Onboarding onStart={initializePlant} />;
  }
  
  const healthIncreased = plant.health > prevHealthRef.current;
  prevHealthRef.current = plant.health;

  return (
    <div className="flex flex-col h-screen bg-transparent text-[var(--text-primary)] font-light select-none animate-fadeIn overflow-hidden">
      <header className="text-center pt-8 pb-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
        <h1 className="text-4xl tracking-widest text-[var(--text-primary)]">{plant.name}</h1>
        <div className="relative h-6 mt-2">
            <p 
                key={statusKey}
                className="absolute inset-0 text-[var(--text-secondary)] tracking-wide animate-fadeIn"
            >
                {displayedStatus}
            </p>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          <Plant 
            health={plant.health} 
            stage={plant.stage}
            activeAnimation={activeAnimation}
            isGrowing={isGrowing}
          />
        </div>
      </main>

      {isDead && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-4 animate-fadeIn">
          <p className="text-xl text-[var(--text-primary)] mb-6">{plant.name} has entered a deep rest.</p>
          <div className="flex space-x-4">
            <button
              onClick={revivePlant}
              className="px-6 py-3 bg-[var(--accent-color)] text-[var(--white)] rounded-lg shadow-md hover:bg-[var(--accent-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
              style={{ animation: 'button-pulse 2s infinite' }}
            >
              Revive
            </button>
            <button
              onClick={startNewPlant}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Start Anew
            </button>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">Reviving requires more patience.</p>
        </div>
      )}

      <footer className="w-full max-w-lg mx-auto p-4 pb-8 animate-slideUp" style={{ animationDelay: '300ms' }}>
        <div className="mb-6 px-2">
          <HealthBar health={plant.health} increased={healthIncreased} />
        </div>
        <ActionButtons
          actions={actions}
          cooldowns={actionCooldowns}
          isDead={isDead}
        />
        <div className="text-center text-xs text-[var(--text-secondary)] mt-6 tracking-wider">
          Stage: {GrowthStage[plant.stage]}
        </div>
      </footer>
    </div>
  );
}