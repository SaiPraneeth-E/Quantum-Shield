import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const headers = { Authorization: `Bearer ${getToken()}` };

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/admin/users`, { headers }),
      axios.get(`${API}/api/admin/predictions?limit=50`, { headers }),
    ])
      .then(([u, p]) => {
        setUsers(u.data);
        setPredictions(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [getToken]);

  const updateRole = async (userId, role) => {
    try {
      await axios.patch(`${API}/api/admin/users/${userId}`, { role }, { headers });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-cyan-500/50 border-t-cyan-400 animate-spin" />
          <p className="text-slate-500">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="page-heading">
            ADMIN <span className="text-cyan-400">PANEL</span>
          </h1>
          <p className="text-slate-500 mt-1 text-base">Users & predictions</p>
        </div>
        <Link
          to="/admin/analytics"
          className="btn-secondary shrink-0 inline-flex items-center gap-2 w-fit"
        >
          Analytics
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold text-cyan-400/90 mb-4">USERS</h2>
        <div className="cyber-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cyber-table w-full text-left">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-800/50">
                  <th className="px-5 py-4 text-slate-400 font-medium">Name</th>
                  <th className="px-5 py-4 text-slate-400 font-medium">Email</th>
                  <th className="px-5 py-4 text-slate-400 font-medium">Role</th>
                  <th className="px-5 py-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-700/50">
                    <td className="px-5 py-4 text-slate-200">{u.name}</td>
                    <td className="px-5 py-4 text-slate-400 font-mono text-sm">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        className="w-full max-w-[140px] min-h-[44px] rounded-xl border border-cyan-500/30 bg-slate-900/80 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-cyan-400/90 mb-4">RECENT PREDICTIONS</h2>
        <div className="cyber-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cyber-table w-full text-left">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-800/50">
                  <th className="px-5 py-4 text-slate-400 font-medium">URL</th>
                  <th className="px-5 py-4 text-slate-400 font-medium">User</th>
                  <th className="px-5 py-4 text-slate-400 font-medium">Result</th>
                  <th className="px-5 py-4 text-slate-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 20).map((p) => (
                  <tr key={p._id} className="border-b border-slate-700/50">
                    <td className="px-5 py-4 text-slate-300 font-mono text-sm truncate max-w-xs">{p.inputUrl}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm">{p.userId?.email || '-'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                          p.prediction === 'phishing'
                            ? 'bg-phishing/20 text-phishing border border-phishing/40'
                            : 'bg-safe/20 text-safe border border-safe/40'
                        }`}
                      >
                        {p.prediction}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">{new Date(p.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
