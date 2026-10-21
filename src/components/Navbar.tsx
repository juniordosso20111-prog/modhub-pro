import React, { useState } from 'react';
import type { GameId, AccentColor } from '../types';
import { GAME_OPTIONS } from '../data/mockMods';
import {
  Search,
  Sliders,
  Layers,
  PlusCircle,
  Gamepad2,
  Palette,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'catalog' | 'perf' | 'setup';
  setActiveTab: (tab: 'home' | 'catalog' | 'perf' | 'setup') => void;
  selectedGame: GameId | 'all';
  setSelectedGame: (game: GameId | 'all') => void;
  setupCount: number;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  onOpenSearch: () => void;
  onOpenSubmitModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedGame,
  setSelectedGame,
  setupCount,
  accentColor,
  setAccentColor,
  onOpenSearch,
  onOpenSubmitModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accentDropdownOpen, setAccentDropdownOpen] = useState(false);

  const accents: { id: AccentColor; label: string; color: string; border: string }[] = [
    { id: 'cyan', label: 'Cyan Néon', color: 'bg-[#00f0ff]', border: 'border-[#00f0ff]' },
    { id: 'orange', label: 'Orange Cyber', color: 'bg-[#ff6600]', border: 'border-[#ff6600]' },
    { id: 'green', label: 'Vert Émeraude', color: 'bg-[#10b981]', border: 'border-[#10b981]' },
    { id: 'purple', label: 'Violet Synth', color: 'bg-[#a855f7]', border: 'border-[#a855f7]' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-900/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3.5 group focus:outline-none"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-neon-cyan/20 blur-md group-hover:bg-neon-cyan/40 transition-all duration-300" />
                <img
                  src="/logo.png"
                  alt="ModHub Pro"
                  className="relative w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.7)] group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-gaming text-2xl font-black tracking-wider text-white">
                    MODHUB
                  </span>
                  <span className="font-gaming text-2xl font-black tracking-wider text-neon-orange drop-shadow-[0_0_8px_rgba(255,102,0,0.6)]">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Hub & Mod Manager
                </div>
              </div>
            </button>

            {/* Active Game Selector Dropdown */}
            <div className="relative hidden lg:block">
              <div className="flex items-center gap-2 bg-dark-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Gamepad2 className="w-4 h-4 text-neon-cyan" />
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value as GameId | 'all')}
                  className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-2"
                >
                  {GAME_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id} className="bg-dark-900 text-slate-200">
                      {g.icon} {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Search Bar trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-dark-950/70 border border-slate-800/90 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan transition-colors" />
                <span>Rechercher des mods, ReShade, maps...</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 border border-slate-700/60">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-800/90 text-white font-semibold shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'catalog'
                  ? 'bg-slate-800/90 text-white font-semibold shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Catalogue de Mods
            </button>

            <button
              onClick={() => setActiveTab('perf')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'perf'
                  ? 'bg-slate-800/90 text-neon-cyan font-semibold shadow-sm border border-neon-cyan/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
              Comparateur Perf
            </button>

            <button
              onClick={() => setActiveTab('setup')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
                activeTab === 'setup'
                  ? 'bg-slate-800/90 text-neon-orange font-semibold shadow-sm border border-neon-orange/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-neon-orange" />
              Mon Setup
              {setupCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-neon-orange text-dark-950 text-[11px] font-bold flex items-center justify-center -mr-1">
                  {setupCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: Accent picker & Proposer un mod */}
          <div className="flex items-center gap-2.5">
            {/* Search icon for mobile */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-400 hover:text-white md:hidden"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Accent Color Switcher */}
            <div className="relative">
              <button
                onClick={() => setAccentDropdownOpen(!accentDropdownOpen)}
                title="Changer le néon d'ambiance"
                className="p-2 rounded-xl bg-dark-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Palette className="w-4 h-4 text-neon-cyan" />
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    accents.find((a) => a.id === accentColor)?.color
                  } shadow-sm`}
                />
              </button>

              {accentDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-dark-900 border border-slate-700/80 p-2 shadow-2xl z-50 animate-fade-in space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-mono uppercase text-slate-400">
                    Accent Néon
                  </div>
                  {accents.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccentColor(acc.id);
                        setAccentDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        accentColor === acc.id
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${acc.color} shadow-sm`} />
                        {acc.label}
                      </span>
                      {accentColor === acc.id && (
                        <span className="text-[10px] text-neon-cyan font-mono">Actif</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Proposer un Mod Button */}
            <button
              onClick={onOpenSubmitModal}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-neon-orange to-amber-500 hover:from-orange-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,102,0,0.3)] hover:shadow-[0_0_20px_rgba(255,102,0,0.5)] transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Proposer un Mod</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-dark-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Game select */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Jeu Actif :</span>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value as GameId | 'all')}
              className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200"
            >
              {GAME_OPTIONS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.icon} {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 pt-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'home' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => {
                setActiveTab('catalog');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'catalog' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Catalogue de Mods
            </button>
            <button
              onClick={() => {
                setActiveTab('perf');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
                activeTab === 'perf' ? 'bg-slate-800 text-neon-cyan font-bold' : 'text-slate-400'
              }`}
            >
              <Sliders className="w-4 h-4 text-neon-cyan" />
              Comparateur de Perf
            </button>
            <button
              onClick={() => {
                setActiveTab('setup');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                activeTab === 'setup' ? 'bg-slate-800 text-neon-orange font-bold' : 'text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-neon-orange" />
                Mon Setup / Modpack
              </span>
              {setupCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-neon-orange text-dark-950 font-bold text-xs">
                  {setupCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              onOpenSubmitModal();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-neon-orange to-amber-500 text-dark-950 font-bold text-sm uppercase flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Proposer un Mod
          </button>
        </div>
      )}
    </header>
  );
};

