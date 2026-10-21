import React from 'react';
import type { GameId } from '../types';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectGame: (game: GameId | 'all') => void;
  onOpenSubmitModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectGame, onOpenSubmitModal }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950/90 text-slate-400 text-xs py-12 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ModHub Pro"
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
              />
              <span className="font-gaming text-xl font-bold tracking-wider text-white">
                MODHUB <span className="text-neon-orange">PRO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La plateforme ultime pour centraliser, comparer l'impact FPS, tester et installer vos mods sur vos simulateurs préférés.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Système Opérationnel • API 60 FPS</span>
            </div>
          </div>

          {/* Quick Games links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider">
              Simulateurs & Jeux
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectGame('ets2')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  Euro Truck Simulator 2 (ETS2)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('assetto_corsa')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  Assetto Corsa & CSP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('gtav')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  GTA V & FiveM
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('cyberpunk2077')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  Cyberpunk 2077
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('beamng')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  BeamNG.drive Soft-Body
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider">
              Fonctionnalités Clés
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-neon-cyan transition-colors cursor-pointer">
                  Comparateur d'Impact FPS & VRAM
                </span>
              </li>
              <li>
                <span className="hover:text-neon-cyan transition-colors cursor-pointer">
                  Modpack Builder & Export .json
                </span>
              </li>
              <li>
                <span className="hover:text-neon-cyan transition-colors cursor-pointer">
                  Slider Avant / Après ReShade
                </span>
              </li>
              <li>
                <button
                  onClick={onOpenSubmitModal}
                  className="hover:text-neon-orange transition-colors"
                >
                  Proposer un Mod (Espace Créateur)
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Integrity */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider">
              Garantie Sécurité
            </h4>
            <div className="p-3.5 rounded-2xl bg-dark-900 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Vérifié Sans Virus
              </div>
              <p className="text-[11px] leading-relaxed">
                Chaque archive est analysée par empreinte SHA-256 et testée pour garantir l'absence de crashs et de conflits d'ordre de chargement.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} ModHub Pro. Tous droits réservés aux auteurs des mods respectifs.
          </div>
          <div className="flex items-center gap-2">
            <span>Conçu avec passion pour la communauté simulation gaming</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
