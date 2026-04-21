/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
  useOutletContext,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import DatasetDiscovery from './components/DatasetDiscovery';
import QueryBuilder from './components/QueryBuilder';
import DatasetOverview from './components/DatasetOverview';
import { Dataset, QueryState } from './types';
import { datasets } from './mockData';
import { motion } from 'motion/react';

function datasetById(id: string | undefined): Dataset | undefined {
  if (!id) return undefined;
  return datasets.find(d => d.id === id);
}

function AppLayout({
  finalQueryState,
  setFinalQueryState,
}: {
  finalQueryState: QueryState | null;
  setFinalQueryState: React.Dispatch<React.SetStateAction<QueryState | null>>;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') ?? '';
  const selectedTheme = searchParams.get('theme');

  const filteredDatasets = useMemo(() => {
    let results = datasets;
    if (searchQuery) {
      results = results.filter(
        d =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedTheme) {
      results = results.filter(d =>
        d.themes.some(t => t.toLowerCase() === selectedTheme.toLowerCase()),
      );
    }
    return results;
  }, [searchQuery, selectedTheme]);

  const goDiscovery = (q: string, theme: string | null) => {
    const next = new URLSearchParams();
    if (q.trim()) next.set('q', q.trim());
    if (theme) next.set('theme', theme);
    navigate({ pathname: '/datasets', search: next.toString() });
  };

  const handleSearch = (query: string) => {
    goDiscovery(query, null);
  };

  const handleSelectTheme = (theme: string) => {
    goDiscovery('', theme);
  };

  const handleStartExploring = () => {
    navigate('/datasets');
  };

  const handleSelectDataset = (dataset: Dataset) => {
    navigate(`/datasets/${dataset.id}/overview`, {
      state: { datasetsList: `${location.pathname}${location.search}` },
    });
  };

  const handleQueryComplete = (state: QueryState) => {
    setFinalQueryState(state);
    console.log('Query completed:', state);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ons-bg font-sans text-ons-text">
      <Header
        onHome={() => navigate('/')}
        onSearch={handleSearch}
        onSelectDataset={handleSelectDataset}
      />

      <main className="flex-grow min-h-0">
        {/* Route key forces remount; avoid AnimatePresence mode="wait" + opacity exit —
            that combo can leave main content stuck invisible after navigate home */}
        <motion.div
          key={location.pathname + location.search}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Outlet
            context={{
              filteredDatasets,
              searchQuery,
              selectedTheme,
              handleSearch,
              handleSelectTheme,
              handleStartExploring,
              handleSelectDataset,
              handleQueryComplete,
              finalQueryState,
              setFinalQueryState,
            }}
          />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

type AppOutlet = {
  filteredDatasets: Dataset[];
  searchQuery: string;
  selectedTheme: string | null;
  handleSearch: (q: string) => void;
  handleSelectTheme: (t: string) => void;
  handleStartExploring: () => void;
  handleSelectDataset: (d: Dataset) => void;
  handleQueryComplete: (s: QueryState) => void;
  finalQueryState: QueryState | null;
  setFinalQueryState: React.Dispatch<React.SetStateAction<QueryState | null>>;
};

function HomePageRoute() {
  const o = useOutletContext<AppOutlet>();
  return (
    <Homepage
      onSearch={o.handleSearch}
      onSelectTheme={o.handleSelectTheme}
      onStartExploring={o.handleStartExploring}
      onSelectDataset={o.handleSelectDataset}
    />
  );
}

function DiscoveryRoute() {
  const o = useOutletContext<AppOutlet>();
  return (
    <DatasetDiscovery
      datasets={o.filteredDatasets}
      onSelectDataset={o.handleSelectDataset}
      onClearGlobalFilters={o.handleStartExploring}
      searchQuery={o.searchQuery}
      selectedTheme={o.selectedTheme}
    />
  );
}

function DatasetOverviewRoute() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const o = useOutletContext<AppOutlet>();

  const dataset = datasetById(datasetId);
  const backTarget =
    (location.state as { datasetsList?: string } | null)?.datasetsList ?? '/datasets';

  if (!dataset) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <p className="text-ons-text mb-4">Dataset not found.</p>
        <button
          type="button"
          onClick={() => navigate('/datasets')}
          className="text-ons-link font-semibold underline"
        >
          Browse all datasets
        </button>
      </div>
    );
  }

  return (
    <DatasetOverview
      dataset={dataset}
      onNext={() => navigate(`/datasets/${dataset.id}/build/geography`)}
      onBack={() => navigate(backTarget)}
    />
  );
}

function QueryBuilderRoute() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const o = useOutletContext<AppOutlet>();

  const dataset = datasetById(datasetId);

  if (!dataset) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <p className="text-ons-text mb-4">Dataset not found.</p>
        <button
          type="button"
          onClick={() => navigate('/datasets')}
          className="text-ons-link font-semibold underline"
        >
          Browse all datasets
        </button>
      </div>
    );
  }

  const initial =
    o.finalQueryState?.dataset?.id === dataset.id ? o.finalQueryState : undefined;

  return (
    <QueryBuilder
      dataset={dataset}
      initialState={initial}
      onCancel={() => navigate(`/datasets/${dataset.id}/overview`)}
      onComplete={o.handleQueryComplete}
    />
  );
}

export default function App() {
  const [finalQueryState, setFinalQueryState] = useState<QueryState | null>(null);

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            finalQueryState={finalQueryState}
            setFinalQueryState={setFinalQueryState}
          />
        }
      >
        <Route index element={<HomePageRoute />} />
        <Route path="datasets" element={<DiscoveryRoute />} />
        <Route path="datasets/:datasetId/overview" element={<DatasetOverviewRoute />} />
        <Route
          path="datasets/:datasetId/build"
          element={<Navigate to="geography" replace />}
        />
        <Route path="datasets/:datasetId/build/:step" element={<QueryBuilderRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
