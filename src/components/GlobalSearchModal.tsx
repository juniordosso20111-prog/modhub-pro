import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Mod } from '../types';
import { Search, X, ChevronRight, Star, Sparkles } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mods: Mod[];
  onSelectMod: (mod: Mod) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  mods,
  onSelectMod,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredMods = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return mods.slice(0, 6);

    const matches: Mod[] = [];
    for (let i = 0; i < mods.length; i++) {
      const m = mods[i];
      if (
        m.title.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.gameShort.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      ) {
        matches.push(m);
        if (matches.length >= 25) break;
      }
    }
    return matches;
  }, [searchTerm, mods]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-dark-950/70">
          <Search className="w-5 h-5 text-neon-cyan shrink-0 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un mod, un jeu (ETS2, Assetto Corsa...), ReShade, une map..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1 divide-y divide-slate-800/40">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{searchTerm ? `Résultats (${filteredMods.length})` : 'Mods Populaires & Recommandés'}</span>
            <span className="text-neon-cyan font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ModHub Pro Live Search
            </span>
          </div>

          {filteredMods.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-sm">Aucun mod trouvé pour « {searchTerm} »</p>
              <p className="text-xs text-slate-500">Essayez avec « ReShade », « ETS2 », « Map » ou « Shaders »</p>
            </div>
          ) : (
            filteredMods.map((mod) => (
              <div
                key={mod.id}
                onClick={() => {
                  onSelectMod(mod);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/80">
                    <img src={mod.medias[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neon-cyan">{mod.gameShort}</span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-400">{mod.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-neon-cyan transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate max-w-md">{mod.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {mod.rating.toFixed(2)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{mod.fpsDropText}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-dark-950/80 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">↵</kbd> Ouvrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ESC</kbd> Quitter
            </span>
          </div>
          <span className="text-slate-500">12 Mods certifiés disponibles</span>
        </div>
      </div>
    </div>
  );
};

