// pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import NavBar from '../components/NavBar';
import { FaStar, FaUsers, FaFilm, FaRocket } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover and Rate
            <span className="block text-indigo-400">Your Favorite Movies</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join our community of movie enthusiasts. Share your reviews, discover new films, 
            and connect with fellow cinema lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/movies"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FaFilm className="w-5 h-5" />
                  <span>Browse Movies</span>
                </Link>
                <Link
                  to="/movies/add"
                  className="border border-indigo-400 text-indigo-400 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 hover:text-white transition-colors duration-200"
                >
                  Add New Movie
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/movies"
                  className="border border-indigo-400 text-indigo-400 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 hover:text-white transition-colors duration-200"
                >
                  Browse Movies
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Join MovieRatings?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rate & Review</h3>
              <p className="text-gray-300">
                Share your honest opinions with 1-5 star ratings and detailed reviews. 
                Help others discover great movies.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Join Community</h3>
              <p className="text-gray-300">
                Connect with fellow movie lovers. See what others are watching and 
                get personalized recommendations.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFilm className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Discover Movies</h3>
              <p className="text-gray-300">
                Explore movies by genre, year, or ratings. Find your next favorite 
                film with our powerful search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">10K+</div>
              <div className="text-gray-300">Movies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">50K+</div>
              <div className="text-gray-300">Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">5K+</div>
              <div className="text-gray-300">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">4.8</div>
              <div className="text-gray-300">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600 bg-opacity-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Movie Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of movie enthusiasts sharing their passion for cinema.
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <FaRocket className="w-5 h-5" />
              <span>Sign Up Now</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;