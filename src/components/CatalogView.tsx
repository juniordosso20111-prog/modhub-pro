import React, { useState, useMemo, useEffect } from 'react';
import type { Mod, GameId, PerfImpact } from '../types';
import { GAME_OPTIONS, CATEGORY_OPTIONS } from '../data/mockMods';
import { ModCard } from './ModCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  Gauge,
  RotateCcw,
  X,
  Eye,
  Check,
  Layers,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface CatalogViewProps {
  mods: Mod[];
  selectedGame: GameId | 'all';
  setSelectedGame: (game: GameId | 'all') => void;
  savedModIds: string[];
  onToggleSetup: (mod: Mod) => void;
  onOpenDetails: (mod: Mod) => void;
  onQuickDownload: (mod: Mod) => void;
}

export type SortOption = 'downloads' | 'rating' | 'fps' | 'recent';

export const CatalogView: React.FC<CatalogViewProps> = ({
  mods,
  selectedGame,
  setSelectedGame,
  savedModIds,
  onToggleSetup,
  onOpenDetails,
  onQuickDownload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes les Catégories');
  const [selectedPerfImpact, setSelectedPerfImpact] = useState<PerfImpact | 'Tous'>('Tous');
  const [selectedVersion, setSelectedVersion] = useState<string>('Toutes les Versions');
  const [vrOnly, setVrOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('downloads');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [pageInput, setPageInput] = useState('');

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGame, selectedCategory, selectedPerfImpact, selectedVersion, vrOnly, searchQuery, sortBy]);

  // Extract distinct versions from the first batch
  const availableVersions = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < Math.min(mods.length, 500); i++) {
      if (mods[i].gameVersion) set.add(mods[i].gameVersion);
    }
    return Array.from(set);
  }, [mods]);

  // Filter & Sort Logic
  const filteredMods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return mods
      .filter((mod) => {
        // Game filter
        if (selectedGame !== 'all' && mod.gameId !== selectedGame) {
          return false;
        }
        // Category filter
        if (
          selectedCategory !== 'Toutes les Catégories' &&
          mod.category !== selectedCategory
        ) {
          return false;
        }
        // Perf impact filter
        if (selectedPerfImpact !== 'Tous' && mod.perfImpact !== selectedPerfImpact) {
          return false;
        }
        // Version filter
        if (
          selectedVersion !== 'Toutes les Versions' &&
          mod.gameVersion !== selectedVersion
        ) {
          return false;
        }
        // VR Only
        if (vrOnly && !mod.isVrReady) {
          return false;
        }
        // Search query
        if (q) {
          const matchTitle = mod.title.toLowerCase().includes(q);
          const matchAuthor = mod.author.toLowerCase().includes(q);
          const matchGame = mod.gameShort.toLowerCase().includes(q);
          const matchTags = mod.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchAuthor || matchGame || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'fps') return a.fpsDropAvg - b.fpsDropAvg;
        if (sortBy === 'recent') {
          return (b.id.startsWith('custom') ? 1 : 0) - (a.id.startsWith('custom') ? 1 : 0);
        }
        return 0;
      });
  }, [
    mods,
    selectedGame,
    selectedCategory,
    selectedPerfImpact,
    selectedVersion,
    vrOnly,
    searchQuery,
    sortBy,
  ]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredMods.length / itemsPerPage));
  const paginatedMods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMods.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMods, currentPage, itemsPerPage]);

  const hasActiveFilters =
    selectedGame !== 'all' ||
    selectedCategory !== 'Toutes les Catégories' ||
    selectedPerfImpact !== 'Tous' ||
    selectedVersion !== 'Toutes les Versions' ||
    vrOnly ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedGame('all');
    setSelectedCategory('Toutes les Catégories');
    setSelectedPerfImpact('Tous');
    setSelectedVersion('Toutes les Versions');
    setVrOnly(false);
    setSearchQuery('');
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setPageInput('');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Title & Quick Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Explorateur Massif de Mods
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Catalogue Pro ({filteredMods.length.toLocaleString('fr-FR')} Mods)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Parcourez une bibliothèque certifiée de 100 000 mods ultra-optimisés avec téléchargement direct garanti.
          </p>
        </div>

        {/* View Switcher, Per-page & Result Count */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Per Page Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-dark-900 border border-slate-800 px-2.5 py-1.5 rounded-xl">
            <span className="hidden sm:inline">Afficher :</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value={24} className="bg-dark-900 text-white">24</option>
              <option value={48} className="bg-dark-900 text-white">48</option>
              <option value={96} className="bg-dark-900 text-white">96</option>
            </select>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-dark-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            Page <span className="font-bold text-white">{currentPage}</span> / {totalPages.toLocaleString('fr-FR')}
          </div>

          <div className="flex items-center bg-dark-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-neon-cyan shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-neon-cyan shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher instantanément parmi les 100 000 mods (titre, auteur, ETS2, CSP, shader...)"
              className="w-full bg-dark-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="flex-1 relative flex items-center bg-dark-950/90 border border-slate-700/80 rounded-xl px-3 py-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="downloads" className="bg-dark-900 text-white">
                  Les Plus Téléchargés
                </option>
                <option value="rating" className="bg-dark-900 text-white">
                  Les Mieux Notés (Étoiles)
                </option>
                <option value="fps" className="bg-dark-900 text-white">
                  Plus Économes en FPS (0 impact)
                </option>
                <option value="recent" className="bg-dark-900 text-white">
                  Les Plus Récents
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Game Horizontal Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {GAME_OPTIONS.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g.id as GameId | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                selectedGame === g.id
                  ? 'bg-cyan-950/90 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-dark-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Detailed Secondary Filters (Category, Perf, Version, VR) */}
        <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-dark-950/90 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-neon-cyan"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Perf Impact Buttons */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Impact FPS</label>
            <div className="grid grid-cols-4 gap-1">
              {(['Tous', 'Faible', 'Moyen', 'Élevé'] as const).map((impact) => (
                <button
                  key={impact}
                  onClick={() => setSelectedPerfImpact(impact)}
                  className={`py-2 rounded-lg text-[11px] font-medium transition-all border ${
                    selectedPerfImpact === impact
                      ? impact === 'Faible'
                        ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400 font-bold'
                        : impact === 'Moyen'
                        ? 'bg-amber-950/90 border-amber-500 text-amber-400 font-bold'
                        : impact === 'Élevé'
                        ? 'bg-rose-950/90 border-rose-500 text-rose-400 font-bold'
                        : 'bg-slate-800 border-neon-cyan text-neon-cyan font-bold'
                      : 'bg-dark-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {impact}
                </button>
              ))}
            </div>
          </div>

          {/* Game Version Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Version Compatible</label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full bg-dark-950/90 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-neon-cyan"
            >
              <option value="Toutes les Versions" className="bg-dark-900 text-white">
                Toutes les Versions
              </option>
              {availableVersions.map((v) => (
                <option key={v} value={v} className="bg-dark-900 text-white">
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* VR & Reset Row */}
          <div className="space-y-1 flex flex-col justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVrOnly(!vrOnly)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  vrOnly
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-dark-950/70 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🥽</span> Compatible VR
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  title="Réinitialiser les filtres"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mods Listing */}
      {filteredMods.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-dark-900/50 border border-slate-800/80 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Aucun mod ne correspond à vos filtres</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Essayez d'élargir vos critères de recherche ou réinitialisez les filtres pour voir l'ensemble du catalogue.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold text-xs hover:bg-neon-cyan hover:text-dark-950 transition-all"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {paginatedMods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              isInSetup={savedModIds.includes(mod.id)}
              onToggleSetup={onToggleSetup}
              onOpenDetails={onOpenDetails}
              onQuickDownload={onQuickDownload}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {paginatedMods.map((mod) => (
            <div
              key={mod.id}
              className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={mod.medias[0].url}
                  alt={mod.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neon-cyan">{mod.gameShort}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{mod.category}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">{mod.modVersion}</span>
                  </div>
                  <h3
                    onClick={() => onOpenDetails(mod)}
                    className="font-bold text-white text-sm sm:text-base truncate group-hover:text-neon-cyan transition-colors cursor-pointer mt-0.5"
                  >
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{mod.shortDescription}</p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 justify-end">
                    <Gauge className="w-3.5 h-3.5" />
                    {mod.fpsDropText}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {formatNumber(mod.downloads)} téléchargements
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetails(mod)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Fiche
                  </button>
                  <button
                    onClick={() => onToggleSetup(mod)}
                    className={`p-2 rounded-xl border ${
                      savedModIds.includes(mod.id)
                        ? 'bg-neon-orange/20 border-neon-orange text-neon-orange'
                        : 'bg-dark-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {savedModIds.includes(mod.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Layers className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onQuickDownload(mod)}
                    className="p-2 rounded-xl bg-cyan-950 border border-neon-cyan/50 text-neon-cyan hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-400 text-center sm:text-left">
            Affichage des mods <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> à{' '}
            <strong className="text-white">
              {Math.min(currentPage * itemsPerPage, filteredMods.length).toLocaleString('fr-FR')}
            </strong>{' '}
            sur <strong className="text-neon-cyan">{filteredMods.length.toLocaleString('fr-FR')}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            {/* First & Prev */}
            <button
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Première page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick page numbers around current */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = currentPage - 2 + i;
                if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                if (p < 1 || p > totalPages) return null;

                return (
                  <button
                    key={p}
                    onClick={() => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-xl font-bold transition-all ${
                      currentPage === p
                        ? 'bg-neon-cyan text-dark-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-dark-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next & Last */}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentPage(totalPages);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Dernière page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to page form */}
          <form onSubmit={handlePageJump} className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Aller à :</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={currentPage.toString()}
              className="w-16 bg-dark-950 border border-slate-800 rounded-lg px-2 py-1 text-center text-white focus:outline-none focus:border-neon-cyan"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              OK
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
