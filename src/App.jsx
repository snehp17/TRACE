import React, { useState, useMemo } from 'react';
import { dataRegistry } from './data/dataRegistry';
import { analyzeConnections } from './engine/relationshipEngine';
import { buildStoryChapters } from './engine/chapterBuilder';

import ArchiveHeader from './components/ArchiveHeader';
import ArchiveOverview from './components/ArchiveOverview';
import ReceiptExplorer from './components/ReceiptExplorer';
import ConnectionMap from './components/ConnectionMap';
import StoryChapters from './components/StoryChapters';
import PatternInsights from './components/PatternInsights';
import ReceiptDetailModal from './components/ReceiptDetailModal';
import AddReceiptFAB from './components/AddReceiptFAB';

export default function App() {
  const [activeSourceId, setActiveSourceId] = useState('household');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Active Adapter & Records
  const activeAdapter = useMemo(() => {
    return dataRegistry.getAdapter(activeSourceId);
  }, [activeSourceId]);

  const allRecords = useMemo(() => {
    return activeAdapter.getAllRecords();
  }, [activeAdapter]);

  // Detected relationships
  const relationshipData = useMemo(() => {
    if (activeAdapter.detectRelationships) {
      return activeAdapter.detectRelationships(allRecords.slice(0, 300));
    }
    return analyzeConnections(allRecords.slice(0, 300));
  }, [activeAdapter, allRecords]);

  // Story Chapters
  const storyChapters = useMemo(() => {
    return buildStoryChapters(activeAdapter, allRecords);
  }, [activeAdapter, allRecords]);

  // Filters state for Explorer (supports deep-linking from Pattern Insights)
  const [explorerFilters, setExplorerFilters] = useState({
    search: '',
    category: 'all',
    mode: 'all',
    year: 'all',
    date: '',
    dayOfWeek: 'all'
  });

  // Switch Dataset
  const handleSelectSource = (sourceId) => {
    setActiveSourceId(sourceId);
    setExplorerFilters({
      search: '',
      category: 'all',
      mode: 'all',
      year: 'all',
      date: '',
      dayOfWeek: 'all'
    });
  };

  const [isAddReceiptOpen, setIsAddReceiptOpen] = useState(false);

  // Smooth scroll to top on tab switch
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Filter by category navigation from Insights
  const handleFilterByCategory = (categoryName) => {
    setExplorerFilters(prev => ({ ...prev, category: categoryName, date: '', dayOfWeek: 'all' }));
    handleSelectTab('explorer');
  };

  // Filter by specific day from Insights
  const handleFilterByDate = (dateStr) => {
    setExplorerFilters(prev => ({ ...prev, date: dateStr, category: 'all', dayOfWeek: 'all' }));
    handleSelectTab('explorer');
  };

  // Filter by day of week from Insights
  const handleFilterByDayOfWeek = (dayName) => {
    setExplorerFilters(prev => ({ ...prev, dayOfWeek: dayName, date: '', category: 'all' }));
    handleSelectTab('explorer');
  };

  return (
    <div className="min-h-screen bg-archive-900 text-archive-100 font-sans selection:bg-amber-accent selection:text-archive-950">

      {/* Sidebar / Mobile Header */}
      <ArchiveHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        activeAdapter={activeAdapter}
        onOpenAddReceipt={() => setIsAddReceiptOpen(true)}
      />

      {/* Main Content — offset by sidebar width on desktop, top bar on mobile */}
      <div className="lg:pl-56 xl:pl-60 pt-14 lg:pt-0 min-h-screen flex flex-col">
        {/* Subtle holographic entrance sweep bar */}
        <div key={`sweep-${activeTab}`} className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-accent to-transparent opacity-80 animate-pulse-subtle" />

        <main className="flex-1 px-4 sm:px-6 xl:px-8 pt-6 pb-28 sm:pb-36">
          <div key={activeTab} className="animate-page-enter">
            {activeTab === 'overview' && (
              <ArchiveOverview
                activeAdapter={activeAdapter}
                activeSourceId={activeSourceId}
                onSelectSource={handleSelectSource}
                onNavigate={handleSelectTab}
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
                onFilterByCategory={handleFilterByCategory}
                onFilterByDate={handleFilterByDate}
                onFilterByDayOfWeek={handleFilterByDayOfWeek}
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

        {/* Floating Add Receipt button — collapsible, auto-shrinks on scroll so it never blocks reading */}
        <AddReceiptFAB
          isOpen={isAddReceiptOpen}
          onOpenChange={setIsAddReceiptOpen}
          onReceiptAdded={() => {}}
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
