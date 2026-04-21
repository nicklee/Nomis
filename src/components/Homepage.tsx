
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  Briefcase, 
  Leaf, 
  TrendingUp, 
  ArrowRight, 
  Home, 
  Landmark,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { datasets } from '../mockData';
import { Dataset } from '../types';

interface HomepageProps {
  onSearch: (query: string) => void;
  onSelectTheme: (theme: string) => void;
  onStartExploring: () => void;
  onSelectDataset?: (dataset: Dataset) => void;
}

const topics = [
  { id: 'Census', name: 'Census', icon: Landmark },
  { id: 'Economy', name: 'Economy', icon: TrendingUp },
  { id: 'Employment', name: 'Employment', icon: Briefcase },
  { id: 'Environment', name: 'Environment', icon: Leaf },
  { id: 'Housing', name: 'Housing', icon: Home },
  { id: 'Population', name: 'Population', icon: Users },
];

export default function Homepage({ onSearch, onSelectTheme, onStartExploring, onSelectDataset }: HomepageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTopic, setActiveTopic] = useState(topics[0].id);

  const liveResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return datasets.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const topicDatasets = useMemo(() => {
    if (activeTopic === 'Census') return [];
    return datasets
      .filter(d => d.themes.some(t => t.toLowerCase() === activeTopic.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }, [activeTopic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowResults(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-ons-blue mb-4 tracking-tight"
          >
            Find and download official UK statistics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Explore data on population, employment, earnings, businesses, local areas and the Census. 
            Access detailed, up-to-date statistics from the Office for National Statistics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative text-left"
          >
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search by keyword, topic or dataset name"
                className="w-full pl-12 pr-32 py-4 rounded-lg border-2 border-ons-border focus:border-ons-blue focus:outline-none text-lg shadow-sm transition-all bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-ons-link text-white px-6 rounded-md font-medium hover:opacity-90 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Live Results Dropdown */}
            <AnimatePresence>
              {showResults && liveResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-2xl border border-ons-border overflow-hidden z-[100] text-left"
                >
                  <div className="p-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Suggested Datasets
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {liveResults.map(dataset => (
                      <button
                        key={dataset.id}
                        onClick={() => {
                          if (onSelectDataset) onSelectDataset(dataset);
                          setShowResults(false);
                        }}
                        className="w-full p-4 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 group flex justify-between items-center"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-ons-blue truncate mb-0.5">{dataset.title}</div>
                          <div className="text-xs text-gray-500 truncate">{dataset.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-ons-blue transition-colors ml-4" />
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      onSearch(searchQuery);
                      setShowResults(false);
                    }}
                    className="w-full p-3 bg-gray-50 text-ons-link text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    View all results for "{searchQuery}" <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Topics Section - The Directory */}
      <section className="bg-gray-50 border-y border-ons-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-ons-blue tracking-tight">Explore by topic</h3>
            </div>
            <button 
              onClick={onStartExploring}
              className="text-ons-link font-bold flex items-center gap-1 hover:underline text-sm"
            >
              View all datasets <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Vertical Tabs Layout */}
          <div className="flex flex-col md:flex-row gap-10 min-h-[350px]">
            {/* Topic List (Left) */}
            <div className="w-full md:w-72 flex-shrink-0 relative">
              <div className="flex flex-col border-r border-gray-200 pr-10">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic.id)}
                    className={`group flex items-center justify-between py-3 text-[15px] transition-all relative ${
                      activeTopic === topic.id 
                        ? 'text-ons-blue font-bold' 
                        : 'text-gray-500 hover:text-ons-blue'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <topic.icon className={`w-5 h-5 ${activeTopic === topic.id ? 'text-ons-blue' : 'text-gray-300 group-hover:text-ons-blue'}`} />
                      {topic.name}
                    </span>
                    {activeTopic === topic.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute -right-[41px] top-1/2 -translate-y-1/2 w-1.5 h-10 bg-ons-blue z-10 rounded-l-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Content (Right) */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopic}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {activeTopic === 'Census' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 max-w-lg">
                        Browse datasets by census collection. You will see all matching datasets in the catalogue.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {[
                          { label: 'Census 2021', query: 'Census 2021' },
                          { label: 'Census 2011', query: 'Census 2011' },
                        ].map(({ label, query }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => onSearch(query)}
                            className="flex-1 text-left p-5 rounded-xl border border-ons-border bg-white hover:border-ons-blue hover:shadow-md transition-all group"
                          >
                            <h4 className="text-ons-link font-semibold group-hover:underline text-[16px]">
                              {label}
                            </h4>
                            <p className="text-xs text-gray-500 mt-2">
                              Open the dataset list filtered to {label} releases.
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {Object.entries(
                        topicDatasets.reduce((acc, d) => {
                          const firstLetter = d.title[0].toUpperCase();
                          if (!acc[firstLetter]) acc[firstLetter] = [];
                          acc[firstLetter].push(d);
                          return acc;
                        }, {} as Record<string, Dataset[]>)
                      )
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([letter, items]) => (
                          <div key={letter} className="flex gap-10">
                            <div className="w-8 shrink-0 text-2xl font-black text-ons-blue/10 pt-0.5">
                              {letter}
                            </div>
                            <div className="flex-1 space-y-6">
                              {(items as Dataset[]).map(dataset => (
                                <button
                                  key={dataset.id}
                                  onClick={() => onSelectDataset?.(dataset)}
                                  className="group block text-left w-full"
                                >
                                  <h4 className="text-ons-link font-semibold group-hover:underline leading-tight text-[16px]">
                                    {dataset.title}
                                  </h4>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                      {topicDatasets.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                          <Landmark className="w-12 h-12 mb-4 opacity-10" />
                          <p className="font-medium text-sm">No datasets available for this topic yet.</p>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-ons-blue">New to NOMIS?</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              NOMIS is a service provided by the ONS to give you free access to the most detailed and
              up-to-date UK labour market statistics.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-ons-blue">Powerful Analysis</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Build custom queries, filter by geography, age, and sex, and download analysis-ready data in multiple formats.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-ons-blue">API Access</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Developers can access our data programmatically through our robust API for integration into their own applications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
