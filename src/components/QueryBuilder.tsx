
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dataset, QueryState, StepId, GeographyType, GeographySelectionMethod, GeographyTypeCategory } from '../types';
import { 
  Check, 
  Info, 
  Table as TableIcon, 
  FileJson, 
  Eye,
  MapPin,
  Calendar,
  Users,
  User,
  Settings2,
  Search,
  Layers,
  MousePointer2,
  SlidersHorizontal,
  History,
  Clock,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geographyOptions, years, ageDimensions, sexOptions } from '../mockData';
import LivePreview from './LivePreview';

type AgeMode = 'labour' | 'bands' | 'single';
type DateMode = 'latest' | 'quick_ranges' | 'custom_range' | 'specific';

interface QueryBuilderProps {
  dataset: Dataset;
  initialState?: QueryState;
  onCancel: () => void;
  onComplete: (state: QueryState) => void;
}

const steps: { id: StepId; label: string; icon: any }[] = [
  { id: 'geography', label: 'Geography', icon: MapPin },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'age', label: 'Age', icon: Users },
  { id: 'sex', label: 'Sex', icon: User },
  { id: 'review', label: 'Review & Export', icon: Eye },
];

const STEP_IDS = steps.map(s => s.id) as readonly StepId[];

function parseStepParam(raw: string | undefined): StepId {
  if (raw && STEP_IDS.includes(raw as StepId)) return raw as StepId;
  return 'geography';
}

