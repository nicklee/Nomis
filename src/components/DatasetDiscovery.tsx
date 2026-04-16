
import React, { useState, useMemo } from 'react';
import { Dataset } from '../types';
import { Calendar, MapPin, ArrowRight, Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DatasetDiscoveryProps {
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  onClearGlobalFilters: () => void;
  searchQuery: string;
  selectedTheme: string | null;
}

export default function DatasetDiscovery({ 
  datasets, 
  onSelectDataset, 
  onClearGlobalFilters,
  searchQuery, 
  selectedTheme 
}: DatasetDiscoveryProps) {
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [activeGeos, setActiveGeos] = useState<string[]>([]);
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [activeYears, setActiveYears] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState('');

  // Extract unique sources, geographies, topics and years from the datasets provided
  const availableSources = useMemo(() => Array.from(new Set(datasets.map(d => d.source))), [datasets]);
  const availableGeos = useMemo(() => Array.from(new Set(datasets.map(d => d.geographyCoverage))), [datasets]);
  const availableTopics = useMemo(() => {
    const themes = datasets.flatMap(d => d.themes);
    return Array.from(new Set(themes)).sort();
  }, [datasets]);
  const availableYears = useMemo(() => {
    const years = datasets.map(d => d.lastUpdated.split(' ').pop() || '');
    return Array.from(new Set(years)).filter(Boolean).sort((a, b) => b.localeCompare(a));
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    return datasets.filter(dataset => {
      const sourceMatch = activeSources.length === 0 || activeSources.includes(dataset.source);
      const geoMatch = activeGeos.length === 0 || activeGeos.includes(dataset.geographyCoverage);
      const topicMatch = activeTopics.length === 0 || dataset.themes.some(t => activeTopics.includes(t));
      const yearMatch = activeYears.length === 0 || activeYears.includes(dataset.lastUpdated.split(' ').pop() || '');
      const textMatch = !localSearch || 
        dataset.title.toLowerCase().includes(localSearch.toLowerCase()) || 
        dataset.description.toLowerCase().includes(localSearch.toLowerCase());
      return sourceMatch && geoMatch && topicMatch && yearMatch && textMatch;
    });
  }, [datasets, activeSources, activeGeos, activeTopics, activeYears, localSearch]);

  const toggleSource = (source: string) => {
    setActiveSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const toggleGeo = (geo: string) => {
    setActiveGeos(prev => 
      prev.includes(geo) ? prev.filter(g => g !== geo) : [...prev, geo]
    );
  };

  const toggleTopic = (topic: string) => {
    setActiveTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleYear = (year: string) => {
    setActiveYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const clearFilters = () => {
    setActiveSources([]);
    setActiveGeos([]);
    setActiveTopics([]);
    setActiveYears([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg border border-ons-border shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <h3 className="font-bold text-ons-text">Filter results</h3>
              </div>
              {(activeSources.length > 0 || activeGeos.length > 0 || activeTopics.length > 0 || activeYears.length > 0 || searchQuery || selectedTheme || localSearch) && (
                <button 
                  onClick={() => {
                    clearFilters();
                    onClearGlobalFilters();
                    setLocalSearch('');
                  }}
                  className="text-[10px] font-bold text-ons-link hover:underline uppercase tracking-wider"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Search within results</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Filter by title or description..." 
                    className="w-full pl-9 pr-4 py-2 text-sm border border-ons-border rounded-md focus:border-ons-link focus:outline-none"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Topic</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                  {availableTopics.map(topic => (
                    <label key={topic} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-ons-link group">
                      <input 
                        type="checkbox" 
                        className="rounded text-ons-link focus:ring-ons-link" 
                        checked={activeTopics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                      />
                      <span className={activeTopics.includes(topic) ? 'font-semibold text-ons-link' : ''}>
                        {topic}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Source</label>
                <div className="space-y-2">
                  {availableSources.map(source => (
                    <label key={source} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-ons-link group">
                      <input 
                        type="checkbox" 
                        className="rounded text-ons-link focus:ring-ons-link" 
                        checked={activeSources.includes(source)}
                        onChange={() => toggleSource(source)}
                      />
                      <span className={activeSources.includes(source) ? 'font-semibold text-ons-link' : ''}>
                        {source}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Geography</label>
                <div className="space-y-2">
                  {availableGeos.map(geo => (
                    <label key={geo} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-ons-link group">
                      <input 
                        type="checkbox" 
                        className="rounded text-ons-link focus:ring-ons-link" 
                        checked={activeGeos.includes(geo)}
                        onChange={() => toggleGeo(geo)}
                      />
                      <span className={activeGeos.includes(geo) ? 'font-semibold text-ons-link' : ''}>
                        {geo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Year Updated</label>
                <div className="space-y-2">
                  {availableYears.map(year => (
                    <label key={year} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-ons-link group">
                      <input 
                        type="checkbox" 
                        className="rounded text-ons-link focus:ring-ons-link" 
                        checked={activeYears.includes(year)}
                        onChange={() => toggleYear(year)}
                      />
                      <span className={activeYears.includes(year) ? 'font-semibold text-ons-link' : ''}>
                        {year}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ons-blue mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : selectedTheme ? `${selectedTheme} datasets` : 'All datasets'}
            </h2>
            <div className="flex items-center gap-2 text-gray-500">
              <span>{filteredDatasets.length} datasets found</span>
              {datasets.length !== filteredDatasets.length && (
                <span className="text-xs italic">(Filtered from {datasets.length})</span>
              )}
            </div>
            
            {/* Active Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {activeTopics.map(t => (
                <button 
                  key={t} 
                  onClick={() => toggleTopic(t)}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  {t} <X className="w-3 h-3" />
                </button>
              ))}
              {activeSources.map(s => (
                <button 
                  key={s} 
                  onClick={() => toggleSource(s)}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-ons-link text-[10px] font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {s} <X className="w-3 h-3" />
                </button>
              ))}
              {activeGeos.map(g => (
                <button 
                  key={g} 
                  onClick={() => toggleGeo(g)}
                  className="flex items-center gap-1 px-2 py-1 bg-green-50 text-ons-accent text-[10px] font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors"
                >
                  {g} <X className="w-3 h-3" />
                </button>
              ))}
              {activeYears.map(y => (
                <button 
                  key={y} 
                  onClick={() => toggleYear(y)}
                  className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold rounded-full border border-orange-100 hover:bg-orange-100 transition-colors"
                >
                  {y} <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredDatasets.map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-6 rounded-lg border border-ons-border hover:border-ons-blue hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => onSelectDataset(dataset)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ons-link bg-blue-50 px-2 py-0.5 rounded">
                          {dataset.source}
                        </span>
                        {dataset.themes.map(theme => (
                          <span key={theme} className="text-xs font-medium text-gray-500">
                            • {theme}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-ons-text group-hover:text-ons-link transition-colors mb-2">
                        {dataset.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {dataset.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {dataset.geographyCoverage}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {dataset.timeRange}
                        </div>
                        <div className="text-xs text-gray-400 italic">
                          Last updated: {dataset.lastUpdated}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 self-center">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-ons-link group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredDatasets.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-ons-border">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-ons-text">No datasets found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
                <button 
                  onClick={() => {
                    clearFilters();
                    onClearGlobalFilters();
                  }}
                  className="mt-4 text-ons-link font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
