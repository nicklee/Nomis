
import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { datasets } from '../mockData';
import { Dataset } from '../types';

interface HeaderProps {
  onHome?: () => void;
  onSearch?: (query: string) => void;
  onSelectDataset?: (dataset: Dataset) => void;
}

export default function Header({ onHome, onSearch, onSelectDataset }: HeaderProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const liveResults = useMemo(() => {
    if (!localSearch.trim()) return [];
    return datasets.filter(d => 
      d.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      d.description.toLowerCase().includes(localSearch.toLowerCase())
    ).slice(0, 5);
  }, [localSearch]);

  return (
    <header className="bg-ons-blue text-white h-16 flex items-center justify-between px-6 shrink-0 shadow-md z-50">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onHome?.()}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="bg-white text-ons-blue px-2 py-1 font-bold text-lg leading-none">ONS</div>
          <div className="font-light tracking-widest text-lg">NOMIS</div>
        </button>
        <div className="relative ml-4 hidden sm:block">
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="bg-white/15 border-none py-2 pl-10 pr-4 rounded text-sm w-96 placeholder:text-white/60 focus:outline-none focus:bg-white/25 transition-all"
            placeholder="Search datasets (e.g. Labour market)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearch) {
                onSearch(localSearch);
                setShowResults(false);
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          
          {/* Live Search Results */}
          {showResults && liveResults.length > 0 && (
            <div className="absolute top-full left-0 w-[400px] bg-white mt-2 rounded-lg shadow-2xl border border-ons-border overflow-hidden z-[100]">
              <div className="p-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Suggested Datasets
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {liveResults.map(dataset => (
                  <button
                    key={dataset.id}
                    onClick={() => {
                      if (onSelectDataset) onSelectDataset(dataset);
                      setLocalSearch('');
                      setShowResults(false);
                    }}
                    className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-ons-blue truncate">{dataset.title}</div>
                        <div className="text-[10px] text-gray-500 truncate">{dataset.source}</div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-ons-blue transition-colors ml-2" />
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (onSearch) onSearch(localSearch);
                  setShowResults(false);
                }}
                className="w-full p-2 bg-gray-50 text-ons-link text-[11px] font-bold hover:bg-gray-100 transition-colors"
              >
                View all results for "{localSearch}"
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <nav className="hidden md:flex gap-6 font-medium">
          <button onClick={() => onSearch?.('')} className="hover:text-blue-200 transition-colors">Datasets</button>
          <a href="#" className="hover:text-blue-200 transition-colors">Reports</a>
          <a href="#" className="hover:text-blue-200 transition-colors">API docs</a>
        </nav>
        <div className="h-4 w-px bg-white/20 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">My Account</a>
        </div>
      </div>
    </header>
  );
}
