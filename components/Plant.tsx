import React from 'react';
import { GrowthStage, ActionType } from '../types';
import { ActiveAnimation } from '../App';

interface PlantProps {
  health: number;
  stage: GrowthStage;
  activeAnimation: ActiveAnimation;
  isGrowing: boolean;
}

const PlantStage: React.FC<{ stage: GrowthStage; style: React.CSSProperties; health: number }> = ({ stage, style, health }) => {
  const commonProps = {
    className: "fill-current transition-all duration-1000",
    style,
  };
  const pathProps = {
    className:"stroke-current stroke-2 fill-none transition-all duration-1000 ease-in-out",
    style,
  }

  switch (stage) {
    case GrowthStage.Seed: // Will be rendered underground, so this is just a fallback
      return <path {...pathProps} d="M 50 90 A 10 5 0 0 1 50 90 Z" transform="scale(0.8) translate(-10, -35)" />;
    case GrowthStage.Sprout:
      return (
        <g {...pathProps}>
          <path d="M50 90 C 52 70, 48 70, 50 50" />
          <path d="M50 65 C 40 60, 40 55, 45 50" />
          <path d="M50 65 C 60 60, 60 55, 55 50" />
        </g>
      );
    case GrowthStage.Young:
       return (
        <g {...pathProps}>
            <path d="M50 90 C 55 70, 45 70, 50 30" />
            <path d="M50 75 C 35 70, 35 60, 42 55" />
            <path d="M50 75 C 65 70, 65 60, 58 55" />
            <path d="M50 55 C 40 50, 40 40, 47 38" />
            <path d="M50 55 C 60 50, 60 40, 53 38" />
        </g>
       );
    case GrowthStage.Mature:
      return (
        <g {...pathProps}>
            <path d="M50 90 C 55 60, 45 60, 50 20" />
            <path d="M50 60 C 65 55, 70 40, 65 30" />
            <path d="M65 42 C 72 45, 75 40, 70 35" />
            <path d="M65 42 C 60 48, 58 50, 60 45" />
            <path d="M50 70 C 35 65, 30 50, 35 40" />
            <path d="M35 52 C 28 55, 25 50, 30 45" />
            <path d="M35 52 C 40 58, 42 60, 40 55" />
            <path d="M50 35 C 40 30, 40 25, 48 22" />
            <path d="M50 35 C 60 30, 60 25, 52 22" />
        </g>
      );
    case GrowthStage.Bloom:
      return (
        <g>
            <g {...pathProps}>
                <path d="M50 90 C 55 60, 45 60, 50 20" />
                <path d="M50 60 C 65 55, 70 40, 65 30" />
                <path d="M65 42 C 72 45, 75 40, 70 35" />
                <path d="M65 42 C 60 48, 58 50, 60 45" />
                <path d="M50 70 C 35 65, 30 50, 35 40" />
                <path d="M35 52 C 28 55, 25 50, 30 45" />
                <path d="M35 52 C 40 58, 42 60, 40 55" />
            </g>
            <circle cx="50" cy="20" r={5 + health/25} className="fill-yellow-200 transition-all duration-1000" />
            <circle cx="50" cy="20" r="10" className="fill-white" opacity="0.8" transform-origin="50 20" style={{ transform: `scale(${Math.min(1, health/50)})`, transition: 'transform 1s' }} />
        </g>
      )
    default:
      return null;
  }
};

const UndergroundView: React.FC<{ health: number; activeAnimation: ActiveAnimation }> = ({ health, activeAnimation }) => {
    const seedColor = `rgb(${140 - 20 * (health/100)}, ${120 - 20 * (health/100)}, ${100 - 20 * (health/100)})`;
    return (
        <g>
            {/* Seed */}
            <ellipse cx="50" cy="80" rx="6" ry="4" style={{ fill: seedColor }} />
            {/* Water animation for seed */}
            {activeAnimation === ActionType.Water && [0,1,2].map(i => (
                 <circle key={i} r="2" cx={45 + i*5} className="fill-blue-300" style={{ animation: `waterDrop 1s ease-in ${i*0.1}s forwards` }} />
            ))}
        </g>
    )
}

