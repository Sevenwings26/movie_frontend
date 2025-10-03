import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { createMovie } from "../api/movies";

import NavBar from "../components/NavBar";
import { FaSpinner, FaArrowLeft, FaCheck } from "react-icons/fa";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Fantasy",
  "Documentary",
  "Other",
];

const AddMoviePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    release_year: new Date().getFullYear(),
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "release_year" ? parseInt(value) || new Date().getFullYear() : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData.genre) {
      newErrors.genre = "Genre is required";
    }

    if (!formData.release_year) {
      newErrors.release_year = "Release year is required";
    } else if (
      formData.release_year < 1900 ||
      formData.release_year > new Date().getFullYear() + 5
    ) {
      newErrors.release_year = `Release year must be between 1900 and ${
        new Date().getFullYear() + 5
      }`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrors({ submit: "You must be logged in to add a movie." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await createMovie(formData);
      setSuccess(true);

      // Redirect to movies list after 2 seconds
      setTimeout(() => {
        navigate("/movies");
      }, 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error.message ||
        "Failed to create movie. Please try again.";

      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to add movies.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Movie</h1>
          <p className="mt-2 text-gray-600">Share a movie with the community</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaCheck className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Movie added successfully!
              </span>
            </div>
            <p className="text-green-700 mt-1">
              Redirecting to movies list...
            </p>
          </div>
        )}

        {/* Movie Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Movie Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter movie title"
                disabled={loading || success}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Genre */}
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.genre ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading || success}
              >
                <option value="">Select a genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
              )}
            </div>

            {/* Release Year */}
            <div>
              <label
                htmlFor="release_year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Release Year *
              </label>
              <input
                type="number"
                id="release_year"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 5}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.release_year ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter release year"
                disabled={loading || success}
              />
              {errors.release_year && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.release_year}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter movie description, plot summary, or any relevant details..."
                disabled={loading || success}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                    Adding Movie...
                  </>
                ) : (
                  "Add Movie"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Tips for adding movies:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make sure the movie title is accurate and complete</li>
            <li>• Select the most appropriate genre for the movie</li>
            <li>• Double-check the release year for accuracy</li>
            <li>• Add a description to help others understand the movie better</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddMoviePage;
