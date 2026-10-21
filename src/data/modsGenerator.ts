import type { Mod, GameId, GameName, ModCategory, PerfImpact } from '../types';
import { MOCK_MODS } from './mockMods';

const PREFIXES = [
  'Ultra Realistic', 'NextGen', 'Definitive', 'Photorealistic', 'Extreme Immersion',
  'Pure Dynamics', 'Advanced', 'Hyper', 'Cinema Grade', 'Apex',
  'Custom Precision', 'Master', 'TrueToLife', 'Quantum', 'Elite Spec',
  'Overdrive', 'Evolution', 'Pro Tuned', 'Ultimate', 'HD Remaster'
];

const SUBJECTS_BY_CAT: Record<ModCategory, string[]> = {
  'Graphismes / ReShade': [
    'Weather & Atmospheric Shaders', 'Ray Tracing Global Illumination', 'Skyboxes & Dynamic Clouds 8K',
    'RainFX Droplets & Wet Reflections', 'PBR Surface Tessellation', 'Cinematic Depth of Field & Bloom',
    'Night Lighting & Streetlamps Remaster', 'HDR Color Grading Preset', 'Volumetric Fog & Sunbeams',
    'Asphalt Specular & Puddle Reflections'
  ],
  'Cartes / Expansions': [
    'Highway & Mountain Pass Overhaul', 'Nordic Fjords & Secret Scenic Routes', 'Urban Expressway Network',
    'Coastal Touge & Hairpin Run', 'Expanded Freight Hubs & Depots', 'Detailed Industrial Zone',
    'Desert Cross-Country Highway', 'Historical Old Town Circuit', 'Island Archipelago Road Network'
  ],
  'Véhicules & Packs': [
    'Custom Show-Truck & Heavy Châssis Pack', 'GT3 Championship Aerodynamics Pack', 'Hypercar Twin-Turbo Overhaul',
    'Classic V8 Muscle Legend', 'Formula Spec Carbon Chassis', 'Endurance Prototype Racing Spec',
    'Dutch Style Cabin & Tuning Accessories', 'Forged Wheels & Michelin Pilot Cup R', 'Widebody Stance & Air Suspension'
  ],
  'Telemetry / SimHub': [
    'Real-Time Digital Instrument Cluster', 'Race Engineer Live Telemetry Dashboard', 'Wireless Secondary Screen HUD',
    'Tire Wear & Thermodynamic Visualizer', 'Radar & Proximity Spotter Screen', 'Motec Data Logger & Delta Lap',
    'Fuel Strategy & Pit Stop Planner', 'Vocore USB Display Template'
  ],
  'UI / HUD': [
    'Minimalist Modern Vector Speedometer', 'Clean Immersion Borderless HUD', 'High-Refresh Glass Cockpit PFD',
    'Satellite GPS Navigation Overlay', 'Transparent Micro Status Bar', 'Customizable Widget Suite'
  ],
  'Physique & Sons': [
    'Open Pipe Straight-Through V8 Exhaust', 'Direct Drive Force Feedback Telemetry Filter', 'Soft-Body Tire Flex Dynamics',
    'Turbo Spool & Wastegate Acoustic Pack', 'Authentic Cabin Insulation & Road Noise', 'Brake Fade & Thermals Simulation',
    'Binaural 3D Engine Acoustics', 'Transmission Gear Whine & Dogbox Clatter'
  ]
};

const AUTHORS = [
  'KassModding', 'ProMods Team', 'Peter Boese', 'Ilja Jusupov', 'Razed Mods',
  'HalkHogan', 'SimEngineering', 'Max2712', 'CMM Motorsports', 'BeamPhysics',
  'AeroSim Dynamics', 'NordicHauler', 'TokyoDriftLab', 'V8Acoustics', 'ApexStudio',
  'CyberModder_99', 'GhostRider_Sims', 'RedlineEngineering', 'PureSpeed', 'SimMasterFR'
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
];

const GAMES_LIST: { id: GameId; name: GameName; short: string; defaultPath: string }[] = [
  { id: 'ets2', name: 'Euro Truck Simulator 2', short: 'ETS2', defaultPath: '%USERPROFILE%\\Documents\\Euro Truck Simulator 2\\mod\\' },
  { id: 'assetto_corsa', name: 'Assetto Corsa', short: 'AC', defaultPath: 'Steam\\steamapps\\common\\assettocorsa\\extension\\' },
  { id: 'gtav', name: 'GTA V', short: 'GTAV', defaultPath: 'Grand Theft Auto V\\mods\\' },
  { id: 'cyberpunk2077', name: 'Cyberpunk 2077', short: 'CP2077', defaultPath: 'Cyberpunk 2077\\archive\\pc\\mod\\' },
  { id: 'beamng', name: 'BeamNG.drive', short: 'BEAMNG', defaultPath: '%LOCALAPPDATA%\\BeamNG.drive\\mods\\' },
  { id: 'msfs', name: 'Microsoft Flight Simulator', short: 'MSFS', defaultPath: 'Packages\\Community\\' },
];

const CATEGORIES_LIST: ModCategory[] = [
  'Graphismes / ReShade',
  'Cartes / Expansions',
  'Véhicules & Packs',
  'Telemetry / SimHub',
  'UI / HUD',
  'Physique & Sons',
];

const PERF_IMPACTS: { impact: PerfImpact; text: string; avg: number }[] = [
  { impact: 'Faible', text: '0 à -2 FPS', avg: 1.0 },
  { impact: 'Faible', text: '-1 à -3 FPS', avg: 2.0 },
  { impact: 'Faible', text: '0 FPS (Zéro perte)', avg: 0.0 },
  { impact: 'Moyen', text: '-4 à -6 FPS', avg: 5.0 },
  { impact: 'Moyen', text: '-5 à -8 FPS', avg: 6.5 },
  { impact: 'Élevé', text: '-10 à -15 FPS', avg: 12.5 },
  { impact: 'Élevé', text: '-12 à -18 FPS', avg: 15.0 },
];

// Target total mods count: 100,000
export const TOTAL_MODS_COUNT = 100000;

let cachedFullCatalog: Mod[] | null = null;

/**
 * High-performance procedural generator that produces 100,000 indexed mods.
 * The 12 handcrafted master mods are retained at the beginning.
 */
export function generate100kMods(): Mod[] {
  if (cachedFullCatalog && cachedFullCatalog.length === TOTAL_MODS_COUNT) {
    return cachedFullCatalog;
  }

  const catalog: Mod[] = [...MOCK_MODS];
  const countNeeded = TOTAL_MODS_COUNT - MOCK_MODS.length;

  for (let i = 0; i < countNeeded; i++) {
    const idNum = i + MOCK_MODS.length + 1;
    const game = GAMES_LIST[i % GAMES_LIST.length];
    const category = CATEGORIES_LIST[i % CATEGORIES_LIST.length];
    const prefix = PREFIXES[(i * 3 + 7) % PREFIXES.length];
    const subjects = SUBJECTS_BY_CAT[category];
    const subject = subjects[(i * 5 + 3) % subjects.length];
    const author = AUTHORS[(i * 2 + 1) % AUTHORS.length];
    const perf = PERF_IMPACTS[(i * 7 + 2) % PERF_IMPACTS.length];
    const imgUrl = SAMPLE_IMAGES[(i * 11) % SAMPLE_IMAGES.length];

    const majorV = (i % 5) + 1;
    const minorV = (i % 9);
    const patchV = (i % 6);
    const modVersion = `v${majorV}.${minorV}.${patchV}`;

    const rating = parseFloat((4.45 + ((i % 54) / 100)).toFixed(2));
    const downloads = 1200 + ((i * 37) % 840000);
    const reviewCount = 20 + ((i * 13) % 3500);

    const sizes = ['120 MB', '340 MB', '780 MB', '1.4 GB', '2.8 GB', '4.2 GB', '6.5 GB', '45 MB'];
    const fileSize = sizes[(i * 4) % sizes.length];

    const title = `${prefix} ${subject} #${idNum}`;

    catalog.push({
      id: `mod-${idNum}`,
      title,
      author,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      authorVerified: (i % 4 === 0),
      gameId: game.id,
      game: game.name,
      gameShort: game.short,
      category,
      perfImpact: perf.impact,
      fpsDropText: perf.text,
      fpsDropAvg: perf.avg,
      vramImpactMB: perf.impact === 'Élevé' ? 2400 : perf.impact === 'Moyen' ? 1200 : 300,
      gameVersion: 'v1.50+',
      modVersion,
      fileSize,
      rating,
      reviewCount,
      downloads,
      releaseDate: '2026',
      updateDate: 'Oct 2026',
      tags: [category.split('/')[0].trim(), game.short, 'Vérifié 2026'],
      isFeatured: false,
      isWeeklyPick: false,
      shortDescription: `Mod optimisé haute fidélité pour ${game.name}. Rendu fluide, compatible dernières mises à jour.`,
      description: `Le mod "${title}" par ${author} apporte une refonte ciblée pour ${game.name}. Testé et vérifié par l'équipe ModHub Pro pour une compatibilité maximale sans corruption de sauvegarde.`,
      features: [
        'Optimisation de framerate',
        'Compatible mode multijoueur et solo',
        'Intégration directe via le gestionnaire de mods',
      ],
      medias: [
        {
          url: imgUrl,
          caption: `${title} en jeu`,
        },
      ],
      dependencies: [],
      installPath: game.defaultPath,
      installSteps: [
        'Téléchargez l\'archive du mod.',
        `Copiez le contenu dans ${game.defaultPath}.`,
        'Activez le mod dans les options du jeu.',
      ],
      comments: [
        {
          id: `c-gen-${idNum}`,
          user: `Player_${(i * 19) % 9999}`,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          date: 'Récemment',
          rating: 5,
          text: 'Super mod, stable et conforme aux FPS indiqués !',
          upvotes: (i % 28) + 1,
          downvotes: 0,
        },
      ],
      downloadUrl: `https://modhub.pro/download/mod-${idNum}.zip`,
      checksumSha256: '9f83ac58b184284d7281bc89a0293847e9281a8b1928374828192837492810a4',
      isVrReady: (i % 2 === 0),
    });
  }

  cachedFullCatalog = catalog;
  return catalog;
}

