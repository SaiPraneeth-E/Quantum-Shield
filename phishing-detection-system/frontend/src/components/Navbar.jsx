import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="relative z-10 border-b border-cyan-500/20 bg-slate-900/70 backdrop-blur-xl px-6 md:px-8 py-4 flex items-center justify-between animate-fade-in min-h-[64px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-cyber">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="font-display text-lg md:text-xl font-semibold text-slate-200 tracking-wide">
          QUANTUM <span className="text-cyan-400">SHIELD</span>
        </h1>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-slate-500 text-sm font-mono hidden sm:inline truncate max-w-[180px]">{user.email}</span>
        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
          {user.role}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-ghost shrink-0"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
