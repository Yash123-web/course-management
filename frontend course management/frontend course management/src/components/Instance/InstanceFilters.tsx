import React from 'react';
import { Search, Filter } from 'lucide-react';

interface InstanceFiltersProps {
  year: string;
  semester: string;
  onYearChange: (year: string) => void;
  onSemesterChange: (semester: string) => void;
  onFilter: () => void;
  onClear: () => void;
}

const InstanceFilters: React.FC<InstanceFiltersProps> = ({
  year,
  semester,
  onYearChange,
  onSemesterChange,
  onFilter,
  onClear
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filter-year" className="block text-xs font-medium text-gray-500 mb-1">
              Year
            </label>
            <select
              id="filter-year"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filter-semester" className="block text-xs font-medium text-gray-500 mb-1">
              Semester
            </label>
            <select
              id="filter-semester"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={semester}
              onChange={(e) => onSemesterChange(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={onFilter}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button
              onClick={onClear}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstanceFilters;