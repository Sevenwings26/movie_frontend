// types/movies.ts
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

export interface MovieListResponse {
  items: Movie[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface SearchFilters {
  genre?: string;
  min_year?: number;
  max_year?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// types/movies.ts - Add these additional types
export interface Rating {
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

export interface MovieDetail extends Movie {
  recent_ratings: Rating[];
  description: string;
}

export interface RatingData {
  rating: number;
  review?: string;
}

export interface RatingResponse {
  rating: Rating;
  movie: {
    id: number;
    title: string;
    ratings_count: number;
    ratings_avg: number;
  };
}