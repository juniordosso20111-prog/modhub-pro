import React, { useState } from 'react';
import type { Mod, ModComment } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import {
  X,
  Star,
  Download,
  Gauge,
  Layers,
  Check,
  HardDrive,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  MessageSquare,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatNumber, copyToClipboard } from '../utils/helpers';

interface ModDetailModalProps {
  mod: Mod | null;
  isOpen: boolean;
  onClose: () => void;
  isInSetup: boolean;
  onToggleSetup: (mod: Mod) => void;
  onDownload: (mod: Mod) => void;
  onAddComment: (modId: string, comment: Omit<ModComment, 'id' | 'date' | 'upvotes' | 'downvotes'>) => void;
  onVoteComment: (modId: string, commentId: string, type: 'up' | 'down') => void;
}

export const ModDetailModal: React.FC<ModDetailModalProps> = ({
  mod,
  isOpen,
  onClose,
  isInSetup,
  onToggleSetup,
  onDownload,
  onAddComment,
  onVoteComment,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [copiedPath, setCopiedPath] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Comment Form state
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!isOpen || !mod) return null;

  const currentMedia = mod.medias[activeMediaIndex] || mod.medias[0];
  const beforeAfterMedia = mod.medias.find((m) => m.isBeforeAfter);

  const handleCopyPath = async () => {
    const success = await copyToClipboard(mod.installPath);
    if (success) {
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userComment.trim()) return;

    setIsSubmittingComment(true);
    onAddComment(mod.id, {
      user: userName.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: userRating,
      text: userComment.trim(),
    });
    setUserName('');
    setUserComment('');
    setUserRating(5);
    setIsSubmittingComment(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-dark-900 border border-slate-700/80 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Title, Actions & Close */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-dark-950/80 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-neon-cyan border border-neon-cyan/40">
              {mod.gameShort}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{mod.title}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Par <strong className="text-slate-200">{mod.author}</strong></span>
                <span>•</span>
                <span>Version {mod.modVersion}</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" /> {mod.rating.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleSetup(mod)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isInSetup
                  ? 'bg-neon-orange/20 border-neon-orange text-neon-orange'
                  : 'bg-dark-950 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isInSetup ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isInSetup ? 'Dans Mon Setup' : 'Ajouter au Setup'}
              </span>
            </button>

            <button
              onClick={() => onDownload(mod)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Media Section: Interactive Before/After OR Screenshot Viewer */}
          <div className="space-y-3">
            {beforeAfterMedia && beforeAfterMedia.beforeUrl && beforeAfterMedia.afterUrl ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono uppercase text-neon-cyan flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4" /> Comparateur Avant / Après Interactif
                  </span>
                  <span className="text-slate-400">Déplacez le curseur central</span>
                </div>
                <div className="h-72 sm:h-96 w-full">
                  <BeforeAfterSlider
                    beforeUrl={beforeAfterMedia.beforeUrl}
                    afterUrl={beforeAfterMedia.afterUrl}
                    beforeLabel={beforeAfterMedia.beforeLabel || 'Vanilla'}
                    afterLabel={beforeAfterMedia.afterLabel || 'Moddé 8K'}
                    className="h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900">
                <img
                  src={currentMedia.url}
                  alt={currentMedia.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white bg-dark-950/80 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
                  {currentMedia.caption}
                </div>
              </div>
            )}

            {/* Thumbnail switcher if multiple images */}
            {mod.medias.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {mod.medias.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border shrink-0 transition-all ${
                      activeMediaIndex === idx
                        ? 'border-neon-cyan ring-2 ring-neon-cyan/40 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                    {media.isBeforeAfter && (
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-dark-950 text-[9px] font-mono text-neon-cyan">
                        A/B
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-slate-800">
              <span className="block text-[11px] font-mono uppercase text-slate-400">Téléchargements</span>
              <span className="text-base font-bold text-white mt-1 block">
                {formatNumber(mod.downloads)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-slate-800">
              <span className="block text-[11px] font-mono uppercase text-slate-400">Note Globale</span>
              <span className="text-base font-bold text-amber-400 mt-1 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {mod.rating.toFixed(2)}/5 ({mod.reviewCount})
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-slate-800">
              <span className="block text-[11px] font-mono uppercase text-slate-400">Impact FPS</span>
              <span className="text-base font-bold text-neon-orange mt-1 flex items-center gap-1">
                <Gauge className="w-4 h-4" />
                {mod.fpsDropText}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-slate-800">
              <span className="block text-[11px] font-mono uppercase text-slate-400">Taille Fichier</span>
              <span className="text-base font-bold text-slate-200 mt-1 block font-mono">
                {mod.fileSize}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-slate-800">
              <span className="block text-[11px] font-mono uppercase text-slate-400">Version Compatible</span>
              <span className="text-xs font-bold text-neon-cyan mt-1 block font-mono truncate">
                {mod.gameVersion}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-slate-800">
              <span className="block text-[11px] font-mono uppercase text-slate-400">VRAM Requise</span>
              <span className="text-base font-bold text-purple-400 mt-1 block font-mono">
                +{mod.vramImpactMB} MB
              </span>
            </div>
          </div>

          {/* Description & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Description du Mod</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {mod.description}
                </p>
              </div>

              {/* Features list */}
              {mod.features && mod.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neon-cyan mb-3">
                    Fonctionnalités Principales
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mod.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-dark-950/60 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guide d'Installation Étape par Étape */}
              <div className="p-5 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-neon-cyan" />
                    Guide d'Installation Étape par Étape
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {completedSteps.length} / {mod.installSteps.length} complétés
                  </span>
                </div>

                {/* Path destination box */}
                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Emplacement cible d'installation :</span>
                    <button
                      onClick={handleCopyPath}
                      className="text-neon-cyan hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedPath ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Chemin copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copier le chemin
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 bg-dark-950 p-2 rounded-lg border border-slate-850 select-all break-all">
                    {mod.installPath}
                  </div>
                </div>

                {/* Step list with checkboxes */}
                <div className="space-y-2.5">
                  {mod.installSteps.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                            : 'bg-dark-900/60 border-slate-800 text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                            isDone
                              ? 'bg-emerald-500 text-dark-950'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                        </div>
                        <span className={`flex-1 leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Dependencies, Checksum, Meta & Tags */}
            <div className="lg:col-span-4 space-y-6">
              {/* Dependencies Card */}
              <div className="p-5 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Dépendances & Prérequis
                </h4>

                {mod.dependencies.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Aucune dépendance requise. Le mod est autonome et prêt à l'emploi.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {mod.dependencies.map((dep, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-dark-900 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{dep.name}</div>
                          {dep.minVersion && (
                            <div className="text-[11px] text-slate-400 font-mono">
                              Requis : {dep.minVersion}
                            </div>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            dep.required
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {dep.required ? 'Obligatoire' : 'Optionnel'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security & Checksum */}
              <div className="p-5 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Sécurité & Intégrité
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Scan Antivirus :</span>
                    <span className="text-emerald-400 font-bold">0 Menace (VirusTotal)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Compatibilité VR :</span>
                    <span className="text-slate-200">{mod.isVrReady ? 'Oui (Testé)' : 'Non testé'}</span>
                  </div>
                  {mod.checksumSha256 && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Hash SHA-256 :
                      </span>
                      <p className="font-mono text-[10px] text-slate-400 bg-dark-900 p-2 rounded-lg border border-slate-850 break-all select-all">
                        {mod.checksumSha256}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="p-5 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400">Tags & Mots-clés</h4>
                <div className="flex flex-wrap gap-1.5">
                  {mod.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-dark-900 border border-slate-800 text-slate-300 text-xs font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Reviews & Comments Section */}
          <div className="p-6 rounded-3xl bg-dark-950/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neon-cyan" />
                Avis & Commentaires de la Communauté ({mod.comments.length})
              </h3>
            </div>

            {/* Write a review form */}
            <form
              onSubmit={handleCommentSubmit}
              className="p-4 rounded-2xl bg-dark-900/90 border border-slate-800 space-y-3"
            >
              <h4 className="text-xs font-mono uppercase text-neon-cyan font-bold">
                Partager votre retour d'expérience
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Votre pseudo gaming..."
                  className="bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
                  required
                />

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Votre note :</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-0.5 text-amber-400 focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= userRating ? 'fill-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Donnez votre avis (impact sur vos FPS, configuration matérielle, conseils de réglage...)"
                rows={2}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan resize-none"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="py-2 px-4 rounded-xl bg-neon-cyan hover:bg-cyan-400 text-dark-950 font-bold text-xs uppercase tracking-wide transition-all shadow-md"
                >
                  Publier mon avis
                </button>
              </div>
            </form>

            {/* List of comments with upvotes/downvotes */}
            <div className="space-y-3">
              {mod.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{comment.user}</span>
                          {comment.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-neon-cyan border border-neon-cyan/30">
                              {comment.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{comment.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {comment.rating}/5
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-11">{comment.text}</p>

                  <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-800/40 text-xs text-slate-400">
                    <button
                      onClick={() => onVoteComment(mod.id, comment.id, 'up')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors ${
                        comment.userVote === 'up' ? 'text-neon-cyan font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.upvotes}</span>
                    </button>
                    <button
                      onClick={() => onVoteComment(mod.id, comment.id, 'down')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors ${
                        comment.userVote === 'down' ? 'text-rose-400 font-bold' : ''
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{comment.downvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

