'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { weatherService } from '@/services/weatherService';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

interface SearchResult {
  name: string;
  country: string;
  region: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await weatherService.searchLocations(searchQuery);
      setResults(searchResults.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleLocationSelect = (location: SearchResult) => {
    const locationString = `${location.name}, ${location.country}`;
    onLocationSelect(locationString);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-900/50 backdrop-blur-sm shadow-sm text-white placeholder-gray-400"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          )}
          {!isLoading && results.length > 0 && (
            results.map((location, index) => (
              <button
                key={`${location.name}-${location.country}-${index}`}
                onClick={() => handleLocationSelect(location)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-b-0 text-left"
              >
                <MapPin className="w-4 h-4 text-green-400" />
                <div>
                  <div className="font-medium text-white">{location.name}</div>
                  <div className="text-sm text-gray-400">
                    {location.region}, {location.country}
                  </div>
                </div>
              </button>
            ))
          )}
          {!isLoading && results.length === 0 && query.length >= 2 && (
            <div className="p-4 text-center text-gray-400">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};
