import React from "react";

interface RatingStarsProps {
  value: number; // current rating value (0–5)
  onChange?: (newValue: number) => void; // callback when user clicks
  readOnly?: boolean; // if true, stars are not clickable
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const handleClick = (index: number) => {
    if (readOnly || !onChange) return;
    onChange(index + 1); // index is 0-based, so +1
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          onClick={() => handleClick(i)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={i < value ? "gold" : "gray"}
          className={`h-5 w-5 cursor-pointer ${
            readOnly ? "cursor-default" : "hover:scale-110 transition-transform"
          }`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.95a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.285 3.95c.3.922-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.176 0l-3.37 2.449c-.785.57-1.84-.196-1.54-1.118l1.285-3.95a1 1 0 00-.364-1.118L2.063 9.377c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.95z" />
        </svg>
      ))}
    </div>
  );
};
