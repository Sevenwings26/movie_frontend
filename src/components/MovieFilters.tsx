// components/MovieFilters.tsx
import React from 'react';


interface Rating {
  id: number;
  movie: number;
  movie_title: string;
  user: number;
  user_username: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}


interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  description: string;
  ratings_count: number;
  ratings_avg: number;
  created_by_username: string;
  created_at: string;
}

interface SearchFilters {
  genre?: string;
  min_year?: number;
  max_year?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface MovieFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  genres: string[];
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  filters,
  onFiltersChange,
  genres,
}) => {
  const handleChange = (key: keyof SearchFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
      page: 1, // Reset to first page when filters change
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search movies..."
          />
        </div>

        {/* Genre Filter */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="genre"
            value={filters.genre || ''}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div>
          <label htmlFor="min_year" className="block text-sm font-medium text-gray-700">
            Min Year
          </label>
          <input
            type="number"
            id="min_year"
            min="1900"
            max="2100"
            value={filters.min_year || ''}
            onChange={(e) => handleChange('min_year', parseInt(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="max_year" className="block text-sm font-medium text-gray-700">
            Max Year
          </label>
          <input
            type="number"
            id="max_year"
            min="1900"
            max="2100"
            value={filters.max_year || ''}
            onChange={(e) => handleChange('max_year', parseInt(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};