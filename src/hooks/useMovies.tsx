import { useCallback, useState } from "react";
import AxiosInstance from "api/AxiosInstance";



export interface Movie {
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

// hooks/useMovies.ts - Fixed version
export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchMovies = useCallback(async (filters: SearchFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      // Make actual API call using your Axios instance
      const response = await AxiosInstance.get(`/movies/?${params.toString()}`);
      const data = response.data;
      
      setMovies(data.items);
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.total_pages,
        hasNext: data.has_next,
        hasPrevious: data.has_previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, []);

  return { movies, loading, error, pagination, fetchMovies };
};