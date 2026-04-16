
import React from 'react';
import { QueryState } from '../types';
import { geographyOptions } from '../mockData';

interface LivePreviewProps {
  queryState: QueryState;
  compact?: boolean;
}

export default function LivePreview({ queryState, compact = false }: LivePreviewProps) {
  const { selectedGeographies, selectedDates, selectedAges, selectedSex, format } = queryState;

  // Mock data generation for preview
  const rows = selectedGeographies.length > 0 ? selectedGeographies.slice(0, compact ? 5 : 10) : ['E92000001', 'W92000004', 'S92000003'];
  const cols = selectedDates.length > 0 ? selectedDates.slice(0, 3) : ['2022'];

  const getGeoName = (id: string) => geographyOptions.find(o => o.id === id)?.name || id;

  if (format === 'tidy') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Geography</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Date</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Age</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Sex</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((geoId, i) => (
              <tr key={geoId} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-xs font-medium text-gray-900">{getGeoName(geoId)}</td>
                <td className="p-3 text-xs text-gray-600">{cols[0]}</td>
                <td className="p-3 text-xs text-gray-600">{selectedAges[0] || 'All Ages'}</td>
                <td className="p-3 text-xs text-gray-600">{selectedSex}</td>
                <td className="p-3 text-xs font-mono text-gray-900">{(Math.random() * 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-100 z-10">Geography</th>
            {cols.map(date => (
              <th key={date} className="p-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">{date}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((geoId) => (
            <tr key={geoId} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 text-xs font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-50">{getGeoName(geoId)}</td>
              {cols.map(date => (
                <td key={date} className="p-3 text-xs font-mono text-gray-900 text-right">
                  {(Math.random() * 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
