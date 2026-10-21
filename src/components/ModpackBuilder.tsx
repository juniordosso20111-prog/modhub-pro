import React, { useMemo } from 'react';
import type { Mod, UserSetupItem } from '../types';
import {
  Layers,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Share2,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Gauge,
} from 'lucide-react';
import {
  triggerConfetti,
  downloadJsonFile,
  downloadTextFile,
  copyToClipboard,
} from '../utils/helpers';

interface ModpackBuilderProps {
  setupItems: UserSetupItem[];
  onReorder: (newItems: UserSetupItem[]) => void;
  onRemove: (modId: string) => void;
  onToggleEnabled: (modId: string) => void;
  onDownloadAll: () => void;
  onOpenDetails: (mod: Mod) => void;
  onLoadPresetPack: (packName: string) => void;
  onNotify: (title: string, desc?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const ModpackBuilder: React.FC<ModpackBuilderProps> = ({
  setupItems,
  onReorder,
  onRemove,
  onToggleEnabled,
  onDownloadAll,
  onOpenDetails,
  onLoadPresetPack,
  onNotify,
}) => {
  // Move item up
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= setupItems.length) return;

    const newItems = [...setupItems];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    // Re-index loadOrder
    const updated = newItems.map((item, idx) => ({
      ...item,
      loadOrder: idx + 1,
    }));
    onReorder(updated);
  };

  // Conflict Detection
  const conflicts = useMemo(() => {
    const activeMods = setupItems.filter((i) => i.enabled).map((i) => i.mod);
    const issues: { modA: Mod; modB: Mod; reason: string }[] = [];

    for (let i = 0; i < activeMods.length; i++) {
      for (let j = i + 1; j < activeMods.length; j++) {
        const a = activeMods[i];
        const b = activeMods[j];

        // Explicit conflictsWith check
        if (a.conflictsWith?.includes(b.id) || b.conflictsWith?.includes(a.id)) {
          issues.push({
            modA: a,
            modB: b,
            reason: `Conflit direct de shaders : « ${a.title} » et « ${b.title} » modifient les mêmes fichiers d'éclairage. Désactivez l'un des deux.`,
          });
        }

        // Two heavy graphics mods for the same game
        if (
          a.gameId === b.gameId &&
          a.category === 'Graphismes / ReShade' &&
          b.category === 'Graphismes / ReShade' &&
          a.id !== b.id
        ) {
          issues.push({
            modA: a,
            modB: b,
            reason: `Attention : Vous avez deux mods de refonte graphique actifs pour ${a.game}. Vérifiez l'ordre de priorité pour éviter les superpositions de textures.`,
          });
        }
      }
    }
    return issues;
  }, [setupItems]);

  // Aggregate stats
  const packStats = useMemo(() => {
    const active = setupItems.filter((i) => i.enabled).map((i) => i.mod);
    let totalFpsDrop = 0;
    let totalVram = 0;

    active.forEach((m) => {
      totalFpsDrop += m.fpsDropAvg;
      totalVram += m.vramImpactMB;
    });

    return {
      count: active.length,
      totalCount: setupItems.length,
      totalFpsDrop: Math.round(totalFpsDrop),
      totalVramMB: totalVram,
    };
  }, [setupItems]);

  // Export as JSON
  const handleExportJson = () => {
    if (setupItems.length === 0) return;
    const exportData = {
      name: 'Mon Modpack ModHub Pro',
      createdAt: new Date().toISOString(),
      platform: 'ModHub Pro v2.4',
      modsCount: setupItems.length,
      mods: setupItems.map((item) => ({
        loadOrder: item.loadOrder,
        id: item.mod.id,
        title: item.mod.title,
        game: item.mod.game,
        version: item.mod.modVersion,
        category: item.mod.category,
        downloadUrl: item.mod.downloadUrl,
        checksum: item.mod.checksumSha256,
      })),
    };
    downloadJsonFile('modhub-modpack-export.json', exportData);
    triggerConfetti();
    onNotify(
      'Modpack Exporté avec Succès !',
      'Le fichier JSON contenant vos configurations a été téléchargé.',
      'success'
    );
  };

  // Export as TXT Load Order
  const handleExportTxt = () => {
    if (setupItems.length === 0) return;
    let txt = `========================================\n`;
    txt += `MODHUB PRO - ORDRE DE CHARGEMENT DE MODS\n`;
    txt += `Généré le : ${new Date().toLocaleString()}\n`;
    txt += `Nombre de mods : ${setupItems.length}\n`;
    txt += `========================================\n\n`;

    setupItems.forEach((item) => {
      txt += `[Priorité #${item.loadOrder}] ${item.mod.title} (${item.mod.gameShort})\n`;
      txt += `  - Fichier / Version : ${item.mod.modVersion}\n`;
      txt += `  - Dossier : ${item.mod.installPath}\n`;
      txt += `  - Statut : ${item.enabled ? 'ACTIF' : 'DÉSACTIVÉ'}\n\n`;
    });

    downloadTextFile('ordre-de-chargement-mods.txt', txt);
    onNotify(
      'Ordre de Chargement Exporté',
      'Fichier texte généré pour vos gestionnaires de mods.',
      'success'
    );
  };

