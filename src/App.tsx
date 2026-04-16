/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import DatasetDiscovery from './components/DatasetDiscovery';
import QueryBuilder from './components/QueryBuilder';
import DatasetOverview from './components/DatasetOverview';
import { Dataset, QueryState } from './types';
import { datasets } from './mockData';
import { AnimatePresence, motion } from 'motion/react';

type View = 'homepage' | 'discovery' | 'overview' | 'builder';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('homepage');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [finalQueryState, setFinalQueryState] = useState<QueryState | null>(null);

  const filteredDatasets = useMemo(() => {
    let results = datasets;
    if (searchQuery) {
      results = results.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedTheme) {
      results = results.filter(d => d.themes.some(t => t.toLowerCase() === selectedTheme.toLowerCase()));
    }
    return results;
  }, [searchQuery, selectedTheme]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTheme(null);
    setCurrentView('discovery');
  };

  const handleSelectTheme = (theme: string) => {
    setSelectedTheme(theme);
    setSearchQuery('');
    setCurrentView('discovery');
  };

  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setCurrentView('overview');
  };

  const handleQueryComplete = (state: QueryState) => {
    setFinalQueryState(state);
    // Stay in builder but we could trigger an export here if needed
    console.log('Query completed:', state);
  };

  const handleStartExploring = () => {
    setSearchQuery('');
    setSelectedTheme(null);
    setCurrentView('discovery');
  };

  const renderView = () => {
    switch (currentView) {
      case 'homepage':
        return (
          <Homepage 
            onSearch={handleSearch} 
            onSelectTheme={handleSelectTheme}
            onStartExploring={handleStartExploring}
            onSelectDataset={handleSelectDataset}
          />
        );
      case 'discovery':
        return (
          <DatasetDiscovery 
            datasets={filteredDatasets}
            onSelectDataset={handleSelectDataset}
            onClearGlobalFilters={handleStartExploring}
            searchQuery={searchQuery}
            selectedTheme={selectedTheme}
          />
        );
      case 'overview':
        return selectedDataset ? (
          <DatasetOverview 
            dataset={selectedDataset}
            onNext={() => setCurrentView('builder')}
            onBack={() => setCurrentView('discovery')}
          />
        ) : null;
      case 'builder':
        return selectedDataset ? (
          <QueryBuilder 
            dataset={selectedDataset}
            initialState={finalQueryState?.dataset?.id === selectedDataset.id ? finalQueryState : undefined}
            onCancel={() => setCurrentView('overview')}
            onComplete={handleQueryComplete}
          />
        ) : null;
      default:
        return <Homepage onSearch={handleSearch} onSelectTheme={handleSelectTheme} onStartExploring={() => setCurrentView('discovery')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ons-bg font-sans text-ons-text">
      <Header 
        onHome={() => setCurrentView('homepage')} 
        onSearch={handleSearch} 
        onSelectDataset={handleSelectDataset}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

    </div>
  );
}

