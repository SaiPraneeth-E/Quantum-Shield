import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CyberBackground from '../components/CyberBackground';

const API = import.meta.env.VITE_API_URL || '';

export default function Login({ isAdmin = false }) {
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
      const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <CyberBackground variant="grid" />
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-cyber-lg ${isAdmin ? 'bg-gradient-to-br from-violet-400 to-violet-600' : 'bg-gradient-to-br from-cyan-400 to-violet-500'}`}>
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-center mb-2 text-slate-200">
          {isAdmin ? (
            <>
              ADMIN <span className="text-violet-400">LOGIN</span>
            </>
          ) : (
            <>
              SIGN <span className="text-cyan-400">IN</span>
            </>
          )}
        </h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          {isAdmin ? 'Sign in with admin credentials to access the dashboard.' : 'Access your security dashboard'}
        </p>

        <form onSubmit={handleSubmit} className="cyber-panel p-8 md:p-10 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-phishing/10 border border-phishing/50 text-phishing text-sm animate-fade-in">
              {error}
            </div>
          )}
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
              placeholder="••••••••"
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
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="text-center mt-6 space-y-2">
          {!isAdmin && (
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline font-medium">Register</Link>
            </p>
          )}
          {isAdmin ? (
            <p className="text-slate-500 text-sm">
              <Link to="/login" className="text-cyan-400 hover:underline font-medium">User Login</Link>
              {' · '}
              <Link to="/" className="text-slate-400 hover:underline">Back to home</Link>
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              <Link to="/admin/login" className="text-violet-400 hover:underline font-medium">Admin Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
