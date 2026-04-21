
import { Dataset, GeographyOption } from './types';

export const datasets: Dataset[] = [
  {
    id: 'pestsyoala',
    title: 'Population estimates - local authority based by single year of age',
    description: 'Annual mid-year population estimates for local authorities in the UK by single year of age and sex.',
    source: 'Population Estimates/Projections',
    lastUpdated: '21 Dec 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '1981 - 2022',
    themes: ['Population', 'Demography']
  },
  {
    id: 'aps-lfs-employment',
    title: 'Annual population survey/labour force survey',
    description: 'The APS is a combined dataset of the LFS and the English, Welsh and Scottish LFS boosts.',
    source: 'Labour market',
    lastUpdated: '12 Feb 2024',
    geographyCoverage: 'United Kingdom',
    timeRange: '2004 - 2023',
    themes: ['Employment', 'Labour market', 'Skills']
  },
  {
    id: 'ashe-earnings',
    title: 'Annual survey of hours and earnings',
    description: 'The ASHE provides information about the levels, distribution and make-up of earnings and hours worked for employees.',
    source: 'Earnings',
    lastUpdated: '01 Nov 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '1997 - 2023',
    themes: ['Earnings', 'Income', 'Labour market']
  },
  {
    id: 'bres-employment',
    title: 'Business register and employment survey',
    description: 'BRES is the official source of employee and employment estimates by detailed geography and industry.',
    source: 'Business',
    lastUpdated: '28 Sep 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '2009 - 2022',
    themes: ['Employment', 'Business', 'Industry']
  },
  {
    id: 'census-2021-tenure',
    title: 'Census 2021 - household composition by tenure',
    description: 'Detailed data from the 2021 Census showing how households are composed and their housing tenure status.',
    source: 'Census 2021',
    lastUpdated: '28 Mar 2023',
    geographyCoverage: 'England & Wales',
    timeRange: '2021',
    themes: ['Population', 'Housing', 'Census']
  },
  {
    id: 'census-2011-ks',
    title: 'Census 2011 - key statistics',
    description: 'A range of key statistics from the 2011 Census providing a snapshot of the population.',
    source: 'Census 2011',
    lastUpdated: '30 Jan 2013',
    geographyCoverage: 'United Kingdom',
    timeRange: '2011',
    themes: ['Population', 'Demography', 'Census']
  },
  {
    id: 'claimant-count',
    title: 'Claimant count',
    description: 'The number of people claiming benefit principally for the reason of being unemployed.',
    source: 'Labour market',
    lastUpdated: '13 Feb 2024',
    geographyCoverage: 'United Kingdom',
    timeRange: '1971 - 2024',
    themes: ['Unemployment', 'Labour market', 'Benefits']
  },
  {
    id: 'housing-stock',
    title: 'Housing stock by tenure',
    description: 'Estimates of the number of dwellings by tenure (owner-occupied, social rented, private rented).',
    source: 'Housing',
    lastUpdated: '15 Dec 2023',
    geographyCoverage: 'England',
    timeRange: '2001 - 2022',
    themes: ['Housing', 'Tenure']
  },
  {
    id: 'jobs-density',
    title: 'Jobs density',
    description: 'The ratio of total jobs to the population aged 16-64.',
    source: 'Labour market',
    lastUpdated: '18 Jan 2024',
    geographyCoverage: 'United Kingdom',
    timeRange: '2000 - 2022',
    themes: ['Employment', 'Labour market']
  },
  {
    id: 'life-events-births',
    title: 'Life events - births by area of usual residence',
    description: 'Annual data on live births by area of usual residence of the mother.',
    source: 'Life events',
    lastUpdated: '10 Oct 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '1991 - 2022',
    themes: ['Demography', 'Births']
  },
  {
    id: 'subnational-pop-proj',
    title: 'Subnational population projections for England: 2022-based',
    description: 'Projections of the future population of local authorities in England.',
    source: 'Population Estimates/Projections',
    lastUpdated: '24 May 2024',
    geographyCoverage: 'England',
    timeRange: '2022 - 2043',
    themes: ['Population', 'Projections']
  },
  {
    id: 'uk-business-counts',
    title: 'UK business counts - enterprises by industry and size',
    description: 'A snapshot of the Inter Departmental Business Register (IDBR) showing the number of enterprises.',
    source: 'Business',
    lastUpdated: '27 Sep 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '2010 - 2023',
    themes: ['Business', 'Economy', 'Industry']
  },
  {
    id: 'workforce-jobs',
    title: 'Workforce jobs by industry',
    description: 'Estimates of the number of jobs in the UK economy by industry sector.',
    source: 'Labour market',
    lastUpdated: '12 Dec 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '1978 - 2023',
    themes: ['Employment', 'Labour market', 'Industry']
  },
  {
    id: 'regional-gva',
    title: 'Regional gross value added (balanced) by industry',
    description: 'Estimates of GVA for regions and local authorities, providing a measure of economic activity by industry.',
    source: 'Regional Accounts',
    lastUpdated: '20 Jan 2024',
    geographyCoverage: 'United Kingdom',
    timeRange: '1998 - 2022',
    themes: ['Economy', 'Regional', 'GVA']
  },
  {
    id: 'civil-service-survey',
    title: 'Annual civil service employment survey [discontinued in 2018]',
    description: 'Detailed data on the Civil Service workforce, including diversity and earnings.',
    source: 'Labour market',
    lastUpdated: '15 Aug 2018',
    geographyCoverage: 'United Kingdom',
    timeRange: '2007 - 2018',
    themes: ['Employment', 'Civil service']
  },
  {
    id: 'house-price-index',
    title: 'UK house price index',
    description: 'Monthly data on the average price of residential properties in the UK.',
    source: 'Housing',
    lastUpdated: '20 Mar 2024',
    geographyCoverage: 'United Kingdom',
    timeRange: '1968 - 2024',
    themes: ['Housing', 'Economy']
  },
  {
    id: 'migration-estimates',
    title: 'Long-term international migration estimates',
    description: 'Estimates of people moving into and out of the UK for at least 12 months.',
    source: 'Population Estimates/Projections',
    lastUpdated: '23 Nov 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '1991 - 2023',
    themes: ['Population', 'Migration']
  },
  {
    id: 'disability-employment',
    title: 'Disability and employment',
    description: 'Labour market status of disabled people, including employment and unemployment rates.',
    source: 'Labour market',
    lastUpdated: '15 Feb 2024',
    geographyCoverage: 'United Kingdom',
    timeRange: '2013 - 2023',
    themes: ['Employment', 'Disability', 'Labour market']
  },
  {
    id: 'energy-consumption',
    title: 'Sub-national total final energy consumption',
    description: 'Energy consumption data at local authority level for electricity, gas, and other fuels.',
    source: 'Energy',
    lastUpdated: '21 Dec 2023',
    geographyCoverage: 'United Kingdom',
    timeRange: '2005 - 2022',
    themes: ['Economy', 'Environment']
  },
  {
    id: 'census-2021-religion',
    title: 'Census 2021 - religion by age and sex',
    description: 'Data from the 2021 Census on religious affiliation across England and Wales.',
    source: 'Census 2021',
    lastUpdated: '30 Jan 2023',
    geographyCoverage: 'England & Wales',
    timeRange: '2021',
    themes: ['Population', 'Census', 'Religion']
  }
];

