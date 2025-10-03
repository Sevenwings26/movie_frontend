import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthProvider';
import { getMovieDetail, rateMovie, deleteRating} from '../api/movies'; 

interface RatingData {
  rating: number;
  review?: string;
}


interface Movie {
  id?: number;
  title: string;
  genre: string;
  release_year: number;
  description?: string;
  ratings_count?: number;
  ratings_avg?: number;
  created_by_username?: string;
  created_at?: string;
}


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
interface MovieDetail extends Movie {
  created_by: number;
  recent_ratings: Rating[];
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
      setMovie(movieData); // ✅ now types match
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const submitRating = async (ratingData: RatingData) => {
    if (!movieId) return;
    
    try {
      const response = await rateMovie(movieId, ratingData);
      await fetchMovieDetail(); // refresh
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit rating');
    }
  };

  const deleteUserRating = async () => {
    if (!movieId || !user) return;
    
    try {
      if (movie) {
        const userRating = movie.recent_ratings.find(rating => rating.user === user.id);
        if (userRating) {
          await deleteRating(userRating.id);
          await fetchMovieDetail();
        }
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete rating');
    }
  };

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
