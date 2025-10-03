import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface RatingStarsProps {
  value: number; // current rating
  onChange?: (value: number) => void; // optional for read-only mode
  max?: number; // total stars, default 5
  size?: 'small' | 'medium' | 'large';
  readOnly?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  max = 5,
  size = 'medium',
  readOnly = false,
}) => {
  const sizes = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-3xl',
  };

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= value;
        const Icon = isActive ? FaStar : FaRegStar;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={readOnly}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            } text-yellow-400 transition-transform hover:scale-110 focus:outline-none`}
          >
            <Icon className={sizes[size]} />
          </button>
        );
      })}
    </div>
  );
};
