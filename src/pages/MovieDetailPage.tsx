import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieRatings, deleteRating } from "../api/movies";
import AxiosInstance from "../api/AxiosInstance";
import { useAuth } from "../context/AuthProvider";
import { RatingStars } from "../components/RatingStars";
import { Link } from "react-router-dom";

interface Rating {
  id: number;
  user: number;
  username?: string; 
  rating: number;
  review?: string;
  created_at: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  description: string;
  created_by_username: string;
  created_at: string;
}

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  const fetchMovie = async () => {
    try {
      const res = await AxiosInstance.get(`/movies/${id}/`);
      setMovie(res.data);
    } catch (err) {
      console.error("Failed to fetch movie", err);
    }
  };

  const fetchRatings = async () => {
    try {
      const data = await getMovieRatings(Number(id));
      setRatings(data);
    } catch (err) {
      console.error("Failed to fetch ratings", err);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([fetchMovie(), fetchRatings()]).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingValue) return;

    try {
      await AxiosInstance.post(`/movies/${id}/ratings/`, {
        rating: ratingValue,
        review: reviewText,
      });
      setRatingValue(0);
      setReviewText("");
      fetchRatings();
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  const handleDelete = async (ratingId: number) => {
    try {
      await deleteRating(ratingId);
      fetchRatings();
    } catch (err) {
      console.error("Failed to delete rating", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center py-12">Movie not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
    <div>
      <div>
        <Link to={`/movies/`}>
          <p>
            Back to Movies
            </p> 
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
        <p className="mt-2 text-gray-600">{movie.genre} • {movie.release_year}</p>
        <p className="mt-4 text-gray-700">{movie.description}</p>
        <p className="mt-4 text-sm text-gray-500">
          Added by {movie.created_by_username} on{" "}
          {new Date(movie.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Ratings & Reviews</h2>

        {ratings.length === 0 ? (
          <p className="mt-4 text-gray-500">No ratings yet. Be the first to review!</p>
        ) : (
          <ul className="divide-y divide-gray-200 mt-4">
            {ratings.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{r.user}</p>
                    <RatingStars value={r.rating} readOnly />
                    {r.review && <p className="mt-1 text-gray-600">{r.review}</p>}
                    <p className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  {user?.username === r.user && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {user && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Leave a Rating</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <RatingStars value={ratingValue} onChange={setRatingValue} />
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a review (optional)"
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
    </div>
  );
};