function Tooltip({ children, content, align = 'center' }: { children: React.ReactNode; content: string; align?: 'center' | 'left' | 'right' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const alignClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0"
  };

  const arrowClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-4",
    right: "right-4"
  };
  
  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={() => setIsVisible(true)} 
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className={`absolute z-[100] bottom-full ${alignClasses[align]} mb-2 w-48 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-[11px] leading-relaxed rounded-lg shadow-2xl pointer-events-none ring-1 ring-white/10`}
          >
            {content}
            <div className={`absolute top-full ${arrowClasses[align]} border-8 border-transparent border-t-gray-900/95`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QueryBuilder({ dataset, initialState, onCancel, onComplete }: QueryBuilderProps) {
  const navigate = useNavigate();
  const { step: stepParam } = useParams<{ step: string }>();

  const currentStep = useMemo(() => parseStepParam(stepParam), [stepParam]);

  const stepPath = (stepId: StepId) => `/datasets/${dataset.id}/build/${stepId}`;

  useEffect(() => {
    if (stepParam && !STEP_IDS.includes(stepParam as StepId)) {
      navigate(stepPath('geography'), { replace: true });
    }
  }, [stepParam, navigate, dataset.id]);
  const [geoSearch, setGeoSearch] = useState('');
  const [ageMode, setAgeMode] = useState<AgeMode>('labour');
  const [dateMode, setDateMode] = useState<DateMode>('latest');
  const [customDateRange, setCustomDateRange] = useState({ from: '2015', to: '2024' });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['Excel (.xlsx)']);
  const [queryState, setQueryState] = useState<QueryState>(initialState || {
    dataset,
    geoSelectionMethod: 'browse',
    geoCategory: 'current',
    geographyType: 'Countries',
    boundaryVersion: 2023,
    selectedGeographies: ['E92000001', 'W92000004', 'S92000003', 'N92000002'],
    selectedDates: ['2024'],
    selectedAges: ['All Ages'],
    selectedSex: 'All',
    format: 'crosstab',
  });

  const filteredGeographies = geographyOptions.filter(o => {
    if (queryState.geoSelectionMethod === 'search') {
      return o.name.toLowerCase().includes(geoSearch.toLowerCase());
    }
    return (
      o.type === queryState.geographyType && 
      o.category === queryState.geoCategory &&
      o.boundaryVersion === queryState.boundaryVersion &&
      o.name.toLowerCase().includes(geoSearch.toLowerCase())
    );
  });

  const stepIndex = steps.findIndex(s => s.id === currentStep);
  const isLastStep = stepIndex === steps.length - 1;

  const handleExportToggle = (format: string) => {
    setSelectedFormats(prev => {
      if (prev.includes(format)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(f => f !== format);
      }
      return [...prev, format];
    });
    setIsDownloaded(false);
  };

  const handleNext = () => {
    if (isLastStep) {
      if (isDownloaded) {
        onComplete(queryState);
        return;
      }
      
      setIsDownloading(true);
      setTimeout(() => {
        setIsDownloading(false);
        setIsDownloaded(true);
      }, 2000);
    } else {
      const nextIdx = stepIndex + 1;
      navigate(stepPath(steps[nextIdx].id));
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      onCancel();
    } else {
      navigate(stepPath(steps[stepIndex - 1].id));
    }
  };

  const goToStep = (stepId: StepId) => {
    navigate(stepPath(stepId));
  };

  const updateState = (updates: Partial<QueryState>) => {
    setQueryState(prev => ({ ...prev, ...updates }));
    setIsDownloaded(false);
  };

  const handleAgeModeChange = (mode: AgeMode) => {
    setAgeMode(mode);
    // Reset selections when switching modes, but keep "All Ages" if in labour mode
    if (mode === 'labour') {
      updateState({ selectedAges: ['All Ages'] });
    } else {
      // For bands or single, we need at least one selected. 
      // Default to the first option in that mode.
      updateState({ selectedAges: [ageDimensions[mode][0]] });
    }
  };

  const handleAgeChange = (age: string, checked: boolean) => {
    let newSelected = [...queryState.selectedAges];
    
    if (age === 'All Ages') {
      // If "All Ages" is selected, it should be the only thing selected
      newSelected = checked ? ['All Ages'] : [ageDimensions.labour[1]]; // Default to next if unchecked
    } else {
      // If a specific age is selected
      if (checked) {
        // Remove "All Ages" and add the specific age
        newSelected = newSelected.filter(a => a !== 'All Ages');
        newSelected.push(age);
      } else {
        // Just remove the specific age
        newSelected = newSelected.filter(a => a !== age);
        
        // At least one value must always be selected
        if (newSelected.length === 0) {
          if (ageMode === 'labour') {
            newSelected = ['All Ages'];
          } else {
            newSelected = [age]; // Keep it selected if it's the last one
          }
        }
      }
    }
    updateState({ selectedAges: newSelected });
  };

  const handleDateModeChange = (mode: DateMode) => {
    setDateMode(mode);
    let newDates: string[] = [];
    
    switch (mode) {
      case 'latest':
        newDates = ['2024'];
        break;
      case 'quick_ranges':
        // Default to last 5 years
        newDates = years.filter(y => parseInt(y) >= 2020 && parseInt(y) <= 2024);
        break;
      case 'custom_range':
        newDates = years.filter(y => parseInt(y) >= parseInt(customDateRange.from) && parseInt(y) <= parseInt(customDateRange.to));
        break;
      case 'specific':
        newDates = ['2024'];
        break;
    }
    updateState({ selectedDates: newDates });
  };

  const handleQuickRange = (range: [number, number]) => {
    const newDates = years.filter(y => parseInt(y) >= range[0] && parseInt(y) <= range[1]);
    updateState({ selectedDates: newDates });
  };

  const handleCustomRangeUpdate = (type: 'from' | 'to', value: string) => {
    const newRange = { ...customDateRange, [type]: value };
    setCustomDateRange(newRange);
    
    // Validate from <= to
    const from = parseInt(newRange.from);
    const to = parseInt(newRange.to);
    
    if (from <= to) {
      const newDates = years.filter(y => parseInt(y) >= from && parseInt(y) <= to);
      updateState({ selectedDates: newDates });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'geography':
        return (
          <div className="space-y-6">
            {/* Selection Method Tabs */}
            <div className="flex border-b border-ons-border mb-6">
              {[
                { id: 'search', label: 'Search', icon: Search },
                { id: 'browse', label: 'Browse', icon: Layers },
                { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => updateState({ geoSelectionMethod: method.id as GeographySelectionMethod })}
                  className={`flex items-center gap-2 px-6 py-3 text-sm transition-all border-b-2 -mb-px ${
                    queryState.geoSelectionMethod === method.id 
                      ? 'border-ons-blue font-bold text-ons-blue bg-blue-50/50' 
                      : 'border-transparent text-gray-500 hover:text-ons-blue hover:bg-gray-50'
                  }`}
                >
                  <method.icon className="w-4 h-4" />
                  {method.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {/* Main Content */}
              <div className="space-y-6">
                {queryState.geoSelectionMethod === 'browse' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Category Selection */}
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
                      <button
                        onClick={() => updateState({ geoCategory: 'current', boundaryVersion: 2023 })}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                          queryState.geoCategory === 'current' ? 'bg-white text-ons-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Current
                      </button>
                      <button
                        onClick={() => updateState({ geoCategory: 'historical' })}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                          queryState.geoCategory === 'historical' ? 'bg-white text-ons-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <History className="w-4 h-4" />
                        Historical
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Geography Type List Sidebar */}
                      <div className="md:col-span-4 space-y-6">
                        <div className="space-y-2">
                          <div className="border border-ons-border rounded-md overflow-hidden bg-white shadow-sm">
                            {(queryState.geoCategory === 'current' 
                              ? [
                                  "Countries",
                                  "Regions",
                                  "Combined authorities",
                                  "Metropolitan counties",
                                  "Local authorities (county or unitary)",
                                  "Local authority districts (unitary or district)"
                                ]
                              : [
                                  "Metropolitan counties",
                                  "Local authorities (county or unitary)",
                                  "Local authority districts (unitary or district)"
                                ]
                            ).map(type => (
                              <button
                                key={type}
                                onClick={() => updateState({ geographyType: type as GeographyType })}
                                className={`w-full text-left px-4 py-3 text-[13px] transition-colors border-b border-gray-50 last:border-0 ${
                                  queryState.geographyType === type ? 'bg-blue-50 text-ons-blue font-semibold' : 'hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Boundary Version (if historical) */}
                        {queryState.geoCategory === 'historical' && (
                          <div className="space-y-2 animate-in zoom-in-95 duration-200">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Boundary Version</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[2023, 2021, 2019, 2014, 2011, 2009].map(year => (
                                <button
                                  key={year}
                                  onClick={() => updateState({ boundaryVersion: year })}
                                  className={`px-3 py-2 rounded-md border text-xs font-medium transition-all ${
                                    queryState.boundaryVersion === year 
                                      ? 'border-ons-blue bg-blue-50 text-ons-blue' 
                                      : 'border-ons-border bg-white text-gray-600 hover:border-ons-blue'
                                  }`}
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Area Selection List (Alongside Types in Browse) */}
                      <div className="md:col-span-8 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-ons-blue">
                            {queryState.geographyType === 'Countries' && "The four nations of the UK: England, Wales, Scotland, and Northern Ireland."}
                            {queryState.geographyType === 'Regions' && "Large sub-national administrative areas in England used for statistical purposes."}
                            {queryState.geographyType === 'Combined authorities' && "Groups of neighboring local councils that cooperate on strategic issues like transport and growth."}
                            {queryState.geographyType === 'Metropolitan counties' && "Administrative areas covering highly urbanized regions around major English cities."}
                            {queryState.geographyType === 'Local authorities (county or unitary)' && "Regional councils responsible for top-level strategic services like education and social care."}
                            {queryState.geographyType === 'Local authority districts (unitary or district)' && "The more granular level of local government, representing individual towns, boroughs, or districts."}
                          </p>
                        </div>

                        <div className="border border-ons-border rounded-lg bg-white overflow-hidden shadow-sm">
                          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <input 
                                type="checkbox" 
                                className="rounded text-ons-blue"
                                checked={filteredGeographies.length > 0 && filteredGeographies.every(o => queryState.selectedGeographies.includes(o.id))}
                                onChange={(e) => {
                                  const currentIds = filteredGeographies.map(o => o.id);
                                  let newSelected = [...queryState.selectedGeographies];
                                  if (e.target.checked) {
                                    newSelected = Array.from(new Set([...newSelected, ...currentIds]));
                                  } else {
                                    newSelected = newSelected.filter(id => !currentIds.includes(id));
                                  }
                                  updateState({ selectedGeographies: newSelected });
                                }}
                              />
                              Select All
                            </label>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {filteredGeographies.length} Areas
                            </span>
                          </div>
                          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                            {filteredGeographies.map(option => (
                              <label key={option.id} className="flex items-center justify-between p-3 hover:bg-blue-50/50 cursor-pointer transition-colors group">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-ons-blue focus:ring-ons-blue"
                                    checked={queryState.selectedGeographies.includes(option.id)}
                                    onChange={(e) => {
                                      const newSelected = e.target.checked
                                        ? [...queryState.selectedGeographies, option.id]
                                        : queryState.selectedGeographies.filter(id => id !== option.id);
                                      updateState({ selectedGeographies: newSelected });
                                    }}
                                  />
                                  <span className="text-sm font-medium text-gray-900">{option.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-gray-300 group-hover:text-ons-blue transition-colors">{option.id}</span>
                              </label>
                            ))}
                            {filteredGeographies.length === 0 && (
                              <div className="p-12 text-center">
                                <p className="text-sm text-gray-500 italic">No areas found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {queryState.geoSelectionMethod === 'search' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for any area, code, or type..." 
                        value={geoSearch}
                        onChange={(e) => setGeoSearch(e.target.value)}
                        className="w-full border border-ons-border p-4 pl-12 text-base rounded-lg focus:outline-none focus:border-ons-blue shadow-md"
                        autoFocus
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    
                    <div className="border border-ons-border rounded-lg bg-white overflow-hidden shadow-sm">
                      <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <input 
                            type="checkbox" 
                            className="rounded text-ons-blue"
                            checked={filteredGeographies.length > 0 && filteredGeographies.every(o => queryState.selectedGeographies.includes(o.id))}
                            onChange={(e) => {
                              const currentIds = filteredGeographies.map(o => o.id);
                              let newSelected = [...queryState.selectedGeographies];
                              if (e.target.checked) {
                                newSelected = Array.from(new Set([...newSelected, ...currentIds]));
                              } else {
                                newSelected = newSelected.filter(id => !currentIds.includes(id));
                              }
                              updateState({ selectedGeographies: newSelected });
                            }}
                          />
                          Select All Results
                        </label>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {filteredGeographies.length} Results
                        </span>
                      </div>
                      <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-50">
                        {filteredGeographies.map(option => (
                          <label key={option.id} className="flex items-center justify-between p-4 hover:bg-blue-50/50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                className="w-5 h-5 rounded text-ons-blue focus:ring-ons-blue"
                                checked={queryState.selectedGeographies.includes(option.id)}
                                onChange={(e) => {
                                  const newSelected = e.target.checked
                                    ? [...queryState.selectedGeographies, option.id]
                                    : queryState.selectedGeographies.filter(id => id !== option.id);
                                  updateState({ selectedGeographies: newSelected });
                                }}
                              />
                              <div>
                                <span className="block text-base font-semibold text-gray-900">{option.name}</span>
                                <span className="text-xs text-gray-500">{option.type} • {option.boundaryVersion}</span>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-gray-300 group-hover:text-ons-blue transition-colors">{option.id}</span>
                          </label>
                        ))}
                        {filteredGeographies.length === 0 && (
                          <div className="p-20 text-center">
                            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 italic">No areas found matching your search</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Selection */}
                {queryState.geoSelectionMethod === 'map' && (
                  <div className="bg-gray-50 border border-ons-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500">
                    <MapPin className="w-12 h-12 text-ons-blue/20 mb-4" />
                    <h3 className="font-bold text-ons-blue">Interactive Map Selection</h3>
                    <p className="text-sm text-gray-500 text-center max-w-xs mt-2">
                      Click areas on the map to add them to your selection.
                    </p>
                    <button className="mt-6 px-6 py-2 bg-white border border-ons-border rounded-md text-sm font-bold hover:bg-gray-50 transition-all">
                      Open Full Screen Map
                    </button>
                  </div>
                )}

                {/* Advanced Selection */}
                {queryState.geoSelectionMethod === 'advanced' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-6 border border-ons-border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ons-blue mb-4 group-hover:bg-ons-blue group-hover:text-white transition-colors">
                        <MousePointer2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Select areas within...</h4>
                      <p className="text-xs text-gray-500">Pick a parent area to select all its children (e.g. all LAs in London)</p>
                    </div>
                    <div className="p-6 border border-ons-border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ons-blue mb-4 group-hover:bg-ons-blue group-hover:text-white transition-colors">
                        <FileJson className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Load saved selection</h4>
                      <p className="text-xs text-gray-500">Import a list of area codes or a previously saved selection file</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-8">
            <div>
              <label className="block font-semibold text-ons-text mb-1 text-[15px]">Select Date</label>
              <p className="text-xs text-gray-500 mb-6">Choose the time period for your data</p>
              
              <div className="space-y-4">
                {/* Latest Available */}
                <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${dateMode === 'latest' ? 'border-ons-blue bg-blue-50/50 shadow-sm' : 'border-ons-border hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="dateMode" 
                    className="mt-1 text-ons-blue focus:ring-ons-blue"
                    checked={dateMode === 'latest'}
                    onChange={() => handleDateModeChange('latest')}
                  />
                  <div>
                    <span className="block font-bold text-sm text-ons-blue">Latest available</span>
                    <span className="block text-xs text-gray-500">Mid-year 2024 estimates</span>
                  </div>
                </label>

                {/* Quick Ranges */}
                <div className={`p-4 rounded-lg border transition-all ${dateMode === 'quick_ranges' ? 'border-ons-blue bg-blue-50/50 shadow-sm' : 'border-ons-border hover:border-gray-300'}`}>
                  <label className={`flex items-start gap-3 cursor-pointer ${dateMode === 'quick_ranges' ? 'mb-4' : ''}`}>
                    <input 
                      type="radio" 
                      name="dateMode" 
                      className="mt-1 text-ons-blue focus:ring-ons-blue"
                      checked={dateMode === 'quick_ranges'}
                      onChange={() => handleDateModeChange('quick_ranges')}
                    />
                    <div>
                      <span className="block font-bold text-sm text-ons-blue">Quick ranges</span>
                      <span className="block text-xs text-gray-500">Select common time periods</span>
                    </div>
                  </label>
                  
                  {dateMode === 'quick_ranges' && (
                    <div className="ml-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Last 5 years', range: [2020, 2024] as [number, number] },
                        { label: 'Last 10 years', range: [2015, 2024] as [number, number] },
                        { label: 'All available', range: [1991, 2024] as [number, number] }
                      ].map(r => (
                        <button
                          key={r.label}
                          onClick={() => handleQuickRange(r.range)}
                          className={`px-3 py-2 rounded border text-xs font-semibold transition-all ${
                            queryState.selectedDates.length === (r.range[1] - r.range[0] + 1) && 
                            queryState.selectedDates.includes(r.range[0].toString()) && 
                            queryState.selectedDates.includes(r.range[1].toString())
                              ? 'bg-ons-blue text-white border-ons-blue'
                              : 'bg-white text-ons-text border-gray-200 hover:border-ons-blue'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Range */}
                <div className={`p-4 rounded-lg border transition-all ${dateMode === 'custom_range' ? 'border-ons-blue bg-blue-50/50 shadow-sm' : 'border-ons-border hover:border-gray-300'}`}>
                  <label className={`flex items-start gap-3 cursor-pointer ${dateMode === 'custom_range' ? 'mb-4' : ''}`}>
                    <input 
                      type="radio" 
                      name="dateMode" 
                      className="mt-1 text-ons-blue focus:ring-ons-blue"
                      checked={dateMode === 'custom_range'}
                      onChange={() => handleDateModeChange('custom_range')}
                    />
                    <div>
                      <span className="block font-bold text-sm text-ons-blue">Custom range</span>
                      <span className="block text-xs text-gray-500">Define a specific start and end year</span>
                    </div>
                  </label>

                  {dateMode === 'custom_range' && (
                    <div className="ml-7 flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400">From</span>
                        <select 
                          value={customDateRange.from}
                          onChange={(e) => handleCustomRangeUpdate('from', e.target.value)}
                          className="border border-gray-200 rounded p-1.5 text-sm focus:outline-none focus:border-ons-blue"
                        >
                          {years.slice().reverse().map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-4 text-gray-400">to</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400">To</span>
                        <select 
                          value={customDateRange.to}
                          onChange={(e) => handleCustomRangeUpdate('to', e.target.value)}
                          className="border border-gray-200 rounded p-1.5 text-sm focus:outline-none focus:border-ons-blue"
                        >
                          {years.slice().reverse().map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      {parseInt(customDateRange.from) > parseInt(customDateRange.to) && (
                        <span className="text-[10px] text-red-500 mt-4">Start year must be before end year</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Specific Years */}
                <div className={`p-4 rounded-lg border transition-all ${dateMode === 'specific' ? 'border-ons-blue bg-blue-50/50 shadow-sm' : 'border-ons-border hover:border-gray-300'}`}>
                  <label className={`flex items-start gap-3 cursor-pointer ${dateMode === 'specific' ? 'mb-4' : ''}`}>
                    <input 
                      type="radio" 
                      name="dateMode" 
                      className="mt-1 text-ons-blue focus:ring-ons-blue"
                      checked={dateMode === 'specific'}
                      onChange={() => handleDateModeChange('specific')}
                    />
                    <div>
                      <span className="block font-bold text-sm text-ons-blue">Select specific years</span>
                      <span className="block text-xs text-gray-500">Pick individual years from the list</span>
                    </div>
                  </label>

                  {dateMode === 'specific' && (
                    <div className="ml-7 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-2 border border-gray-100 rounded bg-white">
                      {years.map(year => (
                        <label key={year} className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                          <input 
                            type="checkbox"
                            className="w-3 h-3 rounded text-ons-blue focus:ring-ons-blue"
                            checked={queryState.selectedDates.includes(year)}
                            onChange={(e) => {
                              let newSelected = [...queryState.selectedDates];
                              if (e.target.checked) {
                                newSelected.push(year);
                              } else {
                                newSelected = newSelected.filter(y => y !== year);
                                if (newSelected.length === 0) newSelected = [year];
                              }
                              updateState({ selectedDates: newSelected });
                            }}
                          />
                          <span className="text-[11px] font-medium">{year}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'age':
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-ons-text mb-1 text-[15px]">Select Age</label>
              
              <div className="space-y-4">
                {[
                  { id: 'labour', label: 'Labour market categories', desc: 'Common groupings used in labour market analysis' },
                  { id: 'bands', label: '5-year age bands', desc: 'Standard statistical groupings' },
                  { id: 'single', label: 'Specific ages', desc: 'Detailed age selection' }
                ].map(mode => (
                  <div 
                    key={mode.id}
                    className={`p-4 rounded-lg border transition-all ${ageMode === mode.id ? 'border-ons-blue bg-blue-50/50 shadow-sm' : 'border-ons-border hover:border-gray-300'}`}
                  >
                    <label className={`flex items-start gap-3 cursor-pointer ${ageMode === mode.id ? 'mb-4' : ''}`}>
                      <input 
                        type="radio" 
                        name="ageMode" 
                        className="mt-1 text-ons-blue focus:ring-ons-blue"
                        checked={ageMode === mode.id}
                        onChange={() => handleAgeModeChange(mode.id as AgeMode)}
                      />
                      <div>
                        <span className="block font-bold text-sm text-ons-blue">{mode.label}</span>
                        <span className="block text-xs text-gray-500">{mode.desc}</span>
                      </div>
                    </label>

                    {ageMode === mode.id && (
                      <div className="ml-7 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="border border-ons-border rounded bg-white max-h-[300px] overflow-y-auto">
                          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            {ageMode !== 'labour' ? (
                              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                <input 
                                  type="checkbox" 
                                  className="rounded text-ons-blue"
                                  checked={ageDimensions[ageMode].every(age => queryState.selectedAges.includes(age))}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      updateState({ selectedAges: [...ageDimensions[ageMode]] });
                                    } else {
                                      updateState({ selectedAges: [ageDimensions[ageMode][0]] });
                                    }
                                  }}
                                />
                                Select All
                              </label>
                            ) : (
                              <div />
                            )}
                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                              {ageDimensions[ageMode].length} options
                            </span>
                          </div>
                          <div className={`grid ${mode.id === 'single' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8' : 'grid-cols-1'} gap-1 p-2`}>
                            {ageDimensions[ageMode].map(age => (
                              <label key={age} className={`flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors ${mode.id === 'single' ? '' : 'border-b border-gray-50 last:border-0'}`}>
                                <input
                                  type="checkbox"
                                  className="w-3 h-3 rounded text-ons-blue focus:ring-ons-blue"
                                  checked={queryState.selectedAges.includes(age)}
                                  onChange={(e) => handleAgeChange(age, e.target.checked)}
                                />
                                <span className="text-[11px] font-medium text-gray-700">{age.replace('Age ', '')}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sex':
        return (
          <div className="space-y-6">
            <label className="block font-semibold text-ons-text mb-4 text-[15px]">Select Sex</label>
            <div className="space-y-3">
              {sexOptions.map(sex => (
                <button
                  key={sex}
                  onClick={() => updateState({ selectedSex: sex })}
                  className={`w-full p-4 rounded border text-left transition-all flex items-center justify-between ${
                    queryState.selectedSex === sex
                      ? 'border-ons-blue bg-blue-50 text-ons-blue'
                      : 'border-ons-border bg-white text-gray-600 hover:border-ons-blue'
                  }`}
                >
                  <span className="font-semibold">{sex}</span>
                  {queryState.selectedSex === sex && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 'review':
        const selectedGeoNames = queryState.selectedGeographies
          .map(id => geographyOptions.find(o => o.id === id)?.name)
          .filter(Boolean);
        
        const formatList = (list: any[]) => {
          return list.join(', ');
        };

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 relative">
              <h3 className="text-lg font-bold text-ons-blue mb-4 flex items-center gap-2">
                Review your query
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Geography</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatList(selectedGeoNames)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatList(queryState.selectedDates)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Age</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatList(queryState.selectedAges)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sex</span>
                  <span className="text-sm font-semibold text-gray-900">{queryState.selectedSex === 'All' ? 'Male, Female' : queryState.selectedSex}</span>
                </div>
              </div>

              <div className="flex justify-end border-t border-blue-100 pt-4 mt-2">
                <button 
                  onClick={() => goToStep('geography')}
                  className="flex items-center gap-2 text-ons-link font-bold text-sm hover:underline"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Edit query
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ons-text">Data Preview</h3>
                <div className="flex bg-gray-100 p-1 rounded-md">
                  <Tooltip content="Multi-dimensional layout with dates as columns. Best for manual analysis and spreadsheets." align="right">
                    <button 
                      onClick={() => updateState({ format: 'crosstab' })}
                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${queryState.format === 'crosstab' ? 'bg-white text-ons-blue shadow-sm' : 'text-gray-500'}`}
                    >
                      Crosstab
                    </button>
                  </Tooltip>
                  <Tooltip content="Machine-readable 'long' format with one row per value. Best for software processing and databases." align="right">
                    <button 
                      onClick={() => updateState({ format: 'tidy' })}
                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${queryState.format === 'tidy' ? 'bg-white text-ons-blue shadow-sm' : 'text-gray-500'}`}
                    >
                      Tidy
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="border border-ons-border rounded-lg overflow-hidden bg-white">
                <LivePreview queryState={queryState} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-ons-text">Export Options</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Excel (.xlsx)', 'CSV (.csv)', 'JSON (.json)', 'SDMX (.xml)'].map(format => (
                    <button 
                      key={format} 
                      onClick={() => handleExportToggle(format)}
                      disabled={isDownloading}
                      className={`flex items-center gap-3 p-3 border rounded transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedFormats.includes(format) 
                          ? 'border-ons-blue bg-blue-50 ring-1 ring-ons-blue' 
                          : 'border-ons-border hover:border-ons-blue bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedFormats.includes(format) ? 'bg-ons-blue border-ons-blue' : 'border-gray-300'}`}>
                        {selectedFormats.includes(format) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-xs font-bold ${selectedFormats.includes(format) ? 'text-ons-blue' : 'text-gray-700'}`}>{format}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-ons-text">API Access</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-ons-accent font-mono text-[10px] relative group">
                  <code className="block break-all">
                    https://api.nomisweb.co.uk/api/v01/dataset/{dataset.id.toUpperCase()}.data.json?geography={queryState.selectedGeographies.slice(0, 3).join(',')},...
                  </code>
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-1 rounded">
                    <Check className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-500 italic">Use this endpoint to fetch this specific data slice programmatically.</p>
                  <a href="#" className="text-[10px] text-blue-700 font-bold hover:underline flex items-center gap-1">
                    API Documentation
                    <ArrowRight className="w-2 h-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar Stepper */}
        <aside className="w-60 bg-white border-r border-ons-border py-6 shrink-0">
          <div className="px-6 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Steps</h3>
          </div>
          <div className="space-y-1">
            <button 
              onClick={onCancel}
              className="w-full px-6 py-3 flex items-center gap-3 text-sm text-ons-accent hover:bg-gray-50 transition-colors border-l-4 border-transparent group"
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] group-hover:scale-110 transition-transform">
                <Info className="w-3 h-3" />
              </div>
              <span className="font-medium">Overview</span>
            </button>
            {steps.map((step, idx) => {
              const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;
              const isActive = step.id === currentStep;
              const isUnlocked = true; // All steps unlocked by default
              
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`w-full px-6 py-3 flex items-center gap-3 text-sm border-l-4 transition-all ${
                    isActive 
                      ? 'border-ons-blue bg-blue-50 text-ons-blue font-semibold' 
                      : isCompleted 
                        ? 'border-transparent text-ons-accent' 
                        : 'border-transparent text-gray-500'
                  } cursor-pointer`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    isActive 
                      ? 'bg-ons-blue text-white' 
                      : isCompleted 
                        ? 'bg-ons-accent text-white' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  {step.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Workspace */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white border-r border-ons-border p-6 sm:p-8">
          <div className="mb-6 shrink-0 sm:mb-8">
            <h2 className="text-xl font-bold text-ons-blue mb-1">{dataset.title}</h2>
            <p className="text-xs text-gray-500">Source: {dataset.source} | Updated: {dataset.lastUpdated}</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Actions in main column — shrink-0 keeps bar below scrollable content (no overlap) */}
          <div className="mt-4 shrink-0 border-t border-ons-border pt-6 pb-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button 
              onClick={handleBack}
              className="w-full px-6 py-2 border border-ons-border font-bold text-sm hover:bg-gray-50 transition-colors rounded sm:w-auto"
            >
              {stepIndex === 0 ? 'Cancel' : 'Previous'}
            </button>
            <button
              onClick={handleNext}
              disabled={isDownloading}
              className={`w-full sm:w-auto sm:min-w-[180px] ${isDownloaded ? 'bg-green-600' : 'bg-ons-accent'} text-white px-8 py-2 font-bold text-sm rounded hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2`}
            >
              {isLastStep ? (
                isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {selectedFormats.length > 1 ? 'Preparing ZIP...' : 'Downloading...'}
                  </>
                ) : isDownloaded ? (
                  <>
                    <Check className="w-4 h-4" />
                    {selectedFormats.length > 1 ? 'ZIP download complete' : 'Download complete'}
                  </>
                ) : (
                  selectedFormats.length > 1 ? 'Download ZIP archive' : 'Download dataset'
                )
              ) : (
                `Next: ${steps[stepIndex + 1].label} →`
              )}
            </button>
          </div>
        </section>

        {/* Preview Panel */}
        {currentStep !== 'review' && (
          <section className="w-80 bg-[#f9f9f9] p-6 shrink-0 overflow-y-auto">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block font-bold text-ons-text text-[13px] uppercase tracking-wider">Current Selections</label>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold">Geography:</span>
                    <span className="text-ons-blue font-semibold">{queryState.selectedGeographies.length} items</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold">Date:</span>
                    <span className="text-ons-blue font-semibold">{queryState.selectedDates.length > 1 ? `${queryState.selectedDates.length} years` : queryState.selectedDates[0] || 'Latest'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold">Age:</span>
                    <span className="text-ons-blue font-semibold">{queryState.selectedAges.length === ageDimensions[ageMode].length ? 'All Ages' : `${queryState.selectedAges.length} selected`}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold">Sex:</span>
                    <span className="text-ons-blue font-semibold">{queryState.selectedSex === 'All' ? 'Male, Female' : queryState.selectedSex}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-ons-text text-[13px] uppercase tracking-wider">Live Data Preview</label>
                  <span className="text-[10px] bg-blue-100 text-ons-blue px-2 py-0.5 rounded font-bold">SAMPLE DATA</span>
                </div>
                <div className="bg-white border border-ons-border rounded-lg overflow-hidden shadow-sm">
                  <LivePreview queryState={queryState} compact={true} />
                </div>
                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                  Preview shows a sample of your current selections. Data values are illustrative.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
