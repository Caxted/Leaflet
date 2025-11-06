import React, { useState, useEffect } from 'react';
import { ActionType, ActionCooldowns } from '../types';
import { Icon, IconType } from './Icon';

interface ActionButtonsProps {
  actions: {
    water: () => void;
    feed: () => void;
    sunlight: () => void;
    prune: () => void;
  };
  cooldowns: ActionCooldowns;
  isDead: boolean;
}

const actionConfig: { type: ActionType, icon: IconType, label: string, action: keyof ActionButtonsProps['actions'], color: string }[] = [
    { type: ActionType.Water, icon: 'water', label: 'Water', action: 'water', color: '#60a5fa' },
    { type: ActionType.Sunlight, icon: 'sun', label: 'Sunlight', action: 'sunlight', color: '#facc15' },
    { type: ActionType.Feed, icon: 'feed', label: 'Feed', action: 'feed', color: '#fb923c' },
    { type: ActionType.Prune, icon: 'prune', label: 'Prune', action: 'prune', color: '#a1a1aa' },
];

const Particle: React.FC<{color: string}> = ({ color }) => {
    const style = {
        ['--translateX' as any]: `${(Math.random() - 0.5) * 60}px`,
        ['--translateY' as any]: `${(Math.random() - 0.5) * 60}px`,
        animation: `particle-burst-keyframe 0.7s ease-out forwards`,
        backgroundColor: color,
    };
    return <div className="absolute w-2 h-2 rounded-full" style={style} />;
};

const ActionButton: React.FC<{
  config: typeof actionConfig[0];
  onClick: () => void;
  cooldownEnd: number;
  isDisabled: boolean;
}> = ({ config, onClick, cooldownEnd, isDisabled }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, cooldownEnd - Date.now());
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cooldownEnd]);
  
  const handleClick = () => {
    onClick();
    const newParticles = Array.from({length: 8}, (_, i) => Date.now() + i);
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  }

  const onCooldown = timeLeft > 0;
  const disabled = isDisabled || onCooldown;
  const cooldownSeconds = Math.ceil(timeLeft / 1000);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="relative flex items-center justify-center w-16 h-16 bg-[var(--white)] border border-[var(--border-color)] rounded-full shadow-sm hover:border-[var(--accent-color)] disabled:hover:border-[var(--border-color)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] active:scale-95"
        aria-label={config.label}
        style={{ animation: !disabled ? 'button-glow 3s infinite ease-in-out' : 'none' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {particles.map(id => <Particle key={id} color={config.color} />)}
        </div>
        <div className="text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors">
          <Icon type={config.icon} />
        </div>
        {onCooldown && (
          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
              <span className="text-lg font-mono text-[var(--text-secondary)]">{cooldownSeconds}</span>
          </div>
        )}
      </button>
      <span className="text-xs text-[var(--text-secondary)] tracking-wider mt-2">{config.label}</span>
    </div>
  );
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ actions, cooldowns, isDead }) => {
  return (
    <div className="flex justify-around">
      {actionConfig.map((config) => (
        <ActionButton
          key={config.type}
          config={config}
          onClick={actions[config.action]}
          cooldownEnd={cooldowns[config.type] || 0}
          isDisabled={isDead}
        />
      ))}
    </div>
  );
};