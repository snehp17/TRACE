import React, { createContext, useContext, useState, useMemo } from 'react';
import { dataRegistry } from '../data/dataRegistry';
import { analyzeConnections } from '../engine/relationshipEngine';
import { buildStoryChapters } from '../engine/chapterBuilder';

const ArchiveContext = createContext(null);

export function ArchiveProvider({ children }) {
  const [activeSourceId, setActiveSourceId] = useState('household');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isAddReceiptOpen, setIsAddReceiptOpen] = useState(false);

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

  // Filters state for Explorer
  const [explorerFilters, setExplorerFilters] = useState({
    search: '',
    category: 'all',
    mode: 'all',
    year: 'all',
    date: '',
    dayOfWeek: 'all'
  });

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

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const filterByCategory = (categoryName) => {
    setExplorerFilters(prev => ({ ...prev, category: categoryName, date: '', dayOfWeek: 'all' }));
    handleSelectTab('explorer');
  };

  const filterByDate = (dateStr) => {
    setExplorerFilters(prev => ({ ...prev, date: dateStr, category: 'all', dayOfWeek: 'all' }));
    handleSelectTab('explorer');
  };

  const filterByDayOfWeek = (dayName) => {
    setExplorerFilters(prev => ({ ...prev, dayOfWeek: dayName, date: '', category: 'all' }));
    handleSelectTab('explorer');
  };

  const value = {
    activeSourceId,
    setActiveSourceId: handleSelectSource,
    activeAdapter,
    allRecords,
    relationshipData,
    storyChapters,
    activeTab,
    setActiveTab: handleSelectTab,
    selectedReceipt,
    setSelectedReceipt,
    isAddReceiptOpen,
    setIsAddReceiptOpen,
    explorerFilters,
    setExplorerFilters,
    filterByCategory,
    filterByDate,
    filterByDayOfWeek
  };

  return (
    <ArchiveContext.Provider value={value}>
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
}
