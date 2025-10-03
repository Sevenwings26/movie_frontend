import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { MovieListPage } from './pages/MovieListPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AddMoviePage from './pages/AddMoviePage';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MovieListPage />} />
          <Route path="/movies/:id" element={
            <ProtectedRoute>
              <MovieDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/movies/add" element={
            <ProtectedRoute>
              <AddMoviePage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;