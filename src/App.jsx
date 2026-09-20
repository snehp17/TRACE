import React, { useState } from 'react';
import { useArchive } from './context/ArchiveContext';

import ArchiveHeader from './components/ArchiveHeader';
import ArchiveOverview from './components/ArchiveOverview';
import ReceiptExplorer from './components/ReceiptExplorer';
import ConnectionMap from './components/ConnectionMap';
import StoryChapters from './components/StoryChapters';
import PatternInsights from './components/PatternInsights';
import ReceiptDetailModal from './components/ReceiptDetailModal';
import AddReceiptFAB from './components/AddReceiptFAB';

// Innovation Components
import AudioAmbiencePlayer from './components/AudioAmbiencePlayer';
import ExportStoryModal from './components/ExportStoryModal';
import EraComparisonModal from './components/EraComparisonModal';
import { Download, GitCompare } from 'lucide-react';

export default function App() {
  const {
    activeSourceId,
    setActiveSourceId,
    activeAdapter,
    allRecords,
    relationshipData,
    storyChapters,
    activeTab,
    setActiveTab,
    selectedReceipt,
    setSelectedReceipt,
    isAddReceiptOpen,
    setIsAddReceiptOpen,
    explorerFilters,
    setExplorerFilters,
    filterByCategory,
    filterByDate,
    filterByDayOfWeek
  } = useArchive();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEraComparisonOpen, setIsEraComparisonOpen] = useState(false);

  return (
    <div className="min-h-screen bg-archive-900 text-archive-100 font-sans selection:bg-amber-accent selection:text-archive-950">

      {/* Sidebar / Mobile Header */}
      <ArchiveHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeAdapter={activeAdapter}
        onOpenAddReceipt={() => setIsAddReceiptOpen(true)}
      />

      {/* Main Content — offset by sidebar width on desktop, top bar on mobile */}
      <div className="lg:pl-56 xl:pl-60 pt-14 lg:pt-0 min-h-screen flex flex-col">
        
        {/* Top Museum Innovation & Ambience Ribbon */}
        <div className="relative z-30 border-b border-archive-700/50 bg-archive-950/90 backdrop-blur-md px-4 sm:px-6 xl:px-8 py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 text-archive-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-paper truncate">{activeAdapter.name}</span>
            <span className="hidden md:inline text-archive-600">·</span>
            <span className="hidden md:inline text-archive-500">{allRecords.length.toLocaleString()} records indexed</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Museum Soundscape Player */}
            <AudioAmbiencePlayer />

            {/* Compare Eras Synthesizer */}
            <button
              type="button"
              onClick={() => setIsEraComparisonOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-archive-900 hover:bg-archive-850 border border-archive-700/60 text-archive-300 hover:text-white transition-all cursor-pointer"
              title="Compare behavioral shifts across time eras"
              aria-label="Open Chrono-Era Synthesizer"
            >
              <GitCompare className="w-3.5 h-3.5 text-sage-accent" />
              <span className="hidden sm:inline">Compare Eras</span>
            </button>

            {/* Export Museum Dossier */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-archive-900 hover:bg-archive-850 border border-archive-700/60 text-archive-300 hover:text-white transition-all cursor-pointer"
              title="Download exhibition dossier as Markdown or JSON"
              aria-label="Export Museum Dossier"
            >
              <Download className="w-3.5 h-3.5 text-amber-accent" />
              <span className="hidden sm:inline">Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Subtle holographic entrance sweep bar */}
        <div key={`sweep-${activeTab}`} className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-accent to-transparent opacity-80 animate-pulse-subtle" />

        <main className="flex-1 px-4 sm:px-6 xl:px-8 pt-6 pb-28 sm:pb-36">
          <div key={activeTab} className="animate-page-enter">
            {activeTab === 'overview' && (
              <ArchiveOverview
                activeAdapter={activeAdapter}
                activeSourceId={activeSourceId}
                onSelectSource={setActiveSourceId}
                onNavigate={setActiveTab}
                relationshipData={relationshipData}
                totalRecordsCount={allRecords.length}
              />
            )}

            {activeTab === 'explorer' && (
              <ReceiptExplorer
                records={allRecords}
                activeAdapter={activeAdapter}
                onSelectReceipt={setSelectedReceipt}
                relationshipData={relationshipData}
                activeFilters={explorerFilters}
                onUpdateFilters={setExplorerFilters}
              />
            )}

            {activeTab === 'connection-map' && (
              <ConnectionMap
                relationshipData={relationshipData}
                activeAdapter={activeAdapter}
                onSelectReceipt={setSelectedReceipt}
              />
            )}

            {activeTab === 'stories' && (
              <StoryChapters
                chapters={storyChapters}
                activeAdapter={activeAdapter}
                onSelectReceipt={setSelectedReceipt}
              />
            )}

            {activeTab === 'insights' && (
              <PatternInsights
                records={allRecords}
                activeAdapter={activeAdapter}
                onFilterByCategory={filterByCategory}
                onFilterByDate={filterByDate}
                onFilterByDayOfWeek={filterByDayOfWeek}
              />
            )}
          </div>
        </main>

        {/* Global Receipt Detail Modal */}
        {selectedReceipt && (
          <ReceiptDetailModal
            receipt={selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
            relationshipData={relationshipData}
            onNavigateToReceipt={(r) => setSelectedReceipt(r)}
          />
        )}

        {/* Floating Add Receipt button */}
        <AddReceiptFAB
          isOpen={isAddReceiptOpen}
          onOpenChange={setIsAddReceiptOpen}
          onReceiptAdded={() => {}}
        />

        {/* Innovation Modals */}
        <ExportStoryModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          activeAdapter={activeAdapter}
          chapters={storyChapters}
          relationshipData={relationshipData}
          totalRecords={allRecords.length}
        />

        <EraComparisonModal
          isOpen={isEraComparisonOpen}
          onClose={() => setIsEraComparisonOpen(false)}
          records={allRecords}
          activeAdapter={activeAdapter}
        />

        {/* Footer */}
        <footer className="border-t border-archive-700/50 bg-archive-950/80 py-6 text-xs font-mono text-archive-500">
          <div className="px-4 sm:px-6 xl:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-amber-accent font-bold font-editorial">TRACE</span>
              <span>— Your Life, Connected.</span>
              <span className="text-archive-600">· Digital Museum Archive</span>
            </div>
            <div className="flex items-center space-x-3 text-archive-600">
              <span>Hackathon Edition</span>
              <span>·</span>
              <span>Zero External APIs</span>
              <span>·</span>
              <span>100% Privacy Compliant</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
