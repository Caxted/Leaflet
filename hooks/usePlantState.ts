import { useState, useEffect, useCallback, useRef } from 'react';
import { PlantState, GrowthStage, ActionType, ActionCooldowns } from '../types';
import {
  MAX_HEALTH,
  INITIAL_HEALTH,
  GAME_TICK_MS,
  HEALTH_DECAY_AMOUNT,
  GROWTH_THRESHOLDS,
  ACTION_EFFECTS,
  ACTION_COOLDOWNS_MS,
  REVIVAL_COOLDOWN_MULTIPLIER,
  REVIVAL_HEALTH_PENALTY,
} from '../constants';

const initialPlantState: PlantState = {
  name: '',
  health: INITIAL_HEALTH,
  stage: GrowthStage.Seed,
  carePoints: 0,
};

export const usePlantState = (onAction?: (action: ActionType) => void) => {
  const [plant, setPlant] = useState<PlantState>(initialPlantState);
  const [actionCooldowns, setActionCooldowns] = useState<ActionCooldowns>({} as ActionCooldowns);
  const [isRevived, setIsRevived] = useState(false);
  const timerRef = useRef<number | null>(null);

  const isDead = plant.health <= 0;

  const saveState = useCallback((p: PlantState, c: ActionCooldowns, r: boolean) => {
    localStorage.setItem('leaflet_plant_state', JSON.stringify(p));
    localStorage.setItem('leaflet_cooldowns', JSON.stringify(c));
    localStorage.setItem('leaflet_is_revived', JSON.stringify(r));
  }, []);

  useEffect(() => {
    try {
      const savedPlant = localStorage.getItem('leaflet_plant_state');
      const savedCooldowns = localStorage.getItem('leaflet_cooldowns');
      const savedRevived = localStorage.getItem('leaflet_is_revived');

      if (savedPlant) setPlant(JSON.parse(savedPlant));
      if (savedCooldowns) setActionCooldowns(JSON.parse(savedCooldowns));
      if (savedRevived) setIsRevived(JSON.parse(savedRevived));
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  const updatePlant = useCallback(<T extends PlantState>(newPlant: T) => {
    // Determine new growth stage
    const currentStage = newPlant.stage;
    let newStage = currentStage;
    const sortedStages = Object.keys(GROWTH_THRESHOLDS).map(Number).sort((a,b) => a - b);
    
    for (const stage of sortedStages) {
        if (newPlant.carePoints >= GROWTH_THRESHOLDS[stage as GrowthStage]) {
            newStage = stage as GrowthStage;
        }
    }

    const finalPlant = { ...newPlant, stage: newStage };
    setPlant(finalPlant);
  }, []);
  
  // Game loop
  useEffect(() => {
    if (!plant.name || isDead) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setPlant(prevPlant => {
          if (prevPlant.health <= 0) return prevPlant;
          // FIX: Corrected typo in constant name from HEALTH_DECAY_ AMOUNT to HEALTH_DECAY_AMOUNT
          const newHealth = Math.max(0, prevPlant.health - HEALTH_DECAY_AMOUNT);
          return { ...prevPlant, health: newHealth };
        });
      }, GAME_TICK_MS);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [plant.name, isDead]);
  
  useEffect(() => {
    if(plant.name){
        saveState(plant, actionCooldowns, isRevived);
    }
  }, [plant, actionCooldowns, isRevived, saveState]);


  const performAction = useCallback((action: ActionType) => {
    if (isDead) return;
    
    const now = Date.now();
    if (actionCooldowns[action] && now < actionCooldowns[action]) {
      return; // Action is on cooldown
    }
    
    onAction?.(action);

    const effect = ACTION_EFFECTS[action];
    const newHealth = Math.min(MAX_HEALTH, plant.health + effect.health);
    const newCarePoints = plant.carePoints + effect.points;

    updatePlant({ ...plant, health: newHealth, carePoints: newCarePoints });

    const cooldownMultiplier = isRevived ? REVIVAL_COOLDOWN_MULTIPLIER : 1;
    const cooldownTime = ACTION_COOLDOWNS_MS[action] * cooldownMultiplier;
    
    setActionCooldowns(prev => ({
      ...prev,
      [action]: now + cooldownTime,
    }));
  }, [plant, isDead, actionCooldowns, isRevived, updatePlant, onAction]);

  const actions = {
    water: () => performAction(ActionType.Water),
    feed: () => performAction(ActionType.Feed),
    sunlight: () => performAction(ActionType.Sunlight),
    prune: () => performAction(ActionType.Prune),
  };

  const initializePlant = (name: string) => {
    const newPlant: PlantState = {
      ...initialPlantState,
      name,
    };
    setPlant(newPlant);
    setActionCooldowns({} as ActionCooldowns);
    setIsRevived(false);
  };
  
  const revivePlant = () => {
      if (!isDead) return;
      const newHealth = Math.max(1, INITIAL_HEALTH - REVIVAL_HEALTH_PENALTY);
      updatePlant({ ...plant, health: newHealth });
      setActionCooldowns({} as ActionCooldowns); // Reset cooldowns
      setIsRevived(true);
  };

  const startNewPlant = () => {
      initializePlant(''); // Go back to onboarding
  };

  return { plant, actions, actionCooldowns, isDead, revivePlant, startNewPlant, initializePlant };
};
