import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/auth/register', {
        ...formData,
        roles: ['USER'] // Default role
      });
      const { id, name, email, roles } = response.data;
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-500 hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker Register</h1>
        </div>
        {error && <div className="mb-4 text-red-600 text-center transition-opacity duration-500 ease-in-out">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center transition-opacity duration-500 ease-in-out">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-300 hover:shadow-md"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-300 hover:shadow-md"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-300 hover:shadow-md"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
