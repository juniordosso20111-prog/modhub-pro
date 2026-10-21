import React, { useState, useMemo } from 'react';
import type { Mod, Resolution } from '../types';
import { HARDWARE_PRESETS } from '../data/mockMods';
import {
  Cpu,
  Monitor,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Layers,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface PerfComparatorProps {
  mods: Mod[];
  savedModIds: string[];
  onToggleSetup: (mod: Mod) => void;
  onOpenDetails: (mod: Mod) => void;
}

export const PerfComparator: React.FC<PerfComparatorProps> = ({
  mods,
  savedModIds,
  onToggleSetup,
  onOpenDetails,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('high-end');
  const [resolution, setResolution] = useState<Resolution>('1440p');
  const [selectedModIds, setSelectedModIds] = useState<string[]>([
    'ets2-brutal-weather',
    'ets2-promods-europe',
    'simhub-nextgen-telemetry',
  ]);

  const currentPreset = useMemo(() => {
    return (
      HARDWARE_PRESETS.find((p) => p.id === selectedPresetId) || HARDWARE_PRESETS[1]
    );
  }, [selectedPresetId]);

  // Selected mods objects
  const activeBenchmarkMods = useMemo(() => {
    return mods.filter((m) => selectedModIds.includes(m.id));
  }, [mods, selectedModIds]);

  // Calculation of FPS impact
  const calculation = useMemo(() => {
    const baseFps = currentPreset.baseFps[resolution] || 100;

    // Multiplier based on resolution
    const resMultiplier =
      resolution === '4K'
        ? 1.35
        : resolution === 'VR'
        ? 1.45
        : resolution === '1440p'
        ? 1.0
        : 0.85;

    // Cumulative FPS drop
    let totalFpsDrop = 0;
    let totalVramImpactMB = 0;

    activeBenchmarkMods.forEach((m) => {
      totalFpsDrop += m.fpsDropAvg * resMultiplier;
      totalVramImpactMB += m.vramImpactMB;
    });

    // Diminishing returns & non-linear scaling
    if (totalFpsDrop > baseFps * 0.75) {
      totalFpsDrop = baseFps * 0.75;
    }

    const projectedFps = Math.max(15, Math.round(baseFps - totalFpsDrop));
    const projected1PercentLow = Math.max(10, Math.round(projectedFps * 0.72));
    const frameTimeMs = (1000 / projectedFps).toFixed(1);

    // VRAM base usage + mod extra
    const baseVramMB = resolution === '4K' ? 5200 : resolution === '1440p' ? 3800 : 2600;
    const totalVramAllocatedGB = (
      (baseVramMB + totalVramImpactMB) /
      1024
    ).toFixed(1);
    const vramPercentage = Math.min(
      100,
      Math.round(((baseVramMB + totalVramImpactMB) / (currentPreset.vramGB * 1024)) * 100)
    );

    return {
      baseFps,
      totalFpsDrop: Math.round(totalFpsDrop),
      projectedFps,
      projected1PercentLow,
      frameTimeMs,
      totalVramAllocatedGB: parseFloat(totalVramAllocatedGB),
      vramPercentage,
      totalVramImpactMB,
    };
  }, [currentPreset, resolution, activeBenchmarkMods]);

  // Toggle mod in benchmark
  const toggleModInBenchmark = (id: string) => {
    if (selectedModIds.includes(id)) {
      setSelectedModIds(selectedModIds.filter((item) => item !== id));
    } else {
      setSelectedModIds([...selectedModIds, id]);
    }
  };

  // Quick preset scenarios
  const applyScenario = (type: 'all-setup' | 'heavy-graphics' | 'lightweight' | 'clear') => {
    if (type === 'all-setup') {
      setSelectedModIds(savedModIds.length > 0 ? savedModIds : ['ets2-brutal-weather']);
    } else if (type === 'heavy-graphics') {
      setSelectedModIds(['ac-pure-csp', 'gtav-nve-remastered', 'cp2077-hd-reworked']);
    } else if (type === 'lightweight') {
      setSelectedModIds(['simhub-nextgen-telemetry', 'ets2-scania-v8-sound', 'ac-porsche-gt3rs']);
    } else if (type === 'clear') {
      setSelectedModIds([]);
    }
  };

  // FPS Status evaluation
  const getFpsStatus = (fps: number) => {
    if (fps >= 100) return { label: 'Ultra Fluide & Compétitif', color: 'text-emerald-400', border: 'border-emerald-500' };
    if (fps >= 60) return { label: 'Fluide & Confortable (60+ FPS)', color: 'text-neon-cyan', border: 'border-neon-cyan' };
    if (fps >= 40) return { label: 'Jouable mais saccades possibles', color: 'text-amber-400', border: 'border-amber-500' };
    return { label: 'Critique - Réduire les filtres graphiques', color: 'text-rose-400', border: 'border-rose-500' };
  };

  const fpsStatus = getFpsStatus(calculation.projectedFps);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          Simulateur Télémétrique & Diagnostic
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Comparateur d'Impact de Performance
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sélectionnez votre configuration matérielle et observez en temps réel l'impact cumulé des mods sur votre framerate, votre VRAM et votre fluidité globale.
        </p>
      </div>

      {/* Main Grid: Hardware & Selection (Left) | Visual Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Hardware Config & Mod Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hardware Configuration Box */}
          <div className="p-5 rounded-3xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neon-cyan" />
              1. Votre Configuration Matérielle
            </h3>

            {/* Hardware Preset Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Profil de Machine :</label>
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neon-cyan"
              >
                {HARDWARE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gpu})
                  </option>
                ))}
              </select>
            </div>

            {/* Hardware Specs Display */}
            <div className="p-3 rounded-xl bg-dark-950/80 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Carte Graphique (GPU) :</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {currentPreset.gpu}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Processeur (CPU) :</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {currentPreset.cpu}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">VRAM Dédiée :</span>
                <span className="font-mono font-bold text-neon-cyan">
                  {currentPreset.vramGB} GB GDDR6X
                </span>
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-neon-cyan" /> Résolution d'affichage :
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['1080p', '1440p', '4K', 'VR'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      resolution === res
                        ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mod Selection for Benchmark */}
          <div className="p-5 rounded-3xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-neon-orange" />
                2. Mods en Cours de Test ({activeBenchmarkMods.length})
              </h3>
              <button
                onClick={() => applyScenario('clear')}
                className="text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors"
              >
                Vider
              </button>
            </div>

            {/* Quick Test Scenarios */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => applyScenario('all-setup')}
                className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                Mon Setup Actuel
              </button>
              <button
                onClick={() => applyScenario('heavy-graphics')}
                className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                Heavy Graphics (ReShade + RT)
              </button>
              <button
                onClick={() => applyScenario('lightweight')}
                className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                Zero FPS Loss
              </button>
            </div>

            {/* Mod selection list */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {mods.slice(0, 80).map((mod) => {
                const isSelected = selectedModIds.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleModInBenchmark(mod.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-800/90 border-neon-cyan/50 text-white'
                        : 'bg-dark-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-neon-cyan focus:ring-0 cursor-pointer"
                      />
                      <span className="font-medium truncate">{mod.title}</span>
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold shrink-0 ml-2 ${
                        mod.perfImpact === 'Faible'
                          ? 'text-emerald-400'
                          : mod.perfImpact === 'Moyen'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {mod.fpsDropText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Telemetry Gauges, VRAM & Smart Diagnostic */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Telemetry HUD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-dark-900/95 via-dark-850 to-dark-950 border border-slate-700/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient neon light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top row: Resolution & Base vs Modded comparison */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">Simulation en direct</span>
                <h3 className="text-xl font-black text-white font-gaming mt-0.5">
                  Résultats Prédictifs ({resolution})
                </h3>
              </div>
              <div
                className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${fpsStatus.color} ${fpsStatus.border} bg-dark-950/80 shadow-md`}
              >
                {fpsStatus.label}
              </div>
            </div>

            {/* Big FPS Counter Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 items-center text-center">
              {/* Base FPS */}
              <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">
                  FPS Jeu de Base
                </span>
                <span className="text-3xl font-black text-slate-300 font-gaming mt-1 block">
                  {calculation.baseFps}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Sans aucun mod</span>
              </div>

              {/* Cumulative Drop */}
              <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">
                  Perte Cumulée
                </span>
                <span className="text-3xl font-black text-neon-orange font-gaming mt-1 block">
                  -{calculation.totalFpsDrop} FPS
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {calculation.baseFps > 0
                    ? `(-${Math.round((calculation.totalFpsDrop / calculation.baseFps) * 100)}%)`
                    : ''}
                </span>
              </div>

              {/* Final Projected FPS */}
              <div className="p-4 rounded-2xl bg-dark-950/90 border border-neon-cyan/40 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
                <span className="text-[11px] font-mono text-neon-cyan uppercase block font-bold">
                  FPS Estimés Avec Mods
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white font-gaming mt-1 block tracking-tight">
                  {calculation.projectedFps}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                  1% Lows : ~{calculation.projected1PercentLow} FPS
                </span>
              </div>
            </div>

            {/* Fluidity & Frame-Time Indicators */}
            <div className="grid grid-cols-2 gap-4 pb-6">
              <div className="p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Temps de trame (Frame-time) :</span>
                <span className="font-mono font-bold text-white">
                  {calculation.frameTimeMs} ms
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Indice de Stabilité :</span>
                <span className="font-mono font-bold text-emerald-400">
                  {calculation.projectedFps >= 60 ? '98% (Stable)' : '82% (Fluctuant)'}
                </span>
              </div>
            </div>

            {/* VRAM Utilization Meter */}
            <div className="space-y-2 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  Consommation de Mémoire Vidéo (VRAM)
                </span>
                <span className="font-mono font-bold text-white">
                  {calculation.totalVramAllocatedGB} GB / {currentPreset.vramGB} GB ({calculation.vramPercentage}%)
                </span>
              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    calculation.vramPercentage > 90
                      ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                      : calculation.vramPercentage > 75
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-neon-cyan to-purple-500'
                  }`}
                  style={{ width: `${calculation.vramPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Textures & Shaders +{calculation.totalVramImpactMB} MB</span>
                <span>
                  {calculation.vramPercentage > 90
                    ? '⚠️ Risque de micro-saccades en cas de saturation'
                    : 'Capacité VRAM optimale'}
                </span>
              </div>
            </div>
          </div>

          {/* Smart AI / Diagnostic Assistant Box */}
          <div className="p-5 rounded-3xl bg-dark-900/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neon-cyan flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Recommandation & Analyse Diagnostic
            </h4>

            {calculation.projectedFps >= 90 && calculation.vramPercentage <= 80 ? (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400 block mb-0.5">Configuration Idéale !</strong>
                  Votre {currentPreset.gpu} encaisse parfaitement ce combo de {activeBenchmarkMods.length} mods en {resolution}. Vous profiterez d'un rendu photoréaliste tout en conservant une fluidité compétitive.
                </div>
              </div>
            ) : calculation.vramPercentage > 90 ? (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-slate-200">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-400 block mb-0.5">Attention : Saturation VRAM Détectée</strong>
                  Ce combo dépasse 90% des {currentPreset.vramGB}GB de votre carte graphique. En cas de conduite rapide en ville dense (ex: ProMods ou NVE), des chutes de FPS temporaires peuvent survenir. Baissez les textures de 8K à 4K pour un résultat parfait.
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-slate-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 block mb-0.5">Impact Notable sur la Fluidité</strong>
                  Le framerate simulé est de {calculation.projectedFps} FPS. Pour les jeux de simulation de course rapide (Assetto Corsa), il est recommandé de désactiver le Ray Tracing dans Pure pour repasser au-delà des 80 FPS.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

