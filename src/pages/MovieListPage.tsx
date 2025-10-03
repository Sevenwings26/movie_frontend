import React, { useEffect, useState } from 'react';
import { MovieFilters } from '../components/MovieFilters';
import { Pagination } from '../components/Pagination';
import { RatingStars } from '../components/RatingStars';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import {listMovies} from '../api/movies'


interface Movie {
  id?: number;
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 
  'Romance', 'Thriller', 'Fantasy', 'Documentary', 'Other'
];

export const MovieListPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  // In MovieListPage component - Updated fetchMovies function
const fetchMovies = async (searchFilters: SearchFilters) => {
  setLoading(true);
  setError(null);
  
  try {
    const data = await listMovies(searchFilters);
    setMovies(data.items);
    setPagination({
      page: data.page,
      limit: data.limit,
      total: data.total,
      total_pages: data.total_pages,
      has_next: data.has_next,
      has_previous: data.has_previous,
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    console.error('Error fetching movies:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMovies(filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">Error: {error}</div>
            <button 
              onClick={() => fetchMovies(filters)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
    );
  }

  return (
    <div>
    <div>
      <NavBar/>
    </div>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Movie Rating Platform</h1>
          <p className="mt-2 text-gray-600">Discover and rate your favorite movies</p>
        </div>

        <MovieFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          genres={GENRES}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {movies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No movies found. Try adjusting your filters.</p>
                  <button 
                    onClick={() => setFilters({ page: 1, limit: 10 })}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {movies.map((movie) => (
                    <li key={movie.id}>
                      <Link 
                        to={`/movies/${movie.id}`}
                        className="block hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-indigo-600 truncate">
                                  {movie.title}
                                </h3>
                                <div className="ml-2 flex-shrink-0 flex items-center">
                                  <RatingStars 
                                    value={Math.round(movie.ratings_avg)} 
                                    readOnly 
                                    size="small" 
                                    showLabel 
                                  />
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({movie.ratings_count} reviews)
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    {movie.genre} • {movie.release_year}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <p>Added by {movie.created_by_username}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {pagination.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  );
};