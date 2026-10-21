import React from 'react';
import type { Mod } from '../types';
import {
  Download,
  Flame,
  Star,
  Gauge,
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface HeroSectionProps {
  featuredMod: Mod;
  onOpenDetails: (mod: Mod) => void;
  onQuickDownload: (mod: Mod) => void;
  onSelectCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredMod,
  onOpenDetails,
  onQuickDownload,
  onSelectCategory,
}) => {
  return (
    <div className="relative pt-6 pb-12 overflow-hidden">
      {/* Background Neon ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-neon-cyan/15 via-neon-orange/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Card */}
        <div className="relative rounded-3xl border border-slate-700/80 bg-gradient-to-br from-dark-900/90 via-dark-850/80 to-dark-950/90 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          {/* Subtle Cyber Grid Texture */}
          <div className="absolute inset-0 bg-cyber-grid bg-[size:24px_24px] opacity-25 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Badges, Details, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-neon-orange to-amber-500 text-dark-950 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,102,0,0.4)]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Mod de la Semaine
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-neon-cyan border border-neon-cyan/40">
                  {featuredMod.game}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-dark-950 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Certifié Sans Crash
                </span>
              </div>

              {/* Title & Slogan */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {featuredMod.title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredMod.description}
                </p>
              </div>

              {/* Highlights & Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-dark-950/70 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Impact FPS</div>
                  <div className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Gauge className="w-4 h-4" /> {featuredMod.fpsDropText}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-dark-950/70 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Note Joueurs</div>
                  <div className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-400" /> {featuredMod.rating.toFixed(2)}/5
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-dark-950/70 border border-slate-800 backdrop-blur-md">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Téléchargements</div>
                  <div className="text-sm sm:text-base font-bold text-neon-cyan flex items-center gap-1.5 mt-0.5">
                    <Download className="w-4 h-4" /> {formatNumber(featuredMod.downloads)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onQuickDownload(featuredMod)}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-dark-950 font-black text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger Direct ({featuredMod.fileSize})</span>
                </button>

                <button
                  onClick={() => onOpenDetails(featuredMod)}
                  className="py-3.5 px-6 rounded-2xl bg-dark-950/90 hover:bg-slate-800/80 text-white font-bold text-sm tracking-wide border border-slate-700/80 hover:border-slate-500 flex items-center gap-2 transition-all"
                >
                  <span>Voir la Fiche Détaillée</span>
                  <ArrowRight className="w-4 h-4 text-neon-cyan" />
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual with Interactive Before/After Badge */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] cursor-pointer" onClick={() => onOpenDetails(featuredMod)}>
                <img
                  src={featuredMod.medias[0].url}
                  alt={featuredMod.title}
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent" />

                {/* Live Pill badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-dark-950/90 border border-neon-cyan/50 backdrop-blur-md text-neon-cyan text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Comparateur Avant/Après Intégré
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs font-mono text-slate-400">Auteur : {featuredMod.author}</div>
                  <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-between">
                    <span>Version {featuredMod.modVersion}</span>
                    <span className="text-xs text-neon-cyan font-mono hover:underline flex items-center gap-1">
                      Inspecter <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Live Ticker & Quick Category Navigation */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-gaming">100 000+</div>
              <div className="text-xs text-slate-400">Mods Indexés & Vérifiés</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-950/70 border border-neon-orange/30 flex items-center justify-center text-neon-orange shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-gaming">2.4M+</div>
              <div className="text-xs text-slate-400">Téléchargements Directs</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-gaming">100%</div>
              <div className="text-xs text-slate-400">Détecteur de Conflits</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-gaming">0 FPS Perte</div>
              <div className="text-xs text-slate-400">Mods SimHub & Télémétrie</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

