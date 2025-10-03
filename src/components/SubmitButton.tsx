// components/SubmitButton.tsx
import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  children: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, children }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};