// hooks/useMovieDetail.ts - Fixed version
import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthProvider';
import { getMovieDetail, rateMovie, deleteRating } from '../api/movies';

// Define proper interfaces based on your backend response
interface Rating {
  id: number;
  user: number;
  user_username: string;
  rating: number;
  review: string | null;
  created_at: string;
}

interface MovieDetail {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  description: string;
  ratings_count: number;
  ratings_avg: number;
  created_by: number;
  created_by_username: string;
  created_at: string;
  recent_ratings: Rating[];
}

interface RatingData {
  rating: number;
  review?: string;
}

export const useMovieDetail = (movieId: number) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMovieDetail = useCallback(async () => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    try {
      const movieData = await getMovieDetail(movieId);
      setMovie(movieData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const submitRating = async (ratingData: RatingData) => {
    if (!movieId) return;
    
    try {
      // Use the correct rateMovie function signature
      const response = await rateMovie(movieId, ratingData);
      
      // Refresh movie data to get updated ratings
      await fetchMovieDetail();
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit rating');
    }
  };

  const deleteUserRating = async () => {
    if (!movieId || !user) return;
    
    try {
      // First, we need to find the user's rating ID
      if (movie) {
        const userRating = movie.recent_ratings.find(rating => rating.user === user.id);
        if (userRating) {
          await deleteRating(userRating.id);
          // Refresh movie data
          await fetchMovieDetail();
        }
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete rating');
    }
  };

  // Find user's existing rating
  const userRating = movie?.recent_ratings.find(rating => rating.user === user?.id) || null;

  return {
    movie,
    loading,
    error,
    userRating,
    fetchMovieDetail,
    submitRating,
    deleteRating: deleteUserRating,
  };
};