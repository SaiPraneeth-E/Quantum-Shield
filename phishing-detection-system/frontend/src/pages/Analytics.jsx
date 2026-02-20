import { useState, useEffect } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

const COLORS = { phishing: '#ef4444', legitimate: '#10b981' };

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    axios
      .get(`${API}/api/admin/analytics`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null));
  }, [getToken]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-cyan-500/50 border-t-cyan-400 animate-spin" />
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Phishing', value: stats.phishingCount, color: COLORS.phishing },
    { name: 'Legitimate', value: stats.legitimateCount, color: COLORS.legitimate },
  ].filter((d) => d.value > 0);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'cyan' },
    { label: 'Total Predictions', value: stats.totalPredictions, color: 'cyan' },
    { label: 'Phishing', value: stats.phishingCount, color: 'phishing' },
    { label: 'Legitimate', value: stats.legitimateCount, color: 'safe' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="page-heading">ANALYTICS</h1>
      <p className="page-subheading">System-wide metrics and activity</p>

      <div className="grid gap-4 md:grid-cols-4 mb-10 stagger-children">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="cyber-panel p-6 hover:scale-[1.02] transition-transform duration-300"
          >
            <p className="text-slate-500 text-sm font-medium mb-1">{s.label}</p>
            <p
              className={`text-3xl font-bold font-mono ${
                s.color === 'cyan'
                  ? 'text-cyan-400'
                  : s.color === 'phishing'
                  ? 'text-phishing'
                  : 'text-safe'
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {pieData.length > 0 && (
        <div className="cyber-panel p-8 mb-10">
          <h2 className="font-display text-lg font-semibold text-cyan-400/90 mb-6">
            PHISHING VS LEGITIMATE
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={50}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="rgba(15,23,42,0.8)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Legend
                wrapperStyle={{ color: '#94a3b8' }}
                formatter={(value) => <span className="text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="cyber-panel p-8">
        <h2 className="font-display text-lg font-semibold text-cyan-400/90 mb-6">RECENT ACTIVITY</h2>
        {stats.recentActivity?.length ? (
          <div className="overflow-x-auto">
            <table className="cyber-table w-full text-left">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-cyan-500/20">
                  <th className="pb-3 font-medium">URL</th>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Result</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((p) => (
                  <tr key={p._id} className="border-b border-slate-700/50 text-slate-300">
                    <td className="py-3 font-mono text-sm truncate max-w-xs">{p.inputUrl}</td>
                    <td className="py-3 text-slate-500 text-sm">{p.userId?.email}</td>
                    <td className="py-3">
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
                    <td className="py-3 text-slate-500 text-sm">{new Date(p.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
