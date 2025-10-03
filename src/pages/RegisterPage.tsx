// pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { FormInput } from '../components/FormInput';
import { SubmitButton } from '../components/SubmitButton';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password1) {
      newErrors.password1 = 'Password is required';
    } else if (formData.password1.length < 6) {
      newErrors.password1 = 'Password must be at least 6 characters';
    }
    
    if (!formData.password2) {
      newErrors.password2 = 'Please confirm your password';
    } else if (formData.password1 !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formData.username,
        formData.email,
        formData.password1,
        formData.password2
      );
      navigate('/');
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {/* Registration Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
          
          <FormInput
            id="username"
            label="Username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            error={errors.username}
          />
          
          <FormInput
            id="email"
            label="Email address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={errors.email}
          />
          
          <FormInput
            id="password1"
            label="Password"
            type="password"
            value={formData.password1}
            onChange={handleChange}
            placeholder="Create a password"
            required
            error={errors.password1}
          />
          
          <FormInput
            id="password2"
            label="Confirm Password"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            error={errors.password2}
          />
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms and Conditions
              </a>
            </label>
          </div>
          
          <SubmitButton loading={isLoading}>
            Create account
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};