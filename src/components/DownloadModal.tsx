import React, { useState, useEffect } from 'react';
import type { Mod } from '../types';
import { Download, CheckCircle, ShieldCheck, HardDrive, Copy, Check, X, Sparkles, FileArchive } from 'lucide-react';
import { copyToClipboard, triggerConfetti } from '../utils/helpers';
import { generateRealModArchive, triggerBrowserDownload } from '../utils/modDownloadGenerator';

interface DownloadModalProps {
  mod: Mod | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloaded?: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  mod,
  isOpen,
  onClose,
  onDownloaded,
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState('48.2 MB/s');
  const [copiedPath, setCopiedPath] = useState(false);
  const [savedFilename, setSavedFilename] = useState<string>('');
  const [isGeneratingFile, setIsGeneratingFile] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !mod) {
      setProgress(0);
      setIsCompleted(false);
      setSavedFilename('');
      return;
    }

    setProgress(8);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 22) + 16;
        const next = Math.min(prev + step, 100);
        const currentSpeed = (42 + Math.random() * 28).toFixed(1);
        setDownloadSpeed(`${currentSpeed} MB/s`);

        if (next === 100) {
          clearInterval(interval);
          handleFinishDownload();
        }
        return next;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [isOpen, mod]);

  const handleFinishDownload = async () => {
    if (!mod) return;
    setIsGeneratingFile(true);
    try {
      // Generate real archive in browser
      const { blob, filename } = await generateRealModArchive(mod);
      setSavedFilename(filename);
      // Trigger actual real file download in the browser
      triggerBrowserDownload(blob, filename);
      setIsCompleted(true);
      triggerConfetti();
      if (onDownloaded) onDownloaded();
    } catch (err) {
      console.error('Download generation error:', err);
      setIsCompleted(true);
      if (onDownloaded) onDownloaded();
    } finally {
      setIsGeneratingFile(false);
    }
  };

  const handleManualDownloadAgain = async () => {
    if (!mod) return;
    const { blob, filename } = await generateRealModArchive(mod);
    triggerBrowserDownload(blob, filename);
  };

  if (!isOpen || !mod) return null;

  const handleCopyPath = async () => {
    const success = await copyToClipboard(mod.installPath);
    if (success) {
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-dark-900 border border-neon-cyan/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Glow corner background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-neon-cyan/50 flex items-center justify-center text-neon-cyan shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <Download className="w-6 h-6 animate-bounce" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-mono font-bold uppercase text-neon-cyan tracking-wider flex items-center gap-1">
              <FileArchive className="w-3.5 h-3.5" />
              {isCompleted ? 'Fichier Réel Téléchargé !' : 'Téléchargement Direct en Cours'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug truncate">
              {mod.title}
            </h3>
            <p className="text-xs text-slate-400">
              v{mod.modVersion} • {mod.fileSize} • {mod.gameShort}
            </p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="mb-5 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>
              {isCompleted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Archive générée & enregistrée
                </span>
              ) : isGeneratingFile ? (
                <span className="text-neon-cyan font-semibold animate-pulse">
                  Génération de l'archive ZIP officielle...
                </span>
              ) : (
                `Transfert haut débit (${downloadSpeed})`
              )}
            </span>
            <span className="font-bold text-neon-cyan">{progress}%</span>
          </div>

          {/* Progress bar container */}
          <div className="relative w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-sky-400 to-neon-orange transition-all duration-300 relative shadow-[0_0_15px_#00f0ff]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Real File Name confirmation if completed */}
        {savedFilename && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-neon-cyan/30 mb-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 truncate">
              <FileArchive className="w-4 h-4 text-neon-cyan shrink-0" />
              <span className="font-mono text-neon-cyan truncate">{savedFilename}</span>
            </div>
            <button
              onClick={handleManualDownloadAgain}
              className="text-[11px] font-mono text-slate-300 hover:text-white underline shrink-0 ml-2"
            >
              Re-télécharger
            </button>
          </div>
        )}

        {/* Install target destination */}
        <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800 mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-neon-cyan" /> Emplacement d'installation
            </span>
            <button
              onClick={handleCopyPath}
              className="flex items-center gap-1 text-[11px] font-mono text-neon-cyan hover:underline transition-colors"
            >
              {copiedPath ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copier le chemin
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-xs text-slate-300 bg-dark-900 p-2.5 rounded-xl border border-slate-800 break-all select-all">
            {mod.installPath}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isCompleted ? (
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Fermer et Ouvrir l'Archive
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
