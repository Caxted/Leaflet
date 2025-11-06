
export enum GrowthStage {
  Seed,
  Sprout,
  Young,
  Mature,
  Bloom,
}

export enum ActionType {
  Water,
  Feed,
  Sunlight,
  Prune,
}

export interface PlantState {
  name: string;
  health: number; // 0-100
  stage: GrowthStage;
  carePoints: number;
}

export type ActionCooldowns = {
  [key in ActionType]: number; // Timestamp when action becomes available
};
