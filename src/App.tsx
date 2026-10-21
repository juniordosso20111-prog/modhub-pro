import React, { useState, useEffect, useMemo } from 'react';
import type { Mod, GameId, AccentColor, UserSetupItem, ModComment } from './types';
import { MOCK_MODS } from './data/mockMods';
import { generate100kMods } from './data/modsGenerator';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogView } from './components/CatalogView';
import { ModDetailModal } from './components/ModDetailModal';
import { PerfComparator } from './components/PerfComparator';
import { ModpackBuilder } from './components/ModpackBuilder';
import { SubmitModModal } from './components/SubmitModModal';
import { DownloadModal } from './components/DownloadModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { triggerConfetti } from './utils/helpers';
import { downloadFullModpackArchive } from './utils/modDownloadGenerator';

export function App() {
  // 100,000 mods generated instantaneously with memoization
  const base100kMods = useMemo(() => generate100kMods(), []);

  const [customMods, setCustomMods] = useState<Mod[]>(() => {
    const saved = localStorage.getItem('modhub_custom_mods');
    return saved ? JSON.parse(saved) : [];
  });

  const mods = useMemo(() => {
    return [...customMods, ...base100kMods];
  }, [customMods, base100kMods]);

  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'perf' | 'setup'>('home');
  const [selectedGame, setSelectedGame] = useState<GameId | 'all'>('all');
  const [accentColor, setAccentColor] = useState<AccentColor>('cyan');

  // User Setup items
  const [userSetup, setUserSetup] = useState<UserSetupItem[]>(() => {
    const saved = localStorage.getItem('modhub_setup');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default initial setup for instant gratification
    return [
      { mod: MOCK_MODS[0], loadOrder: 1, enabled: true },
      { mod: MOCK_MODS[1], loadOrder: 2, enabled: true },
      { mod: MOCK_MODS[5], loadOrder: 3, enabled: true },
    ];
  });

  // Modals & Drawers
  const [selectedModForDetail, setSelectedModForDetail] = useState<Mod | null>(null);
  const [downloadingMod, setDownloadingMod] = useState<Mod | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply accent color to document body or root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  // Persist custom mods and setup to localStorage
  useEffect(() => {
    localStorage.setItem('modhub_custom_mods', JSON.stringify(customMods));
  }, [customMods]);

  useEffect(() => {
    localStorage.setItem('modhub_setup', JSON.stringify(userSetup));
  }, [userSetup]);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'warning' | 'info' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Mod in User Setup
  const handleToggleSetup = (mod: Mod) => {
    const exists = userSetup.some((item) => item.mod.id === mod.id);
    if (exists) {
      setUserSetup(userSetup.filter((item) => item.mod.id !== mod.id));
      addToast(
        'Mod retiré de Mon Setup',
        `« ${mod.title} » a été supprimé de votre liste active.`,
        'info'
      );
    } else {
      const newItem: UserSetupItem = {
        mod,
        loadOrder: userSetup.length + 1,
        enabled: true,
      };
      setUserSetup([...userSetup, newItem]);
      triggerConfetti();
      addToast(
        'Ajouté à Mon Setup !',
        `« ${mod.title} » est prêt pour votre modpack.`,
        'success'
      );
    }
  };

  // Handle direct download initiation
  const handleQuickDownload = (mod: Mod) => {
    setDownloadingMod(mod);
  };

  // When download finishes
  const handleDownloadCompleted = () => {
    if (downloadingMod) {
      addToast(
        'Téléchargement Terminé !',
        `L'archive du mod a été enregistrée sur votre ordinateur. Suivez le guide d'installation.`,
        'success'
      );
    }
  };

  // Download all mods from setup as real ZIP archive
  const handleDownloadAllSetup = async () => {
    const activeMods = userSetup.filter((i) => i.enabled).map((i) => i.mod);
    if (activeMods.length === 0) {
      addToast('Aucun mod actif dans le setup', 'Activez au moins un mod pour télécharger le pack.', 'warning');
      return;
    }
    try {
      addToast('Création du Modpack...', 'Génération de l\'archive ZIP complète avec tous les manifests...', 'info');
      const filename = await downloadFullModpackArchive(activeMods);
      triggerConfetti();
      addToast('Modpack Complet Téléchargé !', `L'archive "${filename}" a été enregistrée dans vos téléchargements.`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Erreur lors du téléchargement', 'Impossible de générer le modpack.', 'warning');
    }
  };

  // Add Comment to Mod
  const handleAddComment = (
    modId: string,
    newCommentData: Omit<ModComment, 'id' | 'date' | 'upvotes' | 'downvotes'>
  ) => {
    const newComment: ModComment = {
      ...newCommentData,
      id: `comm-${Date.now()}`,
      date: 'À l\'instant',
      upvotes: 0,
      downvotes: 0,
      badge: 'Nouveau Testeur',
    };

    if (selectedModForDetail?.id === modId) {
      setSelectedModForDetail((prev) =>
        prev
          ? {
              ...prev,
              comments: [newComment, ...prev.comments],
              reviewCount: prev.reviewCount + 1,
            }
          : null
      );
    }

    addToast('Avis Publié avec Succès', 'Merci pour votre retour constructif !', 'success');
  };

  // Vote on Comment
  const handleVoteComment = (_modId: string, commentId: string, type: 'up' | 'down') => {
    if (selectedModForDetail) {
      setSelectedModForDetail((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) => {
                if (c.id === commentId) {
                  const upDiff = type === 'up' ? (c.userVote === 'up' ? -1 : 1) : c.userVote === 'up' ? -1 : 0;
                  const downDiff = type === 'down' ? (c.userVote === 'down' ? -1 : 1) : c.userVote === 'down' ? -1 : 0;
                  return {
                    ...c,
                    upvotes: Math.max(0, c.upvotes + upDiff),
                    downvotes: Math.max(0, c.downvotes + downDiff),
                    userVote: c.userVote === type ? null : type,
                  };
                }
                return c;
              }),
            }
          : null
      );
    }
  };

  // Submit new mod from Creator form
  const handleSubmitNewMod = (newMod: Mod) => {
    setCustomMods([newMod, ...customMods]);
    addToast(
      'Nouveau Mod Ajouté au Catalogue !',
      `« ${newMod.title} » est désormais accessible à tous.`,
      'success'
    );
    setSelectedModForDetail(newMod);
  };

  // Load Preset Pack into Setup
  const handleLoadPresetPack = (packName: string) => {
    if (packName === 'ets2-ultimate') {
      const ets2Mods = mods.filter((m) => m.gameId === 'ets2');
      setUserSetup(
        ets2Mods.map((m, idx) => ({
          mod: m,
          loadOrder: idx + 1,
          enabled: true,
        }))
      );
      triggerConfetti();
      addToast('Pack ETS2 Réalisme Chargé !', '5 mods ETS2 ajoutés à votre setup.', 'success');
    } else if (packName === 'assetto-pure') {
      const acMods = mods.filter((m) => m.gameId === 'assetto_corsa');
      setUserSetup(
        acMods.map((m, idx) => ({
          mod: m,
          loadOrder: idx + 1,
          enabled: true,
        }))
      );
      triggerConfetti();
      addToast('Pack Assetto Corsa Pure Chargé !', '3 mods Assetto Corsa ajoutés.', 'success');
    }
  };

  const savedModIds = userSetup.map((i) => i.mod.id);
  const weeklyPickMod = mods.find((m) => m.isWeeklyPick) || mods[0];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-neon-cyan selection:text-dark-950">
      {/* Global Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        setupCount={userSetup.length}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Dynamic Main Body Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section with Mod of the Week */}
            <HeroSection
              featuredMod={weeklyPickMod}
              onOpenDetails={(mod) => setSelectedModForDetail(mod)}
              onQuickDownload={handleQuickDownload}
              onSelectCategory={(cat) => {
                setActiveTab('catalog');
              }}
            />

            {/* Direct Catalog Integration on Home for instantaneous discovery */}
            <div className="pt-2">
              <CatalogView
                mods={mods}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                savedModIds={savedModIds}
                onToggleSetup={handleToggleSetup}
                onOpenDetails={(mod) => setSelectedModForDetail(mod)}
                onQuickDownload={handleQuickDownload}
              />
            </div>
          </>
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            mods={mods}
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            savedModIds={savedModIds}
            onToggleSetup={handleToggleSetup}
            onOpenDetails={(mod) => setSelectedModForDetail(mod)}
            onQuickDownload={handleQuickDownload}
          />
        )}

        {activeTab === 'perf' && (
          <PerfComparator
            mods={mods}
            savedModIds={savedModIds}
            onToggleSetup={handleToggleSetup}
            onOpenDetails={(mod) => setSelectedModForDetail(mod)}
          />
        )}

        {activeTab === 'setup' && (
          <ModpackBuilder
            setupItems={userSetup}
            onReorder={setUserSetup}
            onRemove={(id) => {
              setUserSetup(userSetup.filter((i) => i.mod.id !== id));
              addToast('Mod retiré du Modpack', '', 'info');
            }}
            onToggleEnabled={(id) => {
              setUserSetup(
                userSetup.map((i) =>
                  i.mod.id === id ? { ...i, enabled: !i.enabled } : i
                )
              );
            }}
            onDownloadAll={handleDownloadAllSetup}
            onOpenDetails={(mod) => setSelectedModForDetail(mod)}
            onLoadPresetPack={handleLoadPresetPack}
            onNotify={addToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectGame={(g) => {
          setSelectedGame(g);
          setActiveTab('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Mod Detail Modal */}
      <ModDetailModal
        mod={selectedModForDetail}
        isOpen={!!selectedModForDetail}
        onClose={() => setSelectedModForDetail(null)}
        isInSetup={
          selectedModForDetail
            ? savedModIds.includes(selectedModForDetail.id)
            : false
        }
        onToggleSetup={handleToggleSetup}
        onDownload={handleQuickDownload}
        onAddComment={handleAddComment}
        onVoteComment={handleVoteComment}
      />

      {/* Direct Download Simulation Modal */}
      <DownloadModal
        mod={downloadingMod}
        isOpen={!!downloadingMod}
        onClose={() => setDownloadingMod(null)}
        onDownloaded={handleDownloadCompleted}
      />

      {/* Global Quick Search (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        mods={mods}
        onSelectMod={(mod) => setSelectedModForDetail(mod)}
      />

      {/* Submit a Mod Creator Form Modal */}
      <SubmitModModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitNewMod}
      />
    </div>
  );
}

export default App;