export const geographyOptions: GeographyOption[] = [
  // Countries (Current)
  { id: 'E92000001', name: 'England', type: 'Countries', category: 'current', boundaryVersion: 2023 },
  { id: 'W92000004', name: 'Wales', type: 'Countries', category: 'current', boundaryVersion: 2023 },
  { id: 'S92000003', name: 'Scotland', type: 'Countries', category: 'current', boundaryVersion: 2023 },
  { id: 'N92000002', name: 'Northern Ireland', type: 'Countries', category: 'current', boundaryVersion: 2023 },
  
  // Regions (Current)
  { id: 'E12000007', name: 'London', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000008', name: 'South East', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000009', name: 'South West', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000005', name: 'West Midlands', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000004', name: 'East Midlands', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000003', name: 'Yorkshire and The Humber', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000002', name: 'North West', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000001', name: 'North East', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  { id: 'E12000006', name: 'East of England', type: 'Regions', category: 'current', boundaryVersion: 2023, parent: 'E92000001' },
  
  // Local Authorities (Current 2023)
  { id: 'E09000007', name: 'Camden', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000007' },
  { id: 'E09000033', name: 'Westminster', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000007' },
  { id: 'E09000019', name: 'Islington', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000007' },
  { id: 'E09000012', name: 'Hackney', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000007' },
  { id: 'E06000008', name: 'Oxford', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000008' },
  { id: 'E06000045', name: 'Reading', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000008' },
  { id: 'E06000023', name: 'Bristol, City of', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000009' },
  { id: 'E08000025', name: 'Birmingham', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000005' },
  { id: 'E08000035', name: 'Leeds', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000003' },
  { id: 'E08000003', name: 'Manchester', type: 'Local authorities (county or unitary)', category: 'current', boundaryVersion: 2023, parent: 'E12000002' },
  
  // Combined Authorities
  { id: 'E47000001', name: 'Greater Manchester Combined Authority', type: 'Combined authorities', category: 'current', boundaryVersion: 2023 },
  { id: 'E47000007', name: 'West Midlands Combined Authority', type: 'Combined authorities', category: 'current', boundaryVersion: 2023 },

  // Metropolitan Counties
  { id: 'E11000001', name: 'Greater Manchester', type: 'Metropolitan counties', category: 'current', boundaryVersion: 2023 },
  { id: 'E11000004', name: 'Merseyside', type: 'Metropolitan counties', category: 'current', boundaryVersion: 2023 },
  { id: 'E11000003', name: 'South Yorkshire', type: 'Metropolitan counties', category: 'current', boundaryVersion: 2023 },
  { id: 'E11000002', name: 'Tyne and Wear', type: 'Metropolitan counties', category: 'current', boundaryVersion: 2023 },
  { id: 'E11000005', name: 'West Midlands', type: 'Metropolitan counties', category: 'current', boundaryVersion: 2023 },
  { id: 'E11000006', name: 'West Yorkshire', type: 'Metropolitan counties', category: 'current', boundaryVersion: 2023 },
  
  // Local Authorities (Historical 2011/2019/2021)
  { id: 'E09000007_2019', name: 'Camden (2019)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2019, parent: 'E12000007' },
  { id: 'E09000033_2019', name: 'Westminster (2019)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2019, parent: 'E12000007' },
  { id: 'E06000001_2011', name: 'Hartlepool (2011)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2011, parent: 'E12000001' },
  { id: 'E06000002_2011', name: 'Middlesbrough (2011)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2011, parent: 'E12000001' },
  { id: 'E06000048_2021', name: 'Buckinghamshire (2021)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2021, parent: 'E12000008' },
  { id: 'E06000060_2021', name: 'North Northamptonshire (2021)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2021, parent: 'E12000004' },
  { id: 'E06000061_2021', name: 'West Northamptonshire (2021)', type: 'Local authorities (county or unitary)', category: 'historical', boundaryVersion: 2021, parent: 'E12000004' },
  
  // Local Authority Districts (Current)
  { id: 'E07000178', name: 'Oxford District', type: 'Local authority districts (unitary or district)', category: 'current', boundaryVersion: 2023, parent: 'E06000008' }
];

export const ageDimensions = {
  labour: [
    "All Ages",
    "0–15",
    "16–24",
    "25–49",
    "50–64",
    "65+"
  ],
  bands: [
    "0–4", "5–9", "10–14", "15–19", "20–24",
    "25–29", "30–34", "35–39", "40–44", "45–49",
    "50–54", "55–59", "60–64", "65–69", "70–74",
    "75–79", "80–84", "85+"
  ],
  single: Array.from({ length: 91 }, (_, i) => i === 90 ? "Age 90+" : `Age ${i}`)
};

export const years = Array.from({ length: 2024 - 1991 + 1 }, (_, i) => (2024 - i).toString());

export const sexOptions = ['All', 'Male', 'Female'];
