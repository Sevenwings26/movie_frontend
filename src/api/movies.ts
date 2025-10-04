import AxiosInstance from "./AxiosInstance";

export interface Movie {
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
  created_by: number;
  recent_ratings: Rating[];
}

export interface RatingData {
  rating: number;
  review?: string;
}

// Movie creation
export const createMovie = async (movieData: {
  title: string;
  genre: string;
  release_year: number;
  description?: string;
}) => {
  const res = await AxiosInstance.post("/movies/add/", movieData);
  return res.data;
};

// List all movies with pagination support
export const listMovies = async (params?: {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
  min_year?: number;
  max_year?: number;
}): Promise<{
  items: Movie[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}> => {
  const res = await AxiosInstance.get("/movies/", { params });
  return res.data;
};

// Get details of a single movie
export const getMovieDetail = async (id: number): Promise<MovieDetail> => {
  const res = await AxiosInstance.get(`/movies/${id}/`);
  return res.data;
};

// Delete a movie
export const deleteMovie = async (id: number) => {
  const res = await AxiosInstance.delete(`/movies/${id}/`);
  return res.data;
};

// -------- Ratings --------

// Rate a movie (with rating & optional review)
export const rateMovie = async (id: number, ratingData: RatingData) => {
  const res = await AxiosInstance.post(`/movies/${id}/ratings/`, ratingData);
  return res.data;
};

// Update an existing rating
export const updateRating = async (ratingId: number, ratingData: RatingData) => {
  const res = await AxiosInstance.put(`/ratings/${ratingId}/`, ratingData);
  return res.data;
};

// Get all ratings for a specific movie
export const getMovieRatings = async (id: number): Promise<Rating[]> => {
  const res = await AxiosInstance.get(`/movies/${id}/ratings/`);
  return res.data;
};

// Get ratings for the current logged-in user
export const getUserRatings = async (): Promise<Rating[]> => {
  const res = await AxiosInstance.get("/user/ratings/");
  return res.data;
};

// Get ratings for a specific user by ID
export const getUserRatingsById = async (userId: number): Promise<Rating[]> => {
  const res = await AxiosInstance.get(`/users/${userId}/ratings/`);
  return res.data;
};

// Delete a rating
export const deleteRating = async (ratingId: number) => {
  const res = await AxiosInstance.delete(`/ratings/${ratingId}/`);
  return res.data;
};