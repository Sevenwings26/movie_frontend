// components/RatingForm.tsx
import React, { useState } from 'react';
import { RatingStars } from './RatingStars';
// import { RatingData } from '../types/movies';
import { useAuth } from '../context/AuthProvider';


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
  recent_ratings: Rating[];
  description: string;
}

interface RatingData {
  rating: number;
  review?: string;
}

interface RatingResponse {
  rating: Rating;
  movie: {
    id: number;
    title: string;
    ratings_count: number;
    ratings_avg: number;
  };
}


interface RatingFormProps {
  existingRating?: { rating: number; review?: string };
  onSubmit: (data: RatingData) => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  existingRating,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        rating,
        review: review.trim() || undefined,
      });
      
      // Reset form if it's a new rating
      if (!existingRating) {
        setRating(0);
        setReview('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Please log in to rate and review movies.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingRating ? 'Update Your Rating' : 'Rate This Movie'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <RatingStars value={rating} onChange={setRating} size="large" />
          {error && rating === 0 && (
            <p className="mt-1 text-sm text-red-600">Please select a rating</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            id="review"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Share your thoughts about this movie..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
            </button>
            
            {existingRating && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={submitting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Delete Rating
              </button>
            )}
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};