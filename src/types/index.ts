export type GameId = 
  | 'ets2'
  | 'assetto_corsa'
  | 'gtav'
  | 'cyberpunk2077'
  | 'beamng'
  | 'msfs';

export type GameName = 
  | 'Euro Truck Simulator 2'
  | 'Assetto Corsa'
  | 'GTA V'
  | 'Cyberpunk 2077'
  | 'BeamNG.drive'
  | 'Microsoft Flight Simulator';

export type ModCategory = 
  | 'Graphismes / ReShade'
  | 'Cartes / Expansions'
  | 'Véhicules & Packs'
  | 'Telemetry / SimHub'
  | 'UI / HUD'
  | 'Physique & Sons';

export type PerfImpact = 'Faible' | 'Moyen' | 'Élevé';

export type AccentColor = 'cyan' | 'orange' | 'green' | 'purple';

export interface ModDependency {
  name: string;
  required: boolean;
  minVersion?: string;
  link?: string;
  isSatisfied?: boolean;
}

export interface ModMedia {
  url: string;
  caption: string;
  isBeforeAfter?: boolean;
  beforeUrl?: string;
  afterUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface ModComment {
  id: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  badge?: string;
}

export interface Mod {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  authorVerified?: boolean;
  gameId: GameId;
  game: GameName;
  gameShort: string;
  category: ModCategory;
  perfImpact: PerfImpact;
  fpsDropText: string;
  fpsDropAvg: number; // Approximate FPS loss at 1440p
  vramImpactMB: number; // MB of extra VRAM needed
  gameVersion: string;
  modVersion: string;
  fileSize: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  releaseDate: string;
  updateDate: string;
  tags: string[];
  isFeatured?: boolean;
  isWeeklyPick?: boolean;
  shortDescription: string;
  description: string;
  features: string[];
  medias: ModMedia[];
  dependencies: ModDependency[];
  installPath: string;
  installSteps: string[];
  comments: ModComment[];
  downloadUrl: string;
  checksumSha256?: string;
  isVrReady?: boolean;
  conflictsWith?: string[]; // IDs of conflicting mods
}

export interface HardwarePreset {
  id: string;
  name: string;
  gpu: string;
  cpu: string;
  vramGB: number;
  baseFps: Record<'1080p' | '1440p' | '4K' | 'VR', number>;
}

export type Resolution = '1080p' | '1440p' | '4K' | 'VR';

export interface UserSetupItem {
  mod: Mod;
  loadOrder: number;
  enabled: boolean;
  notes?: string;
}

export interface ModSubmission {
  title: string;
  author: string;
  gameId: GameId;
  category: ModCategory;
  perfImpact: PerfImpact;
  fpsDropText: string;
  gameVersion: string;
  modVersion: string;
  fileSize: string;
  shortDescription: string;
  description: string;
  installPath: string;
  installSteps: string;
  dependencies: string;
  imageUrl: string;
  downloadUrl: string;
}

