import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "small" | "medium" | "large";
  readOnly?: boolean;
  showLabel?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  max = 5,
  size = "medium",
  readOnly = false,
  showLabel = false,
}) => {
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  const sizeMap: Record<string, string> = {
    small: "text-sm",
    medium: "text-xl",
    large: "text-3xl",
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          disabled={readOnly}
          className={`focus:outline-none ${sizeMap[size]} ${
            readOnly ? "cursor-default" : "cursor-pointer"
          }`}
        >
          {index < value ? (
            <FaStar className="text-yellow-500" />
          ) : (
            <FaRegStar className="text-gray-300" />
          )}
        </button>
      ))}
      {showLabel && (
        <span className="ml-2 text-sm text-gray-600">
          {value}/{max}
        </span>
      )}
    </div>
  );
};