const GrowthBurst: React.FC = () => (
    <g transform="translate(50 90)">
        <circle r="20" className="fill-white" style={{ animation: 'growth-burst-circle 1.5s ease-out forwards' }}/>
        {Array.from({length: 12}).map((_, i) => {
            const angle = i * 30;
            const distance = 40 + Math.random() * 20;
            return (
                <path 
                    key={i}
                    d="M-2 -2 L0 0 L2 -2 Z"
                    className="fill-green-300"
                    style={{
                        ['--rotate' as any]: `${angle}deg`,
                        ['--translate' as any]: `${distance}px`,
                        ['--rotate-end' as any]: `${Math.random() * 360}deg`,
                        animation: `growth-burst-particle 1.5s ease-out ${Math.random() * 0.2}s forwards`,
                    }}
                />
            )
        })}
    </g>
);


export const Plant: React.FC<PlantProps> = ({ health, stage, activeAnimation, isGrowing }) => {
  const healthRatio = health / 100;
  const isResting = health > 0 && health <= 10;

  let droopAngle = (1 - healthRatio) * (stage > GrowthStage.Sprout ? 15 : 5);
  if (isResting) droopAngle += 3;
  
  const green = Math.round(105 + 90 * healthRatio);
  const red = Math.round(113 - 60 * healthRatio);
  const blue = Math.round(80 + 30 * healthRatio);
  const color = `rgb(${red}, ${green}, ${blue})`;

  const plantStyle = { transform: `rotate(${droopAngle}deg)`, color };
  
  const soilColor = `rgb(180, 160, 140)`;
  const undergroundSoilColor = `rgb(130, 110, 90)`;

  const animationScale = Math.max(0.1, healthRatio * 0.6);
  const animationDuration = 4 + (6 * (1 - healthRatio));

  const showUnderground = stage === GrowthStage.Seed;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-hidden">
      <defs>
        <style>{`
            @keyframes resting-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            .plant-resting { animation: resting-pulse 15s ease-in-out infinite; }
        `}</style>
        <filter id="breathing-wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="warp">
            <animate attributeName="baseFrequency" from="0.1" to="0.105" dur={`${animationDuration}s`} repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale={animationScale} in="SourceGraphic" in2="warp" />
        </filter>
        <filter id="resting-wobble">
           <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="warp">
            <animate attributeName="baseFrequency" from="0.1" to="0.101" dur="30s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0.1" in="SourceGraphic" in2="warp" />
        </filter>
      </defs>

      {/* Action Animations Layer */}
      <g>
          {activeAnimation === ActionType.Sunlight && (
              <path d="M-10,-10 L10,-10 L110,110 L90,110 Z" className="fill-yellow-200 opacity-0" style={{ animation: 'sunbeam 1.2s ease-out' }}/>
          )}
          {activeAnimation === ActionType.Prune && (
              <path d="M45 45 L55 55 M55 45 L45 55" stroke="gray" strokeWidth="2" style={{ animation: 'snipEffect 0.5s ease-out' }} />
          )}
      </g>
      
      {/* Soil and Underground */}
      <path d={`M 0 ${showUnderground ? 60 : 90} Q 50 ${showUnderground ? 55 : 85}, 100 ${showUnderground ? 60 : 90} L 100 100 L 0 100 Z`}
        className="transition-all duration-1000"
        style={{ fill: soilColor }}
      />
      {showUnderground && <rect y="60" width="100" height="40" style={{ fill: undergroundSoilColor }} />}
      
      {isGrowing && <GrowthBurst />}

      {/* Plant/Seed */}
      <g
        className={`transition-transform duration-1000 ease-in-out ${isResting ? 'plant-resting' : ''}`}
        style={{ transformOrigin: '50px 90px', ...plantStyle }}
        filter={ health <= 0 ? "none" : isResting ? "url(#resting-wobble)" : "url(#breathing-wobble)" }
      >
        {showUnderground 
          ? <UndergroundView health={health} activeAnimation={activeAnimation} />
          : <PlantStage stage={stage} style={{ color: plantStyle.color }} health={health} />
        }
      </g>

       {/* More Action Animations (on top of plant) */}
       <g>
        {activeAnimation === ActionType.Water && !showUnderground && [0,1,2].map(i => (
            <circle key={i} r="2" cx={45 + i*5} className="fill-blue-300" style={{ animation: `waterDrop 1s ease-in ${i*0.1}s forwards`, transform: 'translateY(30px)' }} />
        ))}
         {activeAnimation === ActionType.Feed && !showUnderground && [0,1,2,3,4].map(i => (
            <circle key={i} r="1.5" cx={30 + i*10} cy="90" className="fill-orange-300 opacity-0" style={{ animation: `nutrientRise 1.2s ease-out ${i*0.15}s` }} />
        ))}
      </g>
    </svg>
  );
};