
import React from 'react';
import { Dataset } from '../types';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Database, 
  ArrowRight, 
  Info,
  Clock,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface DatasetOverviewProps {
  dataset: Dataset;
  onNext: () => void;
  onBack: () => void;
}

export default function DatasetOverview({ dataset, onNext, onBack }: DatasetOverviewProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-ons-border shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-ons-border bg-gray-50">
          <div className="flex items-center gap-2 text-ons-link text-[10px] font-bold uppercase tracking-widest mb-4">
            <Database className="w-3 h-3" />
            Dataset Overview
          </div>
          <h2 className="text-3xl font-bold text-ons-blue mb-4">{dataset.title}</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            {dataset.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-3 h-3" />
                Variables available
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Geography', 'Date', 'Age', 'Sex'].map(v => (
                  <span key={v} className="px-3 py-1 bg-blue-50 text-ons-blue text-xs font-semibold rounded-full border border-blue-100">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Release details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Last updated:</span>
                  <span className="font-medium text-gray-900">{dataset.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">API Reference:</span>
                  <span className="font-mono font-bold text-ons-accent uppercase">{dataset.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Coverage
              </h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Geography:</span>
                  <span className="ml-2 font-medium text-gray-900">{dataset.geographyCoverage}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Time range:</span>
                  <span className="ml-2 font-medium text-gray-900">{dataset.timeRange}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="w-3 h-3" />
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {dataset.themes.map(theme => (
                  <span key={theme} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded border border-gray-200">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 bg-gray-50 border-t border-ons-border flex items-center justify-between">
          <button 
            onClick={onBack}
            className="text-gray-500 font-bold text-sm hover:text-ons-blue transition-colors"
          >
            Back to all datasets
          </button>
          <button 
            onClick={onNext}
            className="bg-ons-link text-white px-8 py-3 rounded-md font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
          >
            Customise your query
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
