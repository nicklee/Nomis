
import React from 'react';
import { QueryState } from '../types';
import { geographyOptions } from '../mockData';

interface LivePreviewProps {
  queryState: QueryState;
  compact?: boolean;
}

export default function LivePreview({ queryState, compact = false }: LivePreviewProps) {
  const { selectedGeographies, selectedDates, selectedAges, selectedSex, format } = queryState;

  const getGeoName = (id: string) => geographyOptions.find(o => o.id === id)?.name || id;

  const sexes = selectedSex === 'All' ? ['Male', 'Female'] : [selectedSex];
  
  // Increasing preview size to show "fuller" data as requested
  // We still slice for UI performance, but much more generously
  const maxGeos = compact ? 10 : 30;
  const maxDates = compact ? 5 : 20;
  const maxAges = compact ? 5 : 20;

  const geosToPreview = selectedGeographies.slice(0, maxGeos);
  const datesToPreview = selectedDates.slice(0, maxDates);
  const agesToPreview = selectedAges.slice(0, maxAges);

  if (format === 'tidy') {
    // Tidy format shows all combinations as separate rows
    const dataRows: any[] = [];
    geosToPreview.forEach(geo => {
      datesToPreview.forEach(date => {
        agesToPreview.forEach(age => {
          sexes.forEach(sex => {
            dataRows.push({
              geo: getGeoName(geo),
              date,
              age,
              sex,
              value: (Math.random() * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })
            });
          });
        });
      });
    });

    return (
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Geography</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Date</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Age</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Sex</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataRows.slice(0, 100).map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-xs font-medium text-gray-900">{row.geo}</td>
                <td className="p-3 text-xs text-gray-600">{row.date}</td>
                <td className="p-3 text-xs text-gray-600">{row.age}</td>
                <td className="p-3 text-xs text-gray-600">{row.sex}</td>
                <td className="p-3 text-xs font-mono text-gray-900 text-right">{row.value}</td>
              </tr>
            ))}
            {dataRows.length > 100 && (
              <tr>
                <td colSpan={5} className="p-3 text-center text-xs text-gray-400 italic bg-gray-50">
                  Showing first 100 of {dataRows.length} rows...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Crosstab format: Rows (Geo + Age + Sex) x Columns (Dates)
  const crosstabRows: any[] = [];
  geosToPreview.forEach(geo => {
    agesToPreview.forEach(age => {
      sexes.forEach(sex => {
        crosstabRows.push({
          geo: getGeoName(geo),
          age,
          sex
        });
      });
    });
  });

  return (
    <div className="overflow-x-auto max-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200 sticky top-0 z-20">
            <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-100 z-30 min-w-[150px]">Geography</th>
            <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100">Age</th>
            <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100">Sex</th>
            {datesToPreview.map(date => (
              <th key={date} className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">{date}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {crosstabRows.slice(0, 100).map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 text-xs font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-50">{row.geo}</td>
              <td className="p-3 text-xs text-gray-600 border-r border-gray-50">{row.age}</td>
              <td className="p-3 text-xs text-gray-600 border-r border-gray-50">{row.sex}</td>
              {datesToPreview.map(date => (
                <td key={date} className="p-3 text-xs font-mono text-gray-900 text-right">
                  {(Math.random() * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              ))}
            </tr>
          ))}
          {crosstabRows.length > 100 && (
            <tr>
              <td colSpan={3 + datesToPreview.length} className="p-3 text-center text-xs text-gray-400 italic bg-gray-50">
                Showing first 100 of {crosstabRows.length} combinations...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
