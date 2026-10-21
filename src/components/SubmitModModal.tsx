import React, { useState } from 'react';
import type { Mod, GameId, ModCategory, PerfImpact, ModSubmission } from '../types';
import { GAME_OPTIONS, CATEGORY_OPTIONS } from '../data/mockMods';
import {
  X,
  PlusCircle,
  Sparkles,
  Eye,
  Star,
} from 'lucide-react';
import { triggerConfetti } from '../utils/helpers';

interface SubmitModModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newMod: Mod) => void;
}

export const SubmitModModal: React.FC<SubmitModModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ModSubmission>({
    title: '',
    author: '',
    gameId: 'ets2',
    category: 'Graphismes / ReShade',
    perfImpact: 'Faible',
    fpsDropText: '-1 à -3 FPS',
    gameVersion: 'v1.51+',
    modVersion: 'v1.0.0',
    fileSize: '450 MB',
    shortDescription: '',
    description: '',
    installPath: '%USERPROFILE%\\Documents\\Euro Truck Simulator 2\\mod\\',
    installSteps: '1. Téléchargez le fichier.\n2. Copiez dans le dossier mod.\n3. Activez en jeu.',
    dependencies: '',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
    downloadUrl: 'https://modhub.pro/download/sample-mod.zip',
  });

  if (!isOpen) return null;

  const handleChange = (
    field: keyof ModSubmission,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.shortDescription) return;

    const gameMeta = GAME_OPTIONS.find((g) => g.id === formData.gameId) || GAME_OPTIONS[1];

    const newMod: Mod = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      authorVerified: true,
      gameId: formData.gameId,
      game: gameMeta.name as any,
      gameShort: gameMeta.short,
      category: formData.category,
      perfImpact: formData.perfImpact,
      fpsDropText: formData.fpsDropText,
      fpsDropAvg: formData.perfImpact === 'Faible' ? 2 : formData.perfImpact === 'Moyen' ? 5 : 12,
      vramImpactMB: 800,
      gameVersion: formData.gameVersion,
      modVersion: formData.modVersion,
      fileSize: formData.fileSize,
      rating: 5.0,
      reviewCount: 1,
      downloads: 1,
      releaseDate: 'Aujourd\'hui',
      updateDate: 'Aujourd\'hui',
      tags: ['Nouveau', 'Création Communauté', formData.category.split('/')[0].trim()],
      isFeatured: false,
      shortDescription: formData.shortDescription,
      description: formData.description || formData.shortDescription,
      features: ['Mod certifié vérifié par ModHub Pro', 'Installation sans conflit'],
      medias: [
        {
          url: formData.imageUrl || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          caption: formData.title,
        },
      ],
      dependencies: formData.dependencies
        ? [{ name: formData.dependencies, required: true }]
        : [],
      installPath: formData.installPath,
      installSteps: formData.installSteps.split('\n').filter((s) => s.trim().length > 0),
      comments: [
        {
          id: `comm-${Date.now()}`,
          user: formData.author,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          date: 'À l\'instant',
          rating: 5,
          text: 'Bienvenue sur la fiche de mon nouveau mod ! N\'hésitez pas à laisser vos retours et notes.',
          upvotes: 1,
          downvotes: 0,
          badge: 'Auteur',
        },
      ],
      downloadUrl: formData.downloadUrl,
      checksumSha256: '9f83ac58b184284d7281bc89a0293847e9281a8b1928374828192837492810a4',
      isVrReady: true,
    };

    triggerConfetti();
    onSubmit(newMod);
    onClose();
  };

  const targetGame = GAME_OPTIONS.find((g) => g.id === formData.gameId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-neon-cyan/40 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-dark-950/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-neon-cyan/50 flex items-center justify-center text-neon-cyan">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Proposer un Nouveau Mod sur ModHub Pro
              </h2>
              <p className="text-xs text-slate-400">
                Partagez votre création avec la communauté de moddeurs et sim racers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid: Form (Left) & Real-time Live Preview (Right) */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs">
              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Titre du Mod *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ex: Realistic Reshade 2026"
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Auteur / Créateur *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Votre pseudo"
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              {/* Game & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Jeu Cible *
                  </label>
                  <select
                    value={formData.gameId}
                    onChange={(e) => handleChange('gameId', e.target.value as GameId)}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    {GAME_OPTIONS.filter((g) => g.id !== 'all').map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.icon} {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value as ModCategory)}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    {CATEGORY_OPTIONS.filter((c) => c !== 'Toutes les Catégories').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Versions & Size */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">
                    Version Mod
                  </label>
                  <input
                    type="text"
                    value={formData.modVersion}
                    onChange={(e) => handleChange('modVersion', e.target.value)}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">
                    Version Jeu
                  </label>
                  <input
                    type="text"
                    value={formData.gameVersion}
                    onChange={(e) => handleChange('gameVersion', e.target.value)}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">
                    Taille Fichier
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => handleChange('fileSize', e.target.value)}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>
              </div>

              {/* Performance Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Impact FPS Estimé
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Faible', 'Moyen', 'Élevé'] as PerfImpact[]).map((impact) => (
                      <button
                        type="button"
                        key={impact}
                        onClick={() => {
                          handleChange('perfImpact', impact);
                          handleChange(
                            'fpsDropText',
                            impact === 'Faible'
                              ? '-1 à -3 FPS'
                              : impact === 'Moyen'
                              ? '-4 à -7 FPS'
                              : '-10 à -16 FPS'
                          );
                        }}
                        className={`py-2 rounded-lg text-[11px] font-bold border transition-colors ${
                          formData.perfImpact === impact
                            ? 'bg-slate-800 border-neon-cyan text-neon-cyan'
                            : 'bg-dark-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {impact}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Texte de Perte de FPS
                  </label>
                  <input
                    type="text"
                    value={formData.fpsDropText}
                    onChange={(e) => handleChange('fpsDropText', e.target.value)}
                    placeholder="Ex: -3 à -5 FPS"
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-400">
                  Description Courte (1-2 phrases) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  placeholder="Bref résumé accrocheur pour le catalogue"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              {/* Install Path & Steps */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-400">
                  Dossier d'Installation
                </label>
                <input
                  type="text"
                  value={formData.installPath}
                  onChange={(e) => handleChange('installPath', e.target.value)}
                  placeholder="Dossier cible pour le mod"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan font-mono text-[11px]"
                />
              </div>

              {/* Image URL & Download Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    URL Capture d'écran (Image)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Lien Téléchargement Direct
                  </label>
                  <input
                    type="text"
                    value={formData.downloadUrl}
                    onChange={(e) => handleChange('downloadUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-dark-950 font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Publier Mon Mod Immédiatement
                </button>
              </div>
            </form>

            {/* Right: Live Preview Card */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase text-neon-cyan flex items-center gap-1.5 font-bold">
                <Eye className="w-4 h-4" /> Aperçu en Temps Réel de Votre Carte
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={formData.imageUrl || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/60" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-dark-950 text-neon-cyan border border-neon-cyan/40">
                      {targetGame?.short || 'GAME'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      {formData.fpsDropText || '0 FPS'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-900 text-slate-300 border border-slate-700">
                      {formData.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-base truncate">
                      {formData.title || 'Titre de votre Mod'}
                    </h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Par <strong className="text-slate-300">{formData.author || 'Votre Pseudo'}</strong> • {formData.modVersion}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {formData.shortDescription || 'Votre description apparaîtra ici avec une lisibilité optimale pour tous les joueurs.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-850">
                      <span className="block text-[10px] font-mono text-slate-500">Téléch.</span>
                      <span className="font-bold text-slate-200">1</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-850">
                      <span className="block text-[10px] font-mono text-slate-500">Note</span>
                      <span className="font-bold text-amber-400 flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> 5.0
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-850">
                      <span className="block text-[10px] font-mono text-slate-500">Taille</span>
                      <span className="font-bold text-slate-300 font-mono text-[11px]">{formData.fileSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

