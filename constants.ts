
import { ActionType, GrowthStage } from './types';

export const MAX_HEALTH = 100;
export const INITIAL_HEALTH = 80;

export const GAME_TICK_MS = 2000; // Game logic updates every 2 seconds
export const HEALTH_DECAY_AMOUNT = 0.5; // Health points lost per tick
export const REVIVAL_HEALTH_PENALTY = 50; // Health penalty on revival

export const GROWTH_THRESHOLDS: Record<GrowthStage, number> = {
  [GrowthStage.Seed]: 0,
  [GrowthStage.Sprout]: 50,
  [GrowthStage.Young]: 250,
  [GrowthStage.Mature]: 800,
  [GrowthStage.Bloom]: 2000,
};

export const ACTION_EFFECTS: Record<ActionType, { health: number; points: number }> = {
  [ActionType.Water]: { health: 15, points: 5 },
  [ActionType.Feed]: { health: 10, points: 10 },
  [ActionType.Sunlight]: { health: 12, points: 7 },
  [ActionType.Prune]: { health: 5, points: 15 },
};

export const ACTION_COOLDOWNS_MS: Record<ActionType, number> = {
  [ActionType.Water]: 60 * 1000, // 1 minute
  [ActionType.Feed]: 3 * 60 * 1000, // 3 minutes
  [ActionType.Sunlight]: 2 * 60 * 1000, // 2 minutes
  [ActionType.Prune]: 5 * 60 * 1000, // 5 minutes
};

export const REVIVAL_COOLDOWN_MULTIPLIER = 2;

const MESSAGES = {
  HEALTHY: [
    "Feeling vibrant.",
    "Basking in gentle care.",
    "Content and thriving.",
    "Radiating quiet strength.",
    "Life is serene.",
  ],
  THIRSTY: [
    "A little thirsty.",
    "The air feels dry.",
    "Dreaming of a cool drink.",
    "Some water would be wonderful.",
  ],
  WEAK: [
    "Feeling a bit faint.",
    "Energy is low.",
    "Could use some attention.",
    "A little weary.",
  ],
  DYING: [
    "Fading slowly.",
    "Holding on.",
    "Everything is quiet now.",
  ],
  DEAD: [
    "In a deep, quiet rest.",
  ],
};

export const getStatusMessage = (health: number, isDead: boolean): string => {
  if (isDead) {
    return MESSAGES.DEAD[0];
  }
  let messagePool: string[];
  if (health > 70) {
    messagePool = MESSAGES.HEALTHY;
  } else if (health > 40) {
    messagePool = MESSAGES.THIRSTY;
  } else if (health > 10) {
    messagePool = MESSAGES.WEAK;
  } else {
    messagePool = MESSAGES.DYING;
  }
  return messagePool[Math.floor(Math.random() * messagePool.length)];
};
