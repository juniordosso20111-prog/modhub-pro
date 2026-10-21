import React from 'react';
import { Mod } from '../types';
import {
  Star,
  Download,
  Gauge,
  Layers,
  Check,
  CheckCircle2,
  HardDrive,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface ModCardProps {
  mod: Mod;
  isInSetup: boolean;
  onToggleSetup: (mod: Mod) => void;
  onOpenDetails: (mod: Mod) => void;
  onQuickDownload: (mod: Mod) => void;
}

export const ModCard: React.FC<ModCardProps> = ({
  mod,
  isInSetup,
  onToggleSetup,
  onOpenDetails,
  onQuickDownload,
}) => {
  const getPerfColor = (impact: string) => {
    switch (impact) {
      case 'Faible':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      case 'Moyen':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
      case 'Élevé':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const primaryImage = mod.medias[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 relative">
      {/* Top Banner Image with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onOpenDetails(mod)}>
        <img
          src={primaryImage}
          alt={mod.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Game Tag */}
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-dark-950/90 text-neon-cyan border border-neon-cyan/40 backdrop-blur-md shadow-md">
            {mod.gameShort}
          </span>

          {/* Perf Impact Badge */}
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold flex items-center gap-1.5 border backdrop-blur-md shadow-md ${getPerfColor(
              mod.perfImpact
            )}`}
          >
            <Gauge className="w-3 h-3" />
            {mod.fpsDropText}
          </span>
        </div>

        {/* Category Pill on bottom of image */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-md">
            {mod.category}
          </span>
          {mod.medias.some((m) => m.isBeforeAfter) && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-950/90 text-neon-cyan border border-neon-cyan/50 backdrop-blur-md flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Avant/Après
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title & Author */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onOpenDetails(mod)}
              className="font-bold text-white text-base leading-snug group-hover:text-neon-cyan transition-colors cursor-pointer line-clamp-1"
              title={mod.title}
            >
              {mod.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <span>Par</span>
            <span className="text-slate-300 font-medium">{mod.author}</span>
            {mod.authorVerified && (
              <span title="Créateur Vérifié">
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-cyan inline" />
              </span>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px]">{mod.modVersion}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {mod.shortDescription}
          </p>
        </div>

        {/* Stats Row */}
        <div className="pt-3 border-t border-slate-800/70 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-1.5 rounded-lg bg-dark-950/60 border border-slate-800/80">
            <span className="block text-[10px] font-mono text-slate-400 uppercase">Téléch.</span>
            <span className="font-bold text-slate-200">{formatNumber(mod.downloads)}</span>
          </div>
          <div className="p-1.5 rounded-lg bg-dark-950/60 border border-slate-800/80">
            <span className="block text-[10px] font-mono text-slate-400 uppercase">Avis</span>
            <span className="font-bold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              {mod.rating.toFixed(2)}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-dark-950/60 border border-slate-800/80">
            <span className="block text-[10px] font-mono text-slate-400 uppercase">Taille</span>
            <span className="font-bold text-slate-300 font-mono text-[11px]">{mod.fileSize}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center gap-2">
          {/* Details Button */}
          <button
            onClick={() => onOpenDetails(mod)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <Eye className="w-3.5 h-3.5" />
            Détails
          </button>

          {/* Add / Remove from Setup */}
          <button
            onClick={() => onToggleSetup(mod)}
            title={isInSetup ? 'Retirer de Mon Setup' : 'Ajouter à Mon Setup'}
            className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
              isInSetup
                ? 'bg-neon-orange/20 border-neon-orange text-neon-orange shadow-[0_0_10px_rgba(255,102,0,0.3)]'
                : 'bg-dark-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {isInSetup ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
          </button>

          {/* Quick Direct Download Button */}
          <button
            onClick={() => onQuickDownload(mod)}
            title="Téléchargement Direct"
            className="p-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-neon-cyan/50 text-neon-cyan hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
