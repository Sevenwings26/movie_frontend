// components/RatingList.tsx
import React from 'react';
// import { Rating } from '../types/movies';
import { RatingStars } from './RatingStars';


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

interface RatingListProps {
  ratings: Rating[];
  loading?: boolean;
}

export const RatingList: React.FC<RatingListProps> = ({ ratings, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No ratings yet. Be the first to rate this movie!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div key={rating.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">{rating.user_username}</span>
              <span className="text-sm text-gray-500">
                {new Date(rating.created_at).toLocaleDateString()}
              </span>
            </div>
            <RatingStars value={rating.rating} readOnly size="small" showLabel />
          </div>
          
          {rating.review && (
            <div className="mt-2">
              <p className="text-gray-700 whitespace-pre-wrap">{rating.review}</p>
            </div>
          )}
          
          {rating.updated_at !== rating.created_at && (
            <p className="text-xs text-gray-400 mt-2">
              Updated {new Date(rating.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};