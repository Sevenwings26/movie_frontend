import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieRatings, deleteRating } from "../api/movies";
import AxiosInstance from "../api/AxiosInstance";
import { useAuth } from "../context/AuthProvider";
import { RatingStars } from "../components/RatingStars";
import { Link } from "react-router-dom";

interface Rating {
  id: number;
  user: string;
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




// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { useMovieDetail } from '../hooks/useMovieDetail';
// import { RatingForm } from '../components/RatingForm';
// import { RatingList } from '../components/RatingList';
// import { RatingStars } from '../components/RatingStars';
// import { useAuth } from '../context/AuthProvider';
// import { FaChevronLeft, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
// import { deleteMovie } from '../api/movies';

// export const MovieDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const movieId = parseInt(id || '0');

//   const {
//     movie,
//     loading,
//     error,
//     userRating,
//     fetchMovieDetail,
//     submitRating,
//     deleteRating,
//   } = useMovieDetail(movieId);

//   const [showRatingForm, setShowRatingForm] = useState(false);
//   const [ratingsLoading, setRatingsLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   useEffect(() => {
//     if (movieId) {
//       fetchMovieDetail();
//     }
//   }, [movieId, fetchMovieDetail]);

//   const handleRatingSubmit = async (ratingData: { rating: number; review?: string }) => {
//     setActionLoading(true);
//     try {
//       await submitRating(ratingData);
//       setShowRatingForm(false);
//     } catch (err) {
//       console.error('Failed to submit rating:', err);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleRatingDelete = async () => {
//     setActionLoading(true);
//     try {
//       await deleteRating();
//       setShowRatingForm(false);
//     } catch (err) {
//       console.error('Failed to delete rating:', err);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDeleteMovie = async () => {
//     if (!movie || !window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
//       return;
//     }

//     setActionLoading(true);
//     try {
//       await deleteMovie(movie.id);
//       navigate('/', { 
//         state: { message: 'Movie deleted successfully', type: 'success' }
//       });
//     } catch (err) {
//       alert('Failed to delete movie: ' + (err instanceof Error ? err.message : 'Unknown error'));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleViewAllRatings = async () => {
//     setRatingsLoading(true);
//     try {
//       await fetchMovieDetail();
//     } catch (err) {
//       console.error('Failed to load all ratings:', err);
//     } finally {
//       setRatingsLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-6">
//             <div className="h-4 bg-gray-200 rounded w-24"></div>
//           </div>
//           <div className="animate-pulse space-y-6">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex-1">
//                   <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//                 <div className="h-6 bg-gray-200 rounded w-20"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !movie) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-4">
//           <div className="text-red-600 text-lg mb-4">
//             {error || 'Movie not found'}
//           </div>
//           <p className="text-gray-600 mb-6">
//             The movie you're looking for doesn't exist or you don't have permission to view it.
//           </p>
//           <Link 
//             to={`/movies`}
//             className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
//           >
//             <FaChevronLeft className="w-4 h-4 mr-2" />
//             Back to Movies
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const canDeleteMovie = user && movie.created_by === user.id;
//   const hasRatings = movie.ratings_count > 0;
//   const showAllRatingsButton = movie.ratings_count > movie.recent_ratings.length;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Navigation */}
//         <div className="mb-6">
//           <Link 
//             to="{`/movies`}"
//             className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
//           >
//             <FaChevronLeft className="w-4 h-4 mr-2" />
//             Back to Movies
//           </Link>
//         </div>

//         {/* Movie Header */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//           <div className="p-6">
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   {movie.title} ({movie.release_year})
//                 </h1>
//                 <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
//                   <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
//                     {movie.genre}
//                   </span>
//                   <span className="flex items-center">
//                     <span className="text-gray-500">Added by</span>
//                     <span className="font-medium ml-1">{movie.created_by_username}</span>
//                   </span>
//                   <span className="text-gray-500">
//                     {new Date(movie.created_at).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </span>
//                 </div>
//               </div>

//               {canDeleteMovie && (
//                 <button
//                   onClick={handleDeleteMovie}
//                   disabled={actionLoading}
//                   className="flex items-center text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <FaTrash className="w-5 h-5 mr-2" />
//                   <span className="font-medium">Delete</span>
//                 </button>
//               )}
//             </div>

//             {/* Rating Summary */}
//             <div className="flex flex-wrap items-center gap-6 mb-4">
//               <div className="flex items-center space-x-3">
//                 {hasRatings ? (
//                   <>
//                     <RatingStars 
//                       value={Math.round(movie.ratings_avg)} 
//                       readOnly 
//                       size="large" 
//                     />
//                     <span className="text-2xl font-bold text-gray-900">
//                       {movie.ratings_avg.toFixed(1)}
//                     </span>
//                   </>
//                 ) : (
//                   <div className="flex items-center space-x-2 text-gray-400">
//                     <FaStar className="w-6 h-6" />
//                     <span className="text-2xl font-bold">-</span>
//                   </div>
//                 )}
//               </div>

//               <div className="text-sm text-gray-600">
//                 {hasRatings
//                   ? `${movie.ratings_count} rating${movie.ratings_count !== 1 ? 's' : ''}`
//                   : 'No ratings yet'}
//               </div>

//               <div className="flex-1 flex justify-end">
//                 {user && !userRating && !showRatingForm && (
//                   <button
//                     onClick={() => setShowRatingForm(true)}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors duration-200 shadow-sm"
//                   >
//                     Rate This Movie
//                   </button>
//                 )}
//                 {userRating && !showRatingForm && (
//                   <button
//                     onClick={() => setShowRatingForm(true)}
//                     className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors duration-200 bg-indigo-50 px-4 py-2 rounded-md"
//                   >
//                     <FaEdit className="w-4 h-4" />
//                     <span>Edit Your Rating</span>
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Description */}
//             {movie.description && movie.description.trim() ? (
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
//                 <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                   {movie.description}
//                 </p>
//               </div>
//             ) : (
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <p className="text-gray-500 italic">No description provided.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Rating Form */}
//         {showRatingForm && (
//           <div className="mb-8">
//             <RatingForm
//               existingRating={userRating || undefined}
//               onSubmit={handleRatingSubmit}
//               onCancel={() => setShowRatingForm(false)}
//               onDelete={userRating ? handleRatingDelete : undefined}
//             />
//           </div>
//         )}

//         {/* Recent Ratings */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Recent Ratings
//               {hasRatings && (
//                 <span className="text-gray-500 font-normal ml-2">
//                   ({movie.ratings_count} total)
//                 </span>
//               )}
//             </h2>

//             {showAllRatingsButton && (
//               <button
//                 onClick={handleViewAllRatings}
//                 disabled={ratingsLoading}
//                 className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
//               >
//                 {ratingsLoading ? 'Loading...' : 'View All Ratings'}
//               </button>
//             )}
//           </div>

//           <RatingList ratings={movie.recent_ratings} loading={loading} />

//           {!hasRatings && !userRating && (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No Ratings Yet</h3>
//               <p className="text-gray-500 mb-4">Be the first to rate and review this movie!</p>
//               {user && !showRatingForm && (
//                 <button
//                   onClick={() => setShowRatingForm(true)}
//                   className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors duration-200"
//                 >
//                   Add Your Rating
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
