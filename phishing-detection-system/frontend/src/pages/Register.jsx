import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CyberBackground from '../components/CyberBackground';

const API = import.meta.env.VITE_API_URL || '';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, { name, email, password });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <CyberBackground variant="grid" />
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-cyber-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-center mb-2 text-slate-200">
          CREATE <span className="text-cyan-400">ACCOUNT</span>
        </h1>
        <p className="text-slate-500 text-center text-sm mb-8">Join the security network</p>

        <form onSubmit={handleSubmit} className="cyber-panel p-8 md:p-10 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-phishing/10 border border-phishing/50 text-phishing text-sm animate-fade-in">
              {error}
            </div>
          )}
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cyber-input"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400/90 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input"
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cyber-btn text-white font-display tracking-wide"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
