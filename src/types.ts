
export type GeographyTypeCategory = 'current' | 'historical';

export type GeographyType = 
  | 'Countries' 
  | 'Regions' 
  | 'Combined authorities' 
  | 'Metropolitan counties' 
  | 'Local authorities (county or unitary)' 
  | 'Local authority districts (unitary or district)';

export interface GeographyOption {
  id: string;
  name: string;
  type: GeographyType;
  category: GeographyTypeCategory;
  boundaryVersion: number;
  parent?: string;
}

export type GeographySelectionMethod = 'search' | 'browse' | 'map' | 'advanced';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  source: string;
  lastUpdated: string;
  geographyCoverage: string;
  timeRange: string;
  themes: string[];
}

export type AgeSelectionMode = 'labour' | 'bands' | 'single';

export interface QueryState {
  dataset: Dataset | null;
  geoSelectionMethod: GeographySelectionMethod;
  geoCategory: GeographyTypeCategory;
  geographyType: GeographyType | null;
  boundaryVersion: number;
  selectedGeographies: string[];
  selectedDates: string[];
  ageSelectionMode: AgeSelectionMode;
  selectedAges: string[];
  selectedSex: string;
  format: 'crosstab' | 'tidy';
}

export type StepId = 'geography' | 'date' | 'age' | 'sex' | 'review';
