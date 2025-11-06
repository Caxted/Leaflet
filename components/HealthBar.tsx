import React from 'react';

interface HealthBarProps {
  health: number;
  increased: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({ health, increased }) => {
  const healthPercentage = Math.max(0, health);
  
  let barColor = 'var(--health-green)';
  if (healthPercentage < 50) {
    barColor = 'var(--health-yellow)';
  }
  if (healthPercentage < 25) {
    barColor = 'var(--health-red)';
  }

  return (
    <div className="relative w-full bg-[var(--health-bar-bg)] rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-500 ease-out"
        style={{ 
          width: `${healthPercentage}%`,
          backgroundColor: barColor
        }}
      ></div>
      {increased && (
         <div 
            key={Date.now()}
            className="absolute top-0 left-0 h-full w-1/4 bg-white/50"
            style={{ animation: 'health-shimmer 0.7s ease-out' }}
        />
      )}
    </div>
  );
};