  // Copy shareable link
  const handleCopyShareLink = async () => {
    const dummyUrl = `https://modhub.pro/pack/share-${Math.random().toString(36).substring(2, 9)}`;
    const success = await copyToClipboard(dummyUrl);
    if (success) {
      onNotify(
        'Lien de Partage Copié !',
        'Le lien vers votre Modpack est dans votre presse-papier.',
        'success'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neon-orange uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Gestionnaire de Setup & Modpack Builder
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Mon Setup / Modpack Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gérez vos mods favoris, ajustez leur ordre de chargement prioritaire, prévenez les conflits et exportez votre modpack complet en un clic.
          </p>
        </div>

        {/* Global Pack Actions */}
        {setupItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyShareLink}
              className="py-2.5 px-3.5 rounded-xl bg-dark-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Partager le Modpack</span>
            </button>

            <button
              onClick={handleExportJson}
              className="py-2.5 px-3.5 rounded-xl bg-dark-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-neon-orange" />
              <span>Exporter (.json)</span>
            </button>

            <button
              onClick={onDownloadAll}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-neon-orange to-amber-500 hover:from-orange-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,102,0,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Tout Télécharger ({packStats.count})</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400">Mods Actifs</span>
          <div className="text-2xl font-black text-white font-gaming mt-1">
            {packStats.count} / {packStats.totalCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400">Impact FPS Estimé</span>
          <div className="text-2xl font-black text-neon-orange font-gaming mt-1 flex items-center gap-1">
            <Gauge className="w-5 h-5" />
            -{packStats.totalFpsDrop} FPS
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400">VRAM Additionnelle</span>
          <div className="text-2xl font-black text-purple-400 font-gaming mt-1">
            +{(packStats.totalVramMB / 1024).toFixed(1)} GB
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400">Détection Conflits</span>
          <div
            className={`text-sm font-bold font-mono mt-1.5 flex items-center gap-1.5 ${
              conflicts.length === 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {conflicts.length === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> 0 Conflit Détecté
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 animate-bounce" /> {conflicts.length} Alerte(s)
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Warnings Section */}
      {conflicts.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 backdrop-blur-xl space-y-3 animate-pulse-slow">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Conflit de Mods Détecté dans votre Load Order</span>
          </div>
          <div className="space-y-2">
            {conflicts.map((conf, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-dark-900/80 border border-rose-900/60 text-xs text-slate-300">
                {conf.reason}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {setupItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-dark-900/50 border border-slate-800 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Votre Setup est actuellement vide</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Ajoutez des mods depuis le Catalogue ou chargez un pack recommandé prêt à l'emploi ci-dessous.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onLoadPresetPack('ets2-ultimate')}
              className="px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 hover:border-neon-cyan text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
            >
              <span>🚛</span> Charger le Pack ETS2 Réalisme & ProMods
            </button>
            <button
              onClick={() => onLoadPresetPack('assetto-pure')}
              className="px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 hover:border-neon-cyan text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
            >
              <span>🏎️</span> Charger le Pack Assetto Corsa Pure Photorealism
            </button>
          </div>
        </div>
      ) : (
        /* Load Order List */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>Ordre de priorité (Haut = Chargé en premier)</span>
            <button
              onClick={handleExportTxt}
              className="text-neon-cyan hover:underline flex items-center gap-1"
            >
              Télécharger liste .txt
            </button>
          </div>

          <div className="space-y-3">
            {setupItems.map((item, index) => (
              <div
                key={item.mod.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.enabled
                    ? 'bg-dark-900/80 border-slate-800/80 hover:border-slate-700'
                    : 'bg-dark-950/40 border-slate-850 opacity-60'
                }`}
              >
                {/* Left: Load Order Index, Thumbnail, Title, Game */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Load order badge */}
                  <div className="w-8 h-8 rounded-xl bg-dark-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-neon-cyan shrink-0">
                    #{index + 1}
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={item.mod.medias[0].url}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
                  />

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-neon-cyan">
                        {item.mod.gameShort}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{item.mod.category}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono text-slate-400">{item.mod.fileSize}</span>
                    </div>

                    <h4
                      onClick={() => onOpenDetails(item.mod)}
                      className="font-bold text-white text-sm truncate hover:text-neon-cyan transition-colors cursor-pointer mt-0.5"
                    >
                      {item.mod.title}
                    </h4>

                    <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                      {item.mod.installPath}
                    </div>
                  </div>
                </div>

                {/* Right: Perf, Priority Reordering Arrows, Enable/Disable, Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-right hidden sm:block mr-2">
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      {item.mod.fpsDropText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      v{item.mod.modVersion}
                    </span>
                  </div>

                  {/* Priority Arrows */}
                  <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      title="Monter en priorité"
                      className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === setupItems.length - 1}
                      title="Descendre en priorité"
                      className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <button
                    onClick={() => onToggleEnabled(item.mod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                      item.enabled
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400'
                        : 'bg-dark-950 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {item.enabled ? 'Actif' : 'Désactivé'}
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(item.mod.id)}
                    title="Retirer du Modpack"
                    className="p-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